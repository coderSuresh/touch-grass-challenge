import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (!API_URL) {
    throw new Error("API is not configured");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (init?.headers instanceof Headers) {
    init.headers.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (Array.isArray(init?.headers)) {
    init.headers.forEach(([key, value]) => {
      headers[key] = value;
    });
  } else if (init?.headers) {
    Object.assign(headers, init.headers);
  }

  try {
    const response = await axios.request<T>({
      url: `${API_URL.replace(/\/$/, "")}${path}`,
      method: init?.method ?? "GET",
      data: init?.body,
      headers,
    });

    return response.data;
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const wrapped = new Error(
      status === undefined
        ? "BACKEND_UNAVAILABLE"
        : status >= 500
          ? "SERVER_ERROR"
          : status === 409
            ? "CONFLICT"
            : "REQUEST_FAILED",
    );
    wrapped.cause = error;
    throw wrapped;
  }
}
