import { Node } from "../../../../../core/Node";
import { incrementAction } from "../actions/increment";

export class CounterNode extends Node {
  constructor(name) {
    super(name, [incrementAction], { count: 0 });
  }
}

// Export a factory function to create new instances
export const createCounterNode = (name) => new CounterNode(name);
