/**
 * @typedef {import('../types').State} State
 * @typedef {import('./Action').Action} Action
 */

export class Node {
  /**
   * @param {string} name
   * @param {Action[]} actions
   * @param {State} initialState
   * @param {NodeUI} UI
   */
  constructor(name, actions, initialState = {}, UI = null) {
    this.name = name;
    this.actions = new Map(actions.map((action) => [action.getName(), action]));
    this.initialState = initialState;
    this.state = { ...initialState };
    this.UI = UI ? new UI(this) : null;
    this.onStateChange = null;
  }

  /**
   * Set handler for state changes
   * @param {function} handler
   */
  setStateChangeHandler(handler) {
    this.onStateChange = handler;
  }

  /**
   * Get state change handler
   */
  getStateChangeHandler() {
    return this.onStateChange;
  }

  /**
   * @returns {State}
   */
  getInitialState() {
    return this.initialState;
  }

  /**
   * @returns {State}
   */
  getState() {
    return { ...this.state };
  }

  /**
   * @param {State} state
   */
  setState(state) {
    console.log(`Setting state for node ${this.name}:`, state);
    this.state = { ...state };
  }

  /**
   * @param {string} actionType
   * @param {any} payload
   * @returns {{ response: string; newState: State }}
   */
  runAction(actionType, payload) {
    const action = this.actions.get(actionType);
    if (!action) {
      throw new Error(`Unknown action type: ${actionType}`);
    }

    const result = action.execute({
      state: this.state,
      payload,
    });

    this.state = result.state;
    return {
      response: result.response,
      newState: result.state,
    };
  }

  /**
   * @returns {NodeUI}
   */
  getUI() {
    return this.UI;
  }
}
