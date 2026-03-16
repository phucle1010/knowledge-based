import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { InterviewResultModel } from "@/lib/schemas/interview";
import { validateInterviewResultCreate, validateInterviewResultUpdate } from "@/lib/validators/interview";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants/http";

import { MongoService } from "@/services/mongo.service";

import { ListWithPaginationResponse } from "@/types/http.type";
import { InterviewResult } from "@/types/interview.type";

export const POST = async (request: NextRequest) => {
    try {
        await MongoService.connect();

        const body = (await request.json()) as Parameters<typeof validateInterviewResultCreate>[0];
        const validation = validateInterviewResultCreate(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const result = await InterviewResultModel.create({
            sessionId: validation.data.sessionId,
            score: validation.data.score,
            analytics: validation.data.analytics,
            advice: validation.data.advice,
        });

        return NextResponse.json(result.toJSON(), { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create interview result";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};

export const GET = async (request: NextRequest) => {
    try {
        await MongoService.connect();

        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (id) {
            const isValidId = mongoose.isValidObjectId(id);
            if (!isValidId) {
                return NextResponse.json({ error: "Invalid interview result ID" }, { status: 400 });
            }

            const result = await InterviewResultModel.findOne({ _id: id, deletedAt: null }).exec();
            if (!result) {
                return NextResponse.json({ error: "Interview result not found" }, { status: 404 });
            }

            return NextResponse.json(result.toJSON());
        }

        const pageParam = searchParams.get("page");
        const limitParam = searchParams.get("limit");

        const page = Number(pageParam) || DEFAULT_PAGE;
        const limit = Number(limitParam) || DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            InterviewResultModel.find({ deletedAt: null }).skip(skip).limit(limit).exec(),
            InterviewResultModel.countDocuments({ deletedAt: null }).exec(),
        ]);

        const data = items.map((doc) => doc.toJSON());
        const totalPages = Math.max(Math.ceil(total / limit), 1);

        const response: ListWithPaginationResponse<InterviewResult> = {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch interview results";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};

export const PATCH = async (request: NextRequest) => {
    try {
        await MongoService.connect();

        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "id is required in query string" }, { status: 400 });
        }

        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid interview result ID" }, { status: 400 });
        }

        const body = (await request.json()) as Parameters<typeof validateInterviewResultUpdate>[0];
        const validation = validateInterviewResultUpdate(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const result = await InterviewResultModel.findOneAndUpdate({ _id: id, deletedAt: null }, { $set: validation.data }, { new: true }).exec();

        if (!result) {
            return NextResponse.json({ error: "Interview result not found" }, { status: 404 });
        }

        return NextResponse.json(result.toJSON());
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update interview result";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};

export const DELETE = async (request: NextRequest) => {
    try {
        await MongoService.connect();

        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "id is required in query string" }, { status: 400 });
        }

        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid interview result ID" }, { status: 400 });
        }

        const result = await InterviewResultModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { deletedAt: new Date() } },
            { new: true }
        ).exec();

        if (!result) {
            return NextResponse.json({ error: "Interview result not found" }, { status: 404 });
        }

        return NextResponse.json(result.toJSON());
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete interview result";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
