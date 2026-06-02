/**
 * Component 18: Evidence Library Builder
 * EXTREMELY HIGH-YIELD
 *
 * Pre-built citation bank for all 7 nodes and 5 zones.
 * Instant citation insertion into any content without mid-article PubMed searches.
 * Evidence tiers pre-assigned. Updated periodically.
 */

import { VM_BRAND, EvidenceTier } from './brand-config';
import { searchPubMed, type Citation } from './c1-citation-engine';

// --- Types ---

export interface EvidenceEntry {
  id: string;
  topic: string;
  nodeRelevance: string[];
  zoneRelevance: string[];
  evidenceTier: EvidenceTier;
  citationText: string;
  pubmedId?: string;
  doi?: string;
  year: number;
  searchTermUsed: string;
}

export interface EvidenceLibrary {
  entries: EvidenceEntry[];
  lastUpdated: string;
  totalEntries: number;
  coverageByNode: Record<string, number>;
  coverageByZone: Record<string, number>;
}

// --- Pre-built Search Terms per Node ---

export const NODE_SEARCH_TERMS: Record<string, string[]> = {
  N1: ['gut microbiome functional medicine', 'intestinal permeability zonulin', 'digestive enzyme insufficiency', 'SIBO functional assessment', 'food sensitivity IgG clinical'],
  N2: ['immune dysregulation functional medicine', 'chronic inflammation biomarkers', 'autoimmune terrain assessment', 'mucosal immunity gut', 'oxidative stress antioxidant defence'],
  N3: ['mitochondrial dysfunction fatigue', 'cellular energy production CoQ10', 'metabolic flexibility assessment', 'adrenal function cortisol diurnal', 'thyroid functional medicine'],
  N4: ['detoxification phase I phase II', 'liver biotransformation glutathione', 'heavy metal chelation evidence', 'lymphatic drainage clinical', 'renal function functional assessment'],
  N5: ['cardiovascular functional medicine', 'endothelial function assessment', 'pulmonary function integrative', 'cerebrovascular blood brain barrier', 'microcirculation assessment'],
  N6: ['HPA axis dysregulation', 'neurotransmitter imbalance functional', 'insulin resistance functional medicine', 'hormonal communication endocrine', 'cortisol DHEA ratio clinical'],
  N7: ['connective tissue integrity collagen', 'musculoskeletal functional assessment', 'bone density functional medicine', 'joint hypermobility Ehlers Danlos', 'structural integrity assessment'],
};

export const ZONE_SEARCH_TERMS: Record<string, string[]> = {
  Z1: ['metabolic energy axis thyroid adrenal', 'energy metabolism functional medicine', 'pancreatic function insulin sensitivity'],
  Z2: ['gut immune brain axis', 'resilience network functional medicine', 'mucosal barrier immune function'],
  Z3: ['cardiovascular neural axis', 'heart brain connection functional', 'autonomic nervous system cardiovascular'],
  Z4: ['detoxification trident hepatic lymphatic renal', 'biotransformation clinical assessment', 'toxic burden functional medicine'],
  Z5: ['hormonal terrain axis', 'sex hormone functional assessment', 'androgenic estrogenic progestogenic balance'],
};

// --- Library Builder ---

export function buildEmptyLibrary(): EvidenceLibrary {
  return {
    entries: [],
    lastUpdated: new Date().toISOString(),
    totalEntries: 0,
    coverageByNode: { N1: 0, N2: 0, N3: 0, N4: 0, N5: 0, N6: 0, N7: 0 },
    coverageByZone: { Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0 },
  };
}

export function addEntry(library: EvidenceLibrary, entry: EvidenceEntry): EvidenceLibrary {
  library.entries.push(entry);
  library.totalEntries++;
  library.lastUpdated = new Date().toISOString();

  for (const node of entry.nodeRelevance) {
    library.coverageByNode[node] = (library.coverageByNode[node] || 0) + 1;
  }
  for (const zone of entry.zoneRelevance) {
    library.coverageByZone[zone] = (library.coverageByZone[zone] || 0) + 1;
  }

  return library;
}

// --- Query ---

export function findByNode(library: EvidenceLibrary, node: string): EvidenceEntry[] {
  return library.entries.filter(e => e.nodeRelevance.includes(node));
}

export function findByZone(library: EvidenceLibrary, zone: string): EvidenceEntry[] {
  return library.entries.filter(e => e.zoneRelevance.includes(zone));
}

export function findByTier(library: EvidenceLibrary, tier: EvidenceTier): EvidenceEntry[] {
  return library.entries.filter(e => e.evidenceTier === tier);
}

export function findByTopic(library: EvidenceLibrary, query: string): EvidenceEntry[] {
  const q = query.toLowerCase();
  return library.entries.filter(e =>
    e.topic.toLowerCase().includes(q) || e.citationText.toLowerCase().includes(q)
  );
}

// --- Citation Insertion ---

export function formatForInsertion(entry: EvidenceEntry, refNumber: number): string {
  return `<sup>[${refNumber}]</sup>`;
}

export function formatReferenceList(entries: EvidenceEntry[]): string {
  return entries.map((e, i) =>
    `${i + 1}. ${e.citationText} [${e.evidenceTier}]${e.doi ? ` doi:${e.doi}` : ''}`
  ).join('\n');
}

// --- Coverage Report ---

export function generateCoverageReport(library: EvidenceLibrary): string {
  const lines = [
    `# Evidence Library Coverage Report`,
    `Updated: ${library.lastUpdated} | Total: ${library.totalEntries} entries`,
    '',
    '## Node Coverage',
    ...Object.entries(library.coverageByNode).map(([node, count]) =>
      `- ${node}: ${count} citations${count < 3 ? ' **NEEDS MORE**' : ''}`
    ),
    '',
    '## Zone Coverage',
    ...Object.entries(library.coverageByZone).map(([zone, count]) =>
      `- ${zone}: ${count} citations${count < 3 ? ' **NEEDS MORE**' : ''}`
    ),
  ];
  return lines.join('\n');
}
