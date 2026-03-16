import { NextResponse } from "next/server";
import { MilvusService } from "@/services/milvus.service";

export const POST = async () => {
    try {
        const result = await MilvusService.initialize();
        return NextResponse.json({ message: result });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to initialize Milvus";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
