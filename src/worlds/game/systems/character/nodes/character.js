import { Node } from "../../../../../core/Node";
import { levelUpAction } from "../actions/levelUp";
import { gainExperienceAction } from "../actions/gainExperience";

export class CharacterNode extends Node {
  constructor(name) {
    super(name, [levelUpAction, gainExperienceAction], {
      level: 1,
      experience: 0,
      strength: 10,
      dexterity: 10,
      intelligence: 10,
    });
  }
}

export const createCharacterNode = (name) => new CharacterNode(name);
