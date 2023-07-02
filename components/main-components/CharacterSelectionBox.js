import React, { useContext } from 'react'
import { UserContext } from '../../pages/_app';

import CharacterCard from '@/cards/CharacterCard';

export default function CharacterSelectionBox({ cardContainerRef, webOfTeam, multiCardSelection, viewableCharacters, charactersToDisplay, setHoverCharacterStats, allCharactersLoading}) {
    const { showCalculator, grayCharactersInSelectedDeck, allCharacterIDsInDeck } = useContext(UserContext)
  return (
        <div 
          ref={cardContainerRef}
          id={'characterContainer'}
          className="characterContainer flex flex-wrap justify-center items-center p-1 border-2 border-black min-h-0 relative bg-orange-100 overflow-y-auto">
            {allCharactersLoading ? (<div>Loading...</div>) 
            : charactersToDisplay
                .slice(0, viewableCharacters)
                .map((character) => (
                  <div
                  key={character.id}
                  className={`
                    cursor-pointer relative
                    ${(!multiCardSelection && !showCalculator) ? webOfTeam.map((char) => char.id).includes(character.id) ? "bg-slate-900/[.7] hover:bg-slate-900/[.9]" : "hover:bg-slate-900/[.3]" : ''}
                    ${(!multiCardSelection && showCalculator) ? characterComparisonForCalculator.map((char) => char?.id).includes(character.id) ? "bg-cyan-600/[.7] hover:bg-cyan-700/[.9]" : "hover:bg-cyan-800/[.3]" : ''}
                    ${multiCardSelection ? savedToMyCharacterDeck.includes(character.id) ? 'bg-amber-900/[.75] hover:bg-amber-900/[.9]' : 'hover:bg-amber-900/[.4]' : ''} b 
                    `}
                  onMouseEnter={() => setHoverCharacterStats(character)}
                  onMouseLeave={() => setHoverCharacterStats(null)}
                  onClick={() => {
                    if (multiCardSelection) {
                      changeDeck(character.id);
                    } else if (!multiCardSelection && showCalculator){
                      handleCharacterComparisonSelection(character)
                    } else {
                      handleCharacterSelection(character)
                    }
                  }}
                  >
                    <div className={`
                    absolute h-[60px] card-sm:h-[85px] w-[60px] card-sm:w-[85px] bg-gray-900 z-[60] opacity-70
                    ${(grayCharactersInSelectedDeck && allCharacterIDsInDeck.includes(character.id)) ? "" : "hidden"}
                    `}></div>
                    <CharacterCard 
                    individualCharacter={character} 
                    mobilesize={'60px'} 
                    desktopsize={'85px'}
                    />
                  </div>
                ))}
          </div>
  )
}
