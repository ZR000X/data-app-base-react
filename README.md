# Interactive Data Design Tool

A flexible web app data design tool for testing out underlying data structures and actions for any application.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/game-engine-ui.git
cd game-engine-ui
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

### Development

1. Create a new world in `src/worlds/`
2. Define systems within your world
3. Create nodes with actions
4. Register your world in `src/App.js`

Example:

```javascript
// src/worlds/myworld/index.js
import { World } from "../../core/World";
import { MySystem } from "./systems/mysystem";

export const myWorld = new World("myworld", [new MySystem()]);

// src/App.js
import { myWorld } from "./worlds/myworld";

const worlds = [myWorld];
```

## Features

### Core Functionality

- Multiple worlds support
- System and node-based architecture
- Action-driven state management
- Built-in test runner with visual results
- Persistent state across sessions
- Dark/light mode support

### State Management

- Real-time state editing
- JSON validation
- State persistence across page refreshes
- Import/export state functionality
- Automatic state initialization for new nodes
- State history through file saves

### Action System

- Parameter validation
- Default values
- Required field checks
- Interactive payload editor
- Parameter documentation
- Test cases for each action

### Testing

- Built-in test runner
- Visual test results
- Pass/fail statistics
- Detailed error reporting
- Expected vs actual comparison
- Test case documentation

### UI Features

- Monaco editor integration
- JSON formatting
- Error highlighting
- Clipboard support
- Responsive layout
- System navigation
- Action selection
- Log viewer
- Dark/light mode toggle

## Architecture

### Core Components

- `World`: Container for systems
- `System`: Container for nodes
- `Node`: State container with actions
- `Action`: State transformation with tests
- `NodeUI`: Visual representation of node state

### State Management Features

- Real-time state synchronization across all views
- Persistent storage in localStorage
- Import/Export state as JSON files
- State reset functionality
- Automatic state initialization
- Manual state editing
- State history through file saves

### File Structure

```
src/
  core/
    Action.js     # Base action class with test runner
    Node.js       # Node management
    System.js     # System organization
    World.js      # World container
    NodeUI.js     # Base UI class for nodes
  worlds/
    example/      # Example implementation
      systems/
        counter/  # Simple counter system
        character/# Character management system
```

### State Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   NodeUI    │    │    Node     │    │   Master    │
│  Actions    │───>│    State    │───>│    State    │
└─────────────┘    └─────────────┘    └─────────────┘
                          ▲                   │
                          │                   │
                          └───────────────────┘
                           State Persistence
```

## Usage

### Creating an Action

```javascript
const action = new Action(
  "actionName",
  {
    paramName: {
      type: "string",
      description: "Parameter description",
      default: "defaultValue",
      required: true,
    },
  },
  handler,
  tests
);
```

### Creating a Node

```javascript
const node = new Node("nodeName", [action1, action2], initialState, MyNodeUI);
```

### Creating a System

```javascript
const system = new System("systemName", [node1, node2]);
```

### Creating a World

```javascript
const world = new World("worldName", [system1, system2]);
```

### Creating a NodeUI

```javascript
export class MyNodeUI extends NodeUI {
  render() {
    const state = this.getState();
    // Access state values
    const { value } = state;

    // Execute actions
    const handleAction = () => {
      this.executeAction("actionName", { param: "value" });
    };

    return (
      // Your React JSX here
      <Button onClick={handleAction}>Current Value: {value}</Button>
    );
  }
}
```

## State Management

- States are automatically persisted to localStorage
- States can be exported to JSON files
- States can be imported from JSON files
- Each node maintains its own state
- States are initialized with defaults
- States can be manually edited through the UI
- States can be reset to initial values
- States sync automatically between UI and actions
- States persist across page refreshes
- States can be downloaded/uploaded as JSON

## Testing

- Tests are defined per action
- Tests run automatically on action creation
- Tests verify state transformations
- Tests verify action responses
- Test results are visible in the UI
- Failed tests show detailed comparisons

## UI System

### Creating a NodeUI

```javascript
import { NodeUI } from "../core/NodeUI";

export class MyNodeUI extends NodeUI {
  render() {
    const state = this.getState();
    return (
      // Your React JSX here
      // Use this.executeAction(actionType, payload) to trigger actions
    );
  }
}
```

### Registering UI with a Node

```javascript
const node = new Node(
  "nodeName",
  actions,
  initialState,
  MyNodeUI // Pass the UI class here
);
```

### UI Features

- Automatic state synchronization
- Direct action execution
- Real-time updates
- Persistence across sessions
- Dark/light mode support
- Custom styling and layout
- Material-UI integration
