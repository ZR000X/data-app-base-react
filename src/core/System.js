/**
 * @typedef {import('./Node').Node} Node
 */

export class System {
  /**
   * @param {string} name
   * @param {Node[]} nodes
   */
  constructor(name, nodes) {
    this.name = name;
    this.nodes = new Map(nodes.map((node) => [node.name, node]));
  }

  /**
   * @returns {Record<string, any>}
   */
  getState() {
    const state = {};
    for (const [nodeName, node] of this.nodes) {
      state[nodeName] = node.getState();
    }
    return state;
  }

  /**
   * @param {string} nodeName
   * @param {string} actionType
   * @param {any} payload
   */
  runNodeAction(nodeName, actionType, payload) {
    const node = this.nodes.get(nodeName);
    if (!node) {
      throw new Error(`Unknown node: ${nodeName}`);
    }
    return node.runAction(actionType, payload);
  }
}
