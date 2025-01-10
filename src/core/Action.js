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

export class Action {
  /**
   * @param {string} name
   * @param {Record<string, ParamDefinition>} params
   */
  constructor(name, params = {}) {
    this.name = name;
    this.params = params;
  }

  getName() {
    return this.name;
  }

  getParams() {
    return this.params;
  }

  /**
   * @returns {Object} Default payload with all parameters set to their default values
   */
  getDefaultPayload() {
    console.log("Getting default payload for:", this.name);
    console.log("Params:", this.params);
    const payload = {};
    Object.entries(this.params).forEach(([key, param]) => {
      payload[key] = param.default !== undefined ? param.default : null;
    });
    return payload;
  }

  execute(context) {
    throw new Error("Action.execute() must be implemented by subclass");
  }
}
