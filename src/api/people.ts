import { fetchData } from "./client";
import { ApiData, Credits, Person } from "@/types/api";
import { api } from "./endpoints";

export const fetchPersonDetails = async (id: string): Promise<Person> => {
    return fetchData(api.person(id));
};

export const fetchPersonExternals = async (id: string): Promise<ApiData> => {
    return fetchData(api.personExternals(id));
};

export const fetchPersonCombinedCredits = async (
    id: string
): Promise<Credits> => {
    return fetchData(api.personCombinedCredits(id));
};

export const fetchPersonImages = async (id: string): Promise<ApiData> => {
    return fetchData(api.personImages(id));
};