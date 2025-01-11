import { Node } from "../../../../../core/Node";
import { incrementAction } from "../actions/increment";
import { CounterUI } from "../ui/CounterUI";

export function createCounterNode(name) {
  return new Node(name, [incrementAction], { count: 0 }, CounterUI);
}
