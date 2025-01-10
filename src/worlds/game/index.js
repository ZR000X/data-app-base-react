import { World } from "../../core/World";
import { CharacterSystem } from "./systems/character";

const systems = [new CharacterSystem()];

export const gameWorld = new World("game", systems);
