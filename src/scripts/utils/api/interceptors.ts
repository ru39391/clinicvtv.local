import { RESPONSE_DATA } from '../constants';
import { type TResponseData } from './types';

const fetchResponseError = <T>({ res, data }: Record<"res" | "data", TResponseData<T>>) => {
  const message = data?.message as string || res.message;

  return {
    ...res,
    data: [message] as T,
    message
  };
}

export const requestInterceptor = async (config: RequestInit): Promise<RequestInit> => {

  return {
    ...config,
    headers: {
      ...config.headers,
    },
  };
};

export const responseInterceptor = async <T>(
  response: Response
): Promise<TResponseData<T>> => {
  let res: TResponseData<T> = {
    ...RESPONSE_DATA,
    data: RESPONSE_DATA.data as T,
  };

  const { success, data }: { success: TResponseData<T>["success"], data: TResponseData<T> } = await response.json();

  if (!response.ok || !success) {
    const error = fetchResponseError({ res, data });

    return new Promise((reject) => reject(error));
  }

  res = {
    data: data.data !== undefined ? data.data : data as T,
    success,
    message: data.message?.toString() || "",
  };

  return new Promise((resolve) => resolve(res));
};
