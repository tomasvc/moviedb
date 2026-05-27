import { api } from "./endpoints";
import { fetchData } from "./client";
import { APIResponse, Movie, ApiData } from "@/types/api";

export const fetchItemsByKeyword = async (
    keywordId: string,
    page: number
): Promise<APIResponse<Movie>> => {
    return fetchData(api.itemsByKeyword, { with_keywords: keywordId, page });
};

export const fetchKeyword = async (id: string): Promise<ApiData> => {
    return fetchData(api.keyword(id));
};