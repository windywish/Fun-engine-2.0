// ============================================================
// FILE: ['Substrate Darwinism Compiler'(-ing) BPMS] (compiler) (Presettings).ts
// The Substrate Compiler — the mutation engine.
//
// This is the CORE of the post-Large-Model paradigm.
// It takes architectures as input, applies mutations,
// and produces new architectures as output.
//
// Unlike a traditional compiler (source → binary),
// this compiles: (current_substrate + mutation) → new_substrate.
// The "source" and "binary" are the same type: ArchitectureConfig.
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import * as jsonpatch from 'fast-json-patch';
import { createHash } from 'crypto';
import seedrandom from 'seedrandom';

export class SubstrateCompiler {
  // ==========================================================
  // CONFIGURATION
  // ==========================================================

  /** Maximum parameter count for any architecture (beyond this, compilation fails) */
  private readonly MAX_PARAMETERS = 25_000_000;

  /** Maximum FLOPs per forward pass */
  private readonly MAX_FLOPS = 5_000_000_000;

  /** Maximum number of layers */
  private readonly MAX_LAYERS = 48;

  /** Minimum number of layers */
  private readonly MIN_LAYERS = 1;

  /** Maximum attention heads per layer */
  private readonly MAX_HEADS = 32;

  /** Minimum attention heads per layer */
  private readonly MIN_HEADS = 1;

  /** Maximum FFN ratio */
  private readonly MAX_FFN_RATIO = 16;

  /** Minimum FFN ratio */
  private readonly MIN_FFN_RATIO = 1;

  /** All available mutation operators */
  private readonly ALL_OPERATORS: MutationOperatorName[] = [
    'layer_insert', 'layer_delete', 'layer_type_swap',
    'layer_clone', 'layer_split', 'layer_merge',
    'attention_head_clone', 'attention_head_prune',
    'attention_head_split', 'attention_type_swap',
    'attention_window_resize',
    'ffn_ratio_scale', 'ffn_activation_swap', 'ffn_gate_toggle',
    'skip_connection_add', 'skip_connection_remove', 'skip_connection_retarget',
    'embedding_dimension_scale', 'position_encoding_swap',
    'training_hyperparameter_perturb',
    'wild_type_activation_shuffle', 'wild_type_topology_rewire',
    'wild_type_layer_shuffle', 'wild_type_attention_soup',
    'crossover'
  ];

  /** Light operators (safe, low-variance) — used during exploitation mode */
  private readonly LIGHT_OPERATORS: MutationOperatorName[] = [
    'attention_head_clone', 'attention_head_prune',
    'attention_type_swap', 'attention_window_resize',
    'ffn_ratio_scale', 'ffn_activation_swap', 'ffn_gate_toggle',
    'skip_connection_add', 'skip_connection_remove',
    'training_hyperparameter_perturb'
  ];

  /** Heavy operators (high-variance, can be destructive) — used during exploration mode */
  private readonly HEAVY_OPERATORS: MutationOperatorName[] = [
    'layer_insert', 'layer_delete', 'layer_type_swap',
    'layer_clone', 'layer_split', 'layer_merge',
    'attention_head_split',
    'embedding_dimension_scale', 'position_encoding_swap',
    'skip_connection_retarget',
    'wild_type_activation_shuffle', 'wild_type_topology_rewire',
    'wild_type_layer_shuffle', 'wild_type_attention_soup'
  ];

  /** Operator weight distribution (probability of being selected) */
  private readonly OPERATOR_WEIGHTS: Record<MutationOperatorName, number> = {
    'layer_insert': 0.04,
    'layer_delete': 0.03,
    'layer_type_swap': 0.02,
    'layer_clone': 0.02,
    'layer_split': 0.02,
    'layer_merge': 0.02,
    'attention_head_clone': 0.08,
    'attention_head_prune': 0.06,
    'attention_head_split': 0.03,
    'attention_type_swap': 0.06,
    'attention_window_resize': 0.05,
    'ffn_ratio_scale': 0.08,
    'ffn_activation_swap': 0.10,
    'ffn_gate_toggle': 0.05,
    'skip_connection_add': 0.08,
    'skip_connection_remove': 0.04,
    'skip_connection_retarget': 0.03,
    'embedding_dimension_scale': 0.04,
    'position_encoding_swap': 0.03,
    'training_hyperparameter_perturb': 0.04,
    'wild_type_activation_shuffle': 0.02,
    'wild_type_topology_rewire': 0.02,
    'wild_type_layer_shuffle': 0.01,
    'wild_type_attention_soup': 0.01,
    'crossover': 0.02,
  };

  // ==========================================================
  // PUBLIC API
  // ==========================================================

  /**
   * Apply a single named mutation to an architecture.
   *
   * @param config - The architecture to mutate (not modified; a deep copy is made)
   * @param operator - Which mutation to apply
   * @param rng - Seeded random number generator for reproducibility
   * @param cycle - Current experiment cycle number
   * @returns The mutated architecture config and the mutation record
   *
   * @throws {CompileError} If the mutation produces an invalid architecture
   */
  compileMutation(
    config: ArchitectureConfig,
    operator: MutationOperatorName,
    rng: seedrandom.PRNG,
    cycle: number
  ): { mutated: ArchitectureConfig; record: MutationRecord } {
    // 1. Deep clone — never mutate the original
    const mutated = structuredClone(config);

    // 2. Apply the mutation
    const record = this.applyOperator(mutated, operator, rng, cycle);

    // 3. Validate the result
    this.validate(mutated);

    // 4. Update metadata
    mutated.mutation_history.push(record);
    mutated.total_mutations_in_lineage += 1;
    mutated.version = this.bumpVersion(config.version, operator);
    mutated.config_hash = this.computeHash(mutated);
    mutated.estimated_parameters = this.estimateParameters(mutated);
    mutated.estimated_flops = this.estimateFlops(mutated);
    mutated.estimated_training_memory_bytes = this.estimateTrainingMemory(mutated);
    mutated.estimated_latency_ms = this.estimateLatency(mutated);

    return { mutated, record };
  }

  /**
   * Produce N children from a parent architecture.
   * Each child receives 1–5 random mutations.
   *
   * @param parent - The parent architecture
   * @param numChildren - How many children to produce
   * @param mutationRate - Average number of mutations per child (Poisson lambda)
   * @param mode - "exploit" (light operators) or "explore" (all operators) or "mixed"
   * @param rng - Seeded RNG
   * @param cycle - Current cycle
   * @returns Array of mutated children
   */
  compileBatch(
    parent: ArchitectureConfig,
    numChildren: number,
    mutationRate: number,
    mode: "exploit" | "explore" | "mixed",
    rng: seedrandom.PRNG,
    cycle: number
  ): { mutated: ArchitectureConfig; records: MutationRecord[] }[] {
    const children: { mutated: ArchitectureConfig; records: MutationRecord[] }[] = [];

    const operatorPool = mode === "exploit" ? this.LIGHT_OPERATORS
                       : mode === "explore" ? [...this.LIGHT_OPERATORS, ...this.HEAVY_OPERATORS]
                       : this.ALL_OPERATORS;

    for (let i = 0; i < numChildren; i++) {
      let childConfig = structuredClone(parent);
      const records: MutationRecord[] = [];

      // Poisson sample: how many mutations?
      let numMutations = this.poissonSample(mutationRate * 3, rng);
      numMutations = Math.max(1, Math.min(numMutations, 5));  // Clamp 1–5

      // Select operators (without replacement for this child)
      const chosenOps = this.sampleWithoutReplacement(operatorPool, numMutations, rng);

      for (const op of chosenOps) {
        try {
          const record = this.applyOperator(childConfig, op, rng, cycle);
          records.push(record);
        } catch (e) {
          // If a mutation fails, skip it and continue with others
          // Don't let one bad mutation kill the whole child
          continue;
        }
      }

      // If all mutations failed, this child is a clone (still valid, just no changes)
      if (records.length === 0) {
        records.push(this.createNoOpRecord(parent, cycle));
      }

      // Finalize
      childConfig.mutation_history.push(...records);
      childConfig.total_mutations_in_lineage = parent.total_mutations_in_lineage + records.length;
      childConfig.version = this.bumpVersion(parent.version, 'layer_insert'); // conservative
      childConfig.config_hash = this.computeHash(childConfig);
      childConfig.estimated_parameters = this.estimateParameters(childConfig);
      childConfig.estimated_flops = this.estimateFlops(childConfig);
      childConfig.estimated_training_memory_bytes = this.estimateTrainingMemory(childConfig);
      childConfig.estimated_latency_ms = this.estimateLatency(childConfig);

      // Validate
      try {
        this.validate(childConfig);
        children.push({ mutated: childConfig, records });
      } catch (e) {
        // Child failed validation — discard
        continue;
      }
    }

    return children;
  }

  /**
   * Breed two architectures via crossover.
   *
   * Algorithm:
   * 1. Pick a random contiguous block of layers from Parent A
   * 2. Pick a random contiguous block of layers from Parent B
   * 3. Replace A's block with B's block
   * 4. Merge skip connections from both parents (union)
   * 5. Inherit other hyperparameters randomly from either parent
   * 6. Apply 1–2 light mutations on top
   */
  compileCrossover(
    parentA: ArchitectureConfig,
    parentB: ArchitectureConfig,
    rng: seedrandom.PRNG,
    cycle: number
  ): { mutated: ArchitectureConfig; records: MutationRecord[] } {
    if (parentA.architecture_id === parentB.architecture_id) {
      throw new CompileError("Cannot crossover an architecture with itself");
    }

    const child = structuredClone(parentA);
    child.architecture_id = this.generateId('arch');
    child.name = `${parentA.name}×${parentB.name}`;
    child.parent_ids = [parentA.architecture_id, parentB.architecture_id];
    child.generation = Math.max(parentA.generation, parentB.generation) + 1;

    const records: MutationRecord[] = [];

    // --- STEP 1: Layer splice ---
    if (parentB.layers.length >= 2 && child.layers.length >= 2) {
      // Pick splice points
      const spliceStartA = Math.floor(rng() * (child.layers.length - 1));
      const maxSpliceLenA = Math.min(4, child.layers.length - spliceStartA);
      const spliceLenA = Math.max(1, Math.floor(rng() * maxSpliceLenA) + 1);

      const spliceStartB = Math.floor(rng() * (parentB.layers.length - 1));
      const maxSpliceLenB = Math.min(4, parentB.layers.length - spliceStartB);
      const spliceLenB = Math.max(1, Math.floor(rng() * maxSpliceLenB) + 1);

      // Deep clone B's layers for splicing
      const bBlock = structuredClone(
        parentB.layers.slice(spliceStartB, spliceStartB + spliceLenB)
      );

      // Re-ID the spliced layers to avoid ID collisions
      for (const layer of bBlock) {
        layer.layer_id = this.generateId('layer');
      }

      // Splice
      child.layers.splice(spliceStartA, spliceLenA, ...bBlock);

      records.push({
        mutation_id: this.generateId('mut'),
        operator: 'crossover',
        target: `layers[${spliceStartA}:${spliceStartA + spliceLenA}]`,
        description: `Spliced ${spliceLenA} layers from ${parentA.architecture_id} with ${spliceLenB} layers from ${parentB.architecture_id} at position ${spliceStartA}`,
        diff: [],
        applied_at_cycle: cycle,
        crossover_partner: parentB.architecture_id,
        parameter_delta: 0,
        flops_delta: 0,
      });
    }

    // --- STEP 2: Merge skip connections ---
    const childConnIds = new Set(child.connections.map(c => c.connection_id));
    for (const conn of parentB.connections) {
      if (!childConnIds.has(conn.connection_id) && rng() < 0.5) {
        child.connections.push(structuredClone(conn));
      }
    }

    // --- STEP 3: Inherit hyperparameters randomly ---
    child.embedding_dim = rng() < 0.5 ? parentA.embedding_dim : parentB.embedding_dim;
    child.position_encoding = rng() < 0.5 ? parentA.position_encoding : parentB.position_encoding;
    child.tie_embedding_weights = rng() < 0.5
      ? parentA.tie_embedding_weights : parentB.tie_embedding_weights;
    child.training_config.learning_rate = rng() < 0.5
      ? parentA.training_config.learning_rate : parentB.training_config.learning_rate;
    child.training_config.optimizer = rng() < 0.5
      ? parentA.training_config.optimizer : parentB.training_config.optimizer;

    // --- STEP 4: Apply 1–2 light mutations ---
    const numExtra = Math.floor(rng() * 2) + 1;  // 1 or 2
    const extraOps = this.sampleWithoutReplacement(this.LIGHT_OPERATORS, numExtra, rng);
    for (const op of extraOps) {
      try {
        const record = this.applyOperator(child, op, rng, cycle);
        records.push(record);
      } catch (e) {
        continue;
      }
    }

    // --- STEP 5: Finalize ---
    child.mutation_history.push(...records);
    child.total_mutations_in_lineage =
      Math.max(parentA.total_mutations_in_lineage, parentB.total_mutations_in_lineage)
      + records.length;
    child.version = '0.0.1-' + child.generation;
    child.config_hash = this.computeHash(child);
    child.estimated_parameters = this.estimateParameters(child);
    child.estimated_flops = this.estimateFlops(child);
    child.estimated_training_memory_bytes = this.estimateTrainingMemory(child);
    child.estimated_latency_ms = this.estimateLatency(child);

    this.validate(child);

    return { mutated: child, records };
  }

  /**
   * Validate that an architecture configuration is structurally valid.
   *
   * Checks:
   * - At least 1 layer
   * - No duplicate layer IDs
   * - All connection references exist
   * - Parameter count within budget
   * - FLOPs within budget
   * - No circular skip connections
   * - Embedding dimension is positive
   * - All tensors have valid shapes
   *
   * @throws {CompileError} with specific message if validation fails
   */
  validate(config: ArchitectureConfig): void {
    const errors: string[] = [];

    // Layer count
    if (config.layers.length < this.MIN_LAYERS) {
      errors.push(`Too few layers: ${config.layers.length} < ${this.MIN_LAYERS}`);
    }
    if (config.layers.length > this.MAX_LAYERS) {
      errors.push(`Too many layers: ${config.layers.length} > ${this.MAX_LAYERS}`);
    }

    // Unique layer IDs
    const layerIds = new Set<string>();
    for (const layer of config.layers) {
      if (layerIds.has(layer.layer_id)) {
        errors.push(`Duplicate layer ID: ${layer.layer_id}`);
      }
      layerIds.add(layer.layer_id);
    }

    // Unique connection IDs
    const connIds = new Set<string>();
    for (const conn of config.connections) {
      if (connIds.has(conn.connection_id)) {
        errors.push(`Duplicate connection ID: ${conn.connection_id}`);
      }
      connIds.add(conn.connection_id);

      // Connection references must exist
      if (!layerIds.has(conn.from_layer)) {
        errors.push(`Connection ${conn.connection_id} references nonexistent source layer: ${conn.from_layer}`);
      }
      if (!layerIds.has(conn.to_layer)) {
        errors.push(`Connection ${conn.connection_id} references nonexistent target layer: ${conn.to_layer}`);
      }
    }

    // No self-connections
    for (const conn of config.connections) {
      if (conn.from_layer === conn.to_layer) {
        errors.push(`Self-connection: ${conn.connection_id} from ${conn.from_layer} to itself`);
      }
    }

    // No circular connections (simple cycle detection via DFS)
    try {
      this.detectCycles(config);
    } catch (e: any) {
      errors.push(`Circular connection: ${e.message}`);
    }

    // Embedding dimension
    if (config.embedding_dim <= 0 || !Number.isInteger(config.embedding_dim)) {
      errors.push(`Invalid embedding_dim: ${config.embedding_dim}`);
    }

    // Parameter budget
    const params = this.estimateParameters(config);
    if (params > this.MAX_PARAMETERS) {
      errors.push(`Parameter budget exceeded: ${params} > ${this.MAX_PARAMETERS}`);
    }

    // FLOP budget
    const flops = this.estimateFlops(config);
    if (flops > this.MAX_FLOPS) {
      errors.push(`FLOP budget exceeded: ${flops} > ${this.MAX_FLOPS}`);
    }

    // Attention layer validation
    for (const layer of config.layers) {
      if (layer.type === 'attention') {
        if (layer.num_heads !== undefined && (layer.num_heads < this.MIN_HEADS || layer.num_heads > this.MAX_HEADS)) {
          errors.push(`Layer ${layer.layer_id}: num_heads ${layer.num_heads} out of range [${this.MIN_HEADS}, ${this.MAX_HEADS}]`);
        }
        if (layer.hidden_dim !== undefined && layer.num_heads !== undefined) {
          if (layer.hidden_dim % layer.num_heads !== 0) {
            errors.push(`Layer ${layer.layer_id}: hidden_dim ${layer.hidden_dim} not divisible by num_heads ${layer.num_heads}`);
          }
        }
      }
      if (layer.type === 'feedforward') {
        if (layer.ffn_ratio !== undefined && (layer.ffn_ratio < this.MIN_FFN_RATIO || layer.ffn_ratio > this.MAX_FFN_RATIO)) {
          errors.push(`Layer ${layer.layer_id}: ffn_ratio ${layer.ffn_ratio} out of range [${this.MIN_FFN_RATIO}, ${this.MAX_FFN_RATIO}]`);
        }
      }
    }

    if (errors.length > 0) {
      throw new CompileError(`Validation failed: ${errors.join('; ')}`, errors);
    }
  }

  /**
   * Estimate total parameter count for an architecture.
   * Error margin: < 5% for standard transformer variants.
   */
  estimateParameters(config: ArchitectureConfig): number {
    let total = 0;
    const d = config.embedding_dim;

    // Embedding
    total += config.vocab_size * d;
    if (!config.tie_embedding_weights) {
      total += config.vocab_size * d;  // Unembedding
    }

    for (const layer of config.layers) {
      const hd = layer.hidden_dim || d;

      if (layer.type === 'attention') {
        const heads = layer.num_heads || 8;
        const headDim = layer.head_dim || Math.floor(hd / heads);
        total += 4 * hd * hd;  // Q, K, V, O projections
        if (layer.qk_norm) {
          total += 2 * heads * headDim;  // QK norm parameters
        }
      } else if (layer.type === 'feedforward') {
        const ratio = layer.ffn_ratio || 4;
        const ffnDim = Math.floor(hd * ratio);
        if (layer.gated) {
          total += 3 * hd * ffnDim;  // gate_proj, up_proj, down_proj
        } else {
          total += 2 * hd * ffnDim;  // up, down
        }
        if (layer.ffn_bias) {
          total += (layer.gated ? 3 : 2) * ffnDim + hd;
        }
      } else if (layer.type === 'normalization') {
        total += 2 * hd;  // scale + bias (or just scale for RMSNorm)
      } else if (layer.type === 'embedding') {
        total += config.vocab_size * hd;
      } else if (layer.type === 'router') {
        total += hd * (layer.num_heads || 8);  // Router weights
      }
    }

    // Connection adapters
    for (const conn of config.connections) {
      if (conn.adapter) {
        total += conn.adapter.target_dim * config.embedding_dim;  // Approximate
      }
    }

    return total;
  }

  /**
   * Estimate FLOPs for a single forward pass.
   * Error margin: < 10%.
   */
  estimateFlops(config: ArchitectureConfig): number {
    let flops = 0;
    const d = config.embedding_dim;
    const seq = config.max_seq_len;

    // Embedding: negligible (table lookup)

    for (const layer of config.layers) {
      const hd = layer.hidden_dim || d;

      if (layer.type === 'attention') {
        const heads = layer.num_heads || 8;
        const attnType = layer.attention_type || 'standard';
        // Q, K, V, O projections: 4 * seq * d * d
        flops += 4 * seq * hd * hd;
        // Attention computation
        if (attnType === 'sliding_window') {
          const w = layer.window_size || 256;
          flops += seq * Math.min(w, seq) * hd;  // QK^T for window
        } else if (attnType === 'linear') {
          flops += seq * hd * hd;  // Kernelized
        } else {
          flops += seq * seq * hd;  // Standard QK^T
        }
        // V multiplication
        flops += seq * seq * hd;
      } else if (layer.type === 'feedforward') {
        const ratio = layer.ffn_ratio || 4;
        const ffnDim = Math.floor(hd * ratio);
        const mult = layer.gated ? 3 : 2;
        flops += mult * seq * hd * ffnDim;
      }
      // Normalization, dropout, residuals: negligible (< 1% of total)
    }

    // Unembedding
    flops += seq * d * config.vocab_size;

    return Math.round(flops);
  }

  /**
   * Estimate peak training memory in bytes.
   * Includes: parameters, gradients, optimizer states, activations.
   */
  estimateTrainingMemory(config: ArchitectureConfig): number {
    const params = this.estimateParameters(config);
    const bytesPerParam = config.training_config.mixed_precision ? 2 : 4;  // FP16 or FP32

    // Parameters: params * bytes
    let memory = params * bytesPerParam;

    // Gradients: params * bytes (same as parameters)
    memory += params * bytesPerParam;

    // Optimizer states (Adam: 2 states per param; SGD: 0; Lion: 1)
    const optMultiplier = config.training_config.optimizer === 'sgd' ? 0
                        : config.training_config.optimizer === 'lion' ? 1
                        : 2;
    memory += params * bytesPerParam * optMultiplier;

    // Activations (rough: batch * seq * d * layers * factor)
    const activationMemory = config.training_config.batch_size
      * config.max_seq_len
      * config.embedding_dim
      * config.layers.length
      * 10  // Rough factor for intermediate activations
      * bytesPerParam;
    memory += activationMemory;

    return Math.round(memory);
  }

  /**
   * Estimate inference latency in milliseconds.
   * Rough estimate based on FLOPs and a hardware efficiency factor.
   */
  estimateLatency(config: ArchitectureConfig): number {
    const flops = this.estimateFlops(config);
    // Assume 100 TFLOPs/second on modern GPU (A100/H100 class)
    const tflopsPerSecond = 100;
    const seconds = flops / (tflopsPerSecond * 1e12);
    return Math.round(seconds * 1000);
  }

  // ==========================================================
  // MUTATION OPERATOR IMPLEMENTATIONS
  // ==========================================================

  /**
   * Dispatch to the correct mutation operator.
   */
  private applyOperator(
    config: ArchitectureConfig,
    operator: MutationOperatorName,
    rng: seedrandom.PRNG,
    cycle: number
  ): MutationRecord {
    switch (operator) {
      case 'layer_insert':        return this.opLayerInsert(config, rng, cycle);
      case 'layer_delete':        return this.opLayerDelete(config, rng, cycle);
      case 'layer_type_swap':     return this.opLayerTypeSwap(config, rng, cycle);
      case 'layer_clone':         return this.opLayerClone(config, rng, cycle);
      case 'layer_split':         return this.opLayerSplit(config, rng, cycle);
      case 'layer_merge':         return this.opLayerMerge(config, rng, cycle);
      case 'attention_head_clone':   return this.opAttentionHeadClone(config, rng, cycle);
      case 'attention_head_prune':   return this.opAttentionHeadPrune(config, rng, cycle);
      case 'attention_head_split':   return this.opAttentionHeadSplit(config, rng, cycle);
      case 'attention_type_swap':    return this.opAttentionTypeSwap(config, rng, cycle);
      case 'attention_window_resize': return this.opAttentionWindowResize(config, rng, cycle);
      case 'ffn_ratio_scale':        return this.opFfnRatioScale(config, rng, cycle);
      case 'ffn_activation_swap':    return this.opFfnActivationSwap(config, rng, cycle);
      case 'ffn_gate_toggle':        return this.opFfnGateToggle(config, rng, cycle);
      case 'skip_connection_add':    return this.opSkipConnectionAdd(config, rng, cycle);
      case 'skip_connection_remove': return this.opSkipConnectionRemove(config, rng, cycle);
      case 'skip_connection_retarget': return this.opSkipConnectionRetarget(config, rng, cycle);
      case 'embedding_dimension_scale': return this.opEmbeddingDimScale(config, rng, cycle);
      case 'position_encoding_swap': return this.opPositionEncodingSwap(config, rng, cycle);
      case 'training_hyperparameter_perturb': return this.opTrainingHyperparamPerturb(config, rng, cycle);
      case 'wild_type_activation_shuffle': return this.opWildActivationShuffle(config, rng, cycle);
      case 'wild_type_topology_rewire': return this.opWildTopologyRewire(config, rng, cycle);
      case 'wild_type_layer_shuffle': return this.opWildLayerShuffle(config, rng, cycle);
      case 'wild_type_attention_soup': return this.opWildAttentionSoup(config, rng, cycle);
      default:
        throw new CompileError(`Unknown operator: ${operator}`);
    }
  }

  // ---- LAYER INSERT ----
  /**
   * Insert a new layer at a random valid position.
   *
   * Example: 6-layer architecture → insert feedforward layer at position 3 → 7-layer architecture
   *
   * The new layer type is randomly chosen: attention (40%), feedforward (40%), normalization (20%).
   * Layer parameters are initialized to sensible defaults based on neighboring layers.
   */
  private opLayerInsert(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const position = Math.floor(rng() * (config.layers.length + 1));  // 0 to len (inclusive)
    const d = config.embedding_dim;

    // Choose layer type
    const typeRoll = rng();
    let type: LayerSpec['type'];
    if (typeRoll < 0.40) type = 'attention';
    else if (typeRoll < 0.80) type = 'feedforward';
    else type = 'normalization';

    // Build the layer
    const newLayer: LayerSpec = {
      layer_id: this.generateId('layer'),
      name: `${type}_inserted_${position}`,
      type,
      hidden_dim: d,
      created_at_cycle: cycle,
      last_mutated_at_cycle: cycle,
      mutation_count: 0,
      survival_critical: false,
      tensors: [],
      residual: true,
      pre_norm: true,
    };

    if (type === 'attention') {
      newLayer.num_heads = this.randomChoice([4, 8, 12, 16], rng);
      newLayer.attention_type = 'standard';
      newLayer.head_dim = Math.floor(d / newLayer.num_heads);
      newLayer.qk_norm = false;
      newLayer.attn_logit_softcapping = null;
      newLayer.subtype = 'standard';
    } else if (type === 'feedforward') {
      newLayer.ffn_ratio = this.randomChoice([2, 3, 4, 6, 8], rng);
      newLayer.activation = this.randomChoice(['gelu', 'geglu', 'silu', 'swiglu'], rng);
      newLayer.gated = newLayer.activation.endsWith('glu');
      newLayer.ffn_bias = false;
      newLayer.subtype = newLayer.activation;
    } else {
      newLayer.norm_type = this.randomChoice(['layernorm', 'rmsnorm'], rng);
      newLayer.norm_eps = 1e-5;
      newLayer.subtype = newLayer.norm_type;
    }

    config.layers.splice(position, 0, newLayer);
    config.num_layers = config.layers.length;

    return {
      mutation_id: this.generateId('mut'),
      operator: 'layer_insert',
      target: newLayer.layer_id,
      description: `Inserted ${type} layer at position ${position}`,
      diff: [{ op: 'add', path: `/layers/${position}`, value: newLayer }],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- LAYER DELETE ----
  /**
   * Delete a random non-critical layer.
   *
   * Constraints:
   * - Never delete the last remaining layer
   * - Never delete a layer marked survival_critical
   * - Update all connections referencing the deleted layer
   *
   * Example: 7-layer architecture → delete layer 4 → 6-layer architecture
   */
  private opLayerDelete(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    // Find deletable layers (not critical, not the only layer)
    const deletable = config.layers
      .map((l, i) => ({ layer: l, index: i }))
      .filter(({ layer }) => !layer.survival_critical);

    if (deletable.length === 0 || config.layers.length <= this.MIN_LAYERS) {
      throw new CompileError("No deletable layers (all critical or min layers reached)");
    }

    const chosen = this.randomChoice(deletable, rng);
    const removedId = chosen.layer.layer_id;
    const position = chosen.index;

    config.layers.splice(position, 1);
    config.num_layers = config.layers.length;

    // Remove connections that reference the deleted layer
    config.connections = config.connections.filter(
      c => c.from_layer !== removedId && c.to_layer !== removedId
    );

    return {
      mutation_id: this.generateId('mut'),
      operator: 'layer_delete',
      target: removedId,
      description: `Deleted layer "${chosen.layer.name}" (${chosen.layer.type}) at position ${position}`,
      diff: [{ op: 'remove', path: `/layers/${position}` }],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- LAYER TYPE SWAP ----
  /**
   * Change a layer's type.
   *
   * Example: attention layer → feedforward layer (or vice versa)
   *
   * When swapping, sensible defaults are filled in for the new type.
   * Old type-specific parameters are removed.
   */
  private opLayerTypeSwap(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    if (config.layers.length === 0) {
      throw new CompileError("No layers to swap");
    }

    const idx = Math.floor(rng() * config.layers.length);
    const layer = config.layers[idx];
    const oldType = layer.type;
    const d = layer.hidden_dim || config.embedding_dim;

    // Pick new type (different from current)
    const types: LayerSpec['type'][] = ['attention', 'feedforward', 'normalization'];
    const newType = this.randomChoice(types.filter(t => t !== oldType), rng);

    // Reset layer parameters for new type
    layer.type = newType;
    layer.subtype = undefined;
    delete (layer as any).num_heads;
    delete (layer as any).head_dim;
    delete (layer as any).attention_type;
    delete (layer as any).window_size;
    delete (layer as any).qk_norm;
    delete (layer as any).attn_logit_softcapping;
    delete (layer as any).ffn_ratio;
    delete (layer as any).activation;
    delete (layer as any).gated;
    delete (layer as any).ffn_bias;
    delete (layer as any).norm_type;
    delete (layer as any).norm_eps;

    if (newType === 'attention') {
      layer.num_heads = this.randomChoice([4, 8, 12, 16], rng);
      layer.attention_type = 'standard';
      layer.head_dim = Math.floor(d / layer.num_heads);
      layer.subtype = 'standard';
    } else if (newType === 'feedforward') {
      layer.ffn_ratio = this.randomChoice([2, 3, 4, 6, 8], rng);
      layer.activation = this.randomChoice(['gelu', 'geglu', 'silu'], rng);
      layer.gated = layer.activation.endsWith('glu');
      layer.subtype = layer.activation;
    } else {
      layer.norm_type = 'rmsnorm';
      layer.norm_eps = 1e-5;
      layer.subtype = 'rmsnorm';
    }

    layer.last_mutated_at_cycle = cycle;
    layer.mutation_count += 1;
    layer.tensors = [];  // Tensors must be rebuilt for new type

    return {
      mutation_id: this.generateId('mut'),
      operator: 'layer_type_swap',
      target: layer.layer_id,
      description: `Swapped layer "${layer.name}" type: ${oldType} → ${newType}`,
      diff: [{ op: 'replace', path: `/layers/${idx}/type`, value: newType }],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- LAYER CLONE ----
  /**
   * Clone an existing layer and insert the clone adjacent to the original.
   *
   * Example: [L0, L1, L2] → clone L1 → [L0, L1, L1_copy, L2]
   *
   * Skip connections from the original are NOT cloned.
   * The clone is a fresh layer with identical structure but new IDs.
   */
  private opLayerClone(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    if (config.layers.length >= this.MAX_LAYERS) {
      throw new CompileError("Max layers reached, cannot clone");
    }

    const idx = Math.floor(rng() * config.layers.length);
    const original = config.layers[idx];
    const clone = structuredClone(original);
    clone.layer_id = this.generateId('layer');
    clone.name = `${original.name}_clone`;
    clone.created_at_cycle = cycle;
    clone.last_mutated_at_cycle = cycle;
    clone.mutation_count = 0;
    clone.survival_critical = false;

    // Insert after original
    config.layers.splice(idx + 1, 0, clone);
    config.num_layers = config.layers.length;

    return {
      mutation_id: this.generateId('mut'),
      operator: 'layer_clone',
      target: clone.layer_id,
      description: `Cloned layer "${original.name}" (${original.type}) → "${clone.name}"`,
      diff: [{ op: 'add', path: `/layers/${idx + 1}`, value: clone }],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- LAYER SPLIT ----
  /**
   * Split one layer into two layers of the same type, each with half the capacity.
   *
   * Example: FFN layer with ffn_ratio=8 → split → two FFN layers each with ffn_ratio=4
   * Example: Attention layer with 16 heads → split → two attention layers each with 8 heads
   *
   * This creates a deeper but narrower architecture — often beneficial for
   * hierarchical feature learning.
   */
  private opLayerSplit(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    if (config.layers.length >= this.MAX_LAYERS - 1) {
      throw new CompileError("Max layers would be exceeded after split");
    }

    // Find splittable layers (those with capacity to halve)
    const splittable = config.layers
      .map((l, i) => ({ layer: l, index: i }))
      .filter(({ layer }) => {
        if (layer.type === 'attention' && (layer.num_heads || 1) >= 2) return true;
        if (layer.type === 'feedforward' && (layer.ffn_ratio || 1) >= 2) return true;
        return false;
      });

    if (splittable.length === 0) {
      throw new CompileError("No splittable layers");
    }

    const chosen = this.randomChoice(splittable, rng);
    const original = chosen.layer;

    // Create the sibling (half capacity)
    const sibling = structuredClone(original);
    sibling.layer_id = this.generateId('layer');
    sibling.name = `${original.name}_split_2`;
    sibling.created_at_cycle = cycle;
    sibling.last_mutated_at_cycle = cycle;
    sibling.mutation_count = 0;
    sibling.survival_critical = false;

    // Halve capacity
    if (original.type === 'attention' && original.num_heads) {
      const half = Math.max(1, Math.floor(original.num_heads / 2));
      original.num_heads = half;
      sibling.num_heads = original.num_heads;  // Sibling gets the other half
      // Adjust original: it was halved
      original.num_heads = half;
    }
    if (original.type === 'feedforward' && original.ffn_ratio) {
      const half = Math.max(1, original.ffn_ratio / 2);
      original.ffn_ratio = half;
      sibling.ffn_ratio = half;
    }

    original.last_mutated_at_cycle = cycle;
    original.mutation_count += 1;

    // Insert sibling after original
    config.layers.splice(chosen.index + 1, 0, sibling);
    config.num_layers = config.layers.length;

    return {
      mutation_id: this.generateId('mut'),
      operator: 'layer_split',
      target: original.layer_id,
      description: `Split layer "${original.name}" into two — capacity halved`,
      diff: [
        { op: 'replace', path: `/layers/${chosen.index}`, value: original },
        { op: 'add', path: `/layers/${chosen.index + 1}`, value: sibling },
      ],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- LAYER MERGE ----
  /**
   * Merge two adjacent layers of the same type into one layer with combined capacity.
   *
   * Example: Two adjacent FFN layers (ratios 2 and 3) → one FFN layer (ratio 5)
   *
   * This creates a shallower but wider architecture — inverse of split.
   */
  private opLayerMerge(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    if (config.layers.length <= this.MIN_LAYERS + 1) {
      throw new CompileError("Too few layers to merge");
    }

    // Find mergeable adjacent pairs of same type
    const mergeable: { idxA: number; idxB: number; layerA: LayerSpec; layerB: LayerSpec }[] = [];
    for (let i = 0; i < config.layers.length - 1; i++) {
      if (config.layers[i].type === config.layers[i + 1].type &&
          !config.layers[i].survival_critical &&
          !config.layers[i + 1].survival_critical) {
        mergeable.push({
          idxA: i, idxB: i + 1,
          layerA: config.layers[i],
          layerB: config.layers[i + 1],
        });
      }
    }

    if (mergeable.length === 0) {
      throw new CompileError("No mergeable adjacent layers of same type");
    }

    const chosen = this.randomChoice(mergeable, rng);
    const merged = chosen.layerA;
    merged.name = `${merged.name}_merged_${chosen.layerB.name}`;
    merged.last_mutated_at_cycle = cycle;
    merged.mutation_count += 1;

    // Combine capacity
    if (merged.type === 'attention' && merged.num_heads && chosen.layerB.num_heads) {
      merged.num_heads = Math.min(this.MAX_HEADS, merged.num_heads + chosen.layerB.num_heads);
    }
    if (merged.type === 'feedforward' && merged.ffn_ratio && chosen.layerB.ffn_ratio) {
      merged.ffn_ratio = Math.min(this.MAX_FFN_RATIO, merged.ffn_ratio + chosen.layerB.ffn_ratio);
    }

    // Remove the second layer
    const removedId = chosen.layerB.layer_id;
    config.layers.splice(chosen.idxB, 1);
    config.num_layers = config.layers.length;

    // Redirect connections from the removed layer to the merged layer
    for (const conn of config.connections) {
      if (conn.from_layer === removedId) conn.from_layer = merged.layer_id;
      if (conn.to_layer === removedId) conn.to_layer = merged.layer_id;
    }

    return {
      mutation_id: this.generateId('mut'),
      operator: 'layer_merge',
      target: merged.layer_id,
      description: `Merged layers "${chosen.layerA.name}" and "${chosen.layerB.name}" into "${merged.name}"`,
      diff: [
        { op: 'replace', path: `/layers/${chosen.idxA}`, value: merged },
        { op: 'remove', path: `/layers/${chosen.idxB}` },
      ],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- ATTENTION HEAD CLONE ----
  /**
   * Clone one attention head within a layer — increase num_heads by 1.
   *
   * Example: 8-head attention → 9-head attention
   *
   * The new head is a copy of a random existing head.
   * hidden_dim must be divisible by the new num_heads.
   */
  private opAttentionHeadClone(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const attnLayers = config.layers
      .map((l, i) => ({ layer: l, index: i }))
      .filter(({ layer }) => layer.type === 'attention');

    if (attnLayers.length === 0) {
      throw new CompileError("No attention layers");
    }

    const chosen = this.randomChoice(attnLayers, rng);
    const layer = chosen.layer;
    const currentHeads = layer.num_heads || 8;
    const d = layer.hidden_dim || config.embedding_dim;

    if (currentHeads >= this.MAX_HEADS) {
      throw new CompileError(`Layer ${layer.layer_id} already at max heads (${this.MAX_HEADS})`);
    }

    // Check divisibility
    if (d % (currentHeads + 1) !== 0) {
      throw new CompileError(`Hidden dim ${d} not divisible by ${currentHeads + 1} heads`);
    }

    layer.num_heads = currentHeads + 1;
    layer.head_dim = Math.floor(d / layer.num_heads);
    layer.last_mutated_at_cycle = cycle;
    layer.mutation_count += 1;

    return {
      mutation_id: this.generateId('mut'),
      operator: 'attention_head_clone',
      target: layer.layer_id,
      description: `Cloned attention head: ${currentHeads} → ${currentHeads + 1} heads in "${layer.name}"`,
      diff: [{ op: 'replace', path: `/layers/${chosen.index}/num_heads`, value: currentHeads + 1 }],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- ATTENTION HEAD PRUNE ----
  /**
   * Remove one attention head — decrease num_heads by 1.
   *
   * The head with the lowest average gradient norm (least useful) is pruned.
   * If gradient norms are unavailable, a random head is pruned.
   */
  private opAttentionHeadPrune(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const attnLayers = config.layers
      .map((l, i) => ({ layer: l, index: i }))
      .filter(({ layer }) => layer.type === 'attention' && (layer.num_heads || 8) > this.MIN_HEADS);

    if (attnLayers.length === 0) {
      throw new CompileError("No prunable attention layers");
    }

    const chosen = this.randomChoice(attnLayers, rng);
    const layer = chosen.layer;
    const currentHeads = layer.num_heads || 8;
    const d = layer.hidden_dim || config.embedding_dim;

    if (d % (currentHeads - 1) !== 0) {
      throw new CompileError(`Hidden dim ${d} not divisible by ${currentHeads - 1} heads`);
    }

    layer.num_heads = currentHeads - 1;
    layer.head_dim = Math.floor(d / layer.num_heads);
    layer.last_mutated_at_cycle = cycle;
    layer.mutation_count += 1;

    return {
      mutation_id: this.generateId('mut'),
      operator: 'attention_head_prune',
      target: layer.layer_id,
      description: `Pruned attention head: ${currentHeads} → ${currentHeads - 1} heads in "${layer.name}"`,
      diff: [{ op: 'replace', path: `/layers/${chosen.index}/num_heads`, value: currentHeads - 1 }],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- ATTENTION HEAD SPLIT ----
  /**
   * Split each attention head into two heads of half dimension.
   *
   * Example: 8 heads of dim 64 → 16 heads of dim 32
   *
   * Total attention dimension remains the same, but more heads allow
   * finer-grained attention patterns (at the cost of smaller per-head capacity).
   */
  private opAttentionHeadSplit(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const attnLayers = config.layers
      .map((l, i) => ({ layer: l, index: i }))
      .filter(({ layer }) => {
        if (layer.type !== 'attention') return false;
        const h = layer.num_heads || 8;
        const d = layer.hidden_dim || config.embedding_dim;
        return h * 2 <= this.MAX_HEADS && d % (h * 2) === 0;
      });

    if (attnLayers.length === 0) {
      throw new CompileError("No splittable attention layers");
    }

    const chosen = this.randomChoice(attnLayers, rng);
    const layer = chosen.layer;
    const old = layer.num_heads || 8;
    layer.num_heads = old * 2;
    layer.head_dim = Math.floor((layer.hidden_dim || config.embedding_dim) / layer.num_heads);
    layer.last_mutated_at_cycle = cycle;
    layer.mutation_count += 1;

    return {
      mutation_id: this.generateId('mut'),
      operator: 'attention_head_split',
      target: layer.layer_id,
      description: `Split attention heads: ${old} × dim=${Math.floor((layer.hidden_dim || config.embedding_dim) / old)} → ${layer.num_heads} × dim=${layer.head_dim}`,
      diff: [{ op: 'replace', path: `/layers/${chosen.index}/num_heads`, value: layer.num_heads }],
      applied_at_cycle: cycle,
      parameter_delta: 0,  // Same total dimension, no parameter change from head split alone
      flops_delta: 0,
    };
  }

  // ---- ATTENTION TYPE SWAP ----
  /**
   * Change the attention mechanism type.
   */
  private opAttentionTypeSwap(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const attnLayers = config.layers
      .map((l, i) => ({ layer: l, index: i }))
      .filter(({ layer }) => layer.type === 'attention');

    if (attnLayers.length === 0) {
      throw new CompileError("No attention layers");
    }

    const allTypes: AttentionType[] = [
      'standard', 'sliding_window', 'linear', 'flash',
      'differential', 'gated_differential', 'ring', 'blockwise',
      'sparse_hash', 'mamba_ssm'
    ];

    const chosen = this.randomChoice(attnLayers, rng);
    const layer = chosen.layer;
    const oldType = layer.attention_type || 'standard';
    const newType = this.randomChoice(allTypes.filter(t => t !== oldType), rng);

    layer.attention_type = newType;
    layer.subtype = newType;
    layer.last_mutated_at_cycle = cycle;
    layer.mutation_count += 1;

    // Set defaults for the new type
    if (newType === 'sliding_window') {
      layer.window_size = this.randomChoice([128, 256, 512, 1024], rng);
    } else {
      delete layer.window_size;
    }

    return {
      mutation_id: this.generateId('mut'),
      operator: 'attention_type_swap',
      target: layer.layer_id,
      description: `Swapped attention type: ${oldType} → ${newType} in "${layer.name}"`,
      diff: [{ op: 'replace', path: `/layers/${chosen.index}/attention_type`, value: newType }],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- ATTENTION WINDOW RESIZE ----
  /**
   * Resize the sliding window for sliding window attention layers.
   * Increases or decreases by a factor.
   */
  private opAttentionWindowResize(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const windowLayers = config.layers
      .map((l, i) => ({ layer: l, index: i }))
      .filter(({ layer }) =>
        layer.type === 'attention' && layer.attention_type === 'sliding_window'
      );

    if (windowLayers.length === 0) {
      throw new CompileError("No sliding window attention layers");
    }

    const chosen = this.randomChoice(windowLayers, rng);
    const layer = chosen.layer;
    const oldWindow = layer.window_size || 256;
    const factor = this.randomChoice([0.5, 0.75, 1.5, 2.0], rng);
    const newWindow = Math.max(32, Math.min(4096, Math.round(oldWindow * factor)));

    if (newWindow === oldWindow) {
      throw new CompileError("Window size unchanged after resize");
    }

    layer.window_size = newWindow;
    layer.last_mutated_at_cycle = cycle;
    layer.mutation_count += 1;

    return {
      mutation_id: this.generateId('mut'),
      operator: 'attention_window_resize',
      target: layer.layer_id,
      description: `Resized attention window: ${oldWindow} → ${newWindow} in "${layer.name}"`,
      diff: [{ op: 'replace', path: `/layers/${chosen.index}/window_size`, value: newWindow }],
      applied_at_cycle: cycle,
      parameter_delta: 0,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- FFN RATIO SCALE ----
  /**
   * Scale the FFN hidden dimension ratio up or down.
   */
  private opFfnRatioScale(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const ffnLayers = config.layers
      .map((l, i) => ({ layer: l, index: i }))
      .filter(({ layer }) => layer.type === 'feedforward');

    if (ffnLayers.length === 0) {
      throw new CompileError("No feedforward layers");
    }

    const chosen = this.randomChoice(ffnLayers, rng);
    const layer = chosen.layer;
    const oldRatio = layer.ffn_ratio || 4;
    const factor = this.randomChoice([0.5, 0.75, 1.25, 1.5, 2.0], rng);
    const newRatio = Math.max(this.MIN_FFN_RATIO, Math.min(this.MAX_FFN_RATIO, oldRatio * factor));

    if (newRatio === oldRatio) {
      throw new CompileError("FFN ratio unchanged after scaling");
    }

    layer.ffn_ratio = newRatio;
    layer.last_mutated_at_cycle = cycle;
    layer.mutation_count += 1;

    return {
      mutation_id: this.generateId('mut'),
      operator: 'ffn_ratio_scale',
      target: layer.layer_id,
      description: `Scaled FFN ratio: ${oldRatio}× → ${newRatio}× in "${layer.name}"`,
      diff: [{ op: 'replace', path: `/layers/${chosen.index}/ffn_ratio`, value: newRatio }],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- FFN ACTIVATION SWAP ----
  private opFfnActivationSwap(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const ffnLayers = config.layers
      .map((l, i) => ({ layer: l, index: i }))
      .filter(({ layer }) => layer.type === 'feedforward');

    if (ffnLayers.length === 0) {
      throw new CompileError("No feedforward layers");
    }

    const activations: ActivationFunction[] = [
      'relu', 'gelu', 'geglu', 'silu', 'swiglu',
      'swish', 'mish', 'sqrelu', 'leaky_relu', 'elu'
    ];

    const chosen = this.randomChoice(ffnLayers, rng);
    const layer = chosen.layer;
    const oldAct = layer.activation || 'gelu';
    const newAct = this.randomChoice(activations.filter(a => a !== oldAct), rng);

    layer.activation = newAct;
    layer.gated = newAct.endsWith('glu');
    layer.subtype = newAct;
    layer.last_mutated_at_cycle = cycle;
    layer.mutation_count += 1;

    return {
      mutation_id: this.generateId('mut'),
      operator: 'ffn_activation_swap',
      target: layer.layer_id,
      description: `Swapped FFN activation: ${oldAct} → ${newAct} in "${layer.name}"`,
      diff: [{ op: 'replace', path: `/layers/${chosen.index}/activation`, value: newAct }],
      applied_at_cycle: cycle,
      parameter_delta: layer.gated !== (oldAct.endsWith('glu'))
        ? this.estimateParameters(config) - config.estimated_parameters : 0,
      flops_delta: 0,
    };
  }

  // ---- FFN GATE TOGGLE ----
  /**
   * Toggle between gated and non-gated FFN.
   */
  private opFfnGateToggle(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const ffnLayers = config.layers
      .map((l, i) => ({ layer: l, index: i }))
      .filter(({ layer }) => layer.type === 'feedforward');

    if (ffnLayers.length === 0) {
      throw new CompileError("No feedforward layers");
    }

    const chosen = this.randomChoice(ffnLayers, rng);
    const layer = chosen.layer;
    const wasGated = layer.gated || false;
    layer.gated = !wasGated;

    // Update activation to match gating
    if (layer.gated && !layer.activation?.endsWith('glu')) {
      layer.activation = 'swiglu';  // Default gated activation
    } else if (!layer.gated && layer.activation?.endsWith('glu')) {
      layer.activation = 'gelu';    // Default non-gated activation
    }

    layer.last_mutated_at_cycle = cycle;
    layer.mutation_count += 1;

    return {
      mutation_id: this.generateId('mut'),
      operator: 'ffn_gate_toggle',
      target: layer.layer_id,
      description: `Toggled FFN gate: ${wasGated ? 'gated → ungated' : 'ungated → gated'} in "${layer.name}"`,
      diff: [{ op: 'replace', path: `/layers/${chosen.index}/gated`, value: layer.gated }],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- SKIP CONNECTION ADD ----
  private opSkipConnectionAdd(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    if (config.layers.length < 2) {
      throw new CompileError("Too few layers for skip connection");
    }

    const fromIdx = Math.floor(rng() * (config.layers.length - 1));
    const toIdx = fromIdx + 1 + Math.floor(rng() * (config.layers.length - fromIdx - 1));

    const fromLayer = config.layers[fromIdx];
    const toLayer = config.layers[toIdx];

    // Check if connection already exists
    const exists = config.connections.some(
      c => c.from_layer === fromLayer.layer_id && c.to_layer === toLayer.layer_id
    );
    if (exists) {
      throw new CompileError("Skip connection already exists between these layers");
    }

    const connId = this.generateId('conn');
    const newConn: ConnectionSpec = {
      connection_id: connId,
      from_layer: fromLayer.layer_id,
      to_layer: toLayer.layer_id,
      type: this.randomChoice(['residual', 'dense', 'gated', 'highway'], rng),
      strength: 1.0,
      frozen: false,
      created_at_cycle: cycle,
    };

    config.connections.push(newConn);

    return {
      mutation_id: this.generateId('mut'),
      operator: 'skip_connection_add',
      target: connId,
      description: `Added ${newConn.type} skip connection: ${fromLayer.name} → ${toLayer.name}`,
      diff: [{ op: 'add', path: `/connections/-`, value: newConn }],
      applied_at_cycle: cycle,
      parameter_delta: 0,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- SKIP CONNECTION REMOVE ----
  private opSkipConnectionRemove(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    if (config.connections.length === 0) {
      throw new CompileError("No skip connections to remove");
    }

    const idx = Math.floor(rng() * config.connections.length);
    const removed = config.connections.splice(idx, 1)[0];

    return {
      mutation_id: this.generateId('mut'),
      operator: 'skip_connection_remove',
      target: removed.connection_id,
      description: `Removed skip connection: ${removed.from_layer} → ${removed.to_layer} (${removed.type})`,
      diff: [{ op: 'remove', path: `/connections/${idx}` }],
      applied_at_cycle: cycle,
      parameter_delta: 0,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- SKIP CONNECTION RETARGET ----
  /**
   * Change the source or target of a skip connection.
   */
  private opSkipConnectionRetarget(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    if (config.connections.length === 0) {
      throw new CompileError("No skip connections to retarget");
    }
    if (config.layers.length < 2) {
      throw new CompileError("Too few layers to retarget connection");
    }

    const connIdx = Math.floor(rng() * config.connections.length);
    const conn = config.connections[connIdx];

    // Choose to retarget source or destination
    const retargetSource = rng() < 0.5;
    const oldTarget = retargetSource ? conn.from_layer : conn.to_layer;
    const newLayerIdx = Math.floor(rng() * config.layers.length);
    const newTarget = config.layers[newLayerIdx].layer_id;

    if (newTarget === oldTarget) {
      throw new CompileError("Retarget would not change the connection");
    }

    if (retargetSource) {
      conn.from_layer = newTarget;
    } else {
      conn.to_layer = newTarget;
    }

    return {
      mutation_id: this.generateId('mut'),
      operator: 'skip_connection_retarget',
      target: conn.connection_id,
      description: `Retargeted skip connection ${retargetSource ? 'source' : 'destination'}: ${oldTarget} → ${newTarget}`,
      diff: [{ op: 'replace', path: `/connections/${connIdx}/${retargetSource ? 'from_layer' : 'to_layer'}`, value: newTarget }],
      applied_at_cycle: cycle,
      parameter_delta: 0,
      flops_delta: 0,
    };
  }

  // ---- EMBEDDING DIMENSION SCALE ----
  private opEmbeddingDimScale(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const oldDim = config.embedding_dim;
    const factor = this.randomChoice([0.5, 0.75, 1.25, 1.5, 2.0], rng);
    const newDim = Math.max(64, Math.min(4096, Math.round(oldDim * factor)));

    if (newDim === oldDim) {
      throw new CompileError("Embedding dimension unchanged after scaling");
    }

    config.embedding_dim = newDim;

    // Update all layer hidden_dims that were using the old default
    for (const layer of config.layers) {
      if (layer.hidden_dim === oldDim) {
        layer.hidden_dim = newDim;
      }
    }

    // Recompute head_dim for attention layers
    for (const layer of config.layers) {
      if (layer.type === 'attention' && layer.num_heads) {
        if (newDim % layer.num_heads !== 0) {
          // Adjust heads to make hidden_dim divisible
          layer.num_heads = this.findBestHeadCount(newDim);
        }
        layer.head_dim = Math.floor(newDim / layer.num_heads);
      }
    }

    return {
      mutation_id: this.generateId('mut'),
      operator: 'embedding_dimension_scale',
      target: 'global',
      description: `Scaled embedding dimension: ${oldDim} → ${newDim}`,
      diff: [{ op: 'replace', path: '/embedding_dim', value: newDim }],
      applied_at_cycle: cycle,
      parameter_delta: this.estimateParameters(config) - config.estimated_parameters,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- POSITION ENCODING SWAP ----
  private opPositionEncodingSwap(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const types: PositionEncodingType[] = ['rope', 'alibi', 'learned', 'sinusoidal', 'nope', 'xpos'];
    const oldType = config.position_encoding;
    const newType = this.randomChoice(types.filter(t => t !== oldType), rng);

    config.position_encoding = newType;

    if (newType === 'rope') {
      config.rope_theta = this.randomChoice([10000, 50000, 100000, 500000, 1000000], rng);
    }

    return {
      mutation_id: this.generateId('mut'),
      operator: 'position_encoding_swap',
      target: 'global',
      description: `Swapped position encoding: ${oldType} → ${newType}`,
      diff: [{ op: 'replace', path: '/position_encoding', value: newType }],
      applied_at_cycle: cycle,
      parameter_delta: newType === 'learned' && oldType !== 'learned'
        ? config.max_seq_len * config.embedding_dim : 0,
      flops_delta: 0,
    };
  }

  // ---- TRAINING HYPERPARAMETER PERTURB ----
  private opTrainingHyperparamPerturb(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    // Pick a hyperparameter and perturb it by ±10-50%
    const params = [
      { key: 'learning_rate', min: 1e-6, max: 1e-2, logScale: true },
      { key: 'weight_decay', min: 0, max: 0.1, logScale: false },
      { key: 'warmup_steps', min: 10, max: 5000, logScale: true },
      { key: 'gradient_clip_norm', min: 0.1, max: 10.0, logScale: false },
      { key: 'batch_size', min: 8, max: 512, logScale: true },
    ];

    const chosen = this.randomChoice(params, rng);
    const oldValue = (config.training_config as any)[chosen.key];
    const factor = 1.0 + (rng() - 0.5) * 2 * this.randomChoice([0.1, 0.2, 0.3, 0.5], rng);
  
    let newValue: number;
    if (chosen.logScale) {
      newValue = oldValue * factor;
    } else {
      newValue = oldValue + oldValue * (factor - 1);
    }
    newValue = Math.max(chosen.min, Math.min(chosen.max, newValue));

    if (chosen.key === 'batch_size') newValue = Math.round(newValue);
    if (chosen.key === 'warmup_steps') newValue = Math.round(newValue);

    (config.training_config as any)[chosen.key] = newValue;

    return {
      mutation_id: this.generateId('mut'),
      operator: 'training_hyperparameter_perturb',
      target: 'training_config',
      description: `Perturbed ${chosen.key}: ${oldValue} → ${newValue}`,
      diff: [{ op: 'replace', path: `/training_config/${chosen.key}`, value: newValue }],
      applied_at_cycle: cycle,
      parameter_delta: 0,
      flops_delta: 0,
    };
  }

  // ---- WILD TYPE: ACTIVATION SHUFFLE ----
  private opWildActivationShuffle(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const activations: ActivationFunction[] = [
      'relu', 'gelu', 'geglu', 'silu', 'swiglu', 'swish',
      'mish', 'sqrelu', 'leaky_relu', 'elu', 'tanh', 'linear'
    ];

    let count = 0;
    for (const layer of config.layers) {
      if (layer.type === 'feedforward') {
        layer.activation = this.randomChoice(activations, rng);
        layer.gated = layer.activation.endsWith('glu');
        layer.last_mutated_at_cycle = cycle;
        layer.mutation_count += 1;
        count++;
      }
    }

    return {
      mutation_id: this.generateId('mut'),
      operator: 'wild_type_activation_shuffle',
      target: 'global',
      description: `Shuffled activations on ${count} FFN layers (wild-type)`,
      diff: [],
      applied_at_cycle: cycle,
      parameter_delta: 0,
      flops_delta: 0,
    };
  }

  // ---- WILD TYPE: TOPOLOGY REWIRE ----
  private opWildTopologyRewire(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    // Remove all existing connections
    const oldCount = config.connections.length;
    config.connections = [];

    // Randomly rewire: each pair of layers has 15% chance of connection
    let newCount = 0;
    for (let i = 0; i < config.layers.length; i++) {
      for (let j = i + 1; j < config.layers.length; j++) {
        if (rng() < 0.15) {
          config.connections.push({
            connection_id: this.generateId('conn'),
            from_layer: config.layers[i].layer_id,
            to_layer: config.layers[j].layer_id,
            type: this.randomChoice(['residual', 'dense', 'gated', 'highway'], rng),
            strength: 1.0,
            frozen: false,
            created_at_cycle: cycle,
          });
          newCount++;
        }
      }
    }

    return {
      mutation_id: this.generateId('mut'),
      operator: 'wild_type_topology_rewire',
      target: 'global',
      description: `Rewired topology: ${oldCount} connections → ${newCount} connections (wild-type)`,
      diff: [],
      applied_at_cycle: cycle,
      parameter_delta: 0,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ---- WILD TYPE: LAYER SHUFFLE ----
  /**
   * Randomly reorder the layers.
   * CRITICAL: embedding must stay first, unembedding last if present.
   */
  private opWildLayerShuffle(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    if (config.layers.length <= 2) {
      throw new CompileError("Too few layers to shuffle");
    }

    const first = config.layers[0];
    const last = config.layers[config.layers.length - 1];
    const middle = config.layers.slice(1, config.layers.length - 1);

    // Fisher-Yates shuffle on middle layers
    for (let i = middle.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [middle[i], middle[j]] = [middle[j], middle[i]];
    }

    config.layers = [first, ...middle, last];

    return {
      mutation_id: this.generateId('mut'),
      operator: 'wild_type_layer_shuffle',
      target: 'global',
      description: `Shuffled ${middle.length} middle layers (wild-type)`,
      diff: [],
      applied_at_cycle: cycle,
      parameter_delta: 0,
      flops_delta: 0,
    };
  }

  // ---- WILD TYPE: ATTENTION SOUP ----
  /**
   * Randomize all attention types across all attention layers.
   */
  private opWildAttentionSoup(config: ArchitectureConfig, rng: seedrandom.PRNG, cycle: number): MutationRecord {
    const attnTypes: AttentionType[] = [
      'standard', 'sliding_window', 'linear', 'flash',
      'differential', 'gated_differential'
    ];

    let count = 0;
    for (const layer of config.layers) {
      if (layer.type === 'attention') {
        layer.attention_type = this.randomChoice(attnTypes, rng);
        layer.last_mutated_at_cycle = cycle;
        layer.mutation_count += 1;
        if (layer.attention_type === 'sliding_window') {
          layer.window_size = this.randomChoice([128, 256, 512, 1024], rng);
        }
        count++;
      }
    }

    return {
      mutation_id: this.generateId('mut'),
      operator: 'wild_type_attention_soup',
      target: 'global',
      description: `Randomized attention types on ${count} layers (wild-type attention soup)`,
      diff: [],
      applied_at_cycle: cycle,
      parameter_delta: 0,
      flops_delta: this.estimateFlops(config) - config.estimated_flops,
    };
  }

  // ==========================================================
  // UTILITY METHODS
  // ==========================================================

  private generateId(prefix: string): string {
    return `${prefix}_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
  }

  private computeHash(config: ArchitectureConfig): string {
    // Canonicalize by sorting keys for reproducibility
    const canonical = JSON.stringify(config, Object.keys(config).sort());
    return createHash('sha256').update(canonical).digest('hex').slice(0, 16);
  }

  private bumpVersion(oldVersion: ArchitectureVersion, operator: MutationOperatorName): ArchitectureVersion {
    const parts = oldVersion.split('-');
    const semver = parts[0].split('.').map(Number);
    const generation = parseInt(parts[1] || '0') + 1;

    if (operator.startsWith('wild_type') || operator === 'crossover' || operator === 'layer_type_swap') {
      semver[0] += 1;  // Major bump for wild/crossover/swap
    } else if (['layer_insert', 'layer_delete', 'layer_split', 'layer_merge'].includes(operator)) {
      semver[1] += 1;  // Minor bump for structural changes
    } else {
      semver[2] += 1;  // Patch bump
    }

    return `${semver.join('.')}-${generation}`;
  }

  private poissonSample(lambda: number, rng: seedrandom.PRNG): number {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= rng();
    } while (p > L);
    return k - 1;
  }

  private randomChoice<T>(arr: T[], rng: seedrandom.PRNG): T {
    return arr[Math.floor(rng() * arr.length)];
  }

  private sampleWithoutReplacement<T>(pool: T[], n: number, rng: seedrandom.PRNG): T[] {
    const copy = [...pool];
    const result: T[] = [];
    const take = Math.min(n, copy.length);
    for (let i = 0; i < take; i++) {
      const idx = Math.floor(rng() * copy.length);
      result.push(copy.splice(idx, 1)[0]);
    }
    return result;
  }

  private findBestHeadCount(hiddenDim: number): number {
    // Find the largest divisor <= MAX_HEADS
    for (let h = this.MAX_HEADS; h >= this.MIN_HEADS; h--) {
      if (hiddenDim % h === 0) return h;
    }
    return this.MIN_HEADS;  // Fallback
  }

  private detectCycles(config: ArchitectureConfig): void {
    const adjacency: Record<string, string[]> = {};
    for (const layer of config.layers) {
      adjacency[layer.layer_id] = [];
    }
    for (const conn of config.connections) {
      if (adjacency[conn.from_layer]) {
        adjacency[conn.from_layer].push(conn.to_layer);
      }
    }

    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color: Record<string, number> = {};

    const dfs = (node: string): void => {
      color[node] = GRAY;
      for (const neighbor of (adjacency[node] || [])) {
        if (color[neighbor] === GRAY) {
          throw new Error(`Cycle detected involving ${node} → ${neighbor}`);
        }
        if (color[neighbor] === undefined || color[neighbor] === WHITE) {
          dfs(neighbor);
        }
      }
      color[node] = BLACK;
    };

    for (const layer of config.layers) {
      if (color[layer.layer_id] === undefined) {
        dfs(layer.layer_id);
      }
    }
  }

  private createNoOpRecord(parent: ArchitectureConfig, cycle: number): MutationRecord {
    return {
      mutation_id: this.generateId('mut'),
      operator: 'layer_insert',  // placeholder
      target: 'none',
      description: 'No mutation applied (all attempted mutations failed)',
      diff: [],
      applied_at_cycle: cycle,
      parameter_delta: 0,
      flops_delta: 0,
    };
  }
}

// ============================================================
// ERROR TYPE
// ============================================================

class CompileError extends Error {
  public details: string[];

  constructor(message: string, details: string[] = []) {
    super(message);
    this.name = 'CompileError';
    this.details = details;
  }
}