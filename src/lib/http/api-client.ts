type QueryValue = string | number | boolean | undefined | null;

export type ApiRequestOptions = {
  method?: string;
  url: string;
  query?: Record<string, QueryValue>;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

function buildUrl(url: string, query?: Record<string, QueryValue>) {
  if (!query || Object.keys(query).length === 0) return url;

  const target = url.startsWith("http") ? new URL(url) : new URL(url, "http://localhost");

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    target.searchParams.set(key, String(value));
  }

  return url.startsWith("http")
    ? target.toString()
    : `${target.pathname}${target.search}`;
}

export async function apiRequest<TResponse>(options: ApiRequestOptions): Promise<{ data: TResponse }> {
  const method = (options.method ?? "GET").toUpperCase();
  const url = buildUrl(options.url, options.query);

  const response = await fetch(url, {
    method,
    headers: options.headers,
    cache: options.cache,
    next: options.next,
  });

  const rawText = await response.text();
  let parsedBody: unknown = rawText;

  if (rawText) {
    try {
      parsedBody = JSON.parse(rawText) as unknown;
    } catch {
      parsedBody = rawText;
    }
  } else {
    parsedBody = null;
  }

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  return { data: parsedBody as TResponse };
}
