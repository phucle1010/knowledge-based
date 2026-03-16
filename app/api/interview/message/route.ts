import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { InterviewMessageModel } from "@/lib/schemas/interview";
import { validateInterviewMessageCreate, validateInterviewMessageUpdate } from "@/lib/validators/interview";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants/http";

import { MongoService } from "@/services/mongo.service";

import { ListWithPaginationResponse } from "@/types/http.type";
import { InterviewMessage } from "@/types/interview.type";

export const POST = async (request: NextRequest) => {
    try {
        await MongoService.connect();

        const body = (await request.json()) as Parameters<typeof validateInterviewMessageCreate>[0];
        const validation = validateInterviewMessageCreate(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const message = await InterviewMessageModel.create({
            sessionId: validation.data.sessionId,
            content: validation.data.content,
            replied_message_id: validation.data.replied_message_id,
            user_id: validation.data.user_id,
        });

        return NextResponse.json(message.toJSON(), { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create interview message";
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
                return NextResponse.json({ error: "Invalid interview message ID" }, { status: 400 });
            }

            const message = await InterviewMessageModel.findOne({ _id: id, deletedAt: null }).exec();
            if (!message) {
                return NextResponse.json({ error: "Interview message not found" }, { status: 404 });
            }

            return NextResponse.json(message.toJSON());
        }

        const pageParam = searchParams.get("page");
        const limitParam = searchParams.get("limit");

        const page = Number(pageParam) || DEFAULT_PAGE;
        const limit = Number(limitParam) || DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            InterviewMessageModel.find({ deletedAt: null }).skip(skip).limit(limit).exec(),
            InterviewMessageModel.countDocuments({ deletedAt: null }).exec(),
        ]);

        const data = items.map((doc) => doc.toJSON());
        const totalPages = Math.max(Math.ceil(total / limit), 1);

        const response: ListWithPaginationResponse<InterviewMessage> = {
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
        const message = error instanceof Error ? error.message : "Failed to fetch interview messages";
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
            return NextResponse.json({ error: "Invalid interview message ID" }, { status: 400 });
        }

        const body = (await request.json()) as Parameters<typeof validateInterviewMessageUpdate>[0];
        const validation = validateInterviewMessageUpdate(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const message = await InterviewMessageModel.findOneAndUpdate({ _id: id, deletedAt: null }, { $set: validation.data }, { new: true }).exec();

        if (!message) {
            return NextResponse.json({ error: "Interview message not found" }, { status: 404 });
        }

        return NextResponse.json(message.toJSON());
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update interview message";
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
            return NextResponse.json({ error: "Invalid interview message ID" }, { status: 400 });
        }

        const message = await InterviewMessageModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { deletedAt: new Date() } },
            { new: true }
        ).exec();

        if (!message) {
            return NextResponse.json({ error: "Interview message not found" }, { status: 404 });
        }

        return NextResponse.json(message.toJSON());
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete interview message";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
