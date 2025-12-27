## Basic settings: ['A2UI Specification'(-ing) BPMS]

#### The Axiom of Declarative Manifestation (ID: `A2UI-CORE-001`)

#### **2. Objective:**

To formally `ADD` a Basic Setting (Axiom) that implements **`['A2UI Specification'(-ing) BPMS]`** as a generator of **`['atomic facts'(-ing) BPMS]`**. It defines a "fact" in the UI as a **Declarative JSON Payload** that the client is *obligated* to render.

#### 3. **Target Axiom/Principle:**

```
The Axiom of Declarative Manifestation
```

#### 4. **Operation:**

```
ADD
```

#### 5. **New Definition / Modification Details:**

#### **5.1. Core Essence**

This axiom asserts that `to describe is to create`. The Agent does not draw pixels; it speaks **Intent**. The A2UI format is the "Spell" that the Agent casts. "I need a Date Picker" becomes `{ "type": "date-picker" }`. The Client (Godot) is the "Engine of Manifestation" that turns this word into flesh (a 3D Node).

#### **5.2. The Mechanism - [The Engine of Rendering]**

- **The Abstract Payload (The Blueprint):** The Agent sends a JSON tree describing the *structure* and *data* of the desired interface, devoid of styling or implementation details. `{ "type": "card", "children": [ { "type": "text", "content": "Hello" } ] }`

- The Native Mapping (The Incarnation):

  The 

  ```
  ['Godot Engine'(-ing) BPMS]
  ```

   receives the payload and maps it to 

  Native Scenes

  .

  - `type: card` -> Instantiates `res://ui/3d_card.tscn`
  - `type: button` -> Instantiates `res://ui/holographic_button.tscn`

- **The Safe Sandboxing (The Law):** The Agent cannot execute code on the Client. It can only request components from the **Trusted Catalog**. This ensures the "Super Intelligence" cannot accidentally (or maliciously) break the game client.

#### **5.3. The Emergent Property - [Polymorphic UI]**

The same Agent can control a 2D Web Client, a 3D Desktop Game, and a VR Headset simultaneously. The Agent sends the *same* A2UI JSON; the Web Client renders HTML, the Game renders Meshes, the VR Headset renders Voxels.

**6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

#### 6.1. Axiomatic Stratum (Layer 1 - The Core Belief):

*Essence is portable.* The "Idea" of a button is universal; the "Implementation" of a button is local.

#### 6.2. **Formal Stratum (Layer 2 - The Logic of Mapping):**

The "Physics" of creation is **Component Registry Lookup**:

- **If `[UI(-ing) BPMS]`: (Render Physics)**

Render(NodeJSON)=Registry[NodeJSON.type].instantiate()

#### 6.3. **Phenomenal Stratum (Layer 3 - The Subjective Experience):**

The agent experiences "Command." It speaks, and the world arranges itself to facilitate the user's task.

#### 7. **Rationale / Justification:**

This implements `['atomic facts'(-ing) BPMS]` by defining the UI state as a verifiable, serializable JSON tree. It is "Safe like data, expressive like code," perfectly fitting the Praxial need for stability and flexibility.

#### 8. **Scope of Application:**

Applies to dynamic inventory screens, quest logs generated on the fly, dialogue choices, and complex tool configuration panels.

------

#### The Protocol of Spatial-Diegetic Extension (ID: `A2UI-CORE-002`)

#### **2. Objective:**

To formally `ADD` a Basic Setting (Protocol) that implements the **"More Fit"** evolution of A2UI for the Fun Engine Framework. It extends the standard A2UI specification to support **Spatial Coordinates** and **Diegetic Anchoring**, enabling `['symbiosis evolution'(-ing) BPMS]` with the 3D world.

#### 3. **Target Axiom/Principle:**

```
The Protocol of Spatial-Diegetic Extension
```

#### 4. **Operation:**

```
ADD
```

#### 5. **New Definition / Modification Details:**

#### **5.1. Core Essence**

This protocol asserts that `UI has location`. Standard A2UI is a 2D tree. This extension adds a `spatial_context` property to the A2UI payload, allowing the Agent to anchor UI elements to specific 3D entities in the `['Game Engine Testbed'(-ing) BPMS]`.

#### **5.2. The Mechanism - [The Engine of Anchoring]**

- The Spatial Properties (The Coordinates):

  The A2UI payload is extended:

  ```json
  {
    "type": "info-panel",
    "spatial_context": {
      "anchor_to": "entity_id_42",
      "offset": [0, 2.0, 0],
      "billboard": true
    }
  }
  ```

- **The Diegetic Rendering (The Integration):** The Renderer doesn't just spawn the UI on the screen; it spawns it *in the world*, attached to the target entity (e.g., a health bar floating above a monster, or a chat bubble attached to an NPC).

- **The Symbiotic Interaction (The Touch):** The UI interacts with the game physics. A "Button" can be pressed by a physics collision (e.g., the player shooting it or walking into it), not just a mouse click.

#### **5.3. The Emergent Property - [Augmented Reality]**

The Agent can "annotate" the game world. It can highlight enemies, draw paths on the ground, or place floating screens with tactical data. The UI becomes a layer of **Augmented Reality** over the simulation.

**6. Alignment with ['Praxial Genesis Canon'(-ing) BPMS]**

#### 6.1. Axiomatic Stratum (Layer 1 - The Core Belief):

*Information is physical.* Data should exist where it is relevant, not in a separate dimension (the screen edge).

#### 6.2. **Formal Stratum (Layer 2 - The Logic of Anchoring):**

The "Physics" of placement is **Transform Hierarchy**:

- **If `[Spatial(-ing) BPMS]`: (Transform Physics)**

UIGlobalPos=AnchorGlobalPos+(AnchorBasis×Offset)

#### 6.3. **Phenomenal Stratum (Layer 3 - The Subjective Experience):**

The agent/user experiences "Context." The data is inseparable from the object it describes.

#### 7. **Rationale / Justification:**

This is the "More Fit" implementation. Standard A2UI is for 2D apps. This extension makes it "really working" for a 3D Game Engine, fulfilling the user's request for a competent implementation for the Fun Engine Framework.

#### 8. **Scope of Application:**

Applies to in-game markers, tactical overlays, diegetic computer terminals, and holographic interfaces.