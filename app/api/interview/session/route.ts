import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { InterviewSessionModel } from "@/lib/schemas/interview";
import { validateInterviewSessionCreate, validateInterviewSessionUpdate } from "@/lib/validators/interview";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants/http";

import { MongoService } from "@/services/mongo.service";

import { ListWithPaginationResponse } from "@/types/http.type";
import { InterviewSession } from "@/types/interview.type";

export const POST = async (request: NextRequest) => {
    try {
        await MongoService.connect();

        const body = (await request.json()) as Parameters<typeof validateInterviewSessionCreate>[0];
        const validation = validateInterviewSessionCreate(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const session = await InterviewSessionModel.create({
            title: validation.data.title,
            level: validation.data.level,
        });

        return NextResponse.json(session.toJSON(), { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create interview session";
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
                return NextResponse.json({ error: "Invalid interview session ID" }, { status: 400 });
            }

            const session = await InterviewSessionModel.findOne({ _id: id, deletedAt: null }).exec();
            if (!session) {
                return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
            }

            return NextResponse.json(session.toJSON());
        }

        const pageParam = searchParams.get("page");
        const limitParam = searchParams.get("limit");

        const page = Number(pageParam) || DEFAULT_PAGE;
        const limit = Number(limitParam) || DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            InterviewSessionModel.find({ deletedAt: null }).skip(skip).limit(limit).exec(),
            InterviewSessionModel.countDocuments({ deletedAt: null }).exec(),
        ]);

        const data = items.map((doc) => doc.toJSON());
        const totalPages = Math.max(Math.ceil(total / limit), 1);

        const response: ListWithPaginationResponse<InterviewSession> = {
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
        const message = error instanceof Error ? error.message : "Failed to fetch interview sessions";
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
            return NextResponse.json({ error: "Invalid interview session ID" }, { status: 400 });
        }

        const body = (await request.json()) as Parameters<typeof validateInterviewSessionUpdate>[0];
        const validation = validateInterviewSessionUpdate(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const session = await InterviewSessionModel.findOneAndUpdate({ _id: id, deletedAt: null }, { $set: validation.data }, { new: true }).exec();

        if (!session) {
            return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
        }

        return NextResponse.json(session.toJSON());
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update interview session";
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
            return NextResponse.json({ error: "Invalid interview session ID" }, { status: 400 });
        }

        const session = await InterviewSessionModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { deletedAt: new Date() } },
            { new: true }
        ).exec();

        if (!session) {
            return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
        }

        return NextResponse.json(session.toJSON());
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete interview session";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
