import React from "react";

/**
 * @typedef {import('./Node').Node} Node
 */

export class NodeUI extends React.Component {
  /**
   * @param {Node} node The node this UI represents
   */
  constructor(node) {
    super();
    this.node = node;
    // Initialize with empty state
    this.state = {};
  }

  /**
   * Override this to render your UI
   * @returns {JSX.Element}
   */
  render() {
    console.error("NodeUI must implement render()");
    return null;
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

  /**
   * Set UI-specific state
   * @param {Object} update
   */
  setUIState(update) {
    // Directly update state without nesting
    this.setState(update);
  }

  /**
   * Get UI-specific state
   * @returns {Object}
   */
  getUIState() {
    return this.state.uiState;
  }
}
