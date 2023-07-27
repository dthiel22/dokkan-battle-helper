export const categories =[
    "Accelerated Battle",
    "All-Out Struggle",
    "Androids",
    "Androids/Cell Saga",
    "Artificial Life Forms",
    "Battle of Fate",
    "Battle of Wits",
    "Bond of Friendship",
    "Bond of Master and Disciple",
    "Bond of Parent and Child",
    "Connected Hope",
    "Corroded Body and Mind",
    "Crossover",
    "DB Saga",
    "Defenders of Justice",
    "Dragon Ball Heroes",
    "Dragon Ball Seekers",
    "Earth-Bred Fighters",
    "Earthlings",
    "Entrusted Will",
    "Exploding Rage",
    "Final Trump Card",
    "Full Power",
    "Fused Fighters",
    "Fusion",
    "Future Saga",
    "GT Bosses",
    "GT Heroes",
    "Giant Ape Power",
    "Giant Form",
    "Gifted Warriors",
    "Ginyu Force",
    "Goku's Family",
    "Heavenly Events",
    "Hybrid Saiyans",
    "Inhuman Deeds",
    "Joined Forces",
    "Kamehameha",
    "Legendary Existence",
    "Low-Class Warrior",
    "Majin Buu Saga",
    "Majin Power",
    "Mastered Evolution",
    "Miraculous Awakening",
    "Movie Bosses",
    "Movie Heroes",
    "Namekians",
    "Otherworld Warriors",
    "Peppy Gals",
    "Planet Namek Saga",
    "Planetary Destruction",
    "Potara",
    "Power Absorption",
    "Power Beyond Super Saiyan",
    "Power of Wishes",
    "Powerful Comeback",
    "Pure Saiyans",
    "Rapid Growth",
    "Realm of Gods",
    "Representatives of Universe 7",
    "Resurrected Warriors",
    "Revenge",
    "Saiyan Saga",
    "Saviors",
    "Shadow Dragon Saga",
    "Siblings' Bond",
    "Space-Traveling Warriors",
    "Special Pose",
    "Storied Figures",
    "Super Heroes",
    "Super Saiyan 2",
    "Super Saiyan 3",
    "Super Saiyans",
    "Sworn Enemies",
    "Target: Goku",
    "Team Bardock",
    "Terrifying Conquerors",
    "Time Limit",
    "Time Travelers",
    "Transformation Boost",
    "Turtle School",
    "Universe 11",
    "Universe 6",
    "Universe Survival Saga",
    "Vegeta's Family",
    "Wicked Bloodline",
    "World Tournament",
    "Worldwide Chaos",
    "Worthy Rivals",
    "Youth",    
]

export const allCategoryOptions = () => {
  return categories.map((category) => {
    const key = category.toLowerCase().replace(' ','-');
    return <option value={category} key={key}>{category}</option>
  });
}  

export const findCharacterLeaderCategories = (selectedCharacter) => {
  const characterLeaderSkill = selectedCharacter.ls_description.split(';');
  let characterLeadCategories = [];
  for (let i = 0; i < categories.length; i++) {
    for (let j = 0; j < characterLeaderSkill.length; j++) {
      if (characterLeaderSkill[j].includes(categories[i])) {
        const matchedNumbers = characterLeaderSkill[j].match(/\d+/g).map(string => parseInt(string));
        if (matchedNumbers.some(num => num >= 150 && num <= 200)) {
          characterLeadCategories.push(categories[i]);
        }
      }
    }
  }
  return characterLeadCategories;
};

export const findCharacterLeaderCategoriesForCardDetails = (characterLeaderSnipit) => {
  let characterLeadCategories = [];
  for (let i = 0; i < categories.length; i++) {
    for (let j = 0; j < characterLeaderSnipit.length; j++) {
      if (characterLeaderSnipit[j].includes(categories[i])) {
        characterLeadCategories.push(categories[i]);
      }
    }
  }
  return characterLeadCategories;
};

export const find200Leaders = (selectedCharacter, characterDictionary) => {
  const characterObjects = Object.values(characterDictionary);
  const leadersWith200 = [];

  characterObjects.forEach((character) => {
    const leaderNumbers = character.ls_description.match(/\d+(?=%)/g) || [];

    // Check if there are two numbers (170% + 30%) or a single number (200%)
    if (
      (leaderNumbers.length === 2 &&
        parseInt(leaderNumbers[0]) + parseInt(leaderNumbers[1]) === 200) ||
      (leaderNumbers.length === 1 && parseInt(leaderNumbers[0]) === 200)
    ) {
      const leaderSkillSplit = character.ls_description.split(';');

      let firstCategoryMatch = false;
      let secondCategoryMatch = false;

      // Check if there is a category match from selectedCharacter in the first part of the leader skill
      if (
        leaderSkillSplit[0] &&
        selectedCharacter.category.some((singleCategory) =>
          leaderSkillSplit[0].includes(singleCategory.trim())
        )
      ) {
        firstCategoryMatch = true;
      }

      // Check if there is a category match from selectedCharacter in the second part of the leader skill (if exists)
      if (
        leaderSkillSplit.length > 1 &&
        selectedCharacter.category.some((singleCategory) =>
          leaderSkillSplit[1].includes(singleCategory.trim())
        )
      ) {
        secondCategoryMatch = true;
      }

      // Check if both parts have matching categories with the selectedCharacter
      if (firstCategoryMatch && (!leaderSkillSplit[1] || secondCategoryMatch)) {
        // Check if the leader ID is not equal to the selectedCharacter's ID and .transformed is not true
        if (character.id !== selectedCharacter.id && !character.transformed) {
          leadersWith200.push(character);
        }
      }
    }
  });

  return leadersWith200;
};
