import { useEffect } from 'react';

const SITE_URL = 'https://matrikatoursandtravels.com';

// Sets document.title, the meta description, and — most importantly — the
// canonical <link> tag to match the CURRENT page's own URL.
//
// Why this matters: this is a single-page app, so index.html (with its one
// hardcoded canonical tag) is served for every route. Without this hook,
// every page — Packages, Tours, Gallery, every trek detail page — tells
// Google "the real version of this page is the homepage", so Google treats
// them all as duplicates and refuses to index them separately.
//
// Usage in a page component:
//   useSEO({
//     title: 'Our Trek Packages | SkieHIkes',
//     description: 'Browse curated trek packages across Uttarakhand...',
//     path: '/packages',
//   });
export const useSEO = ({ title, description, path }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    const resolvedPath = path || window.location.pathname;
    canonicalTag.setAttribute('href', `${SITE_URL}${resolvedPath}`);

    if (description) {
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.setAttribute('name', 'description');
        document.head.appendChild(descTag);
      }
      descTag.setAttribute('content', description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path]);
};
