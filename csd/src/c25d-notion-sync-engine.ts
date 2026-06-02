/**
 * Component 25D: Notion Sync Engine
 * DEV PACKAGE — Internal tooling only
 *
 * Formats VitalMatrix session data for the Notion API.
 * Generates structured payloads for:
 *   - Session wraps (commits, decisions, files, tests)
 *   - Decision updates (D-series status changes)
 *   - Gate updates (build gate status transitions)
 *
 * Output conforms to Notion API block structure for create-page
 * and update-page endpoints. Uses British English throughout.
 *
 * Reference: Notion Algorithm Scale page 371c2e2d-3782-8182-94a3-f34fbc36314c
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** A single section within a Notion page. */
export interface NotionSection {
  /** Section heading text. */
  heading: string;
  /** Section body content. */
  content: string;
  /** Content type for rendering. */
  type: 'text' | 'table' | 'list' | 'code';
}

/** Full session wrap ready for Notion page creation. */
export interface NotionSessionWrap {
  /** Page title. */
  title: string;
  /** Session window identifier (e.g. "W26-3"). */
  window: string;
  /** Session date in ISO format. */
  date: string;
  /** Ordered sections of the session wrap. */
  sections: NotionSection[];
}

/** A D-series decision update for Notion. */
export interface NotionDecisionUpdate {
  /** Decision ID (e.g. "D-212"). */
  decisionId: string;
  /** New status (e.g. "LOCKED", "RESOLVED", "OPEN"). */
  status: string;
  /** Summary of the decision or change. */
  summary: string;
}

/** A build gate status update for Notion. */
export interface NotionGateUpdate {
  /** Gate name (e.g. "SA Override", "Quality Gate"). */
  gate: string;
  /** Previous status. */
  oldStatus: string;
  /** New status. */
  newStatus: string;
}

/** Notion API rich text object. */
interface NotionRichText {
  type: 'text';
  text: { content: string; link?: { url: string } | null };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
}

/** Notion API block object (simplified). */
interface NotionBlock {
  object: 'block';
  type: string;
  [key: string]: unknown;
}

// --- Commit/Decision Input Types ---

/** Commit entry for session wrap formatting. */
export interface CommitEntry {
  hash: string;
  message: string;
  filesChanged?: number;
}

/** Decision entry for session wrap formatting. */
export interface DecisionEntry {
  id: string;
  status: string;
  summary: string;
}

/** Test summary for session wrap formatting. */
export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
}

// --- Rich Text Helpers ---

/**
 * Create a Notion rich text object.
 *
 * @param content - Text content.
 * @param bold - Whether to bold the text.
 * @param code - Whether to format as inline code.
 * @returns NotionRichText object.
 */
function richText(content: string, bold: boolean = false, code: boolean = false): NotionRichText {
  return {
    type: 'text',
    text: { content },
    annotations: { bold, code },
  };
}

// --- Block Builders ---

/**
 * Create a heading_2 block.
 */
function heading2Block(text: string): NotionBlock {
  return {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [richText(text)],
    },
  };
}

/**
 * Create a heading_3 block.
 */
function heading3Block(text: string): NotionBlock {
  return {
    object: 'block',
    type: 'heading_3',
    heading_3: {
      rich_text: [richText(text)],
    },
  };
}

/**
 * Create a paragraph block.
 */
function paragraphBlock(text: string, bold: boolean = false): NotionBlock {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [richText(text, bold)],
    },
  };
}

/**
 * Create a bulleted list item block.
 */
function bulletBlock(text: string): NotionBlock {
  return {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [richText(text)],
    },
  };
}

/**
 * Create a code block.
 */
function codeBlock(content: string, language: string = 'typescript'): NotionBlock {
  return {
    object: 'block',
    type: 'code',
    code: {
      rich_text: [richText(content)],
      language,
    },
  };
}

/**
 * Create a divider block.
 */
function dividerBlock(): NotionBlock {
  return {
    object: 'block',
    type: 'divider',
    divider: {},
  };
}

/**
 * Create a callout block (used for warnings/important notes).
 */
function calloutBlock(text: string): NotionBlock {
  return {
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: [richText(text)],
      color: 'yellow_background',
    },
  };
}

// --- Session Wrap Formatter ---

/**
 * Format a session wrap for Notion page creation.
 *
 * @param commits - Array of commits from the session.
 * @param decisions - Array of decisions made or updated.
 * @param files - Array of files changed (paths).
 * @param tests - Test summary for the session.
 * @returns NotionSessionWrap ready for page creation.
 */
export function formatSessionWrap(
  commits: CommitEntry[],
  decisions: DecisionEntry[],
  files: string[],
  tests: TestSummary
): NotionSessionWrap {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const window = `W${getISOWeekNumber(now)}`;

  const sections: NotionSection[] = [];

  // Commits section
  if (commits.length > 0) {
    const commitLines = commits.map(
      c => `${c.hash} — ${c.message}${c.filesChanged ? ` (${c.filesChanged} files)` : ''}`
    );
    sections.push({
      heading: 'Commits',
      content: commitLines.join('\n'),
      type: 'list',
    });
  }

  // Decisions section
  if (decisions.length > 0) {
    const decisionLines = decisions.map(
      d => `${d.id} [${d.status}]: ${d.summary}`
    );
    sections.push({
      heading: 'Decisions',
      content: decisionLines.join('\n'),
      type: 'list',
    });
  }

  // Files changed section
  if (files.length > 0) {
    sections.push({
      heading: 'Files Changed',
      content: files.join('\n'),
      type: 'list',
    });
  }

  // Test results section
  sections.push({
    heading: 'Test Results',
    content: `Total: ${tests.total} | Passed: ${tests.passed} | Failed: ${tests.failed} | Skipped: ${tests.skipped}`,
    type: 'text',
  });

  return {
    title: `Session Wrap — ${dateStr} (${window})`,
    window,
    date: dateStr,
    sections,
  };
}

/**
 * Get ISO week number for a date.
 */
function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// --- Decision Update Formatter ---

/**
 * Format a D-series decision update for Notion page content.
 *
 * @param decision - Decision update to format.
 * @returns Array of Notion blocks representing the decision update.
 */
export function formatDecisionUpdate(decision: NotionDecisionUpdate): NotionBlock[] {
  const blocks: NotionBlock[] = [
    heading2Block(`${decision.decisionId} — ${decision.status}`),
    paragraphBlock(decision.summary),
    dividerBlock(),
    paragraphBlock(`Updated: ${new Date().toISOString().split('T')[0]}`),
    paragraphBlock(`${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`),
  ];

  if (decision.status === 'LOCKED') {
    blocks.splice(2, 0, calloutBlock(
      `This decision is LOCKED. Any changes require explicit approval from ${VM_BRAND.credentials.name}.`
    ));
  }

  return blocks;
}

// --- Gate Update Formatter ---

/**
 * Format a build gate status update for Notion page content.
 *
 * @param gate - Gate update to format.
 * @returns Array of Notion blocks representing the gate update.
 */
export function formatGateUpdate(gate: NotionGateUpdate): NotionBlock[] {
  return [
    heading2Block(`Gate: ${gate.gate}`),
    paragraphBlock(`Status changed: ${gate.oldStatus} -> ${gate.newStatus}`, true),
    paragraphBlock(`Date: ${new Date().toISOString().split('T')[0]}`),
    dividerBlock(),
    paragraphBlock(VM_BRAND.regulatoryFooter),
  ];
}

// --- Markdown Formatter ---

/**
 * Convert NotionSections to Notion-compatible markdown.
 *
 * @param sections - Array of NotionSection objects.
 * @returns Markdown string compatible with Notion import.
 */
export function formatAsNotionMarkdown(sections: NotionSection[]): string {
  const lines: string[] = [];

  for (const section of sections) {
    lines.push(`## ${section.heading}`);
    lines.push('');

    switch (section.type) {
      case 'text':
        lines.push(section.content);
        break;

      case 'list':
        for (const item of section.content.split('\n')) {
          if (item.trim().length > 0) {
            lines.push(`- ${item.trim()}`);
          }
        }
        break;

      case 'table':
        // Preserve table content as-is (expects pre-formatted markdown table)
        lines.push(section.content);
        break;

      case 'code':
        lines.push('```typescript');
        lines.push(section.content);
        lines.push('```');
        break;
    }

    lines.push('');
  }

  return lines.join('\n');
}

// --- Notion API Payload ---

/**
 * Generate a full Notion API create-page payload.
 *
 * @param title - Page title.
 * @param content - Array of NotionSection objects for the page body.
 * @param parentPageId - Optional parent page ID in Notion.
 * @returns JSON-serialisable payload matching Notion API create-page structure.
 */
export function generateNotionPagePayload(
  title: string,
  content: NotionSection[],
  parentPageId?: string
): Record<string, unknown> {
  // Build children blocks from sections
  const children: NotionBlock[] = [];

  for (const section of content) {
    children.push(heading3Block(section.heading));

    switch (section.type) {
      case 'text':
        children.push(paragraphBlock(section.content));
        break;

      case 'list':
        for (const item of section.content.split('\n')) {
          if (item.trim().length > 0) {
            children.push(bulletBlock(item.trim()));
          }
        }
        break;

      case 'table':
        // Tables rendered as code blocks for simplicity
        children.push(codeBlock(section.content, 'plain text'));
        break;

      case 'code':
        children.push(codeBlock(section.content));
        break;
    }
  }

  // Add footer
  children.push(dividerBlock());
  children.push(paragraphBlock(VM_BRAND.regulatoryFooter));
  children.push(paragraphBlock(VM_BRAND.tmFooter));

  const payload: Record<string, unknown> = {
    parent: parentPageId
      ? { type: 'page_id', page_id: parentPageId }
      : { type: 'workspace', workspace: true },
    properties: {
      title: {
        title: [richText(title)],
      },
    },
    children,
  };

  return payload;
}

/**
 * Generate a full session wrap as a Notion API payload.
 * Convenience function combining formatSessionWrap and generateNotionPagePayload.
 *
 * @param commits - Array of commits from the session.
 * @param decisions - Array of decisions made or updated.
 * @param files - Array of files changed.
 * @param tests - Test summary.
 * @param parentPageId - Optional parent page ID.
 * @returns JSON-serialisable Notion API payload.
 */
export function generateSessionWrapPayload(
  commits: CommitEntry[],
  decisions: DecisionEntry[],
  files: string[],
  tests: TestSummary,
  parentPageId?: string
): Record<string, unknown> {
  const wrap = formatSessionWrap(commits, decisions, files, tests);
  return generateNotionPagePayload(wrap.title, wrap.sections, parentPageId);
}
