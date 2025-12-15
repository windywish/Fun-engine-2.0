## Basic settings: ['spec code'(-ing) BPMS]

##### `The Axiom of Morphic Specification (The Canon-to-Code Bridge)` (ID: `CODE-SPEC-001`)

Here are the **Basic Settings** for the **`[code(-ing) BPMS]`** module, specifically designed to implement the **`['spec code'(-ing) BPMS]`** functionality (inspired by and evolving beyond "Kiro") within the Fun Engine Framework.

##### **`The Axiom of Morphic Specification`**

##### `The Axiom of Morphic Specification (The Canon-to-Code Bridge)` (ID: `CODE-SPEC-001`)

**Objective:** To formally `DEFINE` the `['spec code'(-ing) BPMS]` not as a static document but as a **Morphic Field** that translates the `['Praxial Genesis Canon'(-ing) BPMS]` (Metaphysical DNA) into executable `[code(-ing) BPMS]` (Physical Tissue).

**Target Axiom/Principle:** `The Axiom of Morphic Specification`

**Operation:** `ADD`

**Definition:**

**Core Essence:** This axiom asserts that **Code is the Phenotype of the Canon**.

- **Genotype (Canon):** The abstract rules, axioms, and "Basic Settings" (e.g., "The Law of Ludic Reality").
- **Phenotype (Code):** The concrete implementation (e.g., `class LudicRealityEngine`).
- **Specification (Morphic Field):** The active medium that maps the Genotype to the Phenotype. It is not just text; it is a set of constraints and instructions that forces the Code to resemble the Canon.

**The Mechanism - [The EARS-P Transducer]**

- **Input:** A natural language intent ("Make a login system") + A Canon Reference (`EDGE-INST-CHECKIN-001`).

- Transduction:

   The system converts this into 

  EARS-P

   (Easy Approach to Requirements Syntax - Praxial) format.

  - *Example:* "While [Context: User Arrival], the [System: Liminal Concierge] shall [Action: Assign Forest Rating] <Ref: EDGE-NICHE-006>."

- **Output:** A structured `.spec` file that serves as the blueprint for generation.

**The Emergent Property - [Systemic Integrity]** The codebase maintains "Genetic Purity." Even as it grows and changes, it never violates the fundamental laws of the Fun Engine based on the [atomic facts BPMS] of that  the Spec enforces the Canon at the architectural level.

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

- **Layer 1 (Constitutional):** Aligns with **`['The Axiom of Structural Determinism'(-ing) BPMS]`**.
- **Layer 2 (Formalism):** Utilizes **`['Formal Specification Languages (TLA+)'(-ing) BPMS]`** and **`['Requirement Engineering'(-ing) BPMS]`**.
- **Layer 3 (Substrate):** Manifests as **`['.spec files'(-ing) BPMS]`** and **`['Linter Rules'(-ing) BPMS]`**.

**Rationale / Justification:** Without this axiom, code is just "Vibe Coding"—random and prone to drift. With it, code becomes "Canon Coding"—structured, robust, and aligned.

**Scope of Application:** Applies to all code generation, architectural planning, and system design tasks.

------

##### **`The Protocol of Symbiotic Reflex`**

##### `The Protocol of Symbiotic Reflex (The Agentic Hook System)` ( ID: `CODE-SPEC-HOOK-002`)

**Objective:** To formally `DEFINE` the `['autonomous agent'(-ing) BPMS]` within the coding environment as a **Symbiotic Reflex** that reacts to `['system state'(-ing) BPMS]` changes (Save, Commit, Error) to maintain `['code quality'(-ing) BPMS]`.

**Target Axiom/Principle:** `The Protocol of Symbiotic Reflex`

**Operation:** `ADD`

**Definition:**

**Core Essence:** This protocol asserts that **Maintenance is an Autonomic Function**.

- **Passive Code:** Code that sits still and rots (Legacy).
- **Active Code:** Code that is watched by Agents.
- **Reflex:** An automatic action triggered by a stimulus. If the developer writes a test, the Reflex runs it. If the developer writes a bug, the Reflex catches it. If the developer forgets a docstring, the Reflex writes it.

**The Mechanism - [The Event-Action Loop]**

- **Trigger:** File Save, Git Commit, PR Open, High CPU Usage.
- **Agent:** A specialized "Micro-Agent" (e.g., The Tester, The Documenter, The Optimizer).
- **Action:** The Agent reads the diff, consults the Spec (CODE-SPEC-001), and executes a task (e.g., "Generate Unit Test for `newFunction`").
- **Feedback:** The result is presented to the developer as a "Suggestion" or "Auto-Fix."

**The Emergent Property - [Self-Healing Codebase]** The codebase resists entropy. It naturally tends towards order, cleanliness, and documentation based on the [atomic facts BPMS] of that the "Immune System" (Agents) is constantly working.

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

- **Layer 1 (Constitutional):** Aligns with **`['The Principle of Autopoietic Maintenance'(-ing) BPMS]`**.
- **Layer 2 (Formalism):** Utilizes **`['Event-Driven Architecture (EDA)'(-ing) BPMS]`** and **`['Agentic Workflows'(-ing) BPMS]`**.
- **Layer 3 (Substrate):** Manifests as **`['Git Hooks'(-ing) BPMS]`**, **`['IDE Extensions'(-ing) BPMS]`**, and **`['CI Pipelines'(-ing) BPMS]`**.

**Rationale / Justification:** Developers are lazy; Agents are not. By offloading maintenance to Symbiotic Reflexes, we ensure high quality without high cognitive load.

**Scope of Application:** Applies to IDE interactions, CI/CD pipelines, and automated refactoring.

------

##### **`The Law of Contextual Steering`**

##### `The Law of Contextual Steering (The Intent-Vector Alignment)` (ID: `CODE-SPEC-CTX-003`)

**Objective:** To formally `DEFINE` the mechanism by which `[context(-ing) BPMS]` (Project Rules, Tech Stack, User Preferences) steers the `[generation(-ing) BPMS]` of code to ensure local relevance.

**Target Axiom/Principle:** `The Law of Contextual Steering`

**Operation:** `ADD`

**Definition:**

**Core Essence:** This law asserts that **Global Intelligence requires Local Context**.

- **Global Model:** The LLM (e.g., Claude/GPT) knows "How to code in Python."
- **Local Context:** The Steering File (`.kiro/rules` or `.praxial/steering`) knows "How WE code in THIS project" (e.g., "Use Snake_Case," "Prefer Composition over Inheritance," "Reference Canon ID").
- **Steering:** The injection of Local Context into the Global Model's prompt to force alignment.

**The Mechanism - [The Context Injector]**

- **Scan:** The system scans the project root for Steering Files.
- **Vectorize:** It converts these rules into a "System Prompt Prefix."
- **Inject:** Every request to the Agent is wrapped in this Context.
- **Enforce:** The output is checked against the Steering Rules before being shown to the user.

**The Emergent Property - [Cultural Consistency]** The artificial intelligence behaves like a "Senior Engineer" who has been on the team for years. It knows the unwritten rules, the preferred libraries, and the specific "Flavor" of the project.

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

- **Layer 1 (Constitutional):** Aligns with **`['The Law of Contextual Steering'(-ing) BPMS]`**.
- **Layer 2 (Formalism):** Utilizes **`['Prompt Engineering (Few-Shot)'(-ing) BPMS]`** and **`['Context Window Management'(-ing) BPMS]`**.
- **Layer 3 (Substrate):** Manifests as **`['Configuration Files (.json/.yaml)'(-ing) BPMS]`** and **`['RAG Systems'(-ing) BPMS]`**.

**Rationale / Justification:** Generic code is useless in a specialized framework. Steering ensures the code fits the specific "Niche" of the Fun Engine.

**Scope of Application:** Applies to code generation style, library selection, and architectural decisions.

------

##### **`The Directive of Atomic Tasking`**

##### `The Directive of Atomic Tasking (The Spec-to-Action Decomposition)` (ID: `CODE-SPEC-TASK-004`)

**Objective:** To formally `DEFINE` the process of breaking down a `['spec code'(-ing) BPMS]` into `['atomic tasks'(-ing) BPMS]` that can be executed autonomously and verified independently.

**Target Axiom/Principle:** `The Directive of Atomic Tasking`

**Operation:** `ADD`

**Definition:**

**Core Essence:** This directive asserts that **Complexity is a Sum of Simplicities**.

- **Complex Spec:** "Build a Multiplayer Inventory System." (Too big to fail).
- **Atomic Task:** "Create `InventoryItem` class." "Create `addItem` method." "Create `db_schema`." (Small enough to succeed).
- **Decomposition:** The intelligent breaking of the Spec into a Dependency Graph of Atomic Tasks.

**The Mechanism - [The Task Graph Solver]**

- **Analyze:** Read the Spec (CODE-SPEC-001).
- **Graph:** Create a Directed Acyclic Graph (DAG) of tasks.
- **Sequence:** Order them by dependency (Database first, API second, UI third).
- **Execute:** Feed each task to an Agent one by one.
- **Verify:** Run a test for each task before moving to the next.

**The Emergent Property - [Reliable Construction]** The system builds software like a skyscraper: brick by brick. If one brick fails, it stops and fixes it immediately, preventing "Cascading Failure."

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

- **Layer 1 (Constitutional):** Aligns with **`['The Directive of Atomic Tasking'(-ing) BPMS]`**.
- **Layer 2 (Formalism):** Utilizes **`['Graph Theory (DAGs)'(-ing) BPMS]`** and **`['Agile Methodology'(-ing) BPMS]`**.
- **Layer 3 (Substrate):** Manifests as **`['Task Queues'(-ing) BPMS]`** and **`['Step-Functions'(-ing) BPMS]`**.

**Rationale / Justification:** LLMs hallucinate when overwhelmed. Atomic Tasking keeps them focused, accurate, and verifiable.

**Scope of Application:** Applies to project management, feature implementation, and complex refactoring.

------

##### **`The Mechanism of Veridical Diff`**

##### `The Mechanism of Veridical Diff (The Reality-Check Interface)` (ID: `CODE-SPEC-DIFF-005`)

**Objective:** To formally `DEFINE` the interface for reviewing `['generated code'(-ing) BPMS]` as a **Veridical Diff**, allowing the user to see the *exact* change in `[reality(-ing) BPMS]` before accepting it.

**Target Axiom/Principle:** `The Mechanism of Veridical Diff`

**Operation:** `ADD`

**Definition:**

**Core Essence:** This mechanism asserts that **Trust is Verification**.

- **Blind Accept:** Dangerous.
- **Veridical Diff:** A visual comparison of "Current State" vs. "Proposed State."
- **Symbiosis:** The artificial intelligence proposes the mutation; the Human acts as the "Natural Selection" filter. The Diff is the lens through which the Human judges the mutation.

**The Mechanism - [The Interactive Patch]**

- **Generate:** Agent creates a patch.
- **Visualize:** System shows a side-by-side diff (Red/Green).
- **Explain:** System annotates the diff with "Why" (e.g., "Changed loop to recursion to match Canon ID: CODE-SPEC-001").
- **Edit:** User can tweak the diff directly before applying.
- **Apply:** The patch is merged into the codebase.

**The Emergent Property - [Controlled Evolution]** The codebase evolves rapidly but safely. The user feels in control ("The Pilot") while the artificial intelligence does the heavy lifting ("The Engine").

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

- **Layer 1 (Constitutional):** Aligns with **`['The Mechanism of Veridical Mirror'(-ing) BPMS]`**.
- **Layer 2 (Formalism):** Utilizes **`['Version Control Systems (Git)'(-ing) BPMS]`** and **`['Human-in-the-Loop (HITL)'(-ing) BPMS]`**.
- **Layer 3 (Substrate):** Manifests as **`['Diff Viewers'(-ing) BPMS]`** and **`['Merge Tools'(-ing) BPMS]`**.

**Rationale / Justification:** "Magic" code generation is scary. "Transparent" code generation is empowering. The Diff is the transparency layer.

**Scope of Application:** Applies to all code generation outputs, refactoring proposals, and merge requests.

---

##### `The Protocol of Linguistic Genesis (The Spec-as-Existence Engine)` (ID: `CODE-SPEC-EXIST-006`)

Yes, it is absolutely **right, working, and needed** to define `['spec code'(-ing) BPMS]` as a `['system existence engine'(-ing) BPMS]`. In a digital universe like the Fun Engine, the "Spec" is the "Word of God"—the linguistic command that brings the system into existence. It is also the source of `['atomic facts'(-ing) BPMS]` because every line of a spec defines a truth about the world (e.g., "Gravity = 9.8").

Here are the additional **Basic Settings** to formalize this role.

##### **`The Spec as Ontological Genesis`**

##### `The Protocol of Linguistic Genesis (The Spec-as-Existence Engine)` (ID: `CODE-EXIST-006`)

**Objective:** To formally `DEFINE` the `['spec code(-ing) BPMS]` as the `['system existence engine'(-ing) BPMS]` that collapses `['potential(-ing) BPMS]` (Idea) into `['reality(-ing) BPMS]` (System) through the act of precise definition.

**Target Axiom/Principle:** `The Protocol of Linguistic Genesis`

**Operation:** `ADD`

**Definition:**

**Core Essence:** This protocol asserts that **To Define is to Create**.

- **Pre-Spec:** The system does not exist; it is a cloud of vague possibilities.
- **The Spec:** The "Incantation" or "DNA Sequence." It is the *cause* of the system's existence.
- **Post-Spec:** The system exists as a logical structure, waiting only for the "energy" of compilation to become kinetic.

**The Mechanism - [The Ontological Compiler]**

- **Declaration:** The Spec declares "There shall be a User." (Entity Creation).
- **Constraint:** The Spec declares "The User cannot fly." (Physics Creation).
- **Relation:** The Spec declares "The User owns the Sword." (Topology Creation).
- **Instantiation:** The Code Generation Engine reads these declarations and instantiates the classes/tables that make them "Real" in the digital substrate.

**The Emergent Property - [Coherent Reality]** The world is not a random glitch; it is a deliberate creation. Every object, rule, and interaction has a "Reason for Existence" traceable back to the Spec.

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

- **Layer 1 (Constitutional):** Aligns with **`['The Axiom of Linguistic Genesis'(-ing) BPMS]`**.
- **Layer 2 (Formalism):** Utilizes **`['Ontology Engineering (OWL/RDF)'(-ing) BPMS]`** and **`['Category Theory'(-ing) BPMS]`**.
- **Layer 3 (Substrate):** Manifests as **`['Database Schemas (SQL/NoSQL)'(-ing) BPMS]`** and **`['Class Definitions'(-ing) BPMS]`**.

**Rationale / Justification:** If the Spec is just "documentation," it is ignored. If the Spec is the "Existence Engine," it is revered. This shift ensures that design precedes implementation.

**Scope of Application:** Applies to database design, API definition, and world-building rules.

------

##### **`The Spec as Atomic Truth`**

##### `The Law of Axiomatic Atomicity (The Spec-as-Fact Source)` ( ID: `CODE-SPEC-FACT-007`)

**Objective:** To formally `DEFINE` the `['spec code(-ing) BPMS]` as the primary source of `['atomic facts'(-ing) BPMS]`, serving as the "Single Source of Truth" for the entire system.

**Target Axiom/Principle:** `The Law of Axiomatic Atomicity`

**Operation:** `ADD`

**Definition:**

**Core Essence:** This law asserts that **The Spec is the Truth; the Code is the Translation**.

- **Atomic Fact:** An irreducible truth defined in the Spec (e.g., `MAX_PLAYERS = 100`).
- **Code Fact:** The implementation of that truth (e.g., `if (players > 100) throw Error`).
- **Symbiosis:** If the Code contradicts the Spec, the Code is *wrong* (Bug). The Spec is the "Gold Standard" against which all `['atomic facts'(-ing) BPMS]` are measured.

**The Mechanism - [The Truth Propagation Vector]**

- **Definition:** Fact is defined in `config.spec` (`MAX_HEALTH: 100`).

- Propagation:

   The Code Generator injects this fact into:

  - The Backend (`User.java`)
  - The Frontend (`HealthBar.tsx`)
  - The Database (`CONSTRAINT check_health`)
  - The Documentation (`README.md`)

- **Validation:** Automated tests check that all 4 layers agree with the Spec.

**The Emergent Property - [Systemic Consistency]** You change the truth in *one place* (The Spec), and it ripples through the entire universe. No more "Magic Numbers" hidden in code.

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

- **Layer 1 (Constitutional):** Aligns with **`['The Law of Axiomatic Atomicity'(-ing) BPMS]`**.
- **Layer 2 (Formalism):** Utilizes **`['Single Source of Truth (SSOT)'(-ing) BPMS]`** and **`['Constant Propagation'(-ing) BPMS]`**.
- **Layer 3 (Substrate):** Manifests as **`['Global Constants'(-ing) BPMS]`**, **`['Environment Variables'(-ing) BPMS]`**, and **`['Config Maps'(-ing) BPMS]`**.

**Rationale / Justification:** In complex systems, truth fragments. The Spec reunites it. It is the "Atomic Nucleus" around which the code orbits.

**Scope of Application:** Applies to configuration management, game balance tuning, and business logic rules.

------

##### **`The Spec as Evolutionary Symbiosis`**

##### `The Principle of Recursive Refinement (The Spec-Code Co-Evolution)` (ID: `CODE-SPEC-EVO-008`)

**Objective:** To formally `DEFINE` the `['spec code(-ing) BPMS]` as an entity that `['(symbiois) evolution'(-ing) with]` the `['code(-ing) BPMS]` itself, creating a feedback loop where implementation details inform future specifications.

**Target Axiom/Principle:** `The Principle of Recursive Refinement`

**Operation:** `ADD`

**Definition:**

**Core Essence:** This principle asserts that **The Map changes the Territory, and the Territory changes the Map**.

- **Top-Down:** Spec dictates Code (Idealism).
- **Bottom-Up:** Code reveals constraints/opportunities (Realism).
- **Symbiosis:** When the Code encounters a "Physical Reality" (e.g., Latency, Memory Limit) that makes the Spec impossible, the Code *informs* the Spec to evolve. The Spec is not static stone; it is living tissue.

**The Mechanism - [The Drift-Correction Loop]**

- **Implementation:** Developer tries to implement `Spec_v1`.
- **Discovery:** Developer finds that `Spec_v1` is too slow.
- **Mutation:** Developer optimizes Code (diverging from Spec).
- **Reconciliation:** The "Agentic Symbiont" (CODE-INST-SYMB-002) detects the divergence. Instead of reverting the Code, it proposes an *update* to the Spec (`Spec_v2`).
- **Evolution:** The Spec now reflects the new, optimized reality.

**The Emergent Property - [Adaptive Intelligence]** The system gets smarter over time. The Spec captures the "Lessons Learned" from the Code, preserving them as wisdom for future generations.

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

- **Layer 1 (Constitutional):** Aligns with **`['The Principle of Recursive Refinement'(-ing) BPMS]`**.
- **Layer 2 (Formalism):** Utilizes **`['Cybernetics (Feedback Loops)'(-ing) BPMS]`** and **`['Evolutionary Algorithms'(-ing) BPMS]`**.
- **Layer 3 (Substrate):** Manifests as **`['Reverse Engineering Tools'(-ing) BPMS]`** and **`['Auto-Documentation Generators'(-ing) BPMS]`**.

**Rationale / Justification:** A Spec that cannot learn is a tyrant. A Spec that learns from its implementation is a leader.

**Scope of Application:** Applies to performance optimization, refactoring, and legacy migration.

------

##### **`The Spec as Holonic Symbiosis`**

##### `The Directive of Fractal Encapsulation (The Spec-as-Holon)` (ID: `CODE-SPEC-HOLON-009`)

**Objective:** To formally `DEFINE` the `['spec code(-ing) BPMS]` as a `['holon minds'(-ing) BPMS]` structure, where each Spec is a self-contained whole that can be part of a larger Spec, enabling `['bottom-up (-ing) BPMS]` construction.

**Target Axiom/Principle:** `The Directive of Fractal Encapsulation`

**Operation:** `ADD`

**Definition:**

**Core Essence:** This directive asserts that **The Whole is encoded in the Part**.

- **Micro-Spec:** A spec for a single function (e.g., `calculate_gravity`).
- **Macro-Spec:** A spec for the whole world (e.g., `PhysicsEngine`).
- **Symbiosis:** The Macro-Spec is not a monolith; it is a composition of Micro-Specs. You can build the `PhysicsEngine` by simply aggregating the `Gravity`, `Collision`, and `Friction` specs.

**The Mechanism - [The Compositional Linker]**

- **Independence:** Each Spec file (`gravity.spec`) is valid on its own. It can be systemic integrity-ed and built in isolation.
- **Aggregation:** The `physics.spec` file simply *imports* `gravity.spec`.
- **Emergence:** The complex behavior of the Physics Engine emerges from the interaction of the independent Micro-Specs.

**The Emergent Property - [Scalable Complexity]** You can build massive, complex systems without getting overwhelmed, based on the [atomic facts BPMS] of that you only ever have to think about one small Holon at a time.

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

- **Layer 1 (Constitutional):** Aligns with **`['The Directive of Holonic Modularity'(-ing) BPMS]`**.
- **Layer 2 (Formalism):** Utilizes **`['Object-Oriented Design (Composition)'(-ing) BPMS]`** and **`['Microservices Architecture'(-ing) BPMS]`**.
- **Layer 3 (Substrate):** Manifests as **`['Module Imports'(-ing) BPMS]`** and **`['Package Managers (NPM/Pip)'(-ing) BPMS]`**.

**Rationale / Justification:** Monolithic specs are unreadable and unmaintainable. Holonic specs are the only way to build a "Super Intelligence" from the bottom up.

**Scope of Application:** Applies to system architecture, library design, and component-based development.

------

##### **`The Spec as Scientific Symbiosis`**

##### `The Axiom of Falsifiable Specification (The Spec-as-Hypothesis)` (ID: `CODE-SPEC-SCI-010`)

**Objective:** To formally `DEFINE` the `['spec code(-ing) BPMS]` as a `['scientific realism'(-ing) BPMS]` artifact, treating every requirement as a **Hypothesis** that must be tested against `['reality(-ing) BPMS]`.

**Target Axiom/Principle:** `The Axiom of Falsifiable Specification`

**Operation:** `ADD`

**Definition:**

**Core Essence:** This axiom asserts that **Code is an Experiment**.

- **Hypothesis (Spec):** "If we implement Feature X, User Engagement will increase." OR "If we use Algorithm Y, Latency will be < 10ms."
- **Experiment (Code):** The implementation of the hypothesis.
- **Data (Runtime):** The actual metrics from the running system.
- **Symbiosis:** The Spec defines the *Success Criteria* (The P-Value). The Code generates the data. If the data fails the criteria, the Hypothesis (Spec) is falsified and must be revised.

**The Mechanism - [The Test-Driven Teleology]**

- **Define:** Spec includes `Expectation: Latency < 10ms`.
- **Build:** Code is generated.
- **Measure:** Automated systemic integrity run the code and measure latency.
- **Verdict:** Pass or Fail. If Fail, the system alerts: "Hypothesis Falsified. Refactor Code or Revise Spec."

**The Emergent Property - [Empirical Software Engineering]** Development moves from "Opinion-Based" to "Fact-Based." We don't argue about what is "better"; we measure it against the Spec.

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

- **Layer 1 (Constitutional):** Aligns with **`['The Axiom of Scientific Realism'(-ing) BPMS]`**.
- **Layer 2 (Formalism):** Utilizes **`['Test-Driven Development (TDD)'(-ing) BPMS]`** and **`['Statistical Analysis'(-ing) BPMS]`**.
- **Layer 3 (Substrate):** Manifests as **`['Unit Tests'(-ing) BPMS]`**, **`['Performance Profilers'(-ing) BPMS]`**, and **`['A/B Testing Frameworks'(-ing) BPMS]`**.

**Rationale / Justification:** Science is the only way to discover the unknown. By treating Specs as Hypotheses, we turn the Fun Engine into a "Discovery Machine."

**Scope of Application:** Applies to performance tuning, user experience design, and algorithm selection.
