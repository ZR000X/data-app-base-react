import { Action } from "../../utils/Action";

/**
 * @typedef {import('../../types').ActionInput} ActionInput
 * @typedef {import('../../types').ActionOutput} ActionOutput
 */

/**
 * @param {(input: ActionInput) => ActionOutput} handler
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
export const createAction = (handler, metadata) => {
  return new Action(handler, [], metadata);
};
