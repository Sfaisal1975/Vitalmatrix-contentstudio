/**
 * Component 3: JSON-LD Schema Markup Fragment
 * Source: HHW Prompt 1 (SEO Metadata), fragment extraction
 * Route: VM W9 (Brand and Design Command)
 * Gate: Hostinger website deployment
 * Priority: Low
 *
 * Features:
 *  - MedicalWebPage JSON-LD structured data for VitalMatrix website pages
 *  - Author credentials: MBBS, FAAMFM (corrected from HHW's FMAARM error)
 *  - Publisher: VitalMatrix Ltd (not Health Horizon Wellness)
 *
 * Stripped (HHW-specific):
 *  - "medically reviewed" toggle
 *  - Open Graph social media metadata
 *  - Twitter Card settings
 *  - Canonical URL management
 *  - Internal linking suggestions engine
 *  - Full SEO scoring system
 *  - Readability/keyword density checker
 *  - XML sitemap auto-update
 */

import { VM_BRAND } from './brand-config';

export interface JsonLdPageConfig {
  pageTitle: string;
  pageDescription: string;
  pageSlug: string;
  datePublished: string;   // YYYY-MM-DD
  dateModified: string;    // YYYY-MM-DD
  medicalCondition?: string;
}

export function generateJsonLd(config: JsonLdPageConfig): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: config.pageTitle,
    description: config.pageDescription,
    url: `https://${VM_BRAND.platform.domain}/${config.pageSlug}`,
    datePublished: config.datePublished,
    dateModified: config.dateModified,
    author: {
      '@type': 'Person',
      name: VM_BRAND.credentials.name,
      honorificPrefix: 'Dr',
      jobTitle: VM_BRAND.credentials.title,
      qualifications: VM_BRAND.credentials.qualifications,
      affiliation: {
        '@type': 'Organization',
        name: VM_BRAND.credentials.company,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: VM_BRAND.credentials.company,
      url: `https://${VM_BRAND.platform.domain}`,
      description: `Terrain intelligence platform for functional medicine practitioners`,
    },
    audience: {
      '@type': 'MedicalAudience',
      audienceType: 'Clinician',
      healthCondition: {
        '@type': 'MedicalCondition',
        name: 'Functional medicine clinical intelligence',
      },
    },
    specialty: {
      '@type': 'MedicalSpecialty',
      name: 'Functional Medicine',
    },
  };

  if (config.medicalCondition) {
    schema.about = {
      '@type': 'MedicalCondition',
      name: config.medicalCondition,
    };
  }

  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

/**
 * Deployment instructions for VM W9:
 * 1. Wait for Hostinger website deployment to complete
 * 2. Insert JSON-LD block into <head> of every public-facing page
 * 3. Replace placeholder values with actual page content
 * 4. For clinical content pages, populate medicalCondition
 * 5. Validate using Google Rich Results Test
 * 6. Confirm credentials read MBBS, FAAMFM (K7 check)
 */
