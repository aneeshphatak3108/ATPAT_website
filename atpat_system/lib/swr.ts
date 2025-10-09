import useSWR, { type SWRConfiguration } from "swr"
import { apiGet } from "./api-client"

export function useApi<T = any>(path: string, config?: SWRConfiguration<T>) {
  return useSWR<T>(path, (key) => apiGet<T>(key), {
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    ...config,
  })
}
