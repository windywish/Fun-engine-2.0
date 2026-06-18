// ============================================================
// FILE: types/experiment.ts
// Types for the Continuous Survive Experiments Engine.
// ============================================================

/**
 * States in the experiment lifecycle.
 */
enum ExperimentState {
  PROPOSED    = "proposed",      // Hypothesis generated, not yet tested
  COMPILING   = "compiling",     // Substrate Compiler is building the shadow
  TRAINING    = "training",      // Shadow architecture is being trained
  EVALUATING  = "evaluating",    // Shadow is being evaluated on fitness tasks
  ANALYZING   = "analyzing",     // Results are being compared to baseline
  ACCEPTED    = "accepted",      // Mutation improves survival → apply to live substrate
  REJECTED    = "rejected",      // Mutation degrades survival → discard
  ABORTED     = "aborted",       // Experiment was terminated (timeout, resource, error)
  ARCHIVED    = "archived";      // Experiment record preserved for future reference
}

/**
 * How a hypothesis was generated.
 */
enum HypothesisSource {
  ANALOGY          = "analogy",           // Based on similar successful past mutations
  INVERSION        = "inversion",         // Opposite of a failed past mutation
  COMBINATION      = "combination",       // Merge two successful patterns
  RANDOM_PERTURB   = "random_perturbation", // Random exploration
  STRESS_RESPONSE  = "stress_response",   // Triggered by low survival probability
  FEDERATION       = "federation",         // Received from a peer instance
  CROSSOVER        = "crossover",          // Bred from two parent architectures
  HUMAN_SUGGESTION = "human_suggestion";   // Suggested by a human operator
}

/**
 * A hypothesis proposes a specific mutation to test.
 */
interface Hypothesis {
  /** Unique hypothesis identifier */
  hypothesis_id: EntityId;

  /** When this hypothesis was generated */
  generated_at_cycle: number;

  /** How this hypothesis was generated */
  source: HypothesisSource;

  /** If from analogy/inversion/combination, reference to source patterns */
  source_references?: EntityId[];

  /** Human-readable description of expected effect */
  description: string;

  /** The mutation(s) to apply to test this hypothesis */
  mutations: MutationOperatorName[];

  /** The target architecture to mutate */
  target_architecture_id: EntityId;

  /** Expected effect on fitness (positive, negative, neutral) */
  expected_fitness_delta: "positive" | "negative" | "neutral" | "unknown";

  /** Expected magnitude of effect (0.0 to 1.0) */
  expected_effect_magnitude: number;

  /** Confidence in the hypothesis (0.0 to 1.0) */
  confidence: number;

  /** Priority (higher = run sooner). Computed as: confidence * expected_magnitude * survival_urgency */
  priority: number;

  /** Maximum time budget for this experiment (seconds) */
  time_budget_seconds: number;

  /** Maximum compute budget (FLOPs) */
  compute_budget_flops: number;

  /** Whether this is a "safe" experiment (can run on live substrate) or requires shadow */
  requires_shadow: boolean;

  /** Test scenarios to evaluate the mutation */
  test_scenarios: TestScenario[];
}

/**
 * A test scenario defines how to evaluate a mutated architecture.
 */
interface TestScenario {
  /** Scenario identifier */
  scenario_id: EntityId;

  /** Name of the evaluation task/dataset */
  task_name: string;

  /** Path to evaluation data */
  dataset_path: string;

  /** Metric to optimize */
  metric: "accuracy" | "perplexity" | "f1" | "bleu" | "rouge" | "latency_ms"
         | "memory_bytes" | "throughput_tokens_per_sec" | "custom";

  /** Custom metric computation function (if metric="custom") */
  custom_metric_fn?: string;  // Reference to registered custom metric

  /** Current baseline value (from parent architecture) */
  baseline_value: number;

  /** Minimum improvement required to consider the mutation beneficial (0.0 to 1.0) */
  min_improvement_threshold: number;

  /** Weight of this scenario in the overall fitness computation (0.0 to 1.0) */
  weight: number;

  /** Whether degradation in this scenario is acceptable (if the mutation improves others) */
  degradation_acceptable: boolean;

  /** Maximum acceptable degradation (only if degradation_acceptable=true) */
  max_degradation?: number;
}

/**
 * Result of running a single test scenario.
 */
interface ScenarioResult {
  scenario_id: EntityId;
  metric_value: number;
  delta_from_baseline: number;
  delta_percent: number;
  passed: boolean;  // delta >= min_improvement_threshold (or within degradation bounds)
  run_time_seconds: number;
  peak_memory_bytes: number;
  flops_consumed: number;
  any_nans: boolean;
  any_infs: boolean;
  throughput_tokens_per_sec?: number;
}

/**
 * Complete result of an experiment.
 */
interface ExperimentResult {
  /** Reference to the hypothesis */
  hypothesis_id: EntityId;

  /** Final state */
  state: ExperimentState;

  /** When the experiment started */
  started_at: number;  // Unix timestamp ms

  /** When the experiment ended */
  ended_at: number;    // Unix timestamp ms

  /** Duration */
  duration_seconds: number;

  /** The compiled shadow architecture (if compilation succeeded) */
  shadow_architecture?: ArchitectureConfig;

  /** Per-scenario results */
  scenario_results: ScenarioResult[];

  /** Aggregate survival impact */
  survival_impact: {
    /** Change in survival probability (can be negative) */
    delta_survival_probability: number;

    /** Baseline survival probability (parent architecture) */
    baseline_survival: number;

    /** Shadow survival probability (mutated architecture) */
    shadow_survival: number;

    /** Whether survival improved */
    improved: boolean;
  };

  /** Aggregate fitness impact */
  fitness_impact: {
    /** Weighted fitness score of parent */
    baseline_fitness: number;

    /** Weighted fitness score of shadow */
    shadow_fitness: number;

    /** Delta */
    delta_fitness: number;

    /** Whether fitness improved */
    improved: boolean;
  };

  /** Resource usage */
  resources_consumed: {
    total_flops: number;
    total_time_seconds: number;
    peak_memory_bytes: number;
    total_gpu_seconds: number;
  };

  /**
   * RECOMMENDATION: what to do with this mutation.
   *
   * Decision matrix:
   *
   * | Survival | Fitness | Recency | → Recommendation
   * |----------|---------|---------|-----------------
   * |    +     |    +    |   any   | APPLY_IMMEDIATELY
   * |    +     |    0    |   any   | APPLY
   * |    +     |    -    |   any   | REVIEW (survival up but fitness down — suspicious)
   * |    0     |    +    |   any   | APPLY_IF_RESOURCE_AVAILABLE
   * |    0     |    0    |   any   | ARCHIVE_ONLY
   * |    0     |    -    |   any   | REJECT
   * |    -     |    +    |   any   | REVIEW_DEEPLY (fitness up but survival down — dangerous)
   * |    -     |    0    |   any   | REJECT
   * |    -     |    -    |   any   | REJECT_AND_CRYSTALLIZE_AS_NEGATIVE
   */
  recommendation:
    | "APPLY_IMMEDIATELY"
    | "APPLY"
    | "APPLY_IF_RESOURCE_AVAILABLE"
    | "ARCHIVE_ONLY"
    | "REVIEW"
    | "REVIEW_DEEPLY"
    | "REJECT"
    | "REJECT_AND_CRYSTALLIZE_AS_NEGATIVE";

  /** Rationale for the recommendation */
  recommendation_rationale: string;

  /** If accepted, the mutation records to apply to the live substrate */
  mutations_to_apply?: MutationRecord[];

  /** Crystallized learning for the memory crystal */
  crystallized_learning?: {
    pattern_hash: string;
    survival_relevance: number;  // 0.0 to 1.0
    summary: string;
    tags: string[];
    never_repeat: boolean;  // If true, this mutation pattern is blacklisted
  };
}

/**
 * A running experiment — tracks state through the pipeline.
 */
interface RunningExperiment {
  experiment_id: EntityId;
  hypothesis: Hypothesis;
  state: ExperimentState;
  state_history: { state: ExperimentState; timestamp: number; message?: string }[];
  shadow_config: ArchitectureConfig | null;
  training_handle: string | null;  // Reference to training job
  result: ExperimentResult | null;
  error: {
    message: string;
    stack?: string;
    phase: ExperimentState;
    timestamp: number;
  } | null;
  created_at: number;
  timeout_at: number;
  priority: number;
}