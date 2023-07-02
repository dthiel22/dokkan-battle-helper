import { useContext, useMemo } from "react";
import { UserContext } from "../../pages/_app";

export function useSortedCharacters(allCharacters, filteredCharacters, filterByGame) {
  const { showTransformedCharacters } = useContext(UserContext) 

  const sortedCharacters = useMemo(() => {
    const typeOrder = ["EAGL", "SAGL", "ETEQ", "STEQ", "EINT", "SINT", "ESTR", "SSTR", "EPHY", "SPHY"];
    const rarityOrder = ["SSR", "UR", "LR"];

    const URandLRCharacters = (filteredCharacters && filteredCharacters.length > 0)
    ? filteredCharacters.filter(c => c.rarity === 'LR' || c.rarity === 'UR')
    : (allCharacters && allCharacters.length > 0)
      ? allCharacters.filter(c => c.rarity === 'LR' || c.rarity === 'UR')
      : [];
  
    const SSRCharacters = (filteredCharacters && filteredCharacters.length > 0)
      ? filteredCharacters.filter(c => c.rarity === 'SSR')
      : (allCharacters && allCharacters.length > 0)
        ? allCharacters.filter(c => c.rarity === 'SSR')
        : [];
  

    const charactersSortedByDate = bubbleSortDates(URandLRCharacters, URandLRCharacters.length).reverse().concat(bubbleSortDates(SSRCharacters, SSRCharacters.length).reverse())

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
      : charactersSortedByDate.filter(character => (!showTransformedCharacters ? character.transformed === false : true))
    )
    : 
    (filterByGame
      ? (filteredCharacters && filteredCharacters.length > 0
        ? filteredCharacters
        .filter(character => (!showTransformedCharacters ? character.transformed === false : true))
        .slice().sort((a, b) => {
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
      : charactersSortedByDate.filter(character => (!showTransformedCharacters ? character.transformed === false : true))
    );
  }, [allCharacters, filteredCharacters, filterByGame]);

  return sortedCharacters;
}
