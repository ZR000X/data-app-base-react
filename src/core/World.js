/**
 * @typedef {import('./System').System} System
 */

export class World {
  /**
   * @param {string} name
   * @param {System[]} systems
   */
  constructor(name, systems) {
    this.name = name;
    this.systems = new Map(systems.map((system) => [system.name, system]));
  }

  /**
   * @returns {Record<string, any>}
   */
  getState() {
    const state = {};
    for (const [systemName, system] of this.systems) {
      state[systemName] = system.getState();
    }
    return state;
  }

  /**
   * @param {string} systemName
   * @param {string} nodeName
   * @param {string} actionType
   * @param {any} payload
   */
  runAction(systemName, nodeName, actionType, payload) {
    const system = this.systems.get(systemName);
    if (!system) {
      throw new Error(`Unknown system: ${systemName}`);
    }
    return system.runNodeAction(nodeName, actionType, payload);
  }
}
