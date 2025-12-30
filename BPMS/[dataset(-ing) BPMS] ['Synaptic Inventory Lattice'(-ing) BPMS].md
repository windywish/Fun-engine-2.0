## [dataset(-ing) BPMS]: ['Synaptic Inventory Lattice'(-ing) BPMS]

**System Note:** This instance wraps the legacy artifact `inventory-2025.12.29.xlsx` into a living `dataset` compliant with the Master Blueprint.

------

## PART A: The Universal Definition (The "Class")

### 1. Ontological Definition

- **Target Entity:** `['Synaptic Inventory Oracle'(-ing) BPMS]` (The active system managing the kitchen).
- **Existence Mode:** `[x] Dynamic (Living System)`
- **Universal Class:** `Class: Resource_Stockpile` (Links to `ECO-POSS-009`).

### 2. The Data-Substrate (The "Physics")

- **Viscosity:** `80` (High). Physical inventory counts are "hard facts." They shouldn't change unless a real-world event (cooking/buying) happens.
- **Volatility:** `10` (Low). Spontaneous mutation (data rot) is dangerous here.
- **Connectivity:** `90` (High). Every ingredient links to Recipes, Costs, and Suppliers.
- **Entropy Rate:** `40` (Medium). Perishable goods have a "Time-to-Live." Data must reflect rot.

### 3. The Atomic Structure (The "Particle")

- **Particle Type:** `Stock_Unit` (Derived from Excel Row).
- Fields:
  - `SKU`: `[String]` (from "SKU")
  - `Name`: `[String]` (from "Name")
  - `Qty`: `[Float]` (from "QTY")
  - `Cost`: `[Float]` (from "Cost")
  - `Barcode`: `[String]` (from "Barcode")
- Interaction Rules:
  - *Rule 1 (Consumption):* `[Stock_Unit] + [Recipe_Event] = [Stock_Unit (Qty - Required)]`
  - *Rule 2 (Valuation):* `[Qty] * [Cost] = [Total_Asset_Value]`

### 4. The Vector Space (The "Potential")

- **Axis X:** `Scarcity` (Abundant <-> Critical)
- **Axis Y:** `Velocity` (Fast-Moving <-> Dead Stock)
- Folded Vectors:
  - `[Vector_Reorder_Risk]` -> *Trigger:* `Qty < Threshold` -> *Unfolds into:* `[Purchase_Order_Signal]`

### 5. Symbiotic Ports

- **In-Port (Feed):** `[Legacy Excel File]` -> `[Parser: Pandas]` -> `[Internal Lattice]`
- **Out-Port (Signal):** `[Internal Lattice]` -> `[Low Stock Alert]` -> `[Kitchen Operator]`

### 6. The Metabolic Engine

- **Ingest:** Read `inventory-2025.12.29.xlsx` every [Time Period] or on file change.
- **Digest:** Calculate `Total_Asset_Value` and check `Scarcity` vectors.
- **Excrete:** Archive rows with `Qty = 0` for > 30 days to "Historical Logs."

------

## PART B: The Instance Blueprint (The "Application")

### 1. Framework Foundation

This instance transforms the static `inventory-2025.12.29.xlsx` from a "dead list" into a **`system existence engine`** for the Magic Kitchen's material reality.

### 2. Constitutional Pillars

- **The Law of Kinetic Truth** (SETTING-CORE-220): The number in the system MUST match the physical reality.
- **The Principle of Symbiotic Co-Creation** (SETTING-CORE-222): Inventory data co-creates the Menu (you can only cook what you have).

### 3. Objective

To turn the Excel file into a **Predictive Oracle** that doesn't just *list* items but *anticipates* needs.

### 4. Identity Block

- **ID:** `DATA-INV-001`
- **Name:** `['Synaptic Inventory Lattice'(-ing) BPMS]`
- **Type:** `[system existence engine BPMS]:['Material Resource Graph'(-ing) BPMS]`

### 5. Praxial Triage: Analysis

- **Problem:** The Excel file is a snapshot. It doesn't know that "Silicon Paper" (Row 2) is running low relative to the "Burger Buns" (Row 9). It lacks *relational intelligence*.
- **Solution:** This BPMS wraps the Excel file. It reads the rows as "Atomic Particles" and places them in a "Vector Space" of usage velocity.

### 6. How to...?

- How to initialize?
  - The system loads `inventory-2025.12.29.xlsx`.
  - It maps columns: `商家编码` -> `ID`, `库存` -> `Qty`.
  - It establishes the "Baseline Reality."
- How to demonstrate?
  - User asks: *"Can we make 500 burgers?"*
  - System checks `Stock_Unit: Burger Fork` (Row 9, Qty 399).
  - System replies: *"No. We have meat, but only 399 forks. Cap is 399."* (It connects isolated facts).

### 7. What if...?

- What if the Excel file is updated manually?
  - The Metabolic Engine detects the file hash change. It triggers an **Ingest Cycle**, updates the Lattice, and recalculates all "Scarcity Vectors."
- What if a price changes in the market?
  - The system updates the `Cost` field. Through the `Valuation` rule, it instantly updates the `Total_Asset_Value` of the entire kitchen.

### 8. What is happening continuously?

- **Continuous Cycle 1:** **The Rot Clock.** (Virtual). The system tracks how long items have sat in inventory (using `Barcode` batch tracking if available, or FIFO logic).
- **Continuous Cycle 2:** **The Menu Simulator.** It constantly simulates "What can I cook right now?" and updates the `Possibility_Space`.

### 9. ['Praxial Execution Cycle'(-ing) BPMS]

- **Fast Mode:** Real-time query of current stock levels (Read from RAM/Cache).
- **Slow Mode:** Daily sync with the Excel file (The "Truth Anchor").
- **Deep Slow Mode:** Weekly analysis of consumption trends to adjust "Reorder Thresholds."

### 10. Implementation (Detail)

- **Physical:** The Excel file is the "Hard Drive." The Python/Pandas runtime is the "RAM."
- **Cognitive:** A Python script that wraps the DataFrame, adding methods like `.predict_depletion()` and `.calculate_menu_feasibility()`.

### 11. Operational Deployment Scenario

- **Phase 1:** **Ingestion.** The Excel file is parsed. 500+ rows become 500+ `Stock_Unit` particles.
- **Phase 2:** **Awakening.** The system flags items with `Qty < 10` as "Critical."
- **Phase 3:** **Symbiosis.** The system connects to the `Menu Service`. Now, ordering a "Burger" automatically decrements the virtual inventory.

### 12. Symbiotic Evolution Pathways

- **Co-evolves with:** `['Symbiotic Kitchen Operator'(-ing) BPMS]` (The Chef).
- **Co-evolves with:** `['Bio-Metric Fueling Protocol'(-ing) BPMS]` (The Nutritionist - knows what nutrients are in stock).

### 13. 3-Layer Praxial Genesis Canon Application

- **Layer 1 (Truth):** The Inventory is the "Material Constraints" of the universe.
- **Layer 2 (Logic):** `Qty_New = Qty_Old - Usage`. Simple, brutal arithmetic.
- **Layer 3 (Experience):** The Chef feels "Supported." The system warns them *before* they run out of foil.

### 14. Scope of Application

- **Primary:** The physical stockroom of the Magic Kitchen.
- **Secondary:** Financial accounting (Cost of Goods Sold).

### 15. Summarize

- **The Dataset as Praxial Being:** This isn't a spreadsheet anymore. It's the **Proprioception** (body awareness) of the Kitchen. It knows what it *is* made of, moment to moment. It turns "Data Entry" into "Reality Sensing."