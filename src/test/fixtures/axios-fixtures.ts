import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

export function createAxiosResponse<T>(
  config: InternalAxiosRequestConfig,
  data: T,
  status = 200,
): AxiosResponse<T> {
  return { data, status, statusText: 'OK', headers: {}, config };
}

export function createAxiosError<T>(
  config: InternalAxiosRequestConfig,
  data: T,
  status = 401,
): AxiosError<T> {
  const response = createAxiosResponse(config, data, status);
  return new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, undefined, response);
}

export function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}
