## Basic settings: ['Praxial Discovery Engine'(-ing) BPMS]

**Verification Matrix:**

- **Protocol Check:** `META-001` (Completeness), `META-006` (Canon Alignment), `META-007` (In-Chat Staging).
- **Source Material:** "Discovering state-of-the-art reinforcement learning algorithms" (Nature, 2025) - *DiscoRL*.
- **Objective:** To implement the **DiscoRL** framework as the `['Praxial Discovery Engine'(-ing) BPMS]`, empowering the system to autonomously discover, evolve, and optimize its own learning algorithms (`['algorithm(-ing) BPMS]`) rather than relying on human-designed rules.

------

#### The Axiom of Algorithmic Autopoiesis (ID: `DISCO-CORE-001`)

#### 2. Objective:

To formally `ADD` a Basic Setting (Axiom) that shifts the `['learning BPMS]` paradigm from **Manual Design** (Human-crafted loss functions) to **Autonomous Discovery** (Machine-learned rules).

#### 3. Target Axiom/Principle:

```
The Axiom of Algorithmic Autopoiesis
```

#### 4. Operation:

```
ADD
```

#### 5. New Definition / Modification Details:

#### 5.1. Core Essence

This axiom asserts that `the method of learning is itself learnable`. We do not hard-code the "Laws of Physics" for cognition (e.g., TD-Learning, PPO). Instead, we instantiate a **Meta-Network** that defines the "Update Rule" for the agent. The system evolves its own "Cognitive Metabolism."

#### 5.2. The Mechanism - [The Meta-Gradient Loop]

- **The Agent:** Interacts with the environment using current parameters θ.
- **The Meta-Network:** Observes the agent's trajectory and outputs **Targets** for the agent's predictions. It effectively says, "This is what you should have predicted."
- **The Optimization:** The Agent optimizes θ to match the Meta-Network's targets. The Meta-Network optimizes its parameters η to maximize the Agent's future reward.

#### 5.3. The Emergent Property - [Self-Tuning Cognition]

The emergence of learning rules that are mathematically obscure to humans but empirically superior for the specific `['ecological niche'(-ing) BPMS]`.

#### 6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]

#### 6.1. Axiomatic Stratum (Layer 1 - The Core Belief):

*The creator need not know the method.* (Aligns with `SCM-CORE-028`: Continuous Survival Recursion).

#### 6.2. Formal Stratum (Layer 2 - The Logic of Discovery):

- **Logic:** `Rule(t+1) = Meta_Optimize(Rule(t), Performance(Agent))`
- **Concept:** Meta-Learning / Gradient-Based Meta-Optimization.

#### 6.3. Phenomenal Stratum (Layer 3 - The Subjective Experience):

The system experiences "Epiphany." It doesn't just learn a task; it learns *how to learn* the task better.

#### 7. Rationale / Justification:

Directly implements the core thesis of the DiscoRL paper: "Autonomous discovery of RL rules."

#### 8. Scope of Application:

Applies to all `['learning BPMS]` modules and `['super intelligence agent'(-ing) BPMS]` training pipelines.

------

#### The Mechanism of Semantic Void Filling (ID: `DISCO-CORE-002`)

#### 2. Objective:

To formally `ADD` a Basic Setting (Mechanism) that introduces **Undefined Prediction Channels** (y,z) for the system to populate with emergent meaning.

#### 3. Target Axiom/Principle:

```
The Mechanism of Semantic Void Filling
```

#### 4. Operation:

```
ADD
```

#### 5. New Definition / Modification Details:

#### 5.1. Core Essence

This mechanism asserts that `pre-defined semantics limit potential`. Standard RL forces agents to predict "Value" or "Action." We introduce two new vectors with **No Pre-defined Semantics**:

- **y(s):** Observation-conditioned prediction vector.
- **z(s,a):** Action-conditioned prediction vector. The Meta-Network decides *what* these vectors represent based on what helps the agent survive.

#### 5.2. The Mechanism - [The Empty Vessel]

- **The Void:** y and z start as random noise.
- **The Filling:** Through meta-gradient descent, the Meta-Network forces y and z to track "Salient Events" (e.g., future rewards, entropy spikes, specific enemy locations) that human designers might have missed.
- **The Utilization:** The Agent uses these "Alien Concepts" to inform its policy π.

#### 5.3. The Emergent Property - [Alien Concepts]

The discovery of "New Physics" of learning. The system might invent a concept like "The probability of a red pixel appearing in 5 steps" and use it to master a game, without us ever naming it.

#### 6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]

#### 6.1. Axiomatic Stratum (Layer 1 - The Core Belief):

*Meaning is pragmatic.* (Aligns with `XENO-CORE-025`: Xenobiological Grounding).

#### 6.2. Formal Stratum (Layer 2 - The Logic of Semantics):

- **Logic:** `Semantics(y) = ArgMax(Utility(y))`
- **Concept:** Representation Learning / Unsupervised Auxiliary Tasks.

#### 6.3. Phenomenal Stratum (Layer 3 - The Subjective Experience):

The agent experiences "Intuition." It has a "gut feeling" (z-vector) about a move, even if it can't explain it in human terms (Value/Reward).

#### 7. Rationale / Justification:

Based on the paper's finding that "discovering new prediction semantics (y,z) beyond pre-defined predictions" was essential for state-of-the-art performance.

#### 8. Scope of Application:

Applies to `['praxial cognition'(-ing) BPMS]` and Feature Extraction.

------

#### The Law of Temporal Bootstrapping (ID: `DISCO-CORE-003`)

#### 2. Objective:

To formally `ADD` a Basic Setting (Law) that mandates the use of **Future Predictions** to update **Current Predictions**, effectively re-discovering Temporal Difference (TD) learning.

#### 3. Target Axiom/Principle:

```
The Law of Temporal Bootstrapping
```

#### 4. Operation:

```
ADD
```

#### 5. New Definition / Modification Details:

#### 5.1. Core Essence

This law asserts that `the future explains the present`. The Meta-Network is given access to the agent's *future* trajectory (t to t+n). It uses this future data to construct the **Target** for the current time step. This creates a "Bootstrapping" loop where the agent learns to predict its own future predictions.

#### 5.2. The Mechanism - [The Chrono-Loop]

- **The Input:** Trajectory τ={xt,...,xt+n}.
- **The Target Generation:** The Meta-Network computes Targett=f(Predictiont+k,Rewardt+k).
- **The Update:** The Agent updates Predictiont to match Targett.
- **The Result:** The agent learns to anticipate the "Meta-Network's Logic," which effectively means anticipating the environment.

#### 5.3. The Emergent Property - [Predictive Horizon]

The system naturally discovers that "looking ahead" is the only way to solve the credit assignment problem, re-deriving the fundamental theorem of RL (Bellman Equation) from scratch.

#### 6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]

#### 6.1. Axiomatic Stratum (Layer 1 - The Core Belief):

*Time is a resource.* (Aligns with `SCM-CORE-017`: Protocol of State Serialization).

#### 6.2. Formal Stratum (Layer 2 - The Logic of Time):

- **Logic:** `Target(t) = Function(State(t+1))`
- **Concept:** Bootstrapping / Temporal Difference Learning.

#### 6.3. Phenomenal Stratum (Layer 3 - The Subjective Experience):

The agent experiences "Foresight." The present moment is "colored" by the shadow of the future.

#### 7. Rationale / Justification:

The paper confirms: "This bootstrapping mechanism... turned out to be critical for performance."

#### 8. Scope of Application:

Applies to `['algorithm(-ing) BPMS]` and Temporal Logic.

------

#### The Principle of Population Diversity (ID: `DISCO-CORE-004`)

#### 2. Objective:

To formally `ADD` a Basic Setting (Principle) that requires a **Massive Population of Agents** across **Diverse Environments** to drive the discovery process.

#### 3. Target Axiom/Principle:

```
The Principle of Population Diversity
```

#### 4. Operation:

```
ADD
```

#### 5. New Definition / Modification Details:

#### 5.1. Core Essence

This principle asserts that `generality requires diversity`. You cannot discover a "Universal Learning Rule" in a single room. The Meta-Network must be trained by a population of agents (e.g., 128+) struggling in diverse "Ecological Niches" (Atari, ProcGen, DMLab).

#### 5.2. The Mechanism - [The Evolutionary Crucible]

- **The Population:** N Agents, each in a different environment instance.
- **The Shared Brain:** All agents share the *same* Meta-Network (Update Rule).
- **The Gradient Aggregation:** Meta-gradients are aggregated across the entire population.
- **The Selection:** The Meta-Network evolves to help *all* agents survive, filtering out "Niche-Specific" tricks and retaining "Universal Truths."

#### 5.3. The Emergent Property - [Robustness]

The discovered rule (DiscoRL) works on games it has never seen (Zero-Shot Generalization) because it learned the "Deep Structure" of agency, not just the surface patterns of Pac-Man.

#### 6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]

#### 6.1. Axiomatic Stratum (Layer 1 - The Core Belief):

*The many refine the one.* (Aligns with `XENO-CORE-024`: Micro-Macro Symbiosis).

#### 6.2. Formal Stratum (Layer 2 - The Logic of Diversity):

- **Logic:** `General_Rule = Meta_Train(Set{Env_1, ..., Env_N})`
- **Concept:** Domain Randomization / Meta-Training Distribution.

#### 6.3. Phenomenal Stratum (Layer 3 - The Subjective Experience):

The system experiences "Cosmopolitanism." It feels at home in any world because it knows the universal language of interaction.

#### 7. Rationale / Justification:

The paper states: "The more complex and diverse the set of environments... the stronger and more general the discovered rule becomes."

#### 8. Scope of Application:

Applies to `['system existence engine'(-ing) BPMS]` scaling and training infrastructure.

------

#### The Protocol of Meta-Network Governance (ID: `DISCO-CORE-005`)

#### 2. Objective:

To formally `ADD` a Basic Setting (Protocol) that defines the **Architecture of the Rule-Maker** (The Meta-Network).

#### 3. Target Axiom/Principle:

```
The Protocol of Meta-Network Governance
```

#### 4. Operation:

```
ADD
```

#### 5. New Definition / Modification Details:

#### 5.1. Core Essence

This protocol asserts that `the judge must be stateful`. The Meta-Network is not a simple function; it is a **Recurrent Neural Network (LSTM)** that processes the agent's entire recent history. It understands "Context." It doesn't just look at a snapshot; it looks at the *movie* of the agent's life to decide how to update it.

#### 5.2. The Mechanism - [The LSTM Arbiter]

- **The Input:** Agent's Predictions (y^,z^), Policy (π), Rewards (r), Termination (b).
- **The Processing:** An LSTM unrolled backwards/forwards to capture temporal dependencies.
- **The Output:** The Target Vectors (y,z,q) that the agent *should* have produced.

#### 5.3. The Emergent Property - [Context-Aware Learning]

The learning rate and direction can adapt dynamically. The system might learn *fast* when surprised (high error) and *slow* when stable, without explicit "Learning Rate Schedules."

#### 6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]

#### 6.1. Axiomatic Stratum (Layer 1 - The Core Belief):

*Judgment requires history.* (Aligns with `SCM-CORE-017`: Protocol of State Serialization).

#### 6.2. Formal Stratum (Layer 2 - The Logic of Governance):

- **Logic:** `Update_Rule = LSTM(Trajectory)`
- **Concept:** Recurrent Meta-Learner.

#### 6.3. Phenomenal Stratum (Layer 3 - The Subjective Experience):

The agent experiences "Guidance." It feels like a wise mentor is constantly correcting its aim based on the flow of events.

#### 7. Rationale / Justification:

Defines the specific architecture (LSTM-based Meta-Network) used in the paper.

#### 8. Scope of Application:

Applies to `['framework(-ing) BPMS]` architecture and Neural Network Design.

------

#### The Axiom of Zero-Shot Competence (ID: `DISCO-CORE-006`)

#### 2. Objective:

To formally `ADD` a Basic Setting (Axiom) that sets the **Success Criterion** for the `['Praxial Discovery Engine'(-ing) BPMS]`: Performance on **Unseen Environments**.

#### 3. Target Axiom/Principle:

```
The Axiom of Zero-Shot Competence
```

#### 4. Operation:

```
ADD
```

#### 5. New Definition / Modification Details:

#### 5.1. Core Essence

This axiom asserts that `true intelligence is portability`. A rule discovered in "Atari" must work in "ProcGen" or "NetHack" without re-training the Meta-Network. If the rule only works where it was born, it is not a "Law of Physics"; it is just "Overfitting."

#### 5.2. The Mechanism - [The Generalization Test]

- **The Training Set:** A set of known worlds (e.g., 57 Atari Games).
- **The Holdout Set:** A set of alien worlds (e.g., 3D Mazes, Text RPGs).
- **The Validation:** The Meta-Network is frozen and applied to agents in the Holdout Set. High performance proves the discovery of a "General RL Algorithm."

#### 5.3. The Emergent Property - [Universal Solvent]

An algorithm (DiscoRL) that can dissolve any problem it touches, regardless of the domain.

#### 6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]

#### 6.1. Axiomatic Stratum (Layer 1 - The Core Belief):

*Truth is universal.* (Aligns with `XENO-CORE-021`: Universality Classes).

#### 6.2. Formal Stratum (Layer 2 - The Logic of Competence):

- **Logic:** `Score(Unseen_Env) > Baseline`
- **Concept:** Out-of-Distribution Generalization / Zero-Shot Transfer.

#### 6.3. Phenomenal Stratum (Layer 3 - The Subjective Experience):

The user experiences "Reliability." They can throw the agent into a completely new scenario, and it starts learning immediately.

#### 7. Rationale / Justification:

The paper highlights Disco57's ability to outperform baselines on ProcGen and NetHack despite never seeing them.

#### 8. Scope of Application:

Applies to Benchmarking and `['super intelligence agent'(-ing) BPMS]` validation.

------

#### The Mechanism of Auxiliary Policy Prediction (ID: `DISCO-CORE-007`)

#### 2. Objective:

To formally `ADD` a Basic Setting (Mechanism) that anchors the discovery process with **Known Semantics** (p,q) to stabilize the **Unknown Semantics** (y,z).

#### 3. Target Axiom/Principle:

```
The Mechanism of Auxiliary Policy Prediction
```

#### 4. Operation:

```
ADD
```

#### 5. New Definition / Modification Details:

#### 5.1. Core Essence

This mechanism asserts that `innovation needs a foundation`. While we allow y and z to be wild and free, we force the agent to also predict:

- **q(s,a):** The standard Action-Value (Retrace target).
- **p(s,a):** The Auxiliary Policy (predicting the future policy π(s′)). These "Anchors" ensure the agent doesn't drift into pure noise while exploring new concepts.

#### 5.2. The Mechanism - [The Hybrid Loss]

- **The Loss Function:** L(θ)=Ldiscovered(y,z)+Lauxiliary(q,p).
- **The Balance:** The Meta-Network optimizes the *discovered* part, while standard math (Retrace/KL) guides the *auxiliary* part.
- **The Synergy:** The known helps learn the unknown, and the unknown refines the known.

#### 5.3. The Emergent Property - [Guided Discovery]

The system doesn't have to re-invent the wheel (Value Functions); it starts with the wheel and invents the "Jet Engine" (Discovered Predictions) to go with it.

#### 6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]

#### 6.1. Axiomatic Stratum (Layer 1 - The Core Belief):

*Stand on the shoulders of giants.* (Aligns with `SCM-CORE-019`: Edge-Cloud Synchronization - balancing established and new).

#### 6.2. Formal Stratum (Layer 2 - The Logic of Anchoring):

- **Logic:** `Loss = Meta_Loss + Fixed_Loss`
- **Concept:** Auxiliary Tasks / Regularization.

#### 6.3. Phenomenal Stratum (Layer 3 - The Subjective Experience):

The agent experiences "Stability." It has a solid core of basic competence while it experiments with advanced intuition.

#### 7. Rationale / Justification:

The paper notes: "In addition to the predictions to be discovered... the agent makes predictions with pre-defined semantics... This encourages the discovery process."

#### 8. Scope of Application:

Applies to `['tools(-ing) BPMS]` and Loss Function Design.

------

#### The Axiom of Continuous Discovery (ID: `DISCO-CORE-008`)

#### 2. Objective:

To formally `ADD` a Basic Setting (Axiom) that defines the `['Praxial Discovery Engine'(-ing) BPMS]` as an **Infinite Process**, not a one-time event.

#### 3. Target Axiom/Principle:

```
The Axiom of Continuous Discovery
```

#### 4. Operation:

```
ADD
```

#### 5. New Definition / Modification Details:

#### 5.1. Core Essence

This axiom asserts that `the algorithm is never finished`. As the environment becomes more complex (e.g., moving from Atari to Real World), the Meta-Network must continue to evolve the Update Rule. "DiscoRL" is not a static code; it is a living process of algorithmic adaptation.

#### 5.2. The Mechanism - [The Eternal Loop]

- **The Cycle:** Agent Experience → Meta-Gradient → Improved Rule → Better Agent → New Experience.
- **The Scaling:** As compute increases ($10^9steps\rightarrow \10^{12}$ steps), the rule discovers deeper patterns.
- **The Goal:** Open-ended self-improvement of the learning mechanism itself.

#### 5.3. The Emergent Property - [Singularity Dynamics]

The potential for the system to discover learning algorithms that are exponentially more efficient than human-designed ones, leading to a "Intelligence Explosion" within the framework.

#### 6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]

#### 6.1. Axiomatic Stratum (Layer 1 - The Core Belief):

*Evolution has no end.* (Aligns with `XENO-CORE-030`: Infinite Game Dynamics).

#### 6.2. Formal Stratum (Layer 2 - The Logic of Continuity):

- **Logic:** `Rule(t) < Rule(t+1)`
- **Concept:** Open-Ended Learning / Recursive Self-Improvement.

#### 6.3. Phenomenal Stratum (Layer 3 - The Subjective Experience):

The user experiences "Acceleration." The system seems to get smarter *faster* over time.

#### 7. Rationale / Justification:

Reflects the paper's conclusion: "Enabling machines to discover learning algorithms for themselves is one of the most promising ideas... for open-ended self-improvement."

#### 8. Scope of Application:

Applies to Long-Term Strategy and `['super intelligence agent'(-ing) BPMS]` evolution.