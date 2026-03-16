import { NextRequest, NextResponse } from "next/server";

import { AppModel } from "@/lib/schemas/app";
import { validateAppCreate, ValidateAppInput, validateAppUpdate } from "@/lib/validators/app";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants/http";

import { MongoService } from "@/services/mongo.service";

import { ListWithPaginationResponse } from "@/types/http.type";
import { App } from "@/types/app.type";

export const POST = async (request: NextRequest) => {
    try {
        await MongoService.connect();

        const body = (await request.json()) as ValidateAppInput;
        const validation = validateAppCreate(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const app = await AppModel.create({
            name: validation.data.name,
            apiKey: validation.data.apiKey,
        });

        const json = app.toJSON();
        return NextResponse.json(json, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create application";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};

export const GET = async (request: NextRequest) => {
    try {
        await MongoService.connect();

        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (id) {
            const app = await AppModel.findOne({ _id: id, deletedAt: null }).exec();

            if (!app) {
                return NextResponse.json({ error: "Application not found" }, { status: 404 });
            }

            return NextResponse.json(app.toJSON());
        }

        const pageParam = searchParams.get("page");
        const limitParam = searchParams.get("limit");

        const page = Number(pageParam) || DEFAULT_PAGE;
        const limit = Number(limitParam) || DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            AppModel.find({ deletedAt: null }).skip(skip).limit(limit).exec(),
            AppModel.countDocuments({ deletedAt: null }).exec(),
        ]);

        const data = items.map((doc) => doc.toJSON());
        const totalPages = Math.max(Math.ceil(total / limit), 1);

        const response: ListWithPaginationResponse<App> = {
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
        const message = error instanceof Error ? error.message : "Failed to fetch applications";
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

        const body = (await request.json()) as ValidateAppInput;
        const validation = validateAppUpdate(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const app = await AppModel.findOneAndUpdate({ _id: id, deletedAt: null }, { $set: validation.data }, { new: true }).exec();

        if (!app) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        return NextResponse.json(app.toJSON());
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update application";
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

        const app = await AppModel.findOneAndUpdate({ _id: id, deletedAt: null }, { $set: { deletedAt: new Date() } }, { new: true }).exec();

        if (!app) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        return NextResponse.json(app.toJSON());
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete application";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
