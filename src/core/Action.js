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

/**
 * @typedef {Object} TestResult
 * @property {boolean} passed
 * @property {string} message
 * @property {TestCase} testCase
 * @property {Object} [actual] Actual output if test failed
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
    this.testResults = this.runTests();
  }

  /**
   * @private
   * @returns {TestResult[]}
   */
  runTests() {
    return this.tests.map((testCase, index) => {
      try {
        const actual = this.handler({
          state: testCase.input.state,
          payload: testCase.input.payload,
        });

        if (testCase.output.error) {
          return {
            passed: false,
            message: `Test ${index + 1} failed: Expected error but got success`,
            testCase,
            actual,
          };
        }

        const stateMatches =
          JSON.stringify(actual.state) ===
          JSON.stringify(testCase.output.state);
        const responseMatches = actual.response === testCase.output.response;

        if (stateMatches && responseMatches) {
          return {
            passed: true,
            message: `Test ${index + 1} passed`,
            testCase,
          };
        }

        return {
          passed: false,
          message: `Test ${index + 1} failed: Output mismatch`,
          testCase,
          actual,
        };
      } catch (error) {
        if (testCase.output.error) {
          const errorMatches = error.message === testCase.output.error;
          return {
            passed: errorMatches,
            message: errorMatches
              ? `Test ${index + 1} passed: Expected error received`
              : `Test ${index + 1} failed: Wrong error message`,
            testCase,
            actual: error.message,
          };
        }

        return {
          passed: false,
          message: `Test ${index + 1} failed: Unexpected error: ${
            error.message
          }`,
          testCase,
          actual: error.message,
        };
      }
    });
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

  /**
   * @returns {TestResult[]}
   */
  getTestResults() {
    return this.testResults;
  }
}
