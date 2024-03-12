import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieReviews,
  fetchMovieKeywords,
  fetchRecommendedMovies,
  fetchMovieImages,
  fetchMovieVideos,
} from "../api";
import { SideMenu } from "../../components/SideMenu";

import { Movie } from "../../features/Movie";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.params as { id: string };

  const movie = await fetchMovieDetails(id);
  const credits = await fetchMovieCredits(id);
  const reviews = await fetchMovieReviews(id);
  const keywords = await fetchMovieKeywords(id);
  const similar = await fetchRecommendedMovies(id);

  return { props: { movie, credits, reviews, keywords, similar } };
};

export default function MoviePage({
  movie,
  credits,
  reviews,
  keywords,
  similar,
}) {
  return (
    <>
      <SideMenu />
      <Movie
        movie={movie}
        credits={credits}
        reviews={reviews.results}
        keywords={keywords}
        similar={similar}
      />
    </>
  );
}
