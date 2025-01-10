import { World } from "../../core/World";
import { CounterSystem } from "./systems/counter";

const systems = [new CounterSystem()];

export const exampleWorld = new World("example", systems);
