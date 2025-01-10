import { System } from "../../../../core/System";
import { createCounterNode } from "./nodes/counter";

const nodes = [createCounterNode("counter")];

export class CounterSystem extends System {
  constructor() {
    super("counter", nodes);
  }
}
