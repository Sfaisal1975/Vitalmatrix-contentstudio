/**
 * Component 1: Citation and Evidence Engine
 * Source: HHW Prompt 3 (Clinical Research Integration), adapted for VitalMatrix
 * Route: VM W5 (Claude Code builds)
 * Gate: Gate O1 (CSV clinical review)
 *
 * Features:
 *  - PubMed eUtils API search (keyword -> title, authors, journal, year, DOI, PMID, abstract)
 *  - Inline citation insertion (superscript reference numbers in practitioner reports)
 *  - Vancouver style reference auto-formatting with DOI hyperlinks
 *  - Bidirectional linking (body <-> reference section)
 *  - Citation summary statistics (count, avg year, oldest citation flag >10yr)
 *  - Evidence tier label on every citation (Established | Emerging | Theoretical | Observed in Practice)
 *
 * VitalMatrix adaptations:
 *  - Categories mapped to FLINT 7-node and NCZ 5-zone taxonomy (not patient topics)
 *  - Each citation carries evidence tier label
 *  - Citations support CascadeIQ stack evidence claims (S1-S6)
 *  - Regulatory footer on all citation displays
 *  - Audience: "For practitioner use only"
 *
 * Stripped (HHW-specific):
 *  - Google Scholar web scraping
 *  - Blog post editor integration
 *  - Patient-facing topic categories
 *  - Export to EndNote/Mendeley/Zotero
 *  - HHW colour palette (#D4A574 warm gold)
 */

import { VM_BRAND, EvidenceTier } from './brand-config';

// --- Types ---

export interface Citation {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pubmedId?: string;
  abstract?: string;
  evidenceTier: EvidenceTier;
  nodeRelevance: string[];   // N1-N7
  zoneRelevance: string[];   // Z1-Z5
  stackRelevance: string[];  // S1-S6
  createdAt: Date;
  updatedAt: Date;
}

export interface PubMedSearchResult {
  pmid: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  abstract?: string;
}

export interface CitationSummary {
  totalCitations: number;
  averageYear: number;
  oldestYear: number;
  oldestCitationFlag: boolean;  // true if oldest > 10 years
  tierBreakdown: Record<EvidenceTier, number>;
}

// --- PubMed API ---

const PUBMED_SEARCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const PUBMED_FETCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';

export async function searchPubMed(query: string, maxResults: number = 10): Promise<string[]> {
  const url = `${PUBMED_SEARCH_URL}?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json`;
  const response = await fetch(url);
  const data = await response.json();
  return data.esearchresult?.idlist ?? [];
}

export async function fetchPubMedDetails(pmids: string[]): Promise<PubMedSearchResult[]> {
  if (pmids.length === 0) return [];
  const url = `${PUBMED_FETCH_URL}?db=pubmed&id=${pmids.join(',')}&retmode=xml`;
  const response = await fetch(url);
  const xml = await response.text();
  return parsePubMedXml(xml);
}

function parsePubMedXml(xml: string): PubMedSearchResult[] {
  const results: PubMedSearchResult[] = [];
  const articles = xml.split('<PubmedArticle>').slice(1);

  for (const article of articles) {
    const getTag = (tag: string): string => {
      const match = article.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
      return match ? match[1].trim() : '';
    };

    const title = getTag('ArticleTitle');
    const journal = getTag('Title'); // Journal title
    const year = parseInt(getTag('Year')) || 0;
    const pmid = getTag('PMID');

    // Extract authors
    const authorMatches = article.match(/<LastName>([^<]*)<\/LastName>\s*<ForeName>([^<]*)<\/ForeName>/g) || [];
    const authors = authorMatches.map(a => {
      const last = a.match(/<LastName>([^<]*)/)?.[1] || '';
      const first = a.match(/<ForeName>([^<]*)/)?.[1] || '';
      return `${last} ${first.charAt(0)}`;
    }).join(', ');

    // Extract DOI
    const doiMatch = article.match(/<ArticleId IdType="doi">([^<]*)<\/ArticleId>/);
    const doi = doiMatch ? doiMatch[1] : undefined;

    // Extract abstract
    const abstractMatch = article.match(/<AbstractText[^>]*>([^<]*)<\/AbstractText>/);
    const abstract = abstractMatch ? abstractMatch[1] : undefined;

    if (title && pmid) {
      results.push({ pmid, title, authors: authors || 'Unknown', journal, year, doi, abstract });
    }
  }

  return results;
}

// --- Vancouver Formatting ---

export function formatVancouver(citation: Citation): string {
  const { authors, title, journal, year, volume, issue, pages, doi } = citation;
  let ref = `${authors}. ${title}. ${journal}. ${year}`;
  if (volume) ref += `;${volume}`;
  if (issue) ref += `(${issue})`;
  if (pages) ref += `:${pages}`;
  ref += '.';
  if (doi) ref += ` doi:${doi}`;
  return ref;
}

// --- Inline Citation Insertion ---

export function insertInlineCitation(text: string, position: number, citationNumber: number): string {
  return text.slice(0, position) + `<sup>[${citationNumber}]</sup>` + text.slice(position);
}

// --- Citation Summary ---

export function generateSummary(citations: Citation[]): CitationSummary {
  const currentYear = new Date().getFullYear();
  const years = citations.map(c => c.year);
  const oldestYear = Math.min(...years);

  const tierBreakdown = {} as Record<EvidenceTier, number>;
  for (const tier of VM_BRAND.evidenceTiers) {
    tierBreakdown[tier] = citations.filter(c => c.evidenceTier === tier).length;
  }

  return {
    totalCitations: citations.length,
    averageYear: Math.round(years.reduce((a, b) => a + b, 0) / years.length),
    oldestYear,
    oldestCitationFlag: (currentYear - oldestYear) > 10,
    tierBreakdown,
  };
}

// --- Database Schema ---

export const CITATION_TABLE_SQL = `
CREATE TABLE vm_clinical_citations (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  journal TEXT,
  year INT,
  volume TEXT,
  issue TEXT,
  pages TEXT,
  doi TEXT,
  pubmed_id TEXT,
  abstract TEXT,
  evidence_tier VARCHAR(30) CHECK (
    evidence_tier IN (
      'Established', 'Emerging', 'Theoretical', 'Observed in Practice', 'Contested'
    )
  ),
  node_relevance TEXT[],   -- Array of N1 through N7
  zone_relevance TEXT[],   -- Array of Z1 through Z5
  stack_relevance TEXT[],  -- Array of S1 through S6
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`;
