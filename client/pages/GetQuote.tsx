import * as React from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = "residential" | "housing" | "commercial";

export default function GetQuote() {
  const location = useLocation();
  const hash = location.hash.replace("#", "");
  const [category, setCategory] = React.useState<Category>(
    (hash as Category) || "residential",
  );

  React.useEffect(() => {
    const h = location.hash.replace("#", "") as Category;
    if (h && ["residential", "housing", "commercial"].includes(h)) {
      setCategory(h);
    }
  }, [location.hash]);

  // Domestic bill ranges -> suggested capacity (kW)
  const domesticBillToCapacity = [
    { range: "1500-2500", label: "₹1,500 - ₹2,500", capacity: 3 },
    { range: "2501-3500", label: "₹2,501 - ₹3,500", capacity: 4 },
    { range: "3500-4500", label: "₹3,500 - ₹4,500", capacity: 5 },
    { range: "4501-5500", label: "₹4,501 - ₹5,500", capacity: 6 },
    { range: "5501-6500", label: "₹5,501 - ₹6,500", capacity: 7 },
    { range: "6501-7500", label: "₹6,501 - ₹7,500", capacity: 8 },
    { range: "7501-10500", label: "₹7,501 - ₹10,500", capacity: 10 },
  ];

  const billOptions = React.useMemo(() => {
    if (category === "commercial") {
      return [
        { value: "10000-20000", label: "₹10,000 - ₹20,000" },
        { value: "20000-30000", label: "₹20,000 - ₹30,000" },
        { value: "30000-40000", label: "₹30,000 - ₹40,000" },
        { value: "40000-50000", label: "₹40,000 - ₹50,000" },
      ];
    }
    return domesticBillToCapacity.map((d) => ({ value: d.range, label: d.label }));
  }, [category]);

  // Dynamic UI state
  const [billRange, setBillRange] = React.useState<string>("");
  const [billAmount, setBillAmount] = React.useState<string>("");
  const [capacityKw, setCapacityKw] = React.useState<number | "">("");
  const [gstMode, setGstMode] = React.useState<"previous" | "current">("current");

  React.useEffect(() => {
    if (category === "commercial") return;
    const found = domesticBillToCapacity.find((d) => d.range === billRange);
    if (found) setCapacityKw(found.capacity);
  }, [billRange, category]);

  const capacityOptions = [2, 3, 4, 5, 6, 7, 8, 10];

  // Pricing model (current GST inclusive)
  const computeCurrentCost = (kw: number) => {
    if (kw <= 2) return 144000;
    if (kw === 3) return 205000;
    return 205000 + (kw - 3) * 61000;
  };

  const estimatedCost = React.useMemo(() => {
    if (!capacityKw) return "";
    const current = computeCurrentCost(capacityKw as number);
    const previous = Math.round(current * 0.92);
    const chosen = gstMode === "current" ? current : previous;
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(chosen);
  }, [capacityKw, gstMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = { category, gstMode, capacityKw, billAmount, billRange, estimatedCost, ...data };
    const submitBtn = form.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement | null;
    try {
      if (submitBtn) {
        submitBtn.textContent = "Submitting...";
        submitBtn.disabled = true;
      }
      const resp = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        let body: any = null;
        try {
          body = await resp.json();
        } catch {
          try {
            body = await resp.text();
          } catch {
            body = null;
          }
        }
        const { toast } = await import("sonner");
        toast.error("Failed to submit quote");
        console.error("Quote submit failed:", body);
        return;
      }
      const { toast } = await import("sonner");
      toast.success("Quote request submitted — we will reach out soon");
      form.reset();
    } catch (err) {
      const { toast } = await import("sonner");
      toast.error("Failed to submit quote");
      console.error(err);
    } finally {
      if (submitBtn) {
        submitBtn.textContent = "Submit Details";
        submitBtn.disabled = false;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Get a Quote
          </h1>
          <p className="text-muted-foreground mb-6">
            Choose your category and fill the form to receive a free
            consultation and quote.
          </p>

          <Tabs
            value={category}
            onValueChange={(v) => setCategory(v as Category)}
          >
            <TabsList className="w-full grid grid-cols-3 gap-2 bg-transparent p-0 rounded-none">
              <TabsTrigger
                value="residential"
                className="h-12 w-full rounded-md border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Residential
              </TabsTrigger>
              <TabsTrigger
                value="housing"
                className="h-12 w-full rounded-md border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Housing Society
              </TabsTrigger>
              <TabsTrigger
                value="commercial"
                className="h-12 w-full rounded-md border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Commercial
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <section className="bg-white/80 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {category} Quote Form
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="category" value={category} />

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Enter Your Name *
                  </label>
                  <Input required name="name" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Whatsapp Number *
                  </label>
                  <Input required name="whatsapp" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pin Code *
                  </label>
                  <Input required name="pincode" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    What is your average monthly bill? *
                  </label>
                  <select
                    required
                    name="bill"
                    value={billRange}
                    onChange={(e) => setBillRange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select</option>
                    {billOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {billRange && category !== "commercial" && (
                    <p className="text-xs text-muted-foreground mt-1">Suggested capacity for this bill range: {domesticBillToCapacity.find(d => d.range === billRange)?.capacity} kW</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Current Monthly Bill (₹)</label>
                  <Input name="billAmount" inputMode="numeric" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Select Capacity (kW)</label>
                  <select
                    name="capacityKw"
                    value={capacityKw as any}
                    onChange={(e) => setCapacityKw(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select</option>
                    {capacityOptions.map((c) => (
                      <option key={c} value={c}>{c} kW</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">GST</label>
                  <div className="flex gap-2">
                    <Button type="button" variant={gstMode === "previous" ? "default" : "outline"} onClick={() => setGstMode("previous")}>Previous GST</Button>
                    <Button type="button" variant={gstMode === "current" ? "default" : "outline"} onClick={() => setGstMode("current")}>Current GST</Button>
                  </div>
                </div>

                {capacityKw && (
                  <div className="p-3 rounded-lg bg-solar-50 border border-solar-100 text-sm">
                    Estimated Cost: <span className="font-semibold text-solar-700">{estimatedCost}</span>
                  </div>
                )}

                {/* Hidden fields for submission */}
                <input type="hidden" name="gstMode" value={gstMode} />
                <input type="hidden" name="estimatedCost" value={estimatedCost} />

                <div className="flex items-center gap-2">
                  <input id="agree" type="checkbox" name="agree" required />
                  <label
                    htmlFor="agree"
                    className="text-sm text-muted-foreground"
                  >
                    I agree to terms of service & privacy policy
                  </label>
                </div>

                <div>
                  <Button type="submit" className="w-full">
                    Submit Details
                  </Button>
                </div>
              </form>
            </section>

            <aside className="hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Solar quote illustration"
                className="w-full h-full object-cover rounded-xl border"
              />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
