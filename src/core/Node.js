/**
 * @typedef {import('../types').State} State
 * @typedef {import('./Action').Action} Action
 */

export class Node {
  /**
   * @param {string} name
   * @param {Action[]} actions
   * @param {State} initialState
   */
  constructor(name, actions, initialState = {}) {
    this.name = name;
    this.actions = new Map(actions.map((action) => [action.getName(), action]));
    this.state = initialState;
  }

  /**
   * @param {State} state
   */
  setState(state) {
    this.state = state;
  }

  /**
   * @returns {State}
   */
  getState() {
    return this.state;
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
}
