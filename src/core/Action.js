/**
 * @typedef {import('../types').State} State
 * @typedef {{ state: State, payload: any }} ActionContext
 * @typedef {{ state: State, response: string }} ActionResult
 * @typedef {Object} ParamDefinition
 * @property {string} type
 * @property {string} description
 * @property {any} [default]
 * @property {boolean} [required]
 */

/**
 * @typedef {Object} TestCase
 * @property {Object} input
 * @property {State} input.state Initial state
 * @property {Object} input.payload Action payload
 * @property {Object} output
 * @property {State} output.state Expected final state
 * @property {string} output.response Expected response
 */

export class Action {
  /**
   * @param {string} name
   * @param {Object} params Parameter definitions
   * @param {function} handler Function that executes the action
   * @param {TestCase[]} tests Array of test cases
   */
  constructor(name, params, handler, tests) {
    this.name = name;
    this.params = params;
    this.handler = handler;
    this.tests = tests;
  }

  getName() {
    return this.name;
  }

  getParams() {
    return this.params;
  }

  getDefaultPayload() {
    const payload = {};
    Object.entries(this.params).forEach(([key, param]) => {
      payload[key] = param.default !== undefined ? param.default : null;
    });
    return payload;
  }

  execute(context) {
    return this.handler(context);
  }

  /**
   * @returns {TestCase[]}
   */
  getTests() {
    return this.tests;
  }
}
