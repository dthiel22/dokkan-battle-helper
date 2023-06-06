import React, { useContext, useState, memo } from 'react';
import { Auth } from '../util/auth';
import { UserContext } from '../../pages/_app';

const DeckSelect = React.memo(({ userDeckData, selectedDeck, setSelectedDeck, allCharactersLoading }) => {  
  const { profileData, showCardDetails, setShowCardDetails } = useContext(UserContext)
  
  console.log(profileData)
  console.log(userDeckData)
  console.log(selectedDeck)
  console.log(allCharactersLoading)
  
  const handleSelectedDeckOptionClick = (deckId) => {
    if (deckId === '') {
      return;
    } else if (deckId === selectedDeck) {
      setShowCardDetails(false);
    }
  };

  const handleSelectedDeck = (deckId) => {
    if (deckId === '') {
      setShowCardDetails(true);
      setSelectedDeck('');
    } else if (deckId === selectedDeck) {
      setShowCardDetails(!showCardDetails);
    } else {
      setShowCardDetails(false);
      setSelectedDeck(deckId);
    }
  };

  if (!profileData?.data) {
    return (
      <div className="w-full h-full border-black card-sm:text-lg font-bold">
        <div className="flex w-full h-full border-black border-2 text-base bg-gray-600 rounded-r-lg justify-center items-center text-center">
          Log In To See Decks
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full border-black card-sm:text-lg font-bold">
      <select
        className={`disabled:bg-gray-500 flex w-full h-full border-black rounded-r-lg justify-center items-center text-center cursor-pointer ${
          showCardDetails ? 'border-2 bg-orange-200' : 'border-4 bg-orange-400'
        }`}
        id="deckSelect"
        value={selectedDeck}
        onChange={(e) => handleSelectedDeck(e.target.value)}
        onClick={(e) => handleSelectedDeckOptionClick(e.target.value)}
        disabled={allCharactersLoading}
      >
        <option className="font-bold" value="">
          Decks
        </option>
        {userDeckData.map((deck) => (
          <option className="font-bold" key={deck._id} value={deck._id}>
            {deck.name}
          </option>
        ))}
      </select>
    </div>
  );
}
)

export default memo(DeckSelect);
