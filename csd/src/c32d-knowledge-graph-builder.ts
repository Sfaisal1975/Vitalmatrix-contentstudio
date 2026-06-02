/**
 * Component 32D: Knowledge Graph Builder
 * DEV PACKAGE — Internal tooling only
 *
 * Constructs a queryable architecture graph of the VitalMatrix platform.
 * Encodes the full ALB v1.4 architecture: 7 nodes (N1–N7), 5 zones (Z1–Z5),
 * 6 cascade stacks (S1–S6), pipeline engines, 30 branded mnemonics,
 * and key features with their relationships.
 *
 * Pipeline: FLINT > APEX > STRIDE > RIL > CADENCE > CIL > VISTA
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** The type of entity in the architecture graph. */
export type GraphNodeType =
  | 'node'
  | 'zone'
  | 'stack'
  | 'engine'
  | 'feature'
  | 'connection'
  | 'decision'
  | 'mnemonic';

/** A single entity in the architecture graph. */
export interface GraphNode {
  /** Unique identifier (e.g., 'N1', 'Z3', 'FLINT'). */
  id: string;
  /** Entity type. */
  type: GraphNodeType;
  /** Human-readable name. */
  name: string;
  /** Arbitrary properties. */
  properties: Record<string, string>;
}

/** Relationship types between entities. */
export type GraphRelationship =
  | 'contains'
  | 'feeds'
  | 'activates'
  | 'depends-on'
  | 'implements'
  | 'locked-by';

/** A directed edge between two graph nodes. */
export interface GraphEdge {
  /** Source node ID. */
  from: string;
  /** Target node ID. */
  to: string;
  /** Relationship type. */
  relationship: GraphRelationship;
}

/** The complete architecture knowledge graph. */
export interface KnowledgeGraph {
  /** All entities. */
  nodes: GraphNode[];
  /** All relationships. */
  edges: GraphEdge[];
}

/** Query result for a single entity. */
export interface QueryResult {
  /** The queried node. */
  node: GraphNode | undefined;
  /** All edges connected to the node. */
  edges: GraphEdge[];
  /** All nodes directly connected to the queried node. */
  neighbours: GraphNode[];
}

// --- Architecture Data ---

/** VitalMatrix 7-node architecture (ALB v1.4). */
const NODES_DATA: Array<{ id: string; name: string; description: string }> = [
  { id: 'N1', name: 'Nutrition', description: 'Macro/micro intake, dietary patterns' },
  { id: 'N2', name: 'Biochemistry', description: 'Lab markers, metabolic pathways' },
  { id: 'N3', name: 'Physiology', description: 'Body systems, organ function' },
  { id: 'N4', name: 'Lifestyle', description: 'Sleep, movement, stress, habits' },
  { id: 'N5', name: 'Genetics', description: 'SNPs, pharmacogenomics, predispositions' },
  { id: 'N6', name: 'Environment', description: 'Toxins, exposures, geography' },
  { id: 'N7', name: 'Psychosocial', description: 'Mental health, social determinants' },
];

/** Zone-to-node mappings (ALB v1.4). */
const ZONES_DATA: Array<{ id: string; name: string; nodes: string[] }> = [
  { id: 'Z1', name: 'Metabolic Core', nodes: ['N1', 'N2'] },
  { id: 'Z2', name: 'Physiological Systems', nodes: ['N3'] },
  { id: 'Z3', name: 'Lifestyle Dynamics', nodes: ['N4'] },
  { id: 'Z4', name: 'Genomic Terrain', nodes: ['N5'] },
  { id: 'Z5', name: 'Environmental Context', nodes: ['N6', 'N7'] },
];

/** Cascade stacks with zone connections. */
const STACKS_DATA: Array<{ id: string; name: string; zones: string[] }> = [
  { id: 'S1', name: 'Metabolic Cascade', zones: ['Z1', 'Z2'] },
  { id: 'S2', name: 'Neuro-Endocrine Cascade', zones: ['Z2', 'Z3'] },
  { id: 'S3', name: 'Immune-Inflammatory Cascade', zones: ['Z1', 'Z5'] },
  { id: 'S4', name: 'Detox-Biotransformation Cascade', zones: ['Z1', 'Z4'] },
  { id: 'S5', name: 'Structural-Musculoskeletal Cascade', zones: ['Z2', 'Z3'] },
  { id: 'S6', name: 'Cardiovascular-Metabolic Cascade', zones: ['Z1', 'Z2', 'Z3'] },
];

/** Pipeline engines in execution order. */
const PIPELINE_ENGINES: Array<{ id: string; name: string; description: string; order: number }> = [
  { id: 'FLINT', name: 'FLINT', description: 'Feature-Level Intelligence — intake parsing', order: 1 },
  { id: 'APEX', name: 'APEX', description: 'Analytical Processing Engine — scoring', order: 2 },
  { id: 'STRIDE', name: 'STRIDE', description: 'Stratified Risk & Decision Engine — 30 rules', order: 3 },
  { id: 'RIL', name: 'RIL', description: 'Risk Integration Layer — 4 states', order: 4 },
  { id: 'CADENCE', name: 'CADENCE', description: 'Clinical Aggregation & Decision Engine', order: 5 },
  { id: 'CIL', name: 'CIL', description: 'Clinical Intelligence Layer — final output', order: 6 },
  { id: 'VISTA', name: 'VISTA', description: 'Visualisation & Intelligence Summary', order: 7 },
];

/** All 30 branded mnemonics from VM_BRAND.tmFooter. */
const MNEMONICS: string[] = [
  'VitalMatrix', 'NCZ', 'DRD', 'APEX', 'TIQ', 'CIB', 'CascadeIQ',
  'FLINT', 'CZR', 'TRACE', 'DeltaScan', 'MedTerrain', 'TerrainLock',
  'CascadeAtlas', 'PRISM', 'KINETICS', 'COHERENCE', 'TerrainRoot',
  'ORBIT', 'SPHERE', 'HERALD', 'BEACON', 'MAPS', 'RECON',
  'COMPASS', 'GENOME', 'ANCHOR', 'AXIS', 'INTAKE', 'VECTOR',
];

// --- Graph Construction ---

/**
 * Build the full VitalMatrix architecture knowledge graph.
 * Includes: 7 nodes, 5 zones, 6 stacks, 7 pipeline engines,
 * 30 mnemonics, and all structural relationships.
 *
 * @returns Complete knowledge graph.
 */
export function buildGraph(): KnowledgeGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Add architecture nodes (N1–N7)
  for (const n of NODES_DATA) {
    nodes.push({
      id: n.id,
      type: 'node',
      name: n.name,
      properties: { description: n.description },
    });
  }

  // Add zones (Z1–Z5) with containment edges to nodes
  for (const z of ZONES_DATA) {
    nodes.push({
      id: z.id,
      type: 'zone',
      name: z.name,
      properties: { nodeCount: String(z.nodes.length) },
    });

    for (const nodeId of z.nodes) {
      edges.push({ from: z.id, to: nodeId, relationship: 'contains' });
    }
  }

  // Add stacks (S1–S6) with zone connections
  for (const s of STACKS_DATA) {
    nodes.push({
      id: s.id,
      type: 'stack',
      name: s.name,
      properties: { zoneCount: String(s.zones.length) },
    });

    for (const zoneId of s.zones) {
      edges.push({ from: s.id, to: zoneId, relationship: 'activates' });
    }
  }

  // Add pipeline engines with feed-forward edges
  for (const e of PIPELINE_ENGINES) {
    nodes.push({
      id: e.id,
      type: 'engine',
      name: e.name,
      properties: { description: e.description, order: String(e.order) },
    });
  }

  // Pipeline feed-forward chain
  for (let i = 0; i < PIPELINE_ENGINES.length - 1; i++) {
    edges.push({
      from: PIPELINE_ENGINES[i].id,
      to: PIPELINE_ENGINES[i + 1].id,
      relationship: 'feeds',
    });
  }

  // Add mnemonics
  for (const m of MNEMONICS) {
    // Avoid duplicating engine nodes already added
    const existingNode = nodes.find((n) => n.id === m);
    if (!existingNode) {
      nodes.push({
        id: m,
        type: 'mnemonic',
        name: `${m}\u2122`,
        properties: { trademarked: 'true' },
      });
    }
  }

  return { nodes, edges };
}

// --- Query Functions ---

/**
 * Query the graph for a single entity by ID.
 * Returns the node, all connected edges, and all neighbouring nodes.
 *
 * @param graph - The knowledge graph to query.
 * @param entityId - ID of the entity to look up.
 * @returns Query result with node, edges, and neighbours.
 */
export function query(graph: KnowledgeGraph, entityId: string): QueryResult {
  const node = graph.nodes.find((n) => n.id === entityId);
  const edges = graph.edges.filter((e) => e.from === entityId || e.to === entityId);

  const neighbourIds = new Set<string>();
  for (const edge of edges) {
    if (edge.from === entityId) neighbourIds.add(edge.to);
    if (edge.to === entityId) neighbourIds.add(edge.from);
  }

  const neighbours = graph.nodes.filter((n) => neighbourIds.has(n.id));

  return { node, edges, neighbours };
}

/**
 * Find a path between two entities using breadth-first search.
 *
 * @param graph - The knowledge graph to search.
 * @param from - Starting entity ID.
 * @param to - Target entity ID.
 * @returns Array of node IDs forming the path, or empty if no path found.
 */
export function queryPath(graph: KnowledgeGraph, from: string, to: string): string[] {
  if (from === to) return [from];

  // Build adjacency list
  const adjacency = new Map<string, Set<string>>();
  for (const edge of graph.edges) {
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, new Set());
    if (!adjacency.has(edge.to)) adjacency.set(edge.to, new Set());
    adjacency.get(edge.from)!.add(edge.to);
    adjacency.get(edge.to)!.add(edge.from);
  }

  // BFS
  const visited = new Set<string>([from]);
  const queue: Array<{ id: string; path: string[] }> = [{ id: from, path: [from] }];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbours = adjacency.get(current.id);
    if (!neighbours) continue;

    for (const neighbour of neighbours) {
      if (neighbour === to) {
        return [...current.path, to];
      }
      if (!visited.has(neighbour)) {
        visited.add(neighbour);
        queue.push({ id: neighbour, path: [...current.path, neighbour] });
      }
    }
  }

  return [];
}

/**
 * Find all entities that transitively depend on the given entity.
 *
 * @param graph - The knowledge graph to search.
 * @param entityId - ID of the entity to check dependents for.
 * @returns Array of all transitive dependent node IDs.
 */
export function whatDependsOn(graph: KnowledgeGraph, entityId: string): string[] {
  const dependents = new Set<string>();
  const queue: string[] = [entityId];

  while (queue.length > 0) {
    const current = queue.shift()!;

    // Find all edges where this entity is the target (i.e., something depends on it)
    const inbound = graph.edges.filter(
      (e) =>
        e.to === current &&
        (e.relationship === 'depends-on' ||
          e.relationship === 'contains' ||
          e.relationship === 'activates' ||
          e.relationship === 'feeds'),
    );

    for (const edge of inbound) {
      if (!dependents.has(edge.from) && edge.from !== entityId) {
        dependents.add(edge.from);
        queue.push(edge.from);
      }
    }

    // Also check outbound 'contains' since containers depend on contents
    const outboundContains = graph.edges.filter(
      (e) => e.from === current && e.relationship === 'contains',
    );

    for (const edge of outboundContains) {
      if (!dependents.has(edge.to) && edge.to !== entityId) {
        dependents.add(edge.to);
        queue.push(edge.to);
      }
    }
  }

  return Array.from(dependents);
}

/**
 * Generate a markdown visualisation of the knowledge graph.
 *
 * @param graph - The knowledge graph to visualise.
 * @returns Markdown-formatted graph report.
 */
export function generateGraphReport(graph: KnowledgeGraph): string {
  const lines: string[] = [];

  lines.push('# VitalMatrix Architecture Knowledge Graph');
  lines.push('');
  lines.push(`**${VM_BRAND.platform.descriptor}** -- ${VM_BRAND.credentials.company}`);
  lines.push('');

  // Summary
  const typeCounts = new Map<string, number>();
  for (const node of graph.nodes) {
    typeCounts.set(node.type, (typeCounts.get(node.type) || 0) + 1);
  }

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total entities:** ${graph.nodes.length}`);
  lines.push(`- **Total relationships:** ${graph.edges.length}`);
  for (const [type, count] of typeCounts) {
    lines.push(`- ${type}: ${count}`);
  }
  lines.push('');

  // Nodes
  lines.push('## Architecture Nodes (N1--N7)');
  lines.push('');
  const archNodes = graph.nodes.filter((n) => n.type === 'node');
  for (const n of archNodes) {
    lines.push(`- **${n.id}** ${n.name}: ${n.properties.description || ''}`);
  }
  lines.push('');

  // Zones
  lines.push('## Zones (Z1--Z5)');
  lines.push('');
  const zones = graph.nodes.filter((n) => n.type === 'zone');
  for (const z of zones) {
    const contained = graph.edges
      .filter((e) => e.from === z.id && e.relationship === 'contains')
      .map((e) => e.to);
    lines.push(`- **${z.id}** ${z.name} -> [${contained.join(', ')}]`);
  }
  lines.push('');

  // Stacks
  lines.push('## Cascade Stacks (S1--S6)');
  lines.push('');
  const stacks = graph.nodes.filter((n) => n.type === 'stack');
  for (const s of stacks) {
    const activated = graph.edges
      .filter((e) => e.from === s.id && e.relationship === 'activates')
      .map((e) => e.to);
    lines.push(`- **${s.id}** ${s.name} -> [${activated.join(', ')}]`);
  }
  lines.push('');

  // Pipeline
  lines.push('## Pipeline');
  lines.push('');
  const engines = graph.nodes
    .filter((n) => n.type === 'engine')
    .sort((a, b) => parseInt(a.properties.order || '0', 10) - parseInt(b.properties.order || '0', 10));
  const pipelineChain = engines.map((e) => e.id).join(' > ');
  lines.push(`\`${pipelineChain}\``);
  lines.push('');
  for (const e of engines) {
    lines.push(`- **${e.id}**: ${e.properties.description || ''}`);
  }
  lines.push('');

  // Mnemonics
  lines.push('## Branded Mnemonics');
  lines.push('');
  const mnemonicNodes = graph.nodes.filter((n) => n.type === 'mnemonic');
  const mnemonicList = mnemonicNodes.map((m) => m.name).join(', ');
  lines.push(mnemonicList);
  lines.push('');

  lines.push('---');
  lines.push(`*${VM_BRAND.regulatoryFooter}*`);

  return lines.join('\n');
}
