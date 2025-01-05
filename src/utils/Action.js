/**
 * @typedef {import('../types').ActionInput} ActionInput
 * @typedef {import('../types').ActionOutput} ActionOutput
 * @typedef {import('../types').ActionTest} ActionTest
 */

export class Action {
  /**
   * @param {(input: ActionInput) => ActionOutput} method
   * @param {ActionTest[]} tests
   * @param {{
   *   label: string;
   *   category: string;
   *   description: string;
   *   params: Record<string, {
   *     type: string;
   *     description: string;
   *     required: boolean;
   *     default?: any;
   *   }>;
   * }} metadata
   */
  constructor(method, tests, metadata) {
    this.method = method;
    this.label = metadata.label;
    this.category = metadata.category;
    this.description = metadata.description;
    this.params = metadata.params;

    // Run tests if provided
    for (const test of tests) {
      const output = this.execute(test.input);
      if (
        output.state !== test.output.state ||
        output.response !== test.output.response
      ) {
        throw new Error(
          `Action test failed: ${JSON.stringify(test.input.payload)}`
        );
      }
    }
  }

  /**
   * @param {ActionInput} input
   * @returns {ActionOutput}
   */
  execute(input) {
    return this.method(input);
  }
}
