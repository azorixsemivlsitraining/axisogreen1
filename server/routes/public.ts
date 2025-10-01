import { Router, type Response } from "express";
import {
  isSupabaseConfigured,
  supabaseRequest,
  SupabaseConfigError,
} from "../lib/supabase";

const router = Router();

if (!isSupabaseConfigured()) {
  console.warn(
    "Supabase credentials not set (SUPABASE_URL/SUPABASE_KEY). Public submission routes will fail until configured.",
  );
}

function respondWithSupabaseError(
  res: Response,
  error: unknown,
  context: string,
) {
  console.error(context, error);
  const message =
    error instanceof SupabaseConfigError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Unexpected Supabase error";
  return res.status(500).json({ error: message });
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
  } catch (error) {
    return respondWithSupabaseError(res, error, "Public /quotes error");
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
  } catch (error) {
    return respondWithSupabaseError(res, error, "Public /contacts error");
  }
});

// Public list endpoints
router.get("/jobs", async (_req, res) => {
  try {
    const rows = await supabaseRequest("jobs", "GET");
    return res.json(rows);
  } catch (error) {
    return respondWithSupabaseError(res, error, "Public /jobs error");
  }
});

router.get("/resources", async (_req, res) => {
  try {
    const rows = await supabaseRequest("resources", "GET");
    return res.json(rows);
  } catch (error) {
    return respondWithSupabaseError(res, error, "Public /resources error");
  }
});

export default router;
