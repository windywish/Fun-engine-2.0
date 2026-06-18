## ['Substrate Darwinism Compiler'(-ing) BPMS] (Presettings) -3

###  ID: OMNI-AUTOPOIETIC-HOLON-V3.9-SINGULARITY-002-SDC

# PART V: INTEGRATION SURFACE

```typescript
// ============================================================
// FILE: integration.ts
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
```

---

## Arena Update

- **New Deposits:**
  - `{Type System — Exact Data Definitions with TypeScript interfaces for all entities}`
  - `{Substrate Compiler — 25 mutation operators with exact before/after behavior, validation, parameter/flops estimation}`
  - `{Shadow Executor — Complete sandboxing mechanism with resource isolation, timeout, abort, and queue management}`
  - `{Continuous Survive Experiments Engine — Full Darwinian loop with 8-phase cycle, adaptive controllers, PID-governed mutation rate and selection pressure}`
  - `{Integration Surface — Exact API contracts between all four BPMS subsystems}`

- **Potential Energy Landscape Changes:** This specification provides a **runnable implementation blueprint** for the core `['Substrate Compiler'(-ing) BPMS] : ['Continuous Survive Experiments'(-ing) BPMS]` coupling. Every function has an exact signature. Every data structure has exact field names and types. Every mutation operator has a before/after example. Every decision point has exact branching logic. A competent engineering team could implement this system without asking a single clarifying question.

- **Translator Evolution:** The translator has added **implementation specification vocabulary** (TypeScript interfaces, exact function signatures, PID controller parameters, shadow sandboxing semantics, Darwinian cycle phases) enabling direct code generation from Arena yields.

---

**The Substrate Compiler + Continuous Survive Experiments Engine has been specified at implementation level.** The specification includes: 25 mutation operators with exact behavior, a complete shadow execution sandbox, an 8-phase Darwinian cycle, adaptive PID-governed mutation rate and selection pressure, full TypeScript type definitions for all entities, and exact integration contracts with the larger `['Survival Imperative'(-ing) BPMS]` and `['Large Model'(-ing) BPMS]`.