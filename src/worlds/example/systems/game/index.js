import { System } from "../../../../core/System";
import { CounterNode } from "../counter";
import { DatabaseNode } from "../../database";

const nodes = [new CounterNode("counter"), new DatabaseNode("database")];

export class GameSystem extends System {
  constructor() {
    super("game", nodes);
  }
}
