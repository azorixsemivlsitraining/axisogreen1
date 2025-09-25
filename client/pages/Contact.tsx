import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import * as React from "react";

// Price list (starting range with current GST)
const prices = [
  { capacity: "3 Kw", current: 205000 },
  { capacity: "3.4 Kw", current: 210000 },
  { capacity: "4 Kw", current: 255000 },
  { capacity: "5 Kw (1ph)", current: 305000 },
  { capacity: "5 Kw (3ph)", current: 325000 },
  { capacity: "6 Kw", current: 375000 },
  { capacity: "7 Kw", current: 420000 },
  { capacity: "8 Kw", current: 475000 },
  { capacity: "9 Kw", current: 535000 },
  { capacity: "10 Kw", current: 585000 },
];

export default function Contact() {
  const [selectedGST, setSelectedGST] = React.useState<"prev" | "current">(
    "current",
  );
  const [selectedPrice, setSelectedPrice] = React.useState(prices[0].current);

  const handleSelect = (price: number, type: "prev" | "current") => {
    setSelectedGST(type);
    setSelectedPrice(
      type === "prev" ? price + 5000 : price, // prev is +5000
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());

    const btn = form.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement | null;
    try {
      if (btn) {
        btn.textContent = "Sending...";
        btn.disabled = true;
      }
      const resp = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!resp.ok) {
        const { toast } = await import("sonner");
        toast.error("Failed to send message");
        return;
      }
      const { toast } = await import("sonner");
      toast.success("Message sent — we will contact you shortly");
      form.reset();
    } catch (err) {
      const { toast } = await import("sonner");
      toast.error("Failed to send message");
      console.error(err);
    } finally {
      if (btn) {
        btn.textContent = "Send Message";
        btn.disabled = false;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Contact Us
          </h1>
          <p className="text-muted-foreground mb-8">
            Get in touch with our renewable energy experts for a free
            consultation.
          </p>

          {/* Contact Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-white/80 p-6 rounded-xl shadow"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>
                <Input required name="name" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <Input required type="email" name="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <Input required name="phone" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject *
                </label>
                <Input required name="subject" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message *
                </label>
                <Textarea required name="message" rows={5} />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
            <aside className="hidden md:block h-full">
              <img
                src="/axis-third.jpeg"
                alt="Axis Green Energy rooftop solar installation"
                className="w-full h-full object-cover rounded-xl border shadow-lg"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/placeholder.svg";
                }}
              />
            </aside>
          </div>
        </section>

        {/* Map Location */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-green-100">
            <iframe
              title="Axiso Green Energy Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.241372001067!2d78.339070175912!3d17.495987599666098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9339b0a17839%3A0x3426f99387651e26!2sAxiso%20Green%20Energy!5e0!3m2!1sen!2sin!4v1758781678550!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
