const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const DEFAULT_PARAMS = {
  language: "en-US",
  include_adult: false,
  include_video: false,
  sort_by: "popularity.desc",
};

export class FetchError extends Error {
  status?: number;
  statusText?: string;
  response?: Response;

  constructor(
    message: string,
    status?: number,
    statusText?: string,
    response?: Response
  ) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

export const apiClient = {
  async get<T>(
    endpoint: string,
    options?: { params?: Record<string, any> }
  ): Promise<{ data: T }> {
    const url = new URL(BASE_URL + endpoint);

    url.searchParams.set("api_key", API_KEY || "");

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, value.toString());
        }
      });
    }

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new FetchError(
          errorData.status_message ||
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText,
          response
        );
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof FetchError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new FetchError("No response received for the data request.");
      }

      throw new FetchError("Error in setting up the data request.");
    }
  },
};

export const fetchData = async <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> => {
  const response = await apiClient.get<T>(endpoint, { params });
  return response.data;
};