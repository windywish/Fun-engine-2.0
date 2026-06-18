// ============================================================
// FILE: ['Substrate Darwinism Compiler'(-ing) BPMS] (population) (Presettings).ts
// Types for the population of architectures.
// ============================================================

/**
 * A live architecture instance in the population.
 * Wraps an ArchitectureConfig with runtime state.
 */
interface ArchitectureInstance {
  /** Unique instance ID (different from architecture_id — same config can have multiple instances) */
  instance_id: EntityId;

  /** The architecture configuration */
  config: ArchitectureConfig;

  /** Current fitness score (0.0 to 1.0) */
  fitness: number;

  /** Fitness history: array of [cycle, fitness] pairs */
  fitness_history: [number, number][];

  /** Training state */
  training_state: {
    /** Current training step */
    current_step: number;

    /** Total training steps completed in this instance's lifetime */
    total_steps: number;

    /** Current loss value */
    current_loss: number | null;

    /** Whether training is active */
    is_training: boolean;

    /** Training job handle */
    job_handle: string | null;
  };

  /** Runtime metrics (updated each evaluation) */
  metrics: {
    /** Per-task evaluation scores */
    task_scores: Record<string, number>;

    /** Inference latency in milliseconds */
    inference_latency_ms: number;

    /** Training throughput (tokens/second) */
    training_throughput: number;

    /** GPU memory usage in bytes */
    gpu_memory_bytes: number;

    /** Gradient norm (for detecting gradient pathologies) */
    gradient_norm: number;

    /** Dead neuron ratio (neurons that haven't activated in last N batches) */
    dead_neuron_ratio: number;

    /** Attention entropy (average across all attention heads) */
    attention_entropy: number;

    /** Number of NaN/Inf occurrences in last training step */
    numerical_issues_count: number;
  };

  /** Lifecycle state */
  lifecycle_state: "training" | "evaluating" | "idle" | "archived" | "culled" | "elite";

  /** Timestamps */
  created_at_cycle: number;
  last_evaluated_at_cycle: number;
  last_mutated_at_cycle: number;
  culled_at_cycle: number | null;
}

/**
 * Result of one reactor cycle.
 */
interface CycleResult {
  cycle: number;
  timestamp: number;

  // Population stats
  population_size: number;
  population_cap: number;
  architectures_training: number;
  architectures_idle: number;

  // Fitness stats
  best_fitness: number;
  median_fitness: number;
  worst_fitness: number;
  fitness_trend_10_cycles: number;  // Average delta per cycle over last 10 cycles

  // Diversity stats
  shannon_diversity: number;
  unique_families: number;
  dominant_family: string;
  dominant_family_share: number;  // Fraction of population

  // Mutation stats
  mutation_rate_current: number;
  mutations_applied_this_cycle: number;
  mutation_acceptance_rate: number;  // Accepted / (Accepted + Rejected) this cycle
  most_common_mutation: string;

  // Selection stats
  survivors: number;
  children_generated: number;
  culled: number;
  elites_preserved: number;
  crossovers_performed: number;

  // Resource stats
  resource_utilization_percent: number;
  total_flops_consumed_this_cycle: number;
  total_gpu_seconds_this_cycle: number;

  // Experiment stats
  experiments_completed_this_cycle: number;
  experiments_accepted_this_cycle: number;
  experiments_rejected_this_cycle: number;
  experiments_running: number;
  experiments_queued: number;

  // Health indicators
  novel_innovation_detected: boolean;
  fitness_plateau_detected: boolean;
  diversity_crisis_detected: boolean;
  resource_crisis_detected: boolean;
  numerical_instability_detected: boolean;

  // Duration
  cycle_duration_seconds: number;
}