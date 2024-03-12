import { useMutation } from '@tanstack/react-query';
import { MutationConfig, queryClient } from '../../../lib/react-query'
import axios from 'axios';

export type CreateDiscussionDTO = {
  genres: any[]
};

export const getMovies = ({ genres }: CreateDiscussionDTO): Promise<any> => {
    const selectedGenres = [];
    genres.forEach(gen => gen.selected && selectedGenres.push(gen.id))
  return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=4f3fdbd8c5943719506e53611dd7be34&language=en-US${selectedGenres.length && `&with_genres=${selectedGenres.join(",")}`}`);
};

type UseGetMoviesOptions = {
  config?: MutationConfig<typeof getMovies>;
};

export const useMovies = ({ config }: UseGetMoviesOptions = {}) => {
  return useMutation({
    onError: (error) => {
      console.error(error)
    },
    ...config,
    mutationFn: getMovies,
  });
};