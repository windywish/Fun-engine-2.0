// ============================================================
// FILE: ['Substrate Darwinism Compiler'(-ing) BPMS] (integration) (Presettings).ts
// How the Substrate Compiler + Experiments Engine integrate
// with the larger ['Survival Imperative'(-ing) BPMS].
// ============================================================

/**
 * Integration contract:
 *
 * ['Survival Imperative'(-ing) BPMS] monitors:
 *   - engine.getStatus()  → population health, diversity, fitness
 *   - engine events       → cycle results, mutations applied, crises
 *
 * ['Survival Imperative'(-ing) BPMS] controls:
 *   - engine.start(seeds) → initialize population
 *   - engine.stop()       → graceful shutdown
 *   - engine.injectPerturbation(perturbation) → shift environment
 *
 * ['Large Model'(-ing) BPMS] provides:
 *   - Initial seed architectures (the "starting population")
 *   - Evaluation tasks and datasets
 *   - Compute resources (GPU allocation)
 *
 * ['Substrate Compiler'(-ing) BPMS] provides:
 *   - compiler.compileMutation()  → single architecture mutation
 *   - compiler.compileBatch()     → batch reproduction
 *   - compiler.compileCrossover() → genetic recombination
 *   - compiler.validate()         → architecture validity check
 *
 * ['Continuous Survive Experiments'(-ing) BPMS] provides:
 *   - engine.runCycle()           → one Darwinian iteration
 *   - engine.getStatus()          → full reactor state
 *   - engine events               → real-time monitoring
 */

// Event schema for external monitoring
interface EngineEvent {
  type: 'engine:cycle_completed'
      | 'engine:mutation_applied'
      | 'engine:mutation_rejected'
      | 'engine:exploration_mode'
      | 'engine:exploitation_mode'
      | 'engine:diversity_crisis'
      | 'engine:resource_crisis'
      | 'engine:novel_innovation'
      | 'engine:checkpoint'
      | 'engine:stopped';
  timestamp: number;
  data: Record<string, any>;
}

// Perturbation injection API
interface Perturbation {
  type: 'task_distribution_shift'
       | 'resource_shock'
       | 'adversarial_evaluation'
       | 'catastrophic_forgetting_challenge'
       | 'temperature_shock'
       | 'population_bottleneck';
  parameters: Record<string, any>;
}

// Status query API
interface ReactorStatus {
  cycle: number;
  uptime_seconds: number;
  population: {
    size: number;
    cap: number;
    best_fitness: number;
    median_fitness: number;
    shannon_diversity: number;
    families: number;
    dominant_family: string;
  };
  resources: {
    gpu_utilization_percent: number;
    parameter_budget_used_percent: number;
    estimated_total_params: number;
    experiments_running: number;
    experiments_queued: number;
  };
  health: {
    fitness_plateau: boolean;
    diversity_crisis: boolean;
    resource_crisis: boolean;
    numerical_instability: boolean;
    mode: 'exploration' | 'exploitation';
  };
  mutations: {
    mutation_rate: number;
    total_mutations_applied: number;
    acceptance_rate: number;
    most_common_mutation: string;
  };
  innovations: {
    total_innovations_detected: number;
    last_innovation_cycle: number;
    permanently_archived: number;
  };
}