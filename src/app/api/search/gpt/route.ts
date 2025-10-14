import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

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
      messages: [
        {
          role: "user",
          content: `Classify and structure the following query: '${query}'. Based on the query, return a list with these three sections if it is suitable for the query: movie titles, people (either cast, crew or both) and movie genres. Make sure the section labels end with a colon. Provide only the results without any additional text. Provide at least 10 items per list if you can. Try not not to include any innacurate information. Do not add any descriptions. If you cannot find anything based on the query, or if the provided query makes no sense, simply respond with 'Could not find any information with the provided query'.`,
        },
      ],
      model: "gpt-4.1-nano",
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({ content });
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
        { status: 500 }
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
