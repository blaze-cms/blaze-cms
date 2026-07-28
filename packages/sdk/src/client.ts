export interface ClientOptions {
  baseUrl: string;
  headers?: Record<string, string>;
}

export interface Client {
  findOne(collection: string, id: string): Promise<Record<string, unknown> | null>;
  findMany(
    collection: string,
    params?: Record<string, unknown>,
  ): Promise<{ data: Record<string, unknown>[]; total: number }>;
  create(collection: string, data: Record<string, unknown>): Promise<Record<string, unknown>>;
  update(
    collection: string,
    id: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown> | null>;
  delete(collection: string, id: string): Promise<boolean>;
}

export function createClient(options: ClientOptions): Client {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const fetchOptions: RequestInit & { body?: string | undefined } = { headers, method };
    if (body !== undefined) {
      fetchOptions.body = JSON.stringify(body);
    }
    const response = await fetch(`${options.baseUrl}${path}`, fetchOptions as RequestInit);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    if (response.status === 204) {
      return undefined as T;
    }
    return response.json() as Promise<T>;
  }

  return {
    create(collection, data) {
      return request("POST", `/${collection}`, data);
    },
    delete(collection, id) {
      return request("DELETE", `/${collection}/${id}`);
    },
    findMany(collection, params) {
      const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";
      return request("GET", `/${collection}${query}`);
    },
    findOne(collection, id) {
      return request("GET", `/${collection}/${id}`);
    },
    update(collection, id, data) {
      return request("PATCH", `/${collection}/${id}`, data);
    },
  };
}
