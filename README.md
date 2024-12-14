# JSON State Machine Playground

## What is this?

A ridiculously simple barebones framework for building data-first, state-transition focused applications. Perfect for developers who think in terms of data structures and transformations first, UI second.

## Why does it exist?

I created something like this to model a MongoDB application that I was designing. At the time I was used to building applications with a more traditional SQL database, where I could think less about backend code and focus on the tables and relationships and SQL interface between backend code and database stored procedures. I build a framework for that as well.

At some point I realised that I could build something that allowed me to write javascript code that would be executed in a node.js environment, and that would allow me to model the application state and actions in a way that would be easy to understand and modify. This way I could focus on the data and the business logic I was trying to model, writing the CRUD operations and validations, hence designing the data with some assurance that it wasn't too far away from a reasonable, implementable design.

The functional UI that is pre-built gives you a very simple way to perform actions against your data state, so you can see what the logic you've coded up actually does. By being able to simply manipulate the state manually as well, it provides a great playground to simulate the data flows you want to model.

This all works well when you're focused on the data and are not too concerned about the UI. For some applications this is all you need. The UI then bends to the data and the logic you've designed. After designing your data logic and the actions you want to perform on it, you can then build the UI to match and make it more user-friendly, which beautiful views, themselves just actions, that offer the user intuitive ways to interact with the data.

There are other ideas for testing, using AI agents to explore the data space, and other ideas for how to make this more useful, but this is a good start.

## 🤔 Is This Framework For You?

This framework is ideal if you:

- Prefer to think about data structures and state transitions before UI
- Want to build complex business logic with rigorous validation
- Need to maintain a clear audit trail of state changes
- Want to focus on business logic while getting a functional UI "for free"

It might not be for you if:

- You prefer UI-first development

## 🚀 Core Concepts

### State

Your application's local state is a JSON object. Every action operates on this state with some payload, producing a new state.

### Actions

Actions are functions that product a new state and JSON response from the current state and JSON payload:

```javascript
const myAction = (payload, state) => {
  // Transform state based on payload
  const newState = { ...state, someField: payload.value };

  return {
    response: "Action completed successfully",
    newState,
  };
};
```

### Logging

The framework provides a logging feature which is a function that can be imported into any action and called during execution of the action to emit a log message. This is useful for debugging and tracking the state of the application. It is important to note that actions can run other actions. While responses are only provided on completion of the initial action that was called, logs are emitted during the execution of any action.

## 🛠️ Getting Started

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Initialize your actions:

```bash
cp -r src/actions-init src/actions
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

## 📁 Project Structure

```
src/
  ├── actions/          # Template actions to get started
  ├── core/             # Core framework code
  ├── utils/            # Utility functions
  └── ui/               # Pre-built UI components
```

## 🎯 Creating Your First Action

1. In `src/actions/index.js`, add your action:

```javascript
export const actions = {
  myAction: {
    handler: myAction,
    label: "My First Action",
    category: "Custom",
    description: "Does something awesome",
    params: {
      field1: {
        type: "string",
        description: "An important field",
        required: true,
      },
    },
  },
};
```

2. Create your action handler:

```javascript
const myAction = (payload, state) => {
  // Validate
  validateMyAction(payload, state);

  // Transform state
  const newState = {
    ...state,
    myField: payload.field1,
  };

  return {
    response: "Action completed",
    newState,
  };
};
```

## 🧪 Testing Actions

The framework provides a built-in playground to test your actions:

1. Select your action from the dropdown
2. Configure the payload in the JSON editor
3. Click "Execute" to run the action
4. View the state changes in real-time

## 🎨 UI Generation

The framework automatically generates a functional UI based on your actions and state:

- Action selection dropdown
- JSON editors for payload and state
- Response visualization
- State history browser
- Dark/light theme support

## 📚 Example Applications

Check out these examples in the `examples/` directory:

- Product Catalog Manager
- Workflow Engine
- Document Processor
- Configuration Manager

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
