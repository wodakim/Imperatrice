import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fallback metadata constructor if needed by other components, although V2 uses layout.tsx
export function constructMetadata({
  title = "L'IMPÉRATRICE - Assistant Vinted Neuro-Inclusif",
  description = "Ton assistante personnelle de vente, conçue pour réussir avec douceur.",
  image = "/images/og-image.jpg",
  icons = "/favicon.ico",
  noIndex = false,
  locale = "fr", // Added locale prop support
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  locale?: string;
} = {}) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@limperatrice",
    },
    icons,
    metadataBase: new URL('https://limperatrice.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
