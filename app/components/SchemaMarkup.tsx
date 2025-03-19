export default function SchemaMarkup() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "LandingKits",
          "applicationCategory": "WebApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "IDR"
          },
          "description": "Platform pembuatan landing page profesional dengan drag & drop builder, template premium, dan analitik lengkap.",
          "featureList": [
            "Drag & Drop Builder",
            "Template Premium",
            "Analitik Lengkap",
            "Custom Domain",
            "API Access"
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
          }
        })
      }}
    />
  );
} 