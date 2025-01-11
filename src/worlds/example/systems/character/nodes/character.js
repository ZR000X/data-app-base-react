import { Node } from "../../../../../core/Node";
import { gainExperienceAction } from "../actions/gainExperience";
import { levelUpAction } from "../actions/levelUp";
import { CharacterUI } from "../ui/CharacterUI";

export function createCharacterNode(name) {
  return new Node(
    name,
    [gainExperienceAction, levelUpAction],
    {
      level: 1,
      experience: 0,
      strength: 10,
      dexterity: 10,
      intelligence: 10,
    },
    CharacterUI
  );
}
