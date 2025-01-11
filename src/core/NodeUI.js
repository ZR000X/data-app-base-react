/**
 * @typedef {import('./Node').Node} Node
 */

export class NodeUI {
  /**
   * @param {Node} node The node this UI represents
   */
  constructor(node) {
    this.node = node;
  }

  /**
   * Override this to render your UI
   * @returns {JSX.Element}
   */
  render() {
    throw new Error("NodeUI must implement render()");
  }

  /**
   * Helper to execute node actions from UI and update master state
   * @param {string} actionType
   * @param {Object} payload
   */
  executeAction(actionType, payload) {
    const result = this.node.runAction(actionType, payload);

    // Get the onNodeStateChange function from the node
    const onStateChange = this.node.getStateChangeHandler();
    if (onStateChange) {
      onStateChange(result.state);
    }

    return result;
  }

  /**
   * Get current node state
   * @returns {Object}
   */
  getState() {
    return this.node.getState();
  }
}
