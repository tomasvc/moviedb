global.structuredClone =
  global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));
import { NextApiRequest, NextApiResponse } from "next";
import { getPlaiceholder } from "plaiceholder";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page } = req.query;

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
          return { ...movie, placeholder: base64 };
        } catch (error) {
          console.log(error);
          return { ...movie, placeholder: "" };
        }
      })
    );

    res.status(200).json({ ...response.data, results: moviesWithPlaceholders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
