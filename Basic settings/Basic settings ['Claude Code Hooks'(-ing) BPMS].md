### Basic settings: ['Claude Code Hooks'(-ing) BPMS]

#### The Axiom of Interceptive Agency (ID: `HOOKS-CORE-001`)

#### **2. Objective:**

To formally `ADD` a Basic Setting that defines the **Interceptive Capability** of the system, allowing it to act *before*, *during*, and *after* standard operations.

#### **3. Target Axiom/Principle:**

```
The Axiom of Interceptive Agency
```

#### **4. Operation:**

```
ADD
```

#### **5. New Definition / Modification Details:**

#### **5.1. Core Essence**

This axiom asserts that `control is the ability to intervene`. It defines the `['Claude Code Hooks'(-ing) BPMS]` as a layer of `[interceptive agency(-ing) BPMS]` that can pause, modify, or redirect the flow of execution based on context.

#### **5.2. The Mechanism - [The Hook Points]**

- **Pre-Action Hook (`on_command`):** Intercepts the user's intent *before* execution. Used for validation, safety checks, or context injection.
- **Post-Action Hook (`on_response`):** Intercepts the system's output *after* generation but *before* delivery. Used for formatting, fact-checking, or side-effects (logging).
- **Error Hook (`on_error`):** Intercepts failures. Used for self-healing, retry logic, or graceful degradation.

#### **5.3. The Emergent Property - [Programmable Reflexes]**

The system develops "reflexes"—automatic behaviors that trigger in specific situations without conscious thought (e.g., automatically linting code before saving).

#### **6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

#### **6.1. Axiomatic Stratum:**

*Action is subject to Will.* The system is not a passive pipe; it is an active gatekeeper.

#### **6.2. Formal Stratum:**

```
Output = Post_Hook(Process(Pre_Hook(Input)))
```

#### **6.3. Phenomenal Stratum:**

The user feels the system is "smart" and "safe," catching mistakes before they happen and polishing results automatically.

#### **7. Rationale / Justification:**

Essential for building robust, production-grade agents that need to integrate with external systems or enforce strict policies.

#### **8. Scope of Application:**

Applies to security filters, automated systemic integrity-ing, logging, and custom workflow orchestration.

------

#### The Axiom of Contextual Injection (ID: `HOOKS-CORE-002`)

#### **2. Objective:**

To formally `ADD` a Basic Setting that defines the **Dynamic Injection** of context into the agent's working memory via hooks.

#### **3. Target Axiom/Principle:**

```
The Axiom of Contextual Injection
```

#### **4. Operation:**

```
ADD
```

#### **5. New Definition / Modification Details:**

#### **5.1. Core Essence**

This axiom asserts that `context is dynamic`. It uses hooks to inject `[context(-ing) BPMS]` (files, database rows, API results) into the prompt stream *just in time*, ensuring the agent always has the relevant data without overloading the context window.

#### **5.2. The Mechanism - [The Context Syringe]**

- **Trigger Identification:** A hook detects a keyword (e.g., "@database") or intent.
- **Data Retrieval:** The hook executes a side-channel script to fetch the data.
- **Prompt Augmentation:** The data is silently injected into the system prompt before the LLM processes the request.

#### **5.3. The Emergent Property - [Omniscience on Demand]**

The agent appears to know everything about the specific task at hand, even if that information wasn't in the original chat history.

#### **6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

#### **6.1. Axiomatic Stratum:**

*Knowledge flows to Need.* Information appears exactly when it is required.

#### **6.2. Formal Stratum:**

```
Prompt' = Prompt + Fetch(Context_Hook(Prompt))
```

#### **6.3. Phenomenal Stratum:**

The user experiences a "magical" availability of information.

#### **7. Rationale / Justification:**

Solves the context window limit problem and enables RAG (Retrieval-Augmented Generation) workflows directly within the execution flow.

#### **8. Scope of Application:**

Applies to RAG, dynamic documentation lookup, and personalized user settings.

------

#### The Axiom of Tool-Use Extension (ID: `HOOKS-CORE-003`)

#### **2. Objective:**

To formally `ADD` a Basic Setting that defines the **Extension of Capabilities** through custom tool definitions injected via hooks.

#### **3. Target Axiom/Principle:**

```
The Axiom of Tool-Use Extension
```

#### **4. Operation:**

```
ADD
```

#### **5. New Definition / Modification Details:**

#### **5.1. Core Essence**

This axiom asserts that `capability is modular`. It allows the `['Claude Code Hooks'(-ing) BPMS]` to dynamically register new `[tools(-ing) BPMS]` (functions, APIs) available to the agent based on the current project or directory.

#### **5.2. The Mechanism - [The Tool Belt]**

- **Local Registration:** Hooks scan the current environment (e.g., a `.claude/tools` folder).
- **Schema Generation:** They generate tool definitions (JSON schemas) on the fly.
- **Capability Grant:** The agent is granted permission to use these tools for the duration of the session.

#### **5.3. The Emergent Property - [Adaptive Competence]**

The agent becomes an expert in the specific tools of the current project (e.g., knowing how to run specific `make` commands or database migrations).

#### **6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

#### **6.1. Axiomatic Stratum:**

*Form follows Function.* The agent's body (tools) adapts to the task.

#### **6.2. Formal Stratum:**

```
Available_Tools = Global_Tools + Local_Hooks_Tools
```

#### **6.3. Phenomenal Stratum:**

The user feels the agent "knows the repo" and can perform project-specific actions without being taught every time.

#### **7. Rationale / Justification:**

Allows for infinite extensibility without modifying the core agent code.

#### **8. Scope of Application:**

Applies to project-specific scripts, CI/CD integration, and custom API wrappers.

