import { SITE } from "@/lib/site";

/**
 * Schema.org JSON-LD (@graph) for rich results: Organization, WebSite and a
 * ProfessionalService with a catalog of offerings. Rendered once in the root
 * layout so it applies site-wide.
 */
export default function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        email: SITE.email,
        description: SITE.description,
        logo: {
          "@type": "ImageObject",
          url: `${SITE.url}/logo.svg`,
        },
        image: `${SITE.url}/opengraph-image`,
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
        },
        areaServed: [
          { "@type": "Country", name: "India" },
          "Worldwide",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: SITE.email,
          areaServed: "Worldwide",
          availableLanguage: ["en"],
        },
        ...(SITE.socials.length ? { sameAs: SITE.socials } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en",
        publisher: { "@id": `${SITE.url}/#organization` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE.url}/#service`,
        name: SITE.name,
        url: SITE.url,
        image: `${SITE.url}/opengraph-image`,
        description: SITE.description,
        provider: { "@id": `${SITE.url}/#organization` },
        areaServed: [{ "@type": "Country", name: "India" }, "Worldwide"],
        serviceType: SITE.services,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Software & AI services",
          itemListElement: SITE.services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s },
          })),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
