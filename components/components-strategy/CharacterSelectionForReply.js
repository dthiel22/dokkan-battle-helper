import React, { useState, useEffect, useRef } from "react";
import ReactDom from "react-dom";

import CharacterCard from "@/cards/CharacterCard";

import SearchFormForReply from "./SearchFormForReply";

import { useSortedCharacters } from "../util/sorting";

import Image from 'next/image';

function CharacterSelectionForReply( {allCharacters, characterDictionary, username, usersSavedCharacterIds, handleCommentCharacterSelection, characterSelection} ) {
  
  const userCharacters = usersSavedCharacterIds.map(id => {
    const value = characterDictionary[id];
    return {
      ...value,
      id: id,
    };
  });

  const [filteredCharacters, setFilteredCharacters] = useState(null)
  const [viewableCharacters, setViewableCharacters] = useState(75);
  const [newFilterData, setNewFilterData] = useState({})

  const filterAndSetCharacters = (filterData) => [setFilteredCharacters(getFilteredCharacters(allCharacters, userCharacters, characterSelection, filterData, selectedCategories)), setNewFilterData(filterData)]

  const [filterByGame, setFilterByGame] = useState(true);

  let charactersToDisplay = useSortedCharacters(allCharacters, filteredCharacters, filterByGame)

  if(newFilterData?.characterCategory?.length > 0 && filteredCharacters?.length === 0){
    charactersToDisplay = []
  }

  const characterSelectContainerRef = useRef(null)

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleNewCategorySelected = (e) => {
    setViewableCharacters(50)
    if(e.target.value === ''){
      setSelectedCategories([])
    }
    if(selectedCategories.includes(e.target.value)){
      return selectedCategories
    }else{
      setSelectedCategories([...selectedCategories, e.target.value])
    }
    characterSelectContainerRef.current.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSelectedCategoryRemoval = (categoryToRemove) => {
    setSelectedCategories(selectedCategories.filter(singleCategory => singleCategory !== categoryToRemove))
  }

  useEffect(() => {
    if(characterSelectContainerRef.current !== null){
      const cardContainer = characterSelectContainerRef.current;
  
      const handleScroll = () => {
        if ((cardContainer.scrollTop + cardContainer.clientHeight) >= (cardContainer.scrollHeight - 240)) {
          setViewableCharacters(viewableCharacters + 50);
        }
      };
  
      cardContainer.addEventListener("scroll", handleScroll);
  
      return () => {
        cardContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [viewableCharacters]);

  //this useEffect allows the filtered characters to be "automatically" loaded when ever the selected categories change
  useEffect(() => {
    const filteredChars = getFilteredCharacters(allCharacters, userCharacters, characterSelection, newFilterData, selectedCategories);
    setFilteredCharacters(filteredChars)
  }, [selectedCategories, characterSelection])

  // this useEffect sets all the form data to null besides the selected category state (helps selecting people more)
  useEffect(() => {
    setNewFilterData({})
    const filteredChars = getFilteredCharacters(allCharacters, userCharacters, characterSelection, newFilterData, selectedCategories);
    setFilteredCharacters(filteredChars)
  }, [])
    
  return (
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full py-2 border-4 border-black rounded-lg shadow-lg bg-orange-200 overflow-y-auto">
        <p className="font-header w-full pb-2 text-lg lg:text-xl text-center justify-center items-center underline underline-offset-8">
          {characterSelection.leader !== 0 &&
          characterSelection.character1 !== 0 &&
          characterSelection.character2 !== 0 &&
          characterSelection.character3 !== 0 &&
          characterSelection.character4 !== 0 &&
          characterSelection.character5 !== 0 ?
          <span>All Characters</span>
          :
          <span>{username}'s Characters</span>
          }
        </p>


        {/* //contains filters/buttons/search field/etc. */}

        <SearchFormForReply
          onFormChange={filterAndSetCharacters}
          selectedCategories={selectedCategories}
          handleNewCategorySelected={handleNewCategorySelected}
          handleSelectedCategoryRemoval={handleSelectedCategoryRemoval}
        />

        {/* //character select box */}
        <div
        id='characterSelectContainerRef' 
        ref={characterSelectContainerRef}
        className="characterContainer flex flex-wrap h-[25vh] justify-around items-center p-1 mx-1 lg:mx-2 mt-2 lg:mt-3 lg:mb-4 border-2 border-slate-900 min-h-0 relative overflow-y-auto bg-orange-100">
           
          {charactersToDisplay && charactersToDisplay
              .slice(0, viewableCharacters)
              .map((character) => (
                <div 
                onClick={() => handleCommentCharacterSelection(character?.id)}
                className={`px-[.5%] ${
                  Object.values(characterSelection).includes(character?.id) ?
                    'bg-amber-600 hover:bg-amber-700'
                    : 'hover:bg-amber-500'
                }`}                
                key={'div'+character?.id}
                >
                  <CharacterCard key={character?.id} individualCharacter={character} mobilesize={'60px'} desktopsize={'85px'}/>
                </div>
              ))
          }
        </div>
      </div>
  )
}

const getFilteredCharacters = (allCharacters, userCharacters, characterSelection, filterData, selectedCategories) => {

  function isCharacterSelectionComplete(characterSelection) {
    return (
      characterSelection.leader !== 0 &&
      characterSelection.character1 !== 0 &&
      characterSelection.character2 !== 0 &&
      characterSelection.character3 !== 0 &&
      characterSelection.character4 !== 0 &&
      characterSelection.character5 !== 0
    );
  }  

  const selectionIsComplete = isCharacterSelectionComplete(characterSelection);
  let useAllCharacters = false; // Flag to determine which array to return

  if (selectionIsComplete) {
    useAllCharacters = true;
  }

  return (useAllCharacters ? allCharacters : userCharacters).filter((character) => {
    return (
      !character.transformed && // Exclude transformed characters
      (!selectedCategories.length || (filterData.matchAllCategories
        ? selectedCategories.every(category => character?.category?.includes(category))
        : selectedCategories.some(category => character?.category?.includes(category))
      )) &&
      (!filterData.searchTerm || character.name.toLowerCase().includes(filterData.searchTerm.toLowerCase())) &&
      (!filterData.characterType || character.type.includes(filterData.characterType)) &&
      (!filterData.characterSuperOrExtreme || character.type.slice(0, 1).includes(filterData.characterSuperOrExtreme)) &&
      (!filterData.characterRarity || filterData.characterRarity === character.rarity)
    );
  });
};

export default CharacterSelectionForReply