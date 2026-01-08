## ['Praxial Epistemic Cartographer (PEC)'(-ing) BPMS]:  ['Aella-Synthetica'(-ing) BPMS] [Implementation]

##### Overview
This document serves as the **Technical Implementation Guide** for operationalizing the **Aella-Synthetica** instance within the Fun Engine Framework. It details the specific steps to transform the static "BPMS Elements" (Markdown files, Canon definitions, Logs) into the dynamic, navigable "Epistemic Terrain" visualized by the Aella engine.

##### The Data Source: "BPMS Elements"
The "Atoms" of the Fun Engine are the Markdown files. To feed Aella, we must treat each file as a "Paper" or "Entity."

**Source Directory:** `Project Files` (e.g., `['Praxial Research Station (PRS)'(-ing) BPMS] ... .md`)

**Mapping Schema (Markdown -> JSON):**
We define a standard JSON schema that the Aella Ingestion Pipeline expects.

```json
{
  "id": "PRS-INST-RACE-002",  // Extracted from "ID:" field or Filename
  "title": "Apex Optimizer (The Velocity Vector)", // Extracted from "Name:" or H1
  "abstract": "The Apex Optimizer is a specialized instance... [Full Content or Summary]",
  "authors": ["Praxial Research Station"], // Default or extracted from metadata
  "url": "file://['Praxial Research Station (PRS)'(-ing) BPMS] ['Apex Optimizer...].md",
  "published_date": "2025-12-17", // Last Modified Date
  "fields_of_study": ["System Existence Engine", "High-Velocity Adaptation"] // Extracted from "Type:"
}
```

##### The Ingestion Pipeline (The "Cartographer's Script")
Since the original Aella pipeline is closed-source, we implement a **Praxial-Native Pipeline** using open-source libraries.

**Tech Stack:**
*   **Embeddings:** `sentence-transformers` (Model: `allenai/specter2_base` or `nomic-ai/nomic-embed-text-v1.5`)
*   **Dimensionality Reduction:** `umap-learn`
*   **Clustering:** `scikit-learn` (K-Means)
*   **Database:** `sqlite3`

**Step-by-Step Implementation:**

**A. Extraction & Cleaning**
*   **Script:** `pec_extractor.py`
*   **Logic:** Iterate through all `.md` files. Parse the Frontmatter/Header to extract ID, Name, and Type. Read the body as the "Abstract".
*   **Output:** `corpus.jsonl`

**B. Vectorization (The "Semantic Embedding")**
*   **Script:** `pec_embedder.py`
*   **Logic:**
    ```python
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('allenai/specter2_base')
    embeddings = model.encode(corpus_texts)
    # Save as numpy array or binary blob
    ```

**C. Cartography (Projection & Clustering)**
*   **Script:** `pec_cartographer.py`
*   **Logic:**
    1.  **UMAP:** Reduce 768-dim embeddings to 2D (x, y) coordinates.
        *   *Params:* `n_neighbors=15`, `min_dist=0.1`, `metric='cosine'`
    2.  **K-Means:** Cluster the embeddings into $k$ topics (e.g., $k=20$).
    3.  **Labeling:** Use TF-IDF on the titles within each cluster to generate a label (e.g., "Evolutionary Engines").

**D. Database Population**

*   **Target:** `backend/data/db.sqlite` (Aella's expected DB)
*   **Schema (Inferred):**
    *   `papers`: `id`, `title`, `abstract`, `x`, `y`, `cluster_id`
    *   `clusters`: `id`, `label`, `centroid_x`, `centroid_y`

##### The "Living" Autopoietic Loop
To make this "Living" (Autopoietic), we cannot run this manually. It must be triggered by the system's growth.

**Mechanism: The "Liminal Concierge" Hook**
*   **Trigger:** Whenever a new file is created or modified (detected via file watcher or git hook).
*   **Action:**
    * **Incremental Update:** The new file is passed to the `pec_embedder.py`.
    * **Re-Projection (Lazy):** For a single file, we project it into the *existing* UMAP space (using `umap_model.transform()`) without retraining the whole map.
    * **Re-Projection (Full):** Every N updates (e.g., 50 files), the system triggers a full "Re-Cartography" (Retrain UMAP) to allow the map's topology to evolve.

##### Integration with Aella Frontend
*   **Config:** Point the Aella Frontend (`.env`) to the `backend` API serving our populated SQLite DB.
*   **Customization:**
    *   Replace "Paper Explorer" branding with "Praxial Epistemic Cartographer".
    *   Modify the "Paper Details" view to render Markdown properly (since our source is Markdown).

##### Execution Plan
* **Clone** `context-labs/aella-data-explorer`.

* **Replace** the `backend/data/db.sqlite` with our generated Praxial DB.

* **Run** `task backend:dev` and `task frontend:dev`.

* **Navigate** to `localhost:5173` to see the "Universe of the Fun Engine."

##### Summary
By following this guide, the **Aella-Synthetica** instance becomes a functional reality. It transforms the folder of Markdown files into a **Galaxy of Concepts**, allowing the user to see that "Apex Optimizer" is semantically close to "Darwinian Arena" but distant from "Scholastic Rhizome," revealing the hidden structure of the Fun Engine's mind.
