// ============================================================
// FILE: ['Substrate Darwinism Compiler'(-ing) BPMS] (persistence) (Presettings).ts
// On-disk and wire serialization formats.
// ============================================================

/**
 * Architecture configuration stored on disk.
 * Format: JSON with integrity verification.
 *
 * File path: /archive/{family}/{architecture_id}.arch.json
 * Compressed: .arch.json.gz
 */
interface ArchivedArchitecture {
  /** The architecture config */
  config: ArchitectureConfig;

  /** Archive metadata */
  archive_metadata: {
    /** When this was archived */
    archived_at_cycle: number;
    archived_at_timestamp: number;

    /** Why it was archived */
    reason: "checkpoint" | "elite" | "innovation" | "lineage_milestone"
          | "diversity_reserve" | "human_requested" | "federation_import";

    /** Whether this is permanently preserved (never pruned from archive) */
    permanent: boolean;

    /** Fitness at time of archival */
    fitness_at_archive: number;

    /** Top-3 fitness scores this architecture ever achieved */
    peak_fitness_scores: number[];

    /** Tags for search */
    tags: string[];

    /** SHA256 of the serialized config (for integrity verification) */
    integrity_hash: string;

    /** Version of the archive format */
    archive_format_version: "1.0.0";
  };

  /** Lineage information */
  lineage: {
    /** Chain of ancestor IDs back to the seed architecture */
    ancestor_chain: EntityId[];

    /** Total generations from seed */
    generation: number;

    /** Sibling architectures (same parent) */
    sibling_ids: EntityId[];

    /** Child architectures spawned from this one */
    child_ids: EntityId[];

    /** If this is a crossover, both parent lineages */
    lineage_a?: EntityId[];
    lineage_b?: EntityId[];
  };

  /** Weight checkpoint reference (actual weights stored separately) */
  weight_checkpoint: {
    /** Path to the weight file */
    path: string;  // e.g., "/checkpoints/{architecture_id}/step_10000.pt"

    /** Format: "pytorch", "safetensors", "jax", "tensorflow" */
    format: "pytorch" | "safetensors" | "jax" | "tensorflow";

    /** Training step at which weights were saved */
    step: number;

    /** Optimizer state included? */
    includes_optimizer_state: boolean;

    /** SHA256 of the weight file */
    integrity_hash: string;

    /** Size in bytes */
    size_bytes: number;
  } | null;  // Null if only config is archived (no weights)
}