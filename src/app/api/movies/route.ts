global.structuredClone =
  global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));
import { NextRequest, NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";
import axios from "axios";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`
    );

    const movies = response.data.results;

    const moviesWithPlaceholders = await Promise.all(
      movies.map(async (movie) => {
        const posterUrl = `https://image.tmdb.org/t/p/w400${movie.poster_path}`;

        try {
          const buffer = await fetch(posterUrl).then(async (res) =>
            Buffer.from(await res.arrayBuffer())
          );
          const { base64 } = await getPlaiceholder(buffer, {
            size: 10,
          });
          // const base64 = "";

          return { ...movie, placeholder: base64 };
        } catch (error) {
          console.log(error);
          return { ...movie, placeholder: "" };
        }
      })
    );

    return NextResponse.json({ ...response.data, results: moviesWithPlaceholders });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
