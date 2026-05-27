import {
    fetchMovieDetails,
    fetchMovieGenres,
    fetchPopularMovies,
    fetchTrendingMovies,
    fetchUpcomingMovies,
    fetchMovieVideos,
} from "@/api/movies";
import { NextResponse } from "next/server";
import { FetchError } from "@/api/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const page = Number(searchParams.get("page") || "1");

    try {
        switch (type) {
            case "popular":
                return NextResponse.json(await fetchPopularMovies(page));
            case "trending":
                return NextResponse.json(await fetchTrendingMovies(page));
            case "upcoming":
                return NextResponse.json(await fetchUpcomingMovies(page));
            case "movie-details":
                if (!id) {
                    return NextResponse.json({ error: "Missing id" }, { status: 400 });
                }
                return NextResponse.json(await fetchMovieDetails(id));
            case "movie-videos":
                if (!id) {
                    return NextResponse.json({ error: "Missing id" }, { status: 400 });
                }
                return NextResponse.json(await fetchMovieVideos(id));
            case "movie-genres":
                return NextResponse.json(await fetchMovieGenres());
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