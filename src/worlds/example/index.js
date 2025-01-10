import { World } from "../../core/World";
import { CounterSystem } from "./systems/counter";
import { CharacterSystem } from "./systems/character";

const systems = [new CounterSystem(), new CharacterSystem()];

export const exampleWorld = new World("example", systems);
