import { Router } from "express";

const router = Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    "Supabase credentials not set (SUPABASE_URL/SUPABASE_KEY). Public submission routes will fail until configured.",
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
    const text = await res.text().catch(() => "");
    const headersObj: Record<string, string> = {};
    res.headers.forEach((v, k) => (headersObj[k] = v));
    throw new Error(
      `Supabase request failed: status=${res.status} statusText=${res.statusText} url=${url} body=${text} headers=${JSON.stringify(headersObj)}`,
    );
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}

// Public submission endpoints
router.post("/quotes", async (req, res) => {
  try {
    const body = (req.body || {}) as Record<string, any>;

    // Map frontend fields to DB columns
    const payload: Record<string, any> = {
      name: body.name,
      whatsapp: body.whatsapp ?? body.phone ?? null,
      pincode: body.pincode ?? null,
      bill: body.bill ?? body.billRange ?? body.bill_range ?? null,
      category: body.category ?? null,
      metadata: {
        gstMode: body.gstMode ?? null,
        capacityKw: body.capacityKw ?? null,
        estimatedCost: body.estimatedCost ?? null,
        address: body.address ?? null,
        message: body.message ?? null,
        source: "public-form",
      },
    };

    const result = await supabaseRequest("quotes", "POST", payload);
    return res.status(201).json(result);
  } catch (err: any) {
    console.error("Public /quotes error:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/contacts", async (req, res) => {
  try {
    const body = (req.body || {}) as Record<string, any>;
    const allowedKeys = ["name", "email", "phone", "message"];
    const payload: Record<string, any> = {};
    for (const key of allowedKeys) if (key in body) payload[key] = body[key];
    const result = await supabaseRequest("contacts", "POST", payload);
    return res.status(201).json(result);
  } catch (err: any) {
    console.error("Public /contacts error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Public list endpoints
router.get("/jobs", async (_req, res) => {
  try {
    const rows = await supabaseRequest("jobs", "GET");
    return res.json(rows);
  } catch (err: any) {
    console.error("Public /jobs error:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/resources", async (_req, res) => {
  try {
    const rows = await supabaseRequest("resources", "GET");
    return res.json(rows);
  } catch (err: any) {
    console.error("Public /resources error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
