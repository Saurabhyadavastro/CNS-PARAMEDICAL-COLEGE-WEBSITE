import React, { useEffect } from 'react';
import { siteConfig } from '../../content/siteConfig';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  canonicalPath?: string;
  jsonLd?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = '/images/campus/courtyard-aerial.jpg',
  type = 'website',
  canonicalPath,
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Set document title with college branding
    const fullTitle = `${title} | ${siteConfig.collegeName}, Kannauj`;
    document.title = fullTitle;

    // Helper to set or create meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'author', siteConfig.collegeName);
    setMetaTag('name', 'keywords', 'CNS Paramedical College, Nursing College Kannauj, ANM GNM admission Kannauj, BSc Nursing Uttar Pradesh, Samdhan nursing college');

    const currentUrl = typeof window !== 'undefined'
      ? canonicalPath 
        ? `${window.location.origin}${canonicalPath}`
        : window.location.href
      : '';
    const fullImageUrl = typeof window !== 'undefined' && image.startsWith('/')
      ? `${window.location.origin}${image}`
      : image;

    // 3. Canonical Link Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentUrl);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:image', fullImageUrl);
    setMetaTag('property', 'og:site_name', siteConfig.collegeName);
    setMetaTag('property', 'og:locale', 'en_IN');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullImageUrl);

    // 6. EducationalOrganization Structured Data (JSON-LD)
    const baseJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: siteConfig.collegeName,
      alternateName: 'C.N.S. Paramedical College',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://cnsparamedical.in',
      logo: typeof window !== 'undefined' ? `${window.location.origin}/images/Logos/College Logo.png` : '/images/Logos/College Logo.png',
      image: fullImageUrl,
      description: siteConfig.tagline,
      foundingDate: '2022',
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.landmark}`,
        addressLocality: siteConfig.contact.address.town,
        addressRegion: siteConfig.contact.address.state,
        postalCode: siteConfig.contact.address.pincode,
        addressCountry: 'IN',
      },
      telephone: siteConfig.contact.phone.includes('TO_CONFIRM') ? undefined : siteConfig.contact.phone,
      email: siteConfig.contact.email.includes('TO_CONFIRM') ? undefined : siteConfig.contact.email,
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:30',
          closes: '16:30',
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Paramedical and Nursing Programs',
        itemListElement: siteConfig.courses.map((c) => ({
          '@type': 'Course',
          name: c.title,
          description: c.shortDescription,
          courseCode: c.code,
          educationalCredentialAwarded: c.code === 'B.Sc. Nursing' ? 'Bachelor Degree' : 'Diploma',
          timeRequired: c.duration,
        })),
      },
    };

    const finalJsonLd = jsonLd ? { ...baseJsonLd, ...jsonLd } : baseJsonLd;

    let scriptTag = document.querySelector('#seo-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(finalJsonLd);
  }, [title, description, image, type, canonicalPath, jsonLd]);

  return null;
};
