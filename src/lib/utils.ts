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
        canonical: `/${locale}`,
        languages: {
            'fr': '/fr',
            'en': '/en',
            'de': '/de',
            'es': '/es',
            'it': '/it',
            'pl': '/pl',
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
