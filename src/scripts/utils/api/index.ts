import { apiClient } from './api-client';
import { requestInterceptor, responseInterceptor } from './interceptors';
import { RESPONSE_DATA } from '../constants';
import { type TResponseData } from './types';

const handleApiClient = async <P, R>(
  params: { method?: "GET"; url: string },
  payload: P | null = null,
): Promise<TResponseData<R>> => {
  let res: TResponseData<R> = {
    ...RESPONSE_DATA,
    data: RESPONSE_DATA.data as R,
  };

  const config: RequestInit = await requestInterceptor({
    method: params.method || "GET",
    ...(payload && { body: JSON.stringify(payload) }),
  });

  try {
    const response = await apiClient(params.url, config);

    const { data, success, message }: TResponseData<R> =
      await responseInterceptor(response);

    if (success !== undefined && !success) {
      throw new Error(message || res.message);
    }

    res = { data, success, message };
  } catch (error) {
    const errorData = error as { message?: string };

    console.log({
      title: errorData.message || RESPONSE_DATA.message,
      type: "error"
    });
  }

  return res;
};

export const apiHandler = {
  fetch: async <T>(url: string) =>
    handleApiClient<null, T>({ url, method: "GET" }),
};

export * from './types';
