import { useContext, useMemo } from "react";
import { UserContext } from "../../pages/_app";

export function useSortedCharacters(allCharacters, filteredCharacters, filterByGame) {
  const { showTransformedCharacters } = useContext(UserContext);

  const sortedCharacters = useMemo(() => {
    const typeOrder = ["EAGL", "SAGL", "ETEQ", "STEQ", "EINT", "SINT", "ESTR", "SSTR", "EPHY", "SPHY"];
    const rarityOrder = ["SSR", "UR", "LR"];

    function swap(arr, xp, yp) {
      var temp = arr[xp];
      arr[xp] = arr[yp];
      arr[yp] = temp;
    }

    function bubbleSortDates(arr, n) {
      var i, j;
      for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - i - 1; j++) {
          const date1 = new Date(arr[j].jp_date);
          const date2 = new Date(arr[j + 1].jp_date);

          // Check for null or "N/A"
          if (!date1.getTime() || !date2.getTime()) {
            if (!date1.getTime()) {
              swap(arr, j, j + 1);
            }
          } else if (date1 > date2) {
            swap(arr, j, j + 1);
          }
        }
      }
      return arr;
    }

    //finding all 
    const transformedCharacters = (filteredCharacters && filteredCharacters.length > 0)
      ? filteredCharacters.filter(character => character.transformed)
      : (allCharacters && allCharacters.length > 0)
      ? allCharacters.filter(character => character.transformed)
      : [];

    const nonTransformedCharacters = (filteredCharacters && filteredCharacters.length > 0)
      ? filteredCharacters.filter(character => !character.transformed)
      : (allCharacters && allCharacters.length > 0)
      ? allCharacters.filter(character => !character.transformed)
      : [];

    // Sort non-transformed characters by jp_date
    const sortedNonTransformed = bubbleSortDates(nonTransformedCharacters, nonTransformedCharacters.length).reverse();

    // Iterate through sorted non-transformed characters
    for (let i = 0; i < sortedNonTransformed.length; i++) {
      const character = sortedNonTransformed[i];

      // Check if the character has transform_to array
      if (character?.transform_to && character?.transform_to.length > 0) {
        const transformIds = character.transform_to;

        // Check if the length of transform_to array is greater than 1
        if (transformIds.length > 1) {
          const transformedChars = transformedCharacters.filter(transformedChar =>
            transformIds.includes(transformedChar.id)
          );

          // Iterate through the transformed characters
          for (let j = 0; j < transformedChars.length; j++) {
            const transformedChar = transformedChars[j];
            // Check if the transformed character has a transform_to array
            if (transformedChar?.transform_to && transformedChar?.transform_to.length > 0) {
              const nestedTransformIds = transformedChar.transform_to;

              const nestedTransformedChars = transformedCharacters.filter(nestedTransformedChar =>
                nestedTransformIds.includes(nestedTransformedChar.id)
              );

              // Insert the nested transformed characters after the current transformed character
              transformedChars.splice(j + 1, 0, ...nestedTransformedChars);
              j += nestedTransformedChars.length; // Increment j by the number of inserted nested transformed characters
            }
          }

          // Insert transformed characters after the current non-transformed character
          sortedNonTransformed.splice(i + 1, 0, ...transformedChars);
          
          // Increment i by the number of inserted transformed characters
          i += transformedChars.length; 

        // this now checks to see if a character has only one character inside the transform_to then checks to see if there is a transforming chain
        } else if (transformIds.length === 1) {
          let transformedCharacterToCheck = transformedCharacters.find(transformedChar =>
            transformIds.includes(transformedChar.id)
          );
        
          // Check if the transformed character is not already in the sortedNonTransformed array
          if (!sortedNonTransformed.includes(transformedCharacterToCheck)) {
            sortedNonTransformed.splice(i + 1, 0, transformedCharacterToCheck);
            i++;
        
            while (transformedCharacterToCheck?.transform_to && transformedCharacterToCheck?.transform_to.length === 1) {
              const nextTransformId = transformedCharacterToCheck.transform_to[0];
              const nextTransformingCharacter = transformedCharacters.find(transformedChar =>
                transformedChar.id === nextTransformId
              );
        
              if (nextTransformingCharacter && !sortedNonTransformed.includes(nextTransformingCharacter)) {
                sortedNonTransformed.splice(i + 1, 0, nextTransformingCharacter);
                i++;
                transformedCharacterToCheck = nextTransformingCharacter;
              } else {
                break;
              }
            }
          }
        }
      }
    }



    // Separating characters based on rarity
    const LRCharacters = sortedNonTransformed.filter(character => character?.rarity === 'LR' || character?.rarity === 'UR')
    const SSRCharacters = sortedNonTransformed.filter(character => character?.rarity === 'SSR');

    // Concatenating the sorted arrays
    const sortedCharacters = LRCharacters.concat(SSRCharacters);

    return (filteredCharacters === null || filteredCharacters.length === 0)
      ? (filterByGame
        ? (allCharacters && allCharacters.length > 0
          ? allCharacters
            .filter(character => (!showTransformedCharacters ? character.transformed === false : true))
            .slice()
            .sort((a, b) => {
              const rarityA = rarityOrder.indexOf(a.rarity);
              const rarityB = rarityOrder.indexOf(b.rarity);
              if (rarityA === rarityB) {
                const typeA = typeOrder.indexOf(a.type);
                const typeB = typeOrder.indexOf(b.type);
                if (typeA === typeB) {
                  return b.id - a.id;
                }
                return typeB - typeA;
              }
              return rarityB - rarityA;
            })
          : [])
        : sortedCharacters.filter(character => (!showTransformedCharacters ? character.transformed === false : true))
      )
      : (filterByGame
        ? (filteredCharacters && filteredCharacters.length > 0
          ? filteredCharacters
            .filter(character => (!showTransformedCharacters ? character.transformed === false : true))
            .slice()
            .sort((a, b) => {
              const rarityA = rarityOrder.indexOf(a.rarity);
              const rarityB = rarityOrder.indexOf(b.rarity);
              if (rarityA === rarityB) {
                const typeA = typeOrder.indexOf(a.type);
                const typeB = typeOrder.indexOf(b.type);
                if (typeA === typeB) {
                  return b.id - a.id;
                }
                return typeB - typeA;
              }
              return rarityB - rarityA;
            })
          : [])
        : sortedCharacters.filter(character => (!showTransformedCharacters ? character.transformed === false : true))
      );
  }, [allCharacters, filteredCharacters, filterByGame, showTransformedCharacters]);

  return sortedCharacters;
}
