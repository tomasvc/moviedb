import { AxiosError } from 'axios';
import { QueryClient, QueryCache, UseQueryOptions, UseMutationOptions, DefaultOptions } from '@tanstack/react-query';
import { Promisable } from 'type-fest';

const queryConfig: DefaultOptions = {
  queries: {
    cacheTime: 1000 * 60 * 60 * 24,
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
  },
};

export const queryClient = new QueryClient({ 
  defaultOptions: queryConfig, 
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error("An unexpected error has occured")
      }
    }  
  }) 
});

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Promisable<
  ReturnType<FnType>
>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> = UseMutationOptions<
  ExtractFnReturnType<MutationFnType>,
  AxiosError,
  Parameters<MutationFnType>[0]
>;