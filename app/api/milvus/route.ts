import { NextResponse } from "next/server";

import { MilvusService } from "@/services/milvus.service";

export const POST = async () => {
  try {
    const result = await MilvusService.initialize();

    if (typeof result !== "undefined") {
      return NextResponse.json({ message: result });
    }

    return NextResponse.json(
      { error: "Something went wrong while initializing Mivus" },
      { status: 400 }
    );
  } catch (error) {
    const msg = String(error);
    return NextResponse.json({ error: msg.replace("Error:", "").trim() }, { status: 500 });
  }
};
