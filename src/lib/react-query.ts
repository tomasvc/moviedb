import { AxiosError } from "axios";
import {
  QueryClient,
  QueryCache,
  UseQueryOptions,
  UseMutationOptions,
  DefaultOptions,
} from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
    refetchOnWindowFocus: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unexpected error has occured");
      }
    },
  }),
});

export type ExtractFnReturnType<FnType extends (...args: any) => any> =
  ReturnType<FnType> extends Promise<infer T> ? T : ReturnType<FnType>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
  >;
