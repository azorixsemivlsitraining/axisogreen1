import * as React from "react";
import { useLocation } from "react-router-dom";

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector) as
    | HTMLMetaElement
    | HTMLLinkElement
    | null;
  if (!el) {
    const tagName = selector.startsWith('link') ? 'link' : 'meta';
    el = document.createElement(tagName) as any;
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => (el as any).setAttribute(k, v));
}

const SITE_NAME = "AXISO Green Energies";
const DEFAULT_IMAGE =
  "https://cdn.builder.io/api/v1/image/assets%2F59bf3e928fc9473a97d5e87470c824bb%2F661e86d7a74f464c89095a37afa49cbd?format=webp&width=1200";

const routeMeta: Record<string, { title: string; description: string; keywords?: string }> = {
  "/": {
    title: `${SITE_NAME} — Clean Energy Solutions`,
    description:
      "Solar, wind, and smart energy solutions delivering maximum efficiency, reliability, and cost savings.",
    keywords:
      "solar energy, renewable energy, rooftop solar, wind power, energy storage, EV charging, smart energy",
  },
  "/solutions": {
    title: `Solutions | ${SITE_NAME}`,
    description:
      "Explore solar, wind, energy storage, and EV charging solutions tailored for homes, businesses, and government.",
  },
  "/about": {
    title: `About Us | ${SITE_NAME}`,
    description:
      "Learn about our mission to accelerate sustainable energy adoption with innovative, reliable solutions.",
  },
  "/contact": {
    title: `Contact | ${SITE_NAME}`,
    description:
      "Contact our experts for a free consultation, pricing, or help with your renewable energy project.",
  },
  "/sectors": {
    title: `Industries | ${SITE_NAME}`,
    description:
      "Industry-specific renewable energy solutions for residential, commercial, and government sectors.",
  },
  "/resources": {
    title: `Resources | ${SITE_NAME}`,
    description:
      "Guides, articles, and updates on solar, wind, storage, and sustainable practices.",
  },
};

export function SEOProvider() {
  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    const meta = routeMeta[path] ?? {
      title: `${SITE_NAME} | ${path.replace(/\//g, " ").trim() || "Home"}`,
      description:
        "Renewable energy solutions including solar, wind, storage, and EV charging backed by expert advisory.",
    };

    const url = `${window.location.origin}${path}${window.location.search}`;

    document.title = meta.title;

    upsertMeta('meta[name="description"]', { name: 'description', content: meta.description });
    if (meta.keywords) {
      upsertMeta('meta[name="keywords"]', { name: 'keywords', content: meta.keywords });
    }
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow' });

    // Canonical
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: url });

    // Open Graph
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: meta.title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: meta.description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: DEFAULT_IMAGE });

    // Twitter
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: meta.description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: DEFAULT_IMAGE });

    // Theme color for PWA/Chrome UI
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#0ea5a3' });
  }, [location]);

  return null;
}
