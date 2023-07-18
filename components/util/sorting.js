import { useContext, useMemo } from "react";
import { UserContext } from "../../pages/_app";

export function useSortedCharacters(allCharacters, filteredCharacters, filterByGame) {
  const { showTransformedCharacters } = useContext(UserContext);

  const sortedCharacters = useMemo(() => {
    function swap(arr, xp, yp) {
      var temp = arr[xp];
      arr[xp] = arr[yp];
      arr[yp] = temp;
    }

    function bubbleSortDates(arr, n) {
      const newArray = arr.slice()
      var i, j;
      for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - i - 1; j++) {
          const date1 = new Date(newArray[j].jp_date);
          const date2 = new Date(newArray[j + 1].jp_date);

          // Check for null or "N/A"
          if (!date1.getTime() || !date2.getTime()) {
            if (!date1.getTime()) {
              swap(newArray, j, j + 1);
            }
          } else if (date1 > date2) {
            swap(newArray, j, j + 1);
          }
        }
      }
      return newArray;
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

    console.log(nonTransformedCharacters)

    function addTransformedCharacters(charactersToUse) {
      if (typeof charactersToUse === 'undefined'){
        return
      }
      // Iterate through sorted non-transformed characters
      for (let i = 0; i < charactersToUse.length; i++) {
        const character = charactersToUse[i];

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
            charactersToUse.splice(i + 1, 0, ...transformedChars);
            
            // Increment i by the number of inserted transformed characters
            i += transformedChars.length; 

          // this now checks to see if a character has only one character inside the transform_to then checks to see if there is a transforming chain
          } else if (transformIds.length === 1) {
            let transformedCharacterToCheck = transformedCharacters.find(transformedChar =>
              transformIds.includes(transformedChar.id)
            );
          
            // Check if the transformed character is not already in the charactersToUse array
            if (!charactersToUse.includes(transformedCharacterToCheck)) {
              charactersToUse.splice(i + 1, 0, transformedCharacterToCheck);
              i++;
              
              // make a while loop for the transforming chain to check character to next character...
              while (transformedCharacterToCheck?.transform_to && transformedCharacterToCheck?.transform_to.length === 1) {
                const nextTransformId = transformedCharacterToCheck.transform_to[0];
                const nextTransformingCharacter = transformedCharacters.find(transformedChar =>
                  transformedChar.id === nextTransformId
                );
          
                if (nextTransformingCharacter && !charactersToUse.includes(nextTransformingCharacter)) {
                  charactersToUse.splice(i + 1, 0, nextTransformingCharacter);
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
      return charactersToUse;
    }

    // Sort non-transformed characters by jp_date
    const sortedByDateNonTransformed = bubbleSortDates(nonTransformedCharacters, nonTransformedCharacters.length).reverse();

    // Separating characters based on rarity
    const LRCharactersByDate = addTransformedCharacters(sortedByDateNonTransformed).filter(character => character?.rarity === 'LR' || character?.rarity === 'UR')
    const SSRCharacters = addTransformedCharacters(sortedByDateNonTransformed).filter(character => character?.rarity === 'SSR');

    // Concatenating the sorted arrays
    const sortedCharactersByDate = LRCharactersByDate.concat(SSRCharacters);

    const typeOrder = ["EAGL", "SAGL", "ETEQ", "STEQ", "EINT", "SINT", "ESTR", "SSTR", "EPHY", "SPHY"];
    const rarityOrder = ["SSR", "UR", "LR"];
    
    function sortByGameFilter(charactersToUse) {
      charactersToUse.sort((a, b) => {
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
      });
      return charactersToUse; // Add this line to return the sorted array.
    }

    const sortedByGameFilter = sortByGameFilter(nonTransformedCharacters);
    
    const charactersByGameFilter = addTransformedCharacters(sortedByGameFilter);

    // initially start with a non-filtered character base (allCharacters)
    return (filteredCharacters === null || filteredCharacters.length === 0)
      // checks to see if we are filtering by the game or release date (first is game)
      ? (filterByGame
        //ensuring that all characters is present, if not then empty array
        ? (allCharacters && allCharacters.length > 0
          ? charactersByGameFilter
            .filter(character => (!showTransformedCharacters ? character.transformed === false : true))
          : [])
        : sortedCharactersByDate.filter(character => (!showTransformedCharacters ? character.transformed === false : true))
      )
      //this is for when a filter is applied to the character search form
      : (filterByGame
        ? (filteredCharacters && filteredCharacters.length > 0
          ? charactersByGameFilter
          .filter(character => (!showTransformedCharacters ? character.transformed === false : true))
        : [])
        : sortedCharactersByDate.filter(character => (!showTransformedCharacters ? character.transformed === false : true))
      );
  }, [allCharacters, filteredCharacters, filterByGame, showTransformedCharacters]);

  return sortedCharacters;
}
