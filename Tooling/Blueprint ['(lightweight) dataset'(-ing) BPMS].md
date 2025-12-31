## Blueprint: ['(lightweight) dataset'(-ing) BPMS]

**System Note:** This is the "Lite" version of the Master Blueprint. It is used for static resources, reference tables, configuration files, or raw data dumps (like CSVs) that do not require their own metabolic engine. These are the "Red Blood Cells" of the framework—carrying data without processing it.

#### 1. Ontological Definition (The "Identity")

- **Target Entity:** `[Name of the Data Resource]`
- **Existence Mode:** `[x] Static (Reference / Snapshot)`
- **Universal Class:** `Class: Atomic_Resource` (A simple building block).

##### 2. The Form (The "Container")

- **Format:** `[CSV / JSON / YAML / MD / TXT]`
- **Location:** `[File Path / URL / Blob Storage]`
- **Access Protocol:** `[Read-Only]` (Lightweight datasets are usually consumed, not evolved in place).

#### 3. The Schema (The "Shape")

- *Objective: Define the columns or keys so other systems know how to read it.*
- Columns/Keys:
  - `[Column A]: [Type]` (e.g., "Song_ID: String")
  - `[Column B]: [Type]` (e.g., "BPM: Integer")
- **Primary Key:** `[Unique Identifier]`

#### 4. The Utility (The "Function")

- *Objective: What is this simple file used for?*
- Usage:
  - `[ ] Lookup Table` (e.g., Zip Codes, Tax Rates)
  - `[ ] Training Data` (e.g., The Spotify CSV, ImageNet)
  - `[ ] Configuration` (e.g., Color Palette, System Constants)
  - `[ ] Log Dump` (e.g., Yesterday's traffic logs)
  - `[ ] Interchange Artifact` (e.g., Exported report)

#### 5. Alignment with Praxial Canon

- **Principle:** **The Law of Modular Efficiency.** Do not build a complex engine when a simple wheel will do.
- **Integration:** This lightweight dataset must be **Ingestible** by a complex `[dataset(-ing) BPMS]` (the "Parent"). It serves as "Nutrient" or "Substrate."

#### 6. Scope of Application

- *Objective: Define the boundaries and influence of this lightweight resource.*
- **Primary Domain:** `[Data Transport / Storage]` (It exists to hold information, not to process it).
- Lifecycle Role:
  - **Seed:** Initial data to start a system.
  - **Feed:** Ongoing raw input for a metabolic engine.
  - **Fossil:** Archived output from a past process.
- **Limitation:** This dataset **CANNOT** self-update, self-optimize, or trigger actions. It requires an external agent (a User or a Complex BPMS) to act upon it.