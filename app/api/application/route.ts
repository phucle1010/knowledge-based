import { NextRequest, NextResponse } from "next/server";

import { AppModel } from "@/lib/schemas/app";
import { validateAppCreate, ValidateAppCreateInput } from "@/lib/validators/app";

import { MongoService } from "@/services/mongo.service";

export const POST = async (request: NextRequest) => {
    try {
        await MongoService.connect();

        const body = (await request.json()) as ValidateAppCreateInput;
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
