import { z } from "zod";

type QueryInput =
  | string
  | URLSearchParams
  | Record<string, string | number | boolean | null | undefined>;

type SupabaseConfig = {
  url: string;
  key: string;
};

const SupabaseEnvSchema = z.object({
  SUPABASE_URL: z
    .string()
    .url(
      "SUPABASE_URL must be a valid URL, for example https://your-project.supabase.co",
    ),
  SUPABASE_KEY: z
    .string()
    .min(
      1,
      "SUPABASE_KEY is required—use the anon public key from the Supabase dashboard",
    ),
});

export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

let cachedConfig: SupabaseConfig | null = null;
let warnedMissingConfig = false;

function loadSupabaseConfig(): SupabaseConfig {
  const parsed = SupabaseEnvSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  });

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.at(0) ?? "SUPABASE"}: ${issue.message}`)
      .join("; ");
    if (!warnedMissingConfig) {
      console.warn(`[Supabase] Configuration error: ${message}`);
      warnedMissingConfig = true;
    }
    throw new SupabaseConfigError(message);
  }

  const { SUPABASE_URL, SUPABASE_KEY } = parsed.data;
  const normalised: SupabaseConfig = {
    url: SUPABASE_URL.replace(/\/$/, ""),
    key: SUPABASE_KEY,
  };
  cachedConfig = normalised;
  warnedMissingConfig = false;
  return normalised;
}

export function getSupabaseConfig(): SupabaseConfig {
  if (cachedConfig) return cachedConfig;
  return loadSupabaseConfig();
}

export function isSupabaseConfigured(): boolean {
  try {
    if (cachedConfig) return true;
    cachedConfig = loadSupabaseConfig();
    return true;
  } catch {
    return false;
  }
}

export async function supabaseRequest(
  table: string,
  method: string = "GET",
  body?: unknown,
  query?: QueryInput,
) {
  const normalisedMethod = method.toUpperCase();
  const { url, key } = getSupabaseConfig();
  const queryString = normaliseQuery(query, normalisedMethod);
  const endpoint = `${url}/rest/v1/${table}${queryString}`;

  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };

  if (normalisedMethod === "GET") {
    headers.Accept = "application/json";
  }

  const shouldSendBody =
    body !== undefined && body !== null && normalisedMethod !== "GET";

  if (shouldSendBody) {
    headers["Content-Type"] = "application/json";
    headers.Prefer = "return=representation";
  } else if (normalisedMethod !== "GET") {
    headers.Prefer = "return=representation";
  }

  const response = await fetch(endpoint, {
    method: normalisedMethod,
    headers,
    body: shouldSendBody ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Supabase request failed: ${response.status} ${response.statusText} ${text}`,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function normaliseQuery(query: QueryInput | undefined, method: string): string {
  let search = "";

  if (typeof query === "string" && query.trim().length > 0) {
    const trimmed = query.trim();
    search = trimmed.startsWith("?") ? trimmed : `?${trimmed}`;
  } else if (query instanceof URLSearchParams) {
    const value = query.toString();
    search = value ? `?${value}` : "";
  } else if (query && typeof query === "object") {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined) continue;
      params.append(key, String(value));
    }
    const value = params.toString();
    search = value ? `?${value}` : "";
  }

  if (method === "GET" && !search.toLowerCase().includes("select=")) {
    if (search.length === 0) {
      search = "?select=*";
    } else {
      const separator = search.includes("?") ? "&" : "?";
      search = `${search}${separator}select=*`;
    }
  }

  return search;
}
