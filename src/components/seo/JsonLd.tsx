export function JsonLd({ data }: { data: any }) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
}

export function generateSoftwareAppSchema(locale: string) {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "L'IMPÉRATRICE",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
        },
        "description": "Assistant personnel pour vendeurs Vinted : Outils SEO, Studio Photo, Gamification.",
        "inLanguage": locale
    };
}

export function generateHowToSchema(locale: string, steps: any[]) {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Comment prendre des photos parfaites pour Vinted",
        "description": "Guide étape par étape pour maximiser vos ventes avec des photos professionnelles.",
        "step": steps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.title,
            "text": step.description,
            // "image": step.image // If we had images
        })),
        "inLanguage": locale
    };
}
