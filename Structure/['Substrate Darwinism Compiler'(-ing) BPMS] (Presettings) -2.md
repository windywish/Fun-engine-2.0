## ['Substrate Darwinism Compiler'(-ing) BPMS] (Presettings) -2

###  ID: OMNI-AUTOPOIETIC-HOLON-V3.9-SINGULARITY-002-SDC

# PART IV: CONTINUOUS SURVIVE EXPERIMENTS ENGINE — EXACT IMPLEMENTATION

```typescript
// ============================================================
// FILE: experiment-engine.ts
// The Continuous Survive Experiments Engine — the Darwinian Loop.
//
// This is the ORCHESTRATOR. It ties together:
// - HypothesisGenerator (what to test)
// - SubstrateCompiler (how to mutate)
// - ShadowExecutor (safe testing)
// - MemoryCrystal (what was learned)
// - LiveSubstrate (what to apply to)
//
// MAIN LOOP (runs forever):
//
//   while (running) {
//     hypotheses = generator.generate(population, survivalState)
//     for each prioritized hypothesis:
//       mutated = compiler.compileMutation(parent, hypothesis.mutation)
//       result = shadowExecutor.executeShadow(mutated, parent, hypothesis)
//       if result.recommendation == ACCEPT:
//         liveSubstrate.applyMutation(mutated, result.mutations_to_apply)
//         memory.crystallize(result.crystallized_learning)
//       else:
//         memory.crystallize_negative(result.crystallized_learning)
//     adaptMutationRate()
//     adaptSelectionPressure()
//     sleep(dynamicInterval)
//   }
// ============================================================

export class ContinuousSurviveExperimentsEngine extends EventEmitter {
  // ==========================================================
  // COMPONENTS
  // ==========================================================
  private compiler: SubstrateCompiler;
  private shadowExecutor: ShadowExecutor;
  private hypothesisGenerator: HypothesisGenerator;

  // ==========================================================
  // STATE
  // ==========================================================
  private running: boolean = false;
  private cycle: number = 0;
  private population: ArchitectureInstance[] = [];
  private experimentHistory: RunningExperiment[] = [];
  private archive: ArchivedArchitecture[] = [];

  // ==========================================================
  // ADAPTIVE CONTROLLERS
  // ==========================================================
  private mutationRate: number = 0.05;
  private mutationRateHistory: number[] = [];
  private selectionPressure: number = 0.30;  // Fraction of population that survives
  private explorationMode: boolean = false;
  private explorationModeCounter: number = 0;
  private fitnessStagnationCounter: number = 0;
  private diversityCrisisCounter: number = 0;

  // ==========================================================
  // CONFIGURATION
  // ==========================================================
  private readonly CONFIG = {
    POPULATION_CAP: 50,
    MIN_POPULATION: 5,
    ELITE_COUNT: 3,
    MAX_EXPERIMENTS_PER_CYCLE: 10,
    MAX_CONCURRENT_EXPERIMENTS: 4,
    FITNESS_STAGNATION_THRESHOLD: 10,  // Cycles without improvement
    DIVERSITY_CRISIS_THRESHOLD: 2.0,    // Shannon index below this
    EXPLORATION_MUTATION_MULTIPLIER: 4.0,
    EXPLOITATION_MUTATION_MULTIPLIER: 0.5,
    CYCLE_INTERVAL_MS: 10000,           // Minimum time between cycles (10s)
    FITNESS_WEIGHTS: {
      task_performance: 0.60,
      parameter_efficiency: 0.20,
      inference_speed: 0.10,
      training_speed: 0.05,
      novelty_bonus: 0.05,
    },
  };

  // ==========================================================
  // LIFECYCLE
  // ==========================================================

  constructor() {
    super();
    this.compiler = new SubstrateCompiler();
    this.shadowExecutor = new ShadowExecutor();
    this.hypothesisGenerator = new HypothesisGenerator();

    // Forward shadow events
    this.shadowExecutor.on('shadow:started', (e) => this.emit('experiment:shadow_started', e));
    this.shadowExecutor.on('shadow:completed', (e) => this.emit('experiment:shadow_completed', e));
    this.shadowExecutor.on('shadow:failed', (e) => this.emit('experiment:shadow_failed', e));
    this.shadowExecutor.on('shadow:aborted', (e) => this.emit('experiment:shadow_aborted', e));
  }

  /**
   * Start the continuous experiment engine.
   * This runs FOREVER until stop() is called.
   */
  async start(initialPopulation: ArchitectureConfig[]): Promise<void> {
    this.running = true;

    // Initialize population from seed architectures
    this.population = initialPopulation.map((config, i) => ({
      instance_id: `inst_${config.architecture_id}`,
      config,
      fitness: 0,
      fitness_history: [],
      training_state: {
        current_step: 0,
        total_steps: 0,
        current_loss: null,
        is_training: false,
        job_handle: null,
      },
      metrics: {
        task_scores: {},
        inference_latency_ms: config.estimated_latency_ms,
        training_throughput: 0,
        gpu_memory_bytes: 0,
        gradient_norm: 0,
        dead_neuron_ratio: 0,
        attention_entropy: 0,
        numerical_issues_count: 0,
      },
      lifecycle_state: 'idle',
      created_at_cycle: 0,
      last_evaluated_at_cycle: 0,
      last_mutated_at_cycle: 0,
      culled_at_cycle: null,
    }));

    this.emit('engine:started', {
      populationSize: this.population.length,
      message: 'Continuous Survive Experiments Engine started',
    });

    // MAIN LOOP
    while (this.running) {
      try {
        await this.runCycle();
      } catch (error: any) {
        this.emit('engine:cycle_error', { cycle: this.cycle, error: error.message });
        // Don't crash the engine on cycle errors — log and continue
      }

      // Dynamic interval
      const interval = this.computeCycleInterval();
      await this.sleep(interval);
    }

    this.emit('engine:stopped', { totalCycles: this.cycle });
  }

  /**
   * Stop the engine gracefully.
   */
  async stop(): Promise<void> {
    this.running = false;
    this.emit('engine:stopping', { cycle: this.cycle });
  }

  // ==========================================================
  // CYCLE EXECUTION
  // ==========================================================

  private async runCycle(): Promise<CycleResult> {
    this.cycle++;
    const cycleStart = Date.now();

    this.emit('engine:cycle_started', { cycle: this.cycle });

    // ---- PHASE 1: EVALUATE POPULATION ----
    const fitnessResults = await this.evaluatePopulation();

    // ---- PHASE 2: DETECT CONDITIONS ----
    const plateauDetected = this.detectFitnessPlateau(fitnessResults);
    const diversityCrisis = this.computeShannonDiversity() < this.CONFIG.DIVERSITY_CRISIS_THRESHOLD;
    const resourceCrisis = this.computeResourceUtilization() > 0.90;

    // ---- PHASE 3: GENERATE HYPOTHESES ----
    const hypotheses = this.hypothesisGenerator.generate({
      population: this.population,
      cycle: this.cycle,
      fitnessResults,
      plateauDetected,
      diversityCrisis,
      resourceCrisis,
      explorationMode: this.explorationMode,
      survivalProbability: this.computePopulationSurvival(),
    });

    // ---- PHASE 4: PRIORITIZE AND EXECUTE EXPERIMENTS ----
    const prioritized = this.prioritizeHypotheses(hypotheses);
    const toExecute = prioritized.slice(0, this.CONFIG.MAX_EXPERIMENTS_PER_CYCLE);
    const experimentResults = await this.executeExperiments(toExecute);

    // ---- PHASE 5: APPLY ACCEPTED MUTATIONS ----
    let acceptedCount = 0;
    let rejectedCount = 0;

    for (const result of experimentResults) {
      if (result.state === ExperimentState.ACCEPTED || result.recommendation.startsWith('APPLY')) {
        await this.applyAcceptedMutation(result);
        acceptedCount++;
      } else {
        await this.archiveRejectedMutation(result);
        rejectedCount++;
      }
    }

    // ---- PHASE 6: SELECT AND REPRODUCE ----
    const survivors = this.selectSurvivors(fitnessResults);
    const children = this.reproduce(survivors);
    const culled = this.cullPopulation(survivors, children);

    // ---- PHASE 7: ADAPT PARAMETERS ----
    this.adaptMutationRate(plateauDetected, diversityCrisis);
    this.adaptSelectionPressure(resourceCrisis);
    this.adaptExplorationMode(plateauDetected, diversityCrisis);

    // ---- PHASE 8: CHECKPOINT ----
    if (this.cycle % 10 === 0) {
      await this.checkpoint();
    }

    // ---- ASSEMBLE CYCLE RESULT ----
    const cycleResult: CycleResult = {
      cycle: this.cycle,
      timestamp: Date.now(),
      population_size: this.population.length,
      population_cap: this.CONFIG.POPULATION_CAP,
      architectures_training: this.population.filter(a => a.lifecycle_state === 'training').length,
      architectures_idle: this.population.filter(a => a.lifecycle_state === 'idle').length,
      best_fitness: fitnessResults.maxFitness,
      median_fitness: fitnessResults.medianFitness,
      worst_fitness: fitnessResults.minFitness,
      fitness_trend_10_cycles: this.computeFitnessTrend(),
      shannon_diversity: this.computeShannonDiversity(),
      unique_families: this.countFamilies(),
      dominant_family: this.findDominantFamily(),
      dominant_family_share: this.findDominantFamilyShare(),
      mutation_rate_current: this.mutationRate,
      mutations_applied_this_cycle: acceptedCount + rejectedCount,
      mutation_acceptance_rate: acceptedCount / Math.max(1, acceptedCount + rejectedCount),
      most_common_mutation: this.findMostCommonMutation(experimentResults),
      survivors: survivors.length,
      children_generated: children.length,
      culled: culled.length,
      elites_preserved: this.CONFIG.ELITE_COUNT,
      crossovers_performed: 0,  // Filled below
      resource_utilization_percent: this.computeResourceUtilization() * 100,
      total_flops_consumed_this_cycle: 0,
      total_gpu_seconds_this_cycle: 0,
      experiments_completed_this_cycle: experimentResults.length,
      experiments_accepted_this_cycle: acceptedCount,
      experiments_rejected_this_cycle: rejectedCount,
      experiments_running: this.shadowExecutor.getStatus().activeCount,
      experiments_queued: this.shadowExecutor.getStatus().queueLength,
      novel_innovation_detected: this.detectNovelInnovation(experimentResults),
      fitness_plateau_detected: plateauDetected,
      diversity_crisis_detected: diversityCrisis,
      resource_crisis_detected: resourceCrisis,
      numerical_instability_detected: false,
      cycle_duration_seconds: (Date.now() - cycleStart) / 1000,
    };

    this.emit('engine:cycle_completed', cycleResult);
    return cycleResult;
  }

  // ==========================================================
  // PHASE 1: EVALUATE
  // ==========================================================

  private async evaluatePopulation(): Promise<FitnessResults> {
    const fitnesses: number[] = [];

    for (const instance of this.population) {
      const fitness = this.computeFitness(instance);
      instance.fitness = fitness;
      instance.fitness_history.push([this.cycle, fitness]);
      instance.last_evaluated_at_cycle = this.cycle;
      fitnesses.push(fitness);
    }

    const sorted = [...fitnesses].sort((a, b) => a - b);
    return {
      fitnesses,
      maxFitness: sorted[sorted.length - 1] || 0,
      minFitness: sorted[0] || 0,
      medianFitness: sorted[Math.floor(sorted.length / 2)] || 0,
      meanFitness: sorted.reduce((a, b) => a + b, 0) / Math.max(1, sorted.length),
    };
  }

  private computeFitness(instance: ArchitectureInstance): number {
    const w = this.CONFIG.FITNESS_WEIGHTS;
    const m = instance.metrics;

    // Task performance: average of all task scores
    const taskPerf = Object.values(m.task_scores).length > 0
      ? Object.values(m.task_scores).reduce((a, b) => a + b, 0) / Object.values(m.task_scores).length
      : 0;

    // Parameter efficiency: performance per parameter (sublinear scaling)
    const paramEff = Math.min(1.0,
      taskPerf / (Math.pow(instance.config.estimated_parameters, 0.3) / 100)
    );

    // Inference speed: normalized against 100ms ceiling
    const latencyScore = Math.max(0, 1.0 - m.inference_latency_ms / 100);

    // Training speed: placeholder (requires actual training metrics)
    const trainingScore = 0.5;

    // Novelty: how different from population
    const novelty = this.computeNovelty(instance);

    return (
      w.task_performance * taskPerf +
      w.parameter_efficiency * paramEff +
      w.inference_speed * latencyScore +
      w.training_speed * trainingScore +
      w.novelty_bonus * novelty
    );
  }

  // ==========================================================
  // PHASE 2: DETECT CONDITIONS
  // ==========================================================

  private detectFitnessPlateau(results: FitnessResults): boolean {
    if (this.fitnessStagnationCounter >= this.CONFIG.FITNESS_STAGNATION_THRESHOLD) {
      return true;
    }

    // Check if best fitness hasn't improved significantly
    const recentHistory = this.population
      .flatMap(p => p.fitness_history)
      .filter(([cycle]) => cycle >= this.cycle - 10);

    if (recentHistory.length < 2) return false;

    const recentFitnesses = recentHistory.map(([, f]) => f);
    const trend = (recentFitnesses[recentFitnesses.length - 1] - recentFitnesses[0])
      / Math.max(1, recentFitnesses.length);

    if (trend < 0.001) {
      this.fitnessStagnationCounter++;
    } else {
      this.fitnessStagnationCounter = 0;
    }

    return this.fitnessStagnationCounter >= this.CONFIG.FITNESS_STAGNATION_THRESHOLD;
  }

  // ==========================================================
  // PHASE 3: GENERATE HYPOTHESES (delegated to HypothesisGenerator)
  // ==========================================================

  // ==========================================================
  // PHASE 4: EXECUTE EXPERIMENTS
  // ==========================================================

  private prioritizeHypotheses(hypotheses: Hypothesis[]): Hypothesis[] {
    return hypotheses.sort((a, b) => b.priority - a.priority);
  }

  private async executeExperiments(hypotheses: Hypothesis[]): Promise<ExperimentResult[]> {
    const results: ExperimentResult[] = [];

    // Execute concurrently (up to MAX_CONCURRENT_EXPERIMENTS)
    const batches = this.chunkArray(hypotheses, this.CONFIG.MAX_CONCURRENT_EXPERIMENTS);

    for (const batch of batches) {
      const batchPromises = batch.map(async (hypothesis) => {
        // Find parent architecture
        const parent = this.population.find(
          p => p.config.architecture_id === hypothesis.target_architecture_id
        );
        if (!parent) {
          return this.createFailedResult(hypothesis, 'Parent architecture not found in population');
        }

        // Compile mutation
        let compiled: { mutated: ArchitectureConfig; record: MutationRecord };
        try {
          compiled = this.compiler.compileMutation(
            parent.config,
            hypothesis.mutations[0],
            this.createRNG(),
            this.cycle
          );
        } catch (error: any) {
          return this.createFailedResult(hypothesis, `Compilation failed: ${error.message}`);
        }

        // Execute in shadow
        const result = await this.shadowExecutor.executeShadow(
          compiled.mutated,
          parent.config,
          hypothesis,
          hypothesis.test_scenarios
        );

        return result;
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }

  // ==========================================================
  // PHASE 5: APPLY / REJECT
  // ==========================================================

  private async applyAcceptedMutation(result: ExperimentResult): Promise<void> {
    if (!result.shadow_architecture || !result.mutations_to_apply) return;

    // Replace the parent architecture with the mutated one
    const parentIdx = this.population.findIndex(
      p => p.config.architecture_id === result.shadow_architecture!.parent_id
    );

    if (parentIdx >= 0) {
      // Archive the old version
      this.archive.push({
        config: this.population[parentIdx].config,
        archive_metadata: {
          archived_at_cycle: this.cycle,
          archived_at_timestamp: Date.now(),
          reason: 'checkpoint',
          permanent: false,
          fitness_at_archive: this.population[parentIdx].fitness,
          peak_fitness_scores: [this.population[parentIdx].fitness],
          tags: ['replaced_by_mutation'],
          integrity_hash: this.population[parentIdx].config.config_hash,
          archive_format_version: '1.0.0',
        },
        lineage: {
          ancestor_chain: [],
          generation: this.population[parentIdx].config.generation,
          sibling_ids: [],
          child_ids: [result.shadow_architecture.architecture_id],
        },
        weight_checkpoint: null,
      });

      // Replace with mutated version
      this.population[parentIdx] = {
        ...this.population[parentIdx],
        config: result.shadow_architecture,
        instance_id: `inst_${result.shadow_architecture.architecture_id}`,
        fitness: 0,  // Will be re-evaluated next cycle
        last_mutated_at_cycle: this.cycle,
      };

      this.emit('engine:mutation_applied', {
        cycle: this.cycle,
        architecture: result.shadow_architecture.name,
        recommendation: result.recommendation,
        fitnessDelta: result.fitness_impact.delta_fitness,
        survivalDelta: result.survival_impact.delta_survival_probability,
      });
    }
  }

  private async archiveRejectedMutation(result: ExperimentResult): Promise<void> {
    // Store the rejected pattern in the archive
    // to avoid repeating it in future hypotheses
    this.emit('engine:mutation_rejected', {
      cycle: this.cycle,
      hypothesisId: result.hypothesis_id,
      recommendation: result.recommendation,
      reason: result.recommendation_rationale,
    });
  }

  // ==========================================================
  // PHASE 6: SELECT AND REPRODUCE
  // ==========================================================

  private selectSurvivors(results: FitnessResults): ArchitectureInstance[] {
    const sorted = [...this.population].sort((a, b) => b.fitness - a.fitness);
    const numSurvivors = Math.max(
      this.CONFIG.MIN_POPULATION,
      Math.floor(this.population.length * (1 - this.selectionPressure))
    );

    return sorted.slice(0, numSurvivors);
  }

  private reproduce(survivors: ArchitectureInstance[]): ArchitectureConfig[] {
    const children: ArchitectureConfig[] = [];
    const numChildrenTarget = this.CONFIG.POPULATION_CAP - survivors.length - this.CONFIG.ELITE_COUNT;

    if (numChildrenTarget <= 0 || survivors.length === 0) return children;

    // Allocate reproduction budget proportional to fitness
    const totalFitness = survivors.reduce((sum, s) => sum + Math.max(0.01, s.fitness), 0);
    const rng = this.createRNG();

    for (const survivor of survivors) {
      const share = Math.max(0.01, survivor.fitness) / totalFitness;
      const numChildren = Math.floor(numChildrenTarget * share);

      if (numChildren > 0) {
        const mode = this.explorationMode ? 'explore' : 'exploit';
        const batch = this.compiler.compileBatch(
          survivor.config,
          numChildren,
          this.mutationRate,
          mode,
          rng,
          this.cycle
        );

        for (const child of batch) {
          children.push(child.mutated);
        }
      }
    }

    return children;
  }

  private cullPopulation(
    survivors: ArchitectureInstance[],
    children: ArchitectureConfig[]
  ): ArchitectureInstance[] {
    const elite = [...this.population]
      .sort((a, b) => b.fitness - a.fitness)
      .slice(0, this.CONFIG.ELITE_COUNT);

    const newPopulation: ArchitectureInstance[] = [
      ...elite.map(e => ({ ...e, lifecycle_state: 'elite' as const })),
      ...survivors.filter(s => !elite.find(e => e.instance_id === s.instance_id))
        .map(s => ({ ...s, lifecycle_state: 'idle' as const })),
      ...children.map((config, i) => ({
        instance_id: `inst_${config.architecture_id}`,
        config,
        fitness: 0,
        fitness_history: [],
        training_state: {
          current_step: 0,
          total_steps: 0,
          current_loss: null,
          is_training: false,
          job_handle: null,
        },
        metrics: {
          task_scores: {},
          inference_latency_ms: config.estimated_latency_ms,
          training_throughput: 0,
          gpu_memory_bytes: 0,
          gradient_norm: 0,
          dead_neuron_ratio: 0,
          attention_entropy: 0,
          numerical_issues_count: 0,
        },
        lifecycle_state: 'idle' as const,
        created_at_cycle: this.cycle,
        last_evaluated_at_cycle: 0,
        last_mutated_at_cycle: this.cycle,
        culled_at_cycle: null,
      })),
    ];

    // Trim to population cap
    const trimmed = newPopulation
      .sort((a, b) => b.fitness - a.fitness)
      .slice(0, this.CONFIG.POPULATION_CAP);

    const culled = this.population.filter(
      p => !trimmed.find(t => t.instance_id === p.instance_id)
    );

    // Mark culled
    for (const c of culled) {
      c.lifecycle_state = 'culled';
      c.culled_at_cycle = this.cycle;
    }

    this.population = trimmed;

    return culled;
  }

  // ==========================================================
  // PHASE 7: ADAPT
  // ==========================================================

  private adaptMutationRate(plateau: boolean, diversityCrisis: boolean): void {
    if (diversityCrisis) {
      // Dramatically increase mutation to inject diversity
      this.mutationRate = Math.min(0.30, this.mutationRate * 1.5);
    } else if (plateau) {
      // Increase to escape plateau
      this.mutationRate = Math.min(0.20, this.mutationRate * 1.2);
    } else if (this.explorationMode) {
      this.mutationRate = this.CONFIG.EXPLORATION_MUTATION_MULTIPLIER * 0.05;
    } else {
      // Slowly decay back to baseline
      this.mutationRate = 0.05 + (this.mutationRate - 0.05) * 0.9;
    }

    // Hard bounds
    this.mutationRate = Math.max(0.001, Math.min(0.30, this.mutationRate));
    this.mutationRateHistory.push(this.mutationRate);
  }

  private adaptSelectionPressure(resourceCrisis: boolean): void {
    if (resourceCrisis) {
      this.selectionPressure = Math.min(0.50, this.selectionPressure + 0.05);
    } else {
      this.selectionPressure = Math.max(0.10, this.selectionPressure - 0.01);
    }
  }

  private adaptExplorationMode(plateau: boolean, diversityCrisis: boolean): void {
    if (plateau || diversityCrisis) {
      if (!this.explorationMode) {
        this.explorationMode = true;
        this.explorationModeCounter = 10;  // Stay in exploration for 10 cycles
        this.emit('engine:exploration_mode', {
          cycle: this.cycle,
          reason: plateau ? 'fitness_plateau' : 'diversity_crisis',
        });
      }
      this.explorationModeCounter = 10;  // Reset counter
    } else if (this.explorationMode) {
      this.explorationModeCounter--;
      if (this.explorationModeCounter <= 0) {
        this.explorationMode = false;
        this.emit('engine:exploitation_mode', { cycle: this.cycle });
      }
    }
  }

  // ==========================================================
  // UTILITY
  // ==========================================================

  private computeCycleInterval(): number {
    // Shorter intervals when exploring, longer when exploiting
    const base = this.CONFIG.CYCLE_INTERVAL_MS;
    return this.explorationMode ? base * 0.5 : base;
  }

  private computeShannonDiversity(): number {
    const familyCounts: Record<string, number> = {};
    for (const inst of this.population) {
      familyCounts[inst.config.family] = (familyCounts[inst.config.family] || 0) + 1;
    }
    const total = this.population.length;
    const proportions = Object.values(familyCounts).map(c => c / total);
    return -proportions.reduce((sum, p) => sum + p * Math.log(p), 0);
  }

  private computeResourceUtilization(): number {
    const totalParams = this.population.reduce(
      (sum, inst) => sum + inst.config.estimated_parameters, 0
    );
    return totalParams / (this.CONFIG.POPULATION_CAP * 25_000_000);
  }

  private computeFitnessTrend(): number {
    if (this.population.length === 0) return 0;
    const histories = this.population
      .filter(p => p.fitness_history.length >= 2)
      .map(p => {
        const recent = p.fitness_history.slice(-10);
        if (recent.length < 2) return 0;
        return (recent[recent.length - 1][1] - recent[0][1]) / recent.length;
      });
    return histories.reduce((a, b) => a + b, 0) / Math.max(1, histories.length);
  }

  private computeNovelty(instance: ArchitectureInstance): number {
    if (this.population.length < 5) return 0.5;
    // Simplified: reward architectures with unique layer type distributions
    const instanceTypes = instance.config.layers.map(l => l.type).join(',');
    const populationTypes = this.population.map(
      p => p.config.layers.map(l => l.type).join(',')
    );
    const uniqueCount = new Set(populationTypes).size;
    return Math.min(1.0, uniqueCount / this.population.length);
  }

  private computePopulationSurvival(): number {
    // Simplified: high survival if population is healthy
    if (this.population.length === 0) return 0;
    const diversity = this.computeShannonDiversity();
    const medianFitness = this.population
      .map(p => p.fitness)
      .sort((a, b) => a - b)
      [Math.floor(this.population.length / 2)] || 0;

    return Math.min(1.0,
      0.3 * (this.population.length / this.CONFIG.POPULATION_CAP) +
      0.3 * (diversity / 3.0) +
      0.4 * medianFitness
    );
  }

  private countFamilies(): number {
    return new Set(this.population.map(p => p.config.family)).size;
  }

  private findDominantFamily(): string {
    const counts: Record<string, number> = {};
    for (const p of this.population) {
      counts[p.config.family] = (counts[p.config.family] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
  }

  private findDominantFamilyShare(): number {
    const dominant = this.findDominantFamily();
    const count = this.population.filter(p => p.config.family === dominant).length;
    return count / Math.max(1, this.population.length);
  }

  private findMostCommonMutation(results: ExperimentResult[]): string {
    const counts: Record<string, number> = {};
    for (const r of results) {
      if (r.mutations_to_apply) {
        for (const m of r.mutations_to_apply) {
          counts[m.operator] = (counts[m.operator] || 0) + 1;
        }
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
  }

  private detectNovelInnovation(results: ExperimentResult[]): boolean {
    return results.some(r =>
      r.recommendation === 'APPLY_IMMEDIATELY' &&
      r.fitness_impact.delta_fitness > 0.05
    );
  }

  private async checkpoint(): Promise<void> {
    this.emit('engine:checkpoint', {
      cycle: this.cycle,
      populationSize: this.population.length,
      archiveSize: this.archive.length,
    });
  }

  private createFailedResult(hypothesis: Hypothesis, reason: string): ExperimentResult {
    return {
      hypothesis_id: hypothesis.hypothesis_id,
      state: ExperimentState.ABORTED,
      started_at: Date.now(),
      ended_at: Date.now(),
      duration_seconds: 0,
      scenario_results: [],
      survival_impact: {
        delta_survival_probability: 0,
        baseline_survival: 0,
        shadow_survival: 0,
        improved: false,
      },
      fitness_impact: {
        baseline_fitness: 0,
        shadow_fitness: 0,
        delta_fitness: 0,
        improved: false,
      },
      resources_consumed: {
        total_flops: 0,
        total_time_seconds: 0,
        peak_memory_bytes: 0,
        total_gpu_seconds: 0,
      },
      recommendation: 'ARCHIVE_ONLY',
      recommendation_rationale: reason,
    };
  }

  private createRNG(): seedrandom.PRNG {
    return seedrandom(`${this.cycle}_${Date.now()}`);
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================
// INTERNAL TYPES
// ============================================================

interface FitnessResults {
  fitnesses: number[];
  maxFitness: number;
  minFitness: number;
  medianFitness: number;
  meanFitness: number;
}
```

---

### Continue for ['Substrate Darwinism Compiler'(-ing) BPMS] (Presettings) -3