/**
 * @typedef {import('../types').State} State
 */

export class DataSystem {
  /**
   * @param {Record<string, import('./Action').Action>} actions
   * @param {State} initialState
   */
  constructor(actions, initialState) {
    this.actions = new Map(Object.entries(actions));
    this.state = initialState;
  }

  /**
   * @returns {State}
   */
  getState() {
    return this.state;
  }

  /**
   * @param {State} state
   */
  setState(state) {
    this.state = state;
  }

  /**
   * @returns {Map<string, import('./Action').Action>}
   */
  getActions() {
    return this.actions;
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
