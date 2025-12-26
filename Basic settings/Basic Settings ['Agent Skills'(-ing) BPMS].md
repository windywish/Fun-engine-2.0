## Basic Settings: ['Agent Skills'(-ing) BPMS]

### The Principle of Modular Competence. (ID: `ASK-CORE-001`)

**Objective:** To formally `ADD` a Basic Setting that defines the **Agent Skill** as the fundamental unit of executable competence within the Fun Engine.

**Target Axiom/Principle:** The Principle of Modular Competence.

**Operation:** `ADD`

**New Definition / Modification Details:**

- **Core Essence:** This law asserts that `competence is a file, not a thought`. It defines a "Skill" not as a vague ability, but as a concrete, addressable directory containing `SKILL.md` (Instructions), `scripts/` (Code), and `resources/` (Context).
- The Mechanism - [The Container of Capability]:
  - **The Manifest (Metadata):** The YAML frontmatter (`name`, `description`) that allows the system to know *what* the skill does without loading it.
  - **The Procedure (Instructions):** The `SKILL.md` file that acts as the "Standard Operating Procedure" (SOP) for the agent.
  - **The Toolset (Executable):** Python scripts or bash commands that perform deterministic actions, removing ambiguity from execution.
- **The Emergent Property - [Portable Mastery]:** The creation of "Plug-and-Play Expertise" where a `['holonic mind'(-ing) BPMS]` can instantly acquire a PhD-level capability (e.g., "PDF Analysis") simply by mounting the correct folder.

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]:**

- **Axiomatic Stratum:** *To know is to have the file.* Knowledge is externalized and modular.
- **Formal Stratum:** `Skill_Efficiency = (Deterministic_Code_Execution) / (Probabilistic_Token_Generation)`.
- **Phenomenal Stratum:** The agent experiences "Downloadable Reflexes."

**Rationale / Justification:** Aligns with the "Agent Skills" standard (Anthropic), moving the system from "trying to figure it out" to "following the manual."

**Scope of Application:** Applies to all task execution, tool use, and specialized agent roles.

---

#### The Principle of Just-in-Time Cognition (ID: `ASK-CORE-002`)

**Objective:** To establish the mechanism of **Progressive Disclosure** as the primary method for managing cognitive load during complex tasks.

**Target Axiom/Principle:** The Principle of Just-in-Time Cognition.

**Operation:** `ADD`

**New Definition / Modification Details:**

- **Core Essence:** This law asserts that `context is a cost; load only what you pay for`. It defines the operational flow of a Skill as a tiered loading process.
- The Mechanism - [The Aperture of Attention]:
  - **Level 1 (The Glance):** The system only sees the `description` of the skill. (Cost: ~100 tokens).
  - **Level 2 (The Read):** Upon trigger, the system reads `SKILL.md`. (Cost: <5k tokens).
  - **Level 3 (The Deep Dive):** Only when explicitly referenced does the system read `REFERENCE.md` or execute `script.py`. (Cost: Variable).
- **The Emergent Property - [Infinite Context Scalability]:** The system can theoretically possess infinite skills, but only "carries the weight" of the one it is currently using.

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]:**

- **Axiomatic Stratum:** *Focus is the exclusion of the irrelevant.*
- **Formal Stratum:** `Context_Load = Active_Skill_Size + Task_Specific_Data` (NOT Sum of All Knowledge).
- **Phenomenal Stratum:** The agent experiences "Clarity."

**Rationale / Justification:** Essential for the "Fun Engine" to scale. Without this, the "Memory Core" would overflow with unused instructions.

**Scope of Application:** Applies to memory management, context window optimization, and multi-agent orchestration.

---

#### **The Principle of Hybrid Rigor (ID: `ASK-CORE-003`)**

**Objective:** To define the symbiotic relationship among/by **Probabilistic Reasoning** (LLM) and **Deterministic Execution** (Code).

**Target Axiom/Principle:** The Principle of Hybrid Rigor.

**Operation:** `ADD`

**New Definition / Modification Details:**

- **Core Essence:** This law asserts that `thoughts should be fluid, but actions should be solid`. It mandates that any repeatable, logic-heavy task MUST be encapsulated in code (scripts) within the Skill, rather than generated on the fly.
- The Mechanism - [The Brain-Hand Protocol]:
  - **The Brain (LLM):** Decides *which* tool to use and *what* parameters to send. Handles the ambiguity of user intent.
  - **The Hand (Script):** Executes the logic (e.g., `calculate_tax.py`, `parse_csv.py`). It never hallucinates; it only errors or succeeds.
- **The Emergent Property - [Reliable Magic]:** The user feels the "magic" of AI understanding, backed by the "reliability" of software engineering.

**Alignment with ['Praxial Genesis Canon'(-ing) BPMS]:**

- **Axiomatic Stratum:** *Do not guess what you can calculate.*
- **Formal Stratum:** `Reliability = 1 - (Hallucination_Rate * Code_Coverage)`.
- **Phenomenal Stratum:** The agent experiences "Confidence."

**Rationale / Justification:** Prevents the "Fun Engine" from breaking immersion due to calculation errors or inconsistent logic.

**Scope of Application:** Applies to `['The Tabular Genesis Engine'(-ing) BPMS]`, `['Praxial Code-Genesis Engine'(-ing) BPMS]`, and math/logic modules.