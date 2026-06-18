// ============================================================
// FILE: ['Substrate Darwinism Compiler'(-ing) BPMS] (architecture) (Presettings).ts
// The complete type definition for a mutable neural architecture.
// This is the "genome" that the Substrate Compiler mutates.
// ============================================================

/**
 * Unique identifier for any entity in the system.
 * Format: {entity_type}_{uuid_v4}_{timestamp_ms}
 * Example: "arch_a1b2c3d4_1700000000000"
 */
type EntityId = string;

/**
 * Semantic version for architecture configurations.
 * Format: MAJOR.MINOR.PATCH-GENERATION
 * MAJOR: incompatible structural change
 * MINOR: new layer or connection added
 * PATCH: hyperparameter or weight mutation only
 * GENERATION: number of mutation cycles from genesis
 * Example: "2.7.3-1847"
 */
type ArchitectureVersion = string;

/**
 * Activation function identifiers.
 * The 'variant' field allows for sub-types (e.g., gated variants).
 */
type ActivationFunction =
  | "relu"
  | "gelu"
  | "geglu"        // Gated GELU: gate * GELU(x)
  | "silu"
  | "swiglu"       // Gated SiLU: gate * SiLU(x)
  | "swish"
  | "mish"
  | "sqrelu"       // Squared ReLU: max(0,x)^2
  | "leaky_relu"
  | "elu"
  | "tanh"
  | "sigmoid"
  | "linear";

/**
 * Attention mechanism types.
 */
type AttentionType =
  | "standard"           // Full QK^T attention, O(n^2)
  | "sliding_window"     // Local window attention, O(n*w)
  | "linear"             // Kernelized linear attention, O(n)
  | "flash"              // FlashAttention algorithm
  | "differential"       // (QK1^T - QK2^T) attention
  | "gated_differential" // sigmoid(gate) ⊙ differential attention
  | "ring"               // Ring attention for distributed long context
  | "blockwise"          // Block-parallel attention
  | "sparse_hash"        // Hash-based sparse attention
  | "mamba_ssm";         // State-space model (Mamba-style, not strictly attention)

/**
 * Normalization types.
 */
type NormalizationType =
  | "layernorm"
  | "rmsnorm"
  | "batchnorm"
  | "groupnorm"
  | "instancenorm"
  | "none";

/**
 * Position encoding types.
 */
type PositionEncodingType =
  | "rope"              // Rotary Position Embedding
  | "alibi"             // Attention with Linear Biases
  | "learned"           // Learned absolute position embeddings
  | "sinusoidal"        // Fixed sinusoidal
  | "nope"              // No position encoding
  | "xpos";             // Extrapolatable position encoding

// ============================================================
// CORE DATA STRUCTURES
// ============================================================

/**
 * A single tensor (weight matrix or bias vector) within a layer.
 * This is what weight-level mutations modify.
 */
interface TensorSpec {
  /** Unique name within the layer, e.g., "q_projection", "k_projection" */
  name: string;

  /** Shape as array of dimension sizes. [] for scalar. */
  shape: number[];

  /** Data type */
  dtype: "float32" | "float16" | "bfloat16" | "int8" | "int4";

  /** Initialization strategy */
  init: "xavier_uniform" | "xavier_normal" | "kaiming_uniform" | "kaiming_normal"
      | "zeros" | "ones" | "normal_0.02" | "orthogonal";

  /** Optional: use tied/shared weights with another tensor (e.g., embedding tying) */
  tied_to?: string;  // "layer_name.tensor_name"

  /** Whether this tensor is frozen (mutations skip it) */
  frozen: boolean;

  /** SHA256 of the initial weight values (for corruption detection) */
  integrity_hash: string;
}

/**
 * A single computational layer in the architecture.
 */
interface LayerSpec {
  /** Unique layer identifier within the architecture */
  layer_id: string;  // e.g., "encoder_2", "decoder_cross_attn"

  /** Human-readable name */
  name: string;

  /** Layer type */
  type: "embedding" | "attention" | "feedforward" | "normalization"
      | "dropout" | "conv1d" | "pooling" | "router" | "expert"
      | "gate" | "projection" | "unembedding" | "custom";

  /** Sub-type for dispatch */
  subtype?: string;  // e.g., for type="attention", subtype="sliding_window"

  // --- Attention-specific parameters ---
  /** Number of attention heads (for attention layers) */
  num_heads?: number;

  /** Size of each attention head (default: hidden_dim / num_heads) */
  head_dim?: number;

  /** Attention mechanism (for attention layers) */
  attention_type?: AttentionType;

  /** Window size for sliding window attention */
  window_size?: number;

  /** Whether to use query-key normalization */
  qk_norm?: boolean;

  /** Whether to use attention logit soft-capping */
  attn_logit_softcapping?: number | null;

  // --- Feedforward-specific parameters ---
  /** Ratio of FFN hidden dim to model dim (e.g., 4 means 4x expansion) */
  ffn_ratio?: number;

  /** Activation function in FFN */
  activation?: ActivationFunction;

  /** Whether FFN uses a gated architecture (gate_proj + up_proj + down_proj) */
  gated?: boolean;

  /** Whether FFN uses bias terms */
  ffn_bias?: boolean;

  // --- Normalization-specific ---
  norm_type?: NormalizationType;

  /** Epsilon for normalization */
  norm_eps?: number;  // default: 1e-5

  // --- General parameters ---
  /** Hidden dimension (model dimension) */
  hidden_dim?: number;

  /** Dropout probability (0.0 to 1.0) */
  dropout?: number;

  /** Whether this layer has a residual connection to its immediate predecessor */
  residual?: boolean;

  /** Multiplier for residual connection (default: 1.0) */
  residual_multiplier?: number;

  /** Whether this layer is pre-normalized (norm before, default) or post-normalized */
  pre_norm?: boolean;

  /** The tensors that compose this layer */
  tensors: TensorSpec[];

  // --- Mutation metadata ---
  /** Cycle when this layer was created */
  created_at_cycle: number;

  /** Cycle when this layer was last mutated */
  last_mutated_at_cycle: number;

  /** Total mutations applied to this layer */
  mutation_count: number;

  /** If true, mutations that remove or fundamentally alter this layer are blocked */
  survival_critical: boolean;
}

/**
 * An explicit skip/residual connection between two layers.
 */
interface ConnectionSpec {
  /** Unique connection identifier */
  connection_id: string;  // e.g., "skip_encoder_2_to_decoder_5"

  /** Source layer ID */
  from_layer: string;

  /** Target layer ID */
  to_layer: string;

  /** Connection type */
  type: "residual"       // x + F(x): additive skip
       | "dense"         // concat(x, F(x)): concatenative
       | "gated"         // gate(x) * F(x): learned gating
       | "u_net"         // U-Net style: encoder→decoder symmetric skip
       | "cross"         // Cross-attention connection
       | "highway";      // Highway network: T(x)*F(x) + (1-T(x))*x

  /** Multiplier for the connected signal (default 1.0) */
  strength: number;

  /** Optional: dimension adapter if from/to dimensions differ */
  adapter?: {
    type: "linear_projection" | "zero_pad" | "truncate" | "learned_projection";
    target_dim: number;
  };

  /** Whether this connection is frozen */
  frozen: boolean;

  /** Cycle when this connection was created */
  created_at_cycle: number;
}

/**
 * Router specification for Mixture-of-Experts architectures.
 */
interface RouterSpec {
  /** Router ID */
  router_id: string;

  /** Which layer this router belongs to */
  parent_layer_id: string;

  /** Number of experts this router dispatches to */
  num_experts: number;

  /** Number of experts selected per token (top-k routing) */
  top_k: number;

  /** Router capacity factor (tokens per expert as fraction of uniform) */
  capacity_factor: number;

  /** Whether to use auxiliary load-balancing loss */
  load_balancing_loss_weight: number;

  /** Whether to use router z-loss for training stability */
  router_z_loss_weight: number;

  /** Expert choice routing (expert chooses tokens) vs token choice (tokens choose experts) */
  routing_strategy: "token_choice" | "expert_choice";

  /** Expert layer specifications (each expert is a feedforward layer) */
  experts: LayerSpec[];

  /** Shared expert (always active, not routed) */
  shared_expert?: LayerSpec;
}

/**
 * Complete architecture configuration.
 * This is what the Substrate Compiler reads and writes.
 * This is the "genome" that evolves.
 */
interface ArchitectureConfig {
  /** Unique architecture identifier */
  architecture_id: EntityId;

  /** Human-assigned or auto-generated name */
  name: string;

  /** Semantic version */
  version: ArchitectureVersion;

  /** Architecture family (lineage identifier) */
  family: string;

  /** Parent architecture ID (null for seed architectures) */
  parent_id: EntityId | null;

  /** If crossover, list both parents */
  parent_ids?: [EntityId, EntityId];

  /** Generation number (0 for seed, increments each mutation cycle) */
  generation: number;

  // --- Model hyperparameters ---
  /** Vocabulary size (for language models) */
  vocab_size: number;

  /** Maximum sequence length */
  max_seq_len: number;

  /** Model dimension (hidden size) — may be overridden per layer */
  embedding_dim: number;

  /** Position encoding type */
  position_encoding: PositionEncodingType;

  /** RoPE theta base (for rotary position encoding) */
  rope_theta?: number;

  /** Whether to tie embedding and unembedding weights */
  tie_embedding_weights: boolean;

  /** Total number of layers */
  num_layers: number;

  // --- Layer specifications ---
  /** All layers in order of execution */
  layers: LayerSpec[];

  // --- Routing specifications ---
  /** MoE router configurations (empty if not MoE) */
  routers: RouterSpec[];

  // --- Connection specifications ---
  /** All explicit skip/residual/cross connections */
  connections: ConnectionSpec[];

  // --- Training configuration (evolves too!) ---
  /** Training hyperparameters that are subject to mutation */
  training_config: {
    learning_rate: number;
    lr_schedule: "cosine" | "linear" | "constant" | "warmup_cosine" | "cyclic";
    warmup_steps: number;
    weight_decay: number;
    gradient_clip_norm: number | null;
    batch_size: number;
    optimizer: "adamw" | "lion" | "sgd" | "adafactor" | "rmsprop";
    adam_beta1?: number;
    adam_beta2?: number;
    adam_epsilon?: number;
    mixed_precision: boolean;
    gradient_checkpointing: boolean;
    gradient_accumulation_steps: number;
  };

  // --- Mutation metadata ---
  /** Cycle when this architecture was compiled */
  compiled_at_cycle: number;

  /** Mutation(s) that produced this architecture from its parent */
  mutation_history: MutationRecord[];

  /** Total mutations in this lineage */
  total_mutations_in_lineage: number;

  /** SHA256 hash of the entire config (for deduplication) */
  config_hash: string;

  /** Estimated parameter count */
  estimated_parameters: number;

  /** Estimated FLOPs per forward pass */
  estimated_flops: number;

  /** Estimated peak memory (bytes) during training */
  estimated_training_memory_bytes: number;

  /** Estimated inference latency (ms) */
  estimated_latency_ms: number;
}

/**
 * Record of a single mutation applied to an architecture.
 */
interface MutationRecord {
  /** Unique mutation identifier */
  mutation_id: EntityId;

  /** Name of the mutation operator applied */
  operator: MutationOperatorName;

  /** Target of the mutation (layer_id, connection_id, or "global") */
  target: string;

  /** Human-readable description of what changed */
  description: string;

  /** Serialized diff of the change (JSON patch format, RFC 6902) */
  diff: JSONPatchOperation[];

  /** Cycle when this mutation was applied */
  applied_at_cycle: number;

  /** Whether this mutation came from a peer (federation) */
  from_peer?: EntityId;

  /** If from crossover, the other parent's ID */
  crossover_partner?: EntityId;

  /** Estimated impact on parameter count (can be negative) */
  parameter_delta: number;

  /** Estimated impact on FLOPs */
  flops_delta: number;
}

/**
 * All 20 mutation operator names.
 */
type MutationOperatorName =
  // Layer-level mutations
  | "layer_insert"
  | "layer_delete"
  | "layer_type_swap"
  | "layer_clone"
  | "layer_split"
  | "layer_merge"

  // Attention mutations
  | "attention_head_clone"
  | "attention_head_prune"
  | "attention_head_split"
  | "attention_type_swap"
  | "attention_window_resize"

  // Feedforward mutations
  | "ffn_ratio_scale"
  | "ffn_activation_swap"
  | "ffn_gate_toggle"

  // Connection mutations
  | "skip_connection_add"
  | "skip_connection_remove"
  | "skip_connection_retarget"

  // Global mutations
  | "embedding_dimension_scale"
  | "position_encoding_swap"
  | "training_hyperparameter_perturb"

  // Recombination
  | "crossover"

  // Wild-type (high-variance) mutations
  | "wild_type_activation_shuffle"
  | "wild_type_topology_rewire"
  | "wild_type_layer_shuffle"
  | "wild_type_attention_soup";

/**
 * RFC 6902 JSON Patch operation.
 */
interface JSONPatchOperation {
  op: "add" | "remove" | "replace" | "move" | "copy" | "test";
  path: string;   // JSON Pointer path, e.g., "/layers/3/num_heads"
  value?: any;    // New value for add/replace
  from?: string;  // Source path for move/copy
}