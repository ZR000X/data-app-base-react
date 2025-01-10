import { System } from "../../../../core/System";
import { createCharacterNode } from "./nodes/character";

const nodes = [createCharacterNode("character")];

export class CharacterSystem extends System {
  constructor() {
    super("character", nodes);
  }
}
