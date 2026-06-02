/**
 * Component 24: Content Freshness Auditor
 * EXTREMELY HIGH-YIELD
 *
 * Scans all published content for staleness, compliance drift,
 * outdated pricing, deprecated terms. Flags what needs updating
 * before a practitioner sees it and loses trust.
 */

import { VM_BRAND } from './brand-config';
import { scanContent, type ScanResult } from './c7-compliance-scanner';

// --- Types ---

export type FreshnessIssue = 'STALE_CITATION' | 'OUTDATED_PRICING' | 'DEPRECATED_TERM' | 'COMPLIANCE_DRIFT' | 'BROKEN_EVIDENCE_TIER' | 'SUPERSEDED_DECISION' | 'STALE_DATE' | 'WRONG_CREDENTIAL';

export interface AuditFinding {
  issue: FreshnessIssue;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  detail: string;
  fix: string;
}

export interface ContentAuditResult {
  contentId: string;
  title: string;
  lastModified: string;
  findings: AuditFinding[];
  complianceScan: ScanResult;
  overallStatus: 'FRESH' | 'STALE' | 'CRITICAL';
  daysSinceUpdate: number;
}

// --- Freshness Checks ---

export function auditContent(contentId: string, title: string, body: string, lastModified: string): ContentAuditResult {
  const findings: AuditFinding[] = [];

  // Days since update
  const lastMod = new Date(lastModified);
  const now = new Date();
  const daysSinceUpdate = Math.floor((now.getTime() - lastMod.getTime()) / (1000 * 60 * 60 * 24));

  // Stale content (>90 days)
  if (daysSinceUpdate > 90) {
    findings.push({
      issue: 'STALE_DATE',
      severity: daysSinceUpdate > 180 ? 'HIGH' : 'MEDIUM',
      location: 'metadata',
      detail: `Content last updated ${daysSinceUpdate} days ago`,
      fix: 'Review and refresh content',
    });
  }

  // Outdated pricing
  if (/GBP\s*(?!99|599)\d+/g.test(body)) {
    findings.push({
      issue: 'OUTDATED_PRICING',
      severity: 'CRITICAL',
      location: 'body',
      detail: 'Non-standard pricing figure found',
      fix: `Update to current rates: GBP ${VM_BRAND.pricing.foundingMonthly} (founding cohort), GBP ${VM_BRAND.pricing.standardRate} (month ${VM_BRAND.pricing.foundingFixedMonths + 1}+)`,
    });
  }

  // Old pricing references
  if (/healthhorizonwellness|HHW|Health Horizon/i.test(body)) {
    findings.push({
      issue: 'DEPRECATED_TERM',
      severity: 'CRITICAL',
      location: 'body',
      detail: 'HHW/Health Horizon Wellness reference found — project is PAUSED',
      fix: 'Remove all HHW references',
    });
  }

  // Stale citations (year check)
  const yearMatches = body.match(/\b(19\d{2}|20[01]\d|202[0-3])\b/g);
  if (yearMatches) {
    const currentYear = now.getFullYear();
    const oldCitations = yearMatches.filter(y => currentYear - parseInt(y) > 10);
    if (oldCitations.length > 0) {
      findings.push({
        issue: 'STALE_CITATION',
        severity: 'MEDIUM',
        location: 'body',
        detail: `${oldCitations.length} citations older than 10 years: ${oldCitations.join(', ')}`,
        fix: 'Review and update or flag with evidence tier',
      });
    }
  }

  // Evidence tier gaps
  const clinicalClaims = body.match(/(?:has been shown|studies suggest|research indicates|evidence shows|data demonstrates)/gi);
  if (clinicalClaims) {
    const hasTierLabels = /\b(Established|Emerging|Theoretical|Observed in Practice|Contested)\b/.test(body);
    if (!hasTierLabels) {
      findings.push({
        issue: 'BROKEN_EVIDENCE_TIER',
        severity: 'HIGH',
        location: 'body',
        detail: `${clinicalClaims.length} clinical claim(s) without evidence tier labels`,
        fix: 'Add evidence tier to every clinical claim',
      });
    }
  }

  // Superseded decisions
  const superseded = ['D-13', 'D-22', 'D-23'];
  for (const d of superseded) {
    if (body.includes(d)) {
      findings.push({
        issue: 'SUPERSEDED_DECISION',
        severity: 'HIGH',
        location: 'body',
        detail: `Reference to superseded decision ${d}`,
        fix: `${d} was superseded — update to current decision`,
      });
    }
  }

  // Wrong mnemonic count
  if (/22\s*(?:branded\s*)?mnemonics/i.test(body)) {
    findings.push({
      issue: 'DEPRECATED_TERM',
      severity: 'MEDIUM',
      location: 'body',
      detail: 'References "22 mnemonics" — there are now 30',
      fix: 'Update to 30 branded mnemonics',
    });
  }

  // Run compliance scanner
  const complianceScan = scanContent(body);

  // Add compliance findings
  for (const v of complianceScan.violations.filter(v => v.severity === 'CRITICAL')) {
    findings.push({
      issue: 'COMPLIANCE_DRIFT',
      severity: 'CRITICAL',
      location: `line ${v.line}`,
      detail: v.message,
      fix: `Fix ${v.rule} violation`,
    });
  }

  // Overall status
  const hasCritical = findings.some(f => f.severity === 'CRITICAL');
  const hasHigh = findings.some(f => f.severity === 'HIGH');
  const overallStatus = hasCritical ? 'CRITICAL' as const : hasHigh || daysSinceUpdate > 90 ? 'STALE' as const : 'FRESH' as const;

  return {
    contentId,
    title,
    lastModified,
    findings,
    complianceScan,
    overallStatus,
    daysSinceUpdate,
  };
}

// --- Report ---

export function generateAuditReport(results: ContentAuditResult[]): string {
  const critical = results.filter(r => r.overallStatus === 'CRITICAL');
  const stale = results.filter(r => r.overallStatus === 'STALE');
  const fresh = results.filter(r => r.overallStatus === 'FRESH');

  const lines = [
    '# Content Freshness Audit Report',
    `Date: ${new Date().toISOString().split('T')[0]}`,
    `Scanned: ${results.length} pieces of content`,
    '',
    `| Status | Count |`,
    `|--------|-------|`,
    `| CRITICAL | ${critical.length} |`,
    `| STALE | ${stale.length} |`,
    `| FRESH | ${fresh.length} |`,
    '',
  ];

  if (critical.length > 0) {
    lines.push('## Critical — Fix Immediately');
    for (const r of critical) {
      lines.push(`### ${r.title}`);
      lines.push(`Last updated: ${r.lastModified} (${r.daysSinceUpdate} days ago)`);
      for (const f of r.findings.filter(f => f.severity === 'CRITICAL')) {
        lines.push(`- **${f.issue}**: ${f.detail} → ${f.fix}`);
      }
      lines.push('');
    }
  }

  if (stale.length > 0) {
    lines.push('## Stale — Review Soon');
    for (const r of stale) {
      lines.push(`- **${r.title}** (${r.daysSinceUpdate} days, ${r.findings.length} findings)`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
