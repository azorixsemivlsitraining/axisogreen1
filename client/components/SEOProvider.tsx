import * as React from "react";
import { useLocation } from "react-router-dom";

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector) as
    | HTMLMetaElement
    | HTMLLinkElement
    | null;
  if (!el) {
    const tagName = selector.startsWith("link") ? "link" : "meta";
    el = document.createElement(tagName) as any;
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => (el as any).setAttribute(k, v));
}

const SITE_NAME = "Axiso Green";
const DEFAULT_IMAGE =
  "https://cdn.builder.io/api/v1/image/assets%2F59bf3e928fc9473a97d5e87470c824bb%2F661e86d7a74f464c89095a37afa49cbd?format=webp&width=1200";

const routeMeta: Record<
  string,
  { title: string; description: string; keywords?: string }
> = {
  "/": {
    title: "Clean Energy Solutions | Axiso Green",
    description:
      "Axiso Green delivers sustainable energy solutions, solar installations, and green technologies to power homes, industries, and communities efficiently.",
    keywords:
      "solar energy, renewable energy, rooftop solar, wind power, energy storage, EV charging, smart energy",
  },
  "/about": {
    title: "About Axiso Green | Renewable Energy Experts",
    description:
      "Learn how Axiso Green pioneers renewable energy solutions, solar power systems, and sustainable practices for a cleaner, greener future.",
  },
  "/solutions": {
    title: "Renewable Energy Services | Axiso Green",
    description:
      "Explore our comprehensive clean energy services including solar power systems, energy audits, and sustainable energy solutions tailored for homes and businesses.",
  },
  "/services": {
    title: "Renewable Energy Services | Axiso Green",
    description:
      "Explore our comprehensive clean energy services including solar power systems, energy audits, and sustainable energy solutions tailored for homes and businesses.",
  },
  "/solutions/solar": {
    title: "Solar Energy Systems & Solutions | Axiso Green",
    description:
      "Harness the power of the sun with Axiso Green’s custom solar panel installations, solar rooftop solutions, and energy-efficient systems.",
  },
  "/solutions/b2b": {
    title: "Industrial Renewable Energy Solutions | Axiso Green",
    description:
      "Maximize efficiency with Axiso Green’s industrial energy solutions, including solar plants, energy optimization, and green technology integration.",
  },
  "/solutions/b2c": {
    title: "Residential Solar & Clean Energy | Axiso Green",
    description:
      "Power your home sustainably with solar installations, energy-efficient solutions, and renewable energy systems from Axiso Green.",
  },
  "/projects": {
    title: "Renewable Energy Projects | Axiso Green",
    description:
      "Discover successful solar and green energy projects delivered by Axiso Green, showcasing innovation, efficiency, and sustainable outcomes.",
  },
  "/case-studies": {
    title: "Renewable Energy Projects | Axiso Green",
    description:
      "Discover successful solar and green energy projects delivered by Axiso Green, showcasing innovation, efficiency, and sustainable outcomes.",
  },
  "/products": {
    title: "Solar Products & Green Energy Equipment | Axiso Green",
    description:
      "Explore high-quality solar panels, inverters, batteries, and renewable energy equipment designed for maximum efficiency and reliability.",
  },
  "/resources": {
    title: "Clean Energy Insights & Updates | Axiso Green",
    description:
      "Stay updated on renewable energy trends, solar technologies, sustainability tips, and industry innovations from Axiso Green.",
  },
  "/blog": {
    title: "Clean Energy Insights & Updates | Axiso Green",
    description:
      "Stay updated on renewable energy trends, solar technologies, sustainability tips, and industry innovations from Axiso Green.",
  },
  "/insights": {
    title: "Clean Energy Insights & Updates | Axiso Green",
    description:
      "Stay updated on renewable energy trends, solar technologies, sustainability tips, and industry innovations from Axiso Green.",
  },
  "/contact": {
    title: "Contact Axiso Green | Renewable Energy Experts",
    description:
      "Get in touch with Axiso Green to discuss solar installations, energy solutions, or request a consultation for sustainable energy projects.",
  },
  "/faq": {
    title: "Renewable Energy FAQs | Axiso Green",
    description:
      "Find answers to common questions about solar energy, installation processes, green technologies, and sustainable solutions from Axiso Green.",
  },
  "/careers": {
    title: "Careers at Axiso Green | Join Renewable Energy Experts",
    description:
      "Explore career opportunities in clean energy, sustainability, and solar technology with Axiso Green.",
  },
  "/testimonials": {
    title: "Client Testimonials | Axiso Green",
    description:
      "Hear from our satisfied clients about the efficiency, reliability, and sustainability of Axiso Green’s solar and clean energy solutions.",
  },
  "/partners": {
    title: "Our Green Partners | Axiso Green",
    description:
      "Collaborating with top renewable energy companies and technology providers to deliver innovative solar and energy solutions.",
  },
  "/gallery": {
    title: "Solar Projects & Installations Gallery | Axiso Green",
    description:
      "Browse images of Axiso Green’s solar projects, installations, and renewable energy solutions for homes, industries, and communities.",
  },
  "/sectors": {
    title: `Industries | ${SITE_NAME}`,
    description:
      "Industry-specific renewable energy solutions for residential, commercial, and government sectors.",
  },
  "/get-quote": {
    title: `Get Quote | ${SITE_NAME}`,
    description:
      "Request a personalized quote for solar, wind, or storage solutions.",
  },
  "/solutions/wind": {
    title: `Wind Solutions | ${SITE_NAME}`,
    description: "Reliable wind power solutions to complement your energy mix.",
  },
  "/solutions/storage": {
    title: `Energy Storage | ${SITE_NAME}`,
    description:
      "Battery storage solutions for resilience and peak demand savings.",
  },
  "/solutions/ev-stations": {
    title: `EV Charging Stations | ${SITE_NAME}`,
    description:
      "Smart EV charging infrastructure for homes, fleets, and public sites.",
  },
  "/solutions/b2g": {
    title: `Government (B2G) Solar | ${SITE_NAME}`,
    description:
      "Government-grade renewable solutions with compliance and performance.",
  },
  "/advisory": {
    title: `Advisory | ${SITE_NAME}`,
    description:
      "Expert energy advisory, audits, design, and project management.",
  },
  "/procurement": {
    title: `Procurement | ${SITE_NAME}`,
    description:
      "Trusted procurement for Tier-1 components and turnkey solutions.",
  },
  "/digital-solutions": {
    title: `Digital Solutions | ${SITE_NAME}`,
    description:
      "IoT, monitoring, and AI-driven energy optimization platforms.",
  },
  "/privacy": {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: "How we protect and use your information.",
  },
  "/terms": {
    title: `Terms of Service | ${SITE_NAME}`,
    description: "Website terms, usage, and disclaimers.",
  },
  "/cookies": {
    title: `Cookie Policy | ${SITE_NAME}`,
    description: "Details of cookies used and your choices.",
  },
  "/compliance": {
    title: `Compliance | ${SITE_NAME}`,
    description: "Certifications, safety, and regulatory compliance.",
  },
};

export function SEOProvider() {
  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    const meta = routeMeta[path] ?? {
      title: `${SITE_NAME} | ${path.replace(/\//g, " ").trim() || "Home"}`,
      description:
        "Axiso Green delivers tailored renewable energy solutions including solar, wind, storage, and EV charging backed by expert advisory.",
    };

    const url = `${window.location.origin}${path}${window.location.search}`;

    document.title = meta.title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: meta.description,
    });
    if (meta.keywords) {
      upsertMeta('meta[name="keywords"]', {
        name: "keywords",
        content: meta.keywords,
      });
    }
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: "index, follow",
    });

    // Canonical
    upsertMeta('link[rel="canonical"]', { rel: "canonical", href: url });

    // Open Graph
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE_NAME,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: meta.title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: meta.description,
    });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: DEFAULT_IMAGE,
    });

    // Twitter
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: meta.title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: meta.description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: DEFAULT_IMAGE,
    });

    // Theme color for PWA/Chrome UI
    upsertMeta('meta[name="theme-color"]', {
      name: "theme-color",
      content: "#0ea5a3",
    });
  }, [location]);

  return null;
}
