import {
  fetchPersonCombinedCredits,
  fetchPersonDetails,
  fetchPersonExternals,
  fetchPersonImages,
} from "@/api/people";
import { FetchError } from "@/api/client";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    switch (type) {
      case "details":
        return NextResponse.json(await fetchPersonDetails(id));
      case "externals":
        return NextResponse.json(await fetchPersonExternals(id));
      case "credits":
        return NextResponse.json(await fetchPersonCombinedCredits(id));
      case "images":
        return NextResponse.json(await fetchPersonImages(id));
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
