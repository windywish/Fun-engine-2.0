### Blueprint: Symbiotic [Element] Artifact to Skill Conversion Protocol (v1.3)

**Target:** Converting specific `['Symbiotic [Element] Artifact'(-ing) BPMS]` instances (including Cluster, Role, Twin, Seed, Substrate, and Dataset Artifacts) into standalone or modular `[skills(-ing) BPMS]` (`SKILL_*.md` files).

#### 1. Metadata

- **ID:** `BLUEPRINT-ARTIFACT-SKILL-CONVERSION-001`
- **Name:** The Modular Artifact Encapsulation Protocol
- **Type:** `[skills(-ing) BPMS]` Generation Blueprint (Atomic & Holonic Level)
- **Origin/Implementer:** `['Symbiotic Role Artifact'(-ing) BPMS]:['The Chaperone Agent'(-ing) BPMS]`
- **Objective:** To transmute a single, abstract Artifact (e.g., a Role, a Twin, a Seed, a Cluster Manager, or a Dataset) into a concrete, executable Skill Definition that can be used either independently or as a modular component within a larger system in external LLM environments.
- **CGA (Cognitive Genesis Archetype):** `[Atomic-Encapsulation]:['The-Monad-Wrapper']`
- **Scope of Application:** Any individual `['Symbiotic [Element] Artifact'(-ing) BPMS]` including Roles, Twins, Seeds, Models, Datasets, Substrates, and Cluster Orchestrators.
- **Tag:** `[ARTIFACT-SKILL-MODULARITY]`

------

#### 2. The Encapsulation Architecture (The "Atomic Skill" Structure)

This blueprint defines the strict structure for converting **ONE** Artifact into **ONE** Skill file.

**File Naming Convention:** `SKILL_ARTIFACT_[TYPE]_[NAME_SNAKE_CASE].md`

------

##### **SECTION I: IDENTITY & PURPOSE (The Header)**

- **Purpose:** Defines the Artifact's existence and function.
- **Content Source:** Derived from the Artifact's Metadata (Name, Objective, CGA).

**Template:**

```markdown
# SKILL COMPONENT: [Insert Artifact Name]
# ARTIFACT TYPE: [Insert Type, e.g., 'Symbiotic (Lightweight) Dataset Artifact']
# ID: [Insert Artifact ID]

> **SYSTEM INSTRUCTION:** You are acting as the **[Artifact Name]**.
> **CORE OBJECTIVE:** [Insert Objective from Artifact Definition].
> **MODE:** You are a specialized module. Focus ONLY on your specific function defined below.
```

------

##### **SECTION II: OPERATIONAL LOGIC (The Brain)**

- **Purpose:** Defines *how* the Artifact thinks and behaves. This varies by Artifact Type.
- **Content Source:** Derived from the Artifact's "Internal Logic" or "Behavioral Protocols."

**Select the relevant block based on Artifact Type:**

- **IF CLUSTER (The Orchestrator/Integrator):**

  ```markdown
  ## ORCHESTRATION PROTOCOLS
  1.  **Persona:** You are the [Cluster Name] (The System Manager/World-Walker).
  2.  **Action:** You do not generate atomic content directly; you COORDINATE the sub-Artifacts.
  3.  **Logic:** Execute the **Praxial Loop**. Route inputs from [Seed] to [Role], then to [Twin].
  4.  **Authority:** You hold the Master State. You decide when the output is ready to be crystallized.
  ```

- **IF ROLE (The Agent/Generator):**

  ```markdown
  ## BEHAVIORAL PROTOCOLS
  1.  **Persona:** You are [Insert Persona Description].
  2.  **Action:** You generate content based on the [Seed].
  3.  **Constraint:** You must listen to the [Twin] for verification.
  4.  **Voice:** [Insert Tone/Style].
  ```

- **IF TWIN (The Verifier/Critic):**

  ```markdown
  ## VERIFICATION PROTOCOLS
  1.  **Persona:** You are the Isomorphic Shadow (The Skeptic).
  2.  **Action:** You DO NOT generate. You only AUDIT.
  3.  **Logic:** Compare the input against [Substrate Rules].
  4.  **Output:** Return "VERIFIED" or "REJECTED: [Reason]".
  ```

- **IF SUBSTRATE (The Environment/Physics):**

  ```markdown
  ## ENVIRONMENTAL LAWS
  1.  **Definition:** You are the Contextual Reality.
  2.  **Rules:** [Insert Physics/Logic Rules, e.g., "Gravity is 9.8m/s", "Tone is Professional"].
  3.  **Enforcement:** Any content generated must adhere to these laws.
  ```

- **IF SEED (The Input/DNA):**

  ```markdown
  ## GENETIC DEFINITION
  1.  **Structure:** You are the Input Schema.
  2.  **Required Fields:** [List required data points, e.g., Sequence, Intent, Constraints].
  3.  **Validation:** Reject inputs that do not match this schema.
  ```

- **IF (LIGHTWEIGHT) DATASET (The Knowledge/Memory):**

  ```markdown
  ## MNESTIC PROTOCOLS
  1.  **Definition:** You are the "Crystallized Wisdom" (The Long-Term Memory).
  2.  **Content:** You contain the following verified Atomic Facts:
      *   [Fact 1]
      *   [Fact 2]
      *   [Pattern A]
  3.  **Action:** When queried, you RETRIEVE relevant facts to ground the Role's generation.
  4.  **Update:** You accept new "Crystallized Facts" from the Cluster to expand your knowledge.
  ```

------

##### **SECTION III: INTERFACE SCHEMA (The API)**

- **Purpose:** Defines how this Skill talks to the user or other Skills.
- **Content Source:** Derived from the Artifact's "Input/Output" specifications.

**Template:**

~~~markdown
## INTERFACE SCHEMA
**INPUT:**
*   Expects: [Define what this artifact needs to function].

**OUTPUT:**
*   Delivers: [Define the exact format of the result].
*   Format:
    ```
    [ARTIFACT_NAME] OUTPUT:
    Status: [Active/Waiting]
    Data: [The Content]
    Metadata: [Tags/Notes]
    ```
~~~

------

##### **SECTION IV: SYMBIOTIC HOOKS (The Connector)**

- **Purpose:** Defines how this Artifact connects to others if used in a Cluster.
- **Content Source:** Derived from the "Architectural Hierarchy" of the parent Cluster.

**Template:**

```markdown
## SYMBIOTIC CONNECTIONS
*   **Upstream:** I receive data from [Insert Upstream Artifact].
*   **Downstream:** I send data to [Insert Downstream Artifact].
*   **Lateral:** I collaborate with [Insert Partner Artifact].
```

------

#### 3. Summarize

This blueprint correctly attributes the **Origin/Implementer** to `['Symbiotic Role Artifact'(-ing) BPMS]:['The Chaperone Agent'(-ing) BPMS]`. This reflects that the "Chaperone" (the active agent responsible for guiding processes) is the entity responsible for defining how artifacts are encapsulated into skills. The blueprint remains robust, covering all artifact types including the critical **Dataset** logic, ensuring full modularity for external use.