import { getSession } from 'next-auth/react';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type QueryParams = Record<string, string | number | boolean | undefined>;

interface RequestOptions extends RequestInit {
  params?: QueryParams;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';

async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await getSession();
  if (session?.accessToken) {
    return {
      Authorization: `Bearer ${session.accessToken}`,
    };
  }
  return {};
}

function buildUrl(endpoint: string, params?: QueryParams): string {
  const url = new URL(`${BASE_URL}/api/v1${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error?.message || 'An error occurred',
      response.status,
      data.error?.code,
      data.error?.details,
    );
  }

  if (!data.success) {
    throw new ApiError(
      data.error?.message || 'Request failed',
      response.status,
      data.error?.code,
      data.error?.details,
    );
  }

  return data.data;
}

export async function apiGet<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const url = buildUrl(endpoint, options?.params);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
    ...options,
  });

  return handleResponse<T>(response);
}

export async function apiPost<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const url = buildUrl(endpoint, options?.params);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  return handleResponse<T>(response);
}

export async function apiPatch<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const url = buildUrl(endpoint, options?.params);

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  return handleResponse<T>(response);
}

export async function apiPut<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const url = buildUrl(endpoint, options?.params);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  return handleResponse<T>(response);
}

export async function apiDelete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const url = buildUrl(endpoint, options?.params);

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
    ...options,
  });

  return handleResponse<T>(response);
}
