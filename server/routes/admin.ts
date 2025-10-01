import { Router } from "express";
import crypto from "node:crypto";

// Simple HMAC-signed token utilities for built-in admin login
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin@2024";
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "change-me-secret";
const ADMIN_TOKEN_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

type AdminTokenPayload = { u: string; exp: number };

function createAdminToken(username: string): string {
  const payload: AdminTokenPayload = { u: username, exp: Date.now() + ADMIN_TOKEN_TTL_MS };
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString("base64url");
  const sig = crypto.createHmac("sha256", ADMIN_TOKEN_SECRET).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

function verifyAdminToken(token: string): AdminTokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  const expected = crypto.createHmac("sha256", ADMIN_TOKEN_SECRET).update(b64).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf8")) as AdminTokenPayload;
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

const router = Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    "Supabase credentials not set (SUPABASE_URL/SUPABASE_KEY). Admin routes will fail until configured.",
  );
}

async function supabaseRequest(
  table: string,
  method = "GET",
  body?: any,
  query = "",
) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Supabase not configured");
  }
  const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}${query}`;
  const headers: Record<string, string> = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };
  if (method === "GET") headers.Accept = "application/json";
  if (body) headers["Content-Type"] = "application/json";
  if (method !== "GET") headers.Prefer = "return=representation";
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase request failed: ${res.status} ${text}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}

const ALLOWED_TABLES = {
  // match the tables created by migrations: quotes, contacts, jobs, resources
  quotes: "quotes",
  contacts: "contacts",
  jobs: "jobs",
  resources: "resources",
};

// Public admin login (no auth required)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = createAdminToken(username);
      return res.json({ token, user: { username } });
    }
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Middleware: require admin user via either built-in token or Supabase auth
router.use(async (req, res, next) => {
  try {
    const auth = req.headers.authorization as string | undefined;
    if (!auth) return res.status(401).json({ error: "Missing Authorization header" });
    // Accept built-in admin token (Bearer <token>)
    const maybeToken = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : auth;
    const payload = verifyAdminToken(maybeToken);
    if (payload) {
      (req as any).adminUser = { username: payload.u };
      return next();
    }
    if (!SUPABASE_URL || !SUPABASE_KEY)
      return res.status(500).json({ error: "Supabase not configured" });
    // validate token with Supabase Auth
    const userResp = await fetch(
      `${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`,
      {
        headers: { Authorization: auth, apikey: SUPABASE_KEY },
      },
    );
    if (!userResp.ok)
      return res.status(401).json({ error: "Invalid auth token" });
    const user = await userResp.json();
    const email = (user as any).email;
    if (!email) return res.status(401).json({ error: "Unauthenticated" });
    // check admin_users table
    try {
      const rows = await supabaseRequest(
        "admin_users",
        "GET",
        undefined,
        `?email=eq.${encodeURIComponent(email)}`,
      );
      if (Array.isArray(rows) && rows.length > 0) {
        // attach user info
        (req as any).supabaseUser = user;
        return next();
      }
    } catch (e) {
      console.warn("admin lookup failed", e);
    }
    return res.status(403).json({ error: "Forbidden: not an admin" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// List endpoints
router.get("/quotes", async (req, res) => {
  try {
    const rows = await supabaseRequest(ALLOWED_TABLES.quotes);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/contacts", async (req, res) => {
  try {
    const rows = await supabaseRequest(ALLOWED_TABLES.contacts);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/jobs", async (req, res) => {
  try {
    const rows = await supabaseRequest(ALLOWED_TABLES.jobs);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/resources", async (req, res) => {
  try {
    const rows = await supabaseRequest(ALLOWED_TABLES.resources);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Basic analytics aggregation
router.get("/analytics", async (req, res) => {
  try {
    const [quotes, contacts, jobs, resources] = await Promise.all([
      supabaseRequest(ALLOWED_TABLES.quotes),
      supabaseRequest(ALLOWED_TABLES.contacts),
      supabaseRequest(ALLOWED_TABLES.jobs),
      supabaseRequest(ALLOWED_TABLES.resources),
    ]);
    const safeLen = (v: any) => (Array.isArray(v) ? v.length : 0);
    res.json({
      totals: {
        quotes: safeLen(quotes),
        contacts: safeLen(contacts),
        jobs: safeLen(jobs),
        resources: safeLen(resources),
      },
      recent: {
        quotes: Array.isArray(quotes) ? quotes.slice(-5) : [],
        contacts: Array.isArray(contacts) ? contacts.slice(-5) : [],
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create job
router.post("/jobs", async (req, res) => {
  try {
    const body = (req.body || {}) as Record<string, any>;
    const allowedKeys = [
      "title",
      "location",
      "employment_type",
      "department",
      "description",
      "requirements",
      "benefits",
      "featured",
    ];
    const payload: Record<string, any> = {};
    for (const key of allowedKeys) if (key in body) payload[key] = body[key];
    // Supabase REST insert requires prefer return=representation to return rows
    const result = await supabaseRequest(ALLOWED_TABLES.jobs, "POST", payload);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create resource
router.post("/resources", async (req, res) => {
  try {
    const body = (req.body || {}) as Record<string, any>;
    const allowedKeys = [
      "title",
      "resource_type",
      "file_url",
      "description",
      "tags",
      "featured",
      "author",
      "image",
      "read_time",
    ];
    const payload: Record<string, any> = {};
    for (const key of allowedKeys) if (key in body) payload[key] = body[key];
    const result = await supabaseRequest(ALLOWED_TABLES.resources, "POST", payload);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Upload file to Supabase Storage (expects JSON with base64)
router.post("/upload", async (req, res) => {
  try {
    const { bucket, path, file_base64, contentType } = req.body;
    if (!bucket || !path || !file_base64) {
      return res
        .status(400)
        .json({ error: "bucket, path and file_base64 are required" });
    }
    if (!SUPABASE_URL || !SUPABASE_KEY)
      throw new Error("Supabase not configured");
    const url = `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/${encodeURIComponent(bucket)}/${encodeURIComponent(path)}`;
    const buffer = Buffer.from(file_base64, "base64");
    const resp = await fetch(url, {
      method: "PUT",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": contentType || "application/octet-stream",
      },
      body: buffer,
    });
    if (!resp.ok) {
      const text = await resp.text();
      return res
        .status(500)
        .json({ error: `Upload failed: ${resp.status} ${text}` });
    }
    // Return public URL (if bucket is public)
    const publicUrl = `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodeURIComponent(path)}`;
    res.json({ ok: true, url: publicUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Export CSV for a table key
router.get("/export/:table", async (req, res) => {
  try {
    const key = req.params.table;
    const table = (ALLOWED_TABLES as any)[key];
    if (!table) return res.status(400).json({ error: "Invalid export target" });

    const rows = await supabaseRequest(table);
    if (!Array.isArray(rows))
      return res.status(500).json({ error: "Unexpected response" });

    if (rows.length === 0) {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=\"${key}.csv\"`,
      );
      return res.send("");
    }

    const columns = Object.keys(rows[0]);
    const escape = (v: any) => {
      if (v === null || v === undefined) return "";
      const s = typeof v === "object" ? JSON.stringify(v) : String(v);
      if (s.includes(",") || s.includes("\n") || s.includes('"')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };
    const csv = [columns.join(",")]
      .concat(rows.map((r: any) => columns.map((c) => escape(r[c])).join(",")))
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=\"${key}.csv\"`);
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Export all tables into a single Excel file with multiple sheets
router.get("/export-all/xlsx", async (_req, res) => {
  try {
    const [quotes, contacts, jobs, resources] = await Promise.all([
      supabaseRequest(ALLOWED_TABLES.quotes),
      supabaseRequest(ALLOWED_TABLES.contacts),
      supabaseRequest(ALLOWED_TABLES.jobs),
      supabaseRequest(ALLOWED_TABLES.resources),
    ]);

    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();
    const toSheet = (rows: any[], name: string) => {
      const data = Array.isArray(rows) ? rows : [];
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, name);
    };
    toSheet(quotes as any[], "quotes");
    toSheet(contacts as any[], "contacts");
    toSheet(jobs as any[], "jobs");
    toSheet(resources as any[], "resources");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "buffer" as any });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=export.xlsx");
    return res.send(wbout);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
