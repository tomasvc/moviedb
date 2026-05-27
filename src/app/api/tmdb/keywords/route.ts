import { fetchItemsByKeyword, fetchKeyword } from "@/api/keywords";
import { FetchError } from "@/api/client";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  const keywordId = searchParams.get("keywordId") || id;
  const page = Number(searchParams.get("page") || "1");

  try {
    switch (type) {
      case "details":
        if (!id) {
          return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }
        return NextResponse.json(await fetchKeyword(id));
      case "items":
        if (!keywordId) {
          return NextResponse.json(
            { error: "Missing keywordId" },
            { status: 400 }
          );
        }
        return NextResponse.json(await fetchItemsByKeyword(keywordId, page));
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error: any) {
    if (error instanceof FetchError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
