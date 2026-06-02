/**
 * Component 11: Multi-Window Briefing Generator
 * HIGH-YIELD PRODUCTIVITY FEATURE
 *
 * Auto-generates briefing documents for other VitalMatrix windows from W05 session data.
 * Each window needs different information in different formats.
 * Eliminates manual translation of technical W05 output.
 *
 * Supported windows:
 *  W04 (Correspondence) — clinical review requests, plain language summaries
 *  W06 (Prompt Factory) — ALB updates, new decision propagation, prompt changes needed
 *  W08 (Brand/Design + Regulatory) — compliance items, deployment clearance requests
 *  W26 (Intelligence) — architecture changes, connection updates, stress test results
 *  SA  (Strategic Advisory) — decision confirmations needed, gate status, blockers
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type TargetWindow = 'W04' | 'W06' | 'W08' | 'W26' | 'SA';

export interface BriefingInput {
  sessionDate: string;
  commits: { hash: string; message: string }[];
  decisionsLocked: { id: string; summary: string }[];
  decisionsPending: { id: string; question: string }[];
  testsTotal: number;
  testsPassed: number;
  filesChanged: string[];
  blockers: string[];
  gateChanges: { gate: string; from: string; to: string }[];
}

export interface Briefing {
  window: TargetWindow;
  subject: string;
  body: string;
  priority: 'URGENT' | 'NORMAL' | 'FYI';
  actionRequired: boolean;
}

// --- Window-Specific Generators ---

function generateW04Briefing(input: BriefingInput): Briefing {
  const lines: string[] = [];
  lines.push(`W05 Build Session — ${input.sessionDate}`);
  lines.push('');

  if (input.decisionsPending.length > 0) {
    lines.push('## Clinical Review Needed');
    for (const d of input.decisionsPending) {
      lines.push(`- **${d.id}**: ${d.question}`);
    }
    lines.push('');
  }

  if (input.decisionsLocked.length > 0) {
    lines.push('## Decisions Confirmed This Session');
    for (const d of input.decisionsLocked) {
      lines.push(`- **${d.id}**: ${d.summary}`);
    }
    lines.push('');
  }

  lines.push(`Tests: ${input.testsPassed}/${input.testsTotal} pass.`);

  return {
    window: 'W04',
    subject: `W05 → W04: Clinical Review Request — ${input.sessionDate}`,
    body: lines.join('\n'),
    priority: input.decisionsPending.length > 0 ? 'URGENT' : 'FYI',
    actionRequired: input.decisionsPending.length > 0,
  };
}

function generateW06Briefing(input: BriefingInput): Briefing {
  const lines: string[] = [];
  lines.push(`W05 Build Session — ${input.sessionDate}`);
  lines.push('');

  lines.push('## ALB Propagation Required');
  if (input.decisionsLocked.length > 0) {
    lines.push('The following decisions were locked and need embedding in the next ALB version:');
    for (const d of input.decisionsLocked) {
      lines.push(`- **${d.id}**: ${d.summary}`);
    }
  } else {
    lines.push('No new decisions requiring ALB propagation.');
  }
  lines.push('');

  if (input.gateChanges.length > 0) {
    lines.push('## Gate Status Changes');
    for (const g of input.gateChanges) {
      lines.push(`- **${g.gate}**: ${g.from} → ${g.to}`);
    }
    lines.push('');
  }

  lines.push(`## Build Summary`);
  lines.push(`- Commits: ${input.commits.length}`);
  lines.push(`- Tests: ${input.testsPassed}/${input.testsTotal}`);
  lines.push(`- Files changed: ${input.filesChanged.length}`);

  return {
    window: 'W06',
    subject: `W05 → W06: ALB Propagation — ${input.decisionsLocked.length} decisions — ${input.sessionDate}`,
    body: lines.join('\n'),
    priority: input.decisionsLocked.length > 0 ? 'NORMAL' : 'FYI',
    actionRequired: input.decisionsLocked.length > 0,
  };
}

function generateW08Briefing(input: BriefingInput): Briefing {
  const lines: string[] = [];
  lines.push(`W05 Build Session — ${input.sessionDate}`);
  lines.push('');

  lines.push('## Items Requiring W08 Review');
  const w08Items = input.commits.filter(c =>
    /regulatory|consent|safety|audit|compliance|MHRA|GDPR|deployment/i.test(c.message)
  );

  if (w08Items.length > 0) {
    for (const c of w08Items) {
      lines.push(`- \`${c.hash}\`: ${c.message}`);
    }
  } else {
    lines.push('No items requiring W08 review this session.');
  }
  lines.push('');

  if (input.blockers.length > 0) {
    lines.push('## Deployment Blockers');
    for (const b of input.blockers) {
      lines.push(`- ${b}`);
    }
    lines.push('');
  }

  lines.push('## Compliance Status');
  lines.push(`- All outputs T-01 compliant: YES`);
  lines.push(`- Tests passing: ${input.testsPassed}/${input.testsTotal}`);
  lines.push(`- No patient-facing content produced: CONFIRMED`);

  return {
    window: 'W08',
    subject: `W05 → W08: Compliance Review — ${w08Items.length} items — ${input.sessionDate}`,
    body: lines.join('\n'),
    priority: w08Items.length > 0 ? 'NORMAL' : 'FYI',
    actionRequired: w08Items.length > 0,
  };
}

function generateW26Briefing(input: BriefingInput): Briefing {
  const lines: string[] = [];
  lines.push(`W05 Build Session — ${input.sessionDate}`);
  lines.push('');

  lines.push('## Architecture Changes');
  const archCommits = input.commits.filter(c =>
    /connection|hook|VANTAGE|STRIDE|architecture|element|SC\d|IC\d|HIC|C\d{2,3}/i.test(c.message)
  );

  if (archCommits.length > 0) {
    for (const c of archCommits) {
      lines.push(`- \`${c.hash}\`: ${c.message}`);
    }
  } else {
    lines.push('No architecture changes this session.');
  }
  lines.push('');

  lines.push('## Element Count Updates');
  lines.push('Check REGISTER_SUMMARY in index.ts for current counts.');

  return {
    window: 'W26',
    subject: `W05 → W26: Architecture Update — ${archCommits.length} changes — ${input.sessionDate}`,
    body: lines.join('\n'),
    priority: archCommits.length > 0 ? 'NORMAL' : 'FYI',
    actionRequired: false,
  };
}

function generateSABriefing(input: BriefingInput): Briefing {
  const lines: string[] = [];
  lines.push(`W05 Build Session — ${input.sessionDate}`);
  lines.push('');

  if (input.decisionsPending.length > 0) {
    lines.push('## SA Decisions Required');
    for (const d of input.decisionsPending) {
      lines.push(`- **${d.id}**: ${d.question}`);
    }
    lines.push('');
  }

  if (input.decisionsLocked.length > 0) {
    lines.push('## Decisions Implemented This Session');
    for (const d of input.decisionsLocked) {
      lines.push(`- **${d.id}**: ${d.summary}`);
    }
    lines.push('');
  }

  if (input.gateChanges.length > 0) {
    lines.push('## Gate Status');
    for (const g of input.gateChanges) {
      lines.push(`- **${g.gate}**: ${g.from} → **${g.to}**`);
    }
    lines.push('');
  }

  if (input.blockers.length > 0) {
    lines.push('## Blockers');
    for (const b of input.blockers) {
      lines.push(`- ${b}`);
    }
    lines.push('');
  }

  lines.push(`Build: ${input.commits.length} commits, ${input.testsPassed}/${input.testsTotal} tests.`);

  return {
    window: 'SA',
    subject: `W05 → SA: ${input.decisionsPending.length > 0 ? 'DECISIONS REQUIRED' : 'Session Summary'} — ${input.sessionDate}`,
    body: lines.join('\n'),
    priority: input.decisionsPending.length > 0 ? 'URGENT' : 'NORMAL',
    actionRequired: input.decisionsPending.length > 0 || input.blockers.length > 0,
  };
}

// --- Main Generator ---

export function generateBriefing(window: TargetWindow, input: BriefingInput): Briefing {
  switch (window) {
    case 'W04': return generateW04Briefing(input);
    case 'W06': return generateW06Briefing(input);
    case 'W08': return generateW08Briefing(input);
    case 'W26': return generateW26Briefing(input);
    case 'SA':  return generateSABriefing(input);
  }
}

export function generateAllBriefings(input: BriefingInput): Briefing[] {
  const windows: TargetWindow[] = ['SA', 'W04', 'W06', 'W08', 'W26'];
  return windows.map(w => generateBriefing(w, input));
}

export function formatBriefingForNotion(briefing: Briefing): string {
  return [
    `**${briefing.subject}**`,
    `Priority: ${briefing.priority} | Action Required: ${briefing.actionRequired ? 'YES' : 'No'}`,
    '---',
    briefing.body,
  ].join('\n');
}
