import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SearchGPTResponse } from "@/types/api";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SEARCH_SCHEMA = {
  name: "search_response",
  strict: true,
  schema: {
    type: "object",
    properties: {
      mode: { type: "string", enum: ["regular", "vibe"] },
      titles: { type: "array", items: { type: "string" } },
      people: { type: "array", items: { type: "string" } },
      filters: {
        type: "object",
        properties: {
          mood: { type: "array", items: { type: "string" } },
          max_runtime: { anyOf: [{ type: "number" }, { type: "null" }] },
          exclude_genres: { type: "array", items: { type: "string" } },
          include_genres: { type: "array", items: { type: "string" } },
        },
        required: ["mood", "max_runtime", "exclude_genres", "include_genres"],
        additionalProperties: false,
      },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            blurb: { type: "string" },
          },
          required: ["title", "blurb"],
          additionalProperties: false,
        },
      },
    },
    required: ["mode", "titles", "people", "filters", "recommendations"],
    additionalProperties: false,
  },
} as const;

const SYSTEM_PROMPT = `You are a movie search assistant. Given a user query, respond with structured JSON.

Determine the mode:
- "regular": the query names a specific movie title, person (actor/director/crew), or both. Extract the names as-is.
- "vibe": the query describes a mood, feeling, genre preference, constraint, or scenario (e.g. "something cozy", "under 2 hours", "not horror", "after a breakup"). Extract filters and recommend up to 8 well-known movies.

For "regular" mode:
- Put movie titles in "titles" (up to 10, exact names)
- Put people names in "people" (up to 5, full names)
- Leave "filters" and "recommendations" empty (filters: {mood:[], max_runtime:null, exclude_genres:[], include_genres:[]}, recommendations:[])

For "vibe" mode:
- Leave "titles" and "people" as empty arrays
- Populate "filters" with what you understood from the query
- Populate "recommendations" with up to 8 real movies that fit the vibe, each with a one-sentence blurb (max 15 words) explaining why it fits. Be specific about runtime or mood in the blurb.`;

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API not configured" },
        { status: 500 }
      );
    }

    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (query.length > 200) {
      return NextResponse.json({ error: "Query too long" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
      response_format: {
        type: "json_schema",
        json_schema: SEARCH_SCHEMA,
      },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from OpenAI" },
        { status: 500 }
      );
    }

    const parsed: SearchGPTResponse = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }
    if (error?.status === 401) {
      return NextResponse.json(
        { error: "Invalid API key configuration" },
        { status: 401 }
      );
    }
    if (error?.status === 402) {
      return NextResponse.json(
        { error: "Insufficient credits. Please check your OpenAI account." },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process search query" },
      { status: 500 }
    );
  }
}
