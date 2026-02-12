import { siteConfig } from '@/config/site';

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
  locale = "fr",
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  locale?: string;
} = {}) {
  // Fix: Ensure canonical is an absolute URL
  const canonicalUrl = `${siteConfig.url}/${locale}`;

  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
      type: "website",
      locale: locale,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@limperatrice",
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    alternates: {
        canonical: canonicalUrl,
        languages: {
            'fr': `${siteConfig.url}/fr`,
            'en': `${siteConfig.url}/en`,
            'de': `${siteConfig.url}/de`,
            'es': `${siteConfig.url}/es`,
            'it': `${siteConfig.url}/it`,
            'pl': `${siteConfig.url}/pl`,
        },
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
