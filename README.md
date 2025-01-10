# Data System Base (React JS)

## What is this?

A ridiculously simple barebones framework for building data-first, state-transition focused applications. Perfect for developers who think in terms of data structures and transformations first, UI second.

## Core Concepts

### Worlds, Systems, and Nodes

The framework is organized hierarchically:

- **Worlds**: Top-level containers that group related systems
- **Systems**: Collections of related nodes (e.g., "character system", "inventory system")
- **Nodes**: Individual state containers with their own actions

Example:

```javascript
// Define a node with actions
export class CharacterNode extends Node {
  constructor(name) {
    super(name, [levelUpAction, gainExperienceAction], {
      level: 1,
      experience: 0,
      strength: 10,
      dexterity: 10,
      intelligence: 10,
    });
  }
}

// Create a system with nodes
export class CharacterSystem extends System {
  constructor() {
    super("character", [createCharacterNode("character")]);
  }
}

// Create a world with systems
const gameWorld = new World("game", [new CharacterSystem()]);
```

### Actions

Actions are the core building blocks that transform state. They:

- Accept a payload and current state
- Return a new state and response
- Can emit logs during execution
- Include parameter definitions for validation

Example Action:

```javascript
class LevelUpAction extends Action {
  constructor() {
    const params = {
      statPoints: {
        type: "number",
        description: "Number of stat points to allocate",
        default: 1,
        required: true,
      },
      attribute: {
        type: "string",
        description:
          "Attribute to increase (strength, dexterity, intelligence)",
        default: "strength",
        required: true,
      },
    };
    super("levelUp", params);
  }

  execute({ state, payload }) {
    // Validation
    if (!validAttributes.includes(payload.attribute)) {
      throw new Error(`Invalid attribute: ${payload.attribute}`);
    }

    // State transformation
    const newState = {
      ...state,
      level: state.level + 1,
      [payload.attribute]: state[payload.attribute] + payload.statPoints,
    };

    // Logging
    log(`Character leveled up to ${newState.level}!`);

    return {
      state: newState,
      response: `Leveled up to ${newState.level}`,
    };
  }
}
```

### Logging

Built-in logging system for tracking action execution:

- Automatic ID generation
- Timestamp tracking
- Support for different log levels (info, warning, error)
- Reverse chronological display

```javascript
log(`Gained ${amount} experience from ${source}`);
log(`Level up available!`, "warning");
log(`Invalid operation`, "error");
```

## Getting Started

1. Clone and install:

```bash
git clone <repository-url>
cd data-system-base
npm install
```

2. Start the development server:

```bash
npm start
```

3. Create your first world:

```javascript
// src/worlds/myWorld/index.js
import { World } from "../../core/World";
import { MySystem } from "./systems/mySystem";

const systems = [new MySystem()];
export const myWorld = new World("myWorld", systems);
```

## Example Worlds

The framework includes two example worlds:

### 1. Counter World

A simple example demonstrating basic state management:

- Single increment action
- Numeric state tracking
- Basic logging

### 2. Game World

A more complex example showing:

- Multiple interdependent actions (levelUp, gainExperience)
- Rich parameter definitions
- State validation
- Complex business logic
- Multi-level logging

## UI Features

The framework provides a built-in UI with:

- World/System/Node navigation
- Action selection with parameter validation
- JSON state editor
- Action parameter documentation
- Real-time logging
- Dark/light theme support

## Best Practices

1. **Action Design**

   - Define clear parameter specifications
   - Include meaningful descriptions
   - Set sensible defaults
   - Validate inputs

2. **State Management**

   - Keep state immutable
   - Validate state transitions
   - Use logging to track changes

3. **Error Handling**
   - Throw descriptive errors
   - Use appropriate log levels
   - Validate early, fail fast

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - see LICENSE file for details
