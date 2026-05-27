import { fetchData } from "./client";
import { APIResponse, Movie, Person } from "@/types/api";
import { api } from "./endpoints";

export const multiSearch = async (
    query: string,
    page: number = 1
): Promise<APIResponse> => {
    return fetchData(api.multiSearch, { query, page });
};

export const movieSearch = async (
    query: string,
    page: number = 1
): Promise<APIResponse<Movie>> => {
    return fetchData(api.searchMovie, { query, page });
};

export const personSearch = async (
    query: string,
    page: number = 1
): Promise<APIResponse<Person>> => {
    return fetchData(api.searchPerson, { query, page });
};