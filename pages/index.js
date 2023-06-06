import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import Navbar from "../components/main-components/Navbar"
import CharacterCard from "../components/cards/CharacterCard";
import AllComponentsCard from "../components/cards/AllComponentsCard";
import CharacterSelectionBox from "@/main-components/CharacterSelectionBox";
import SearchForm from "../components/main-components/SearchForm";
import SuggestToWeb from "../components/main-components/SuggestToWeb";

import { useQuery, useLazyQuery } from "@apollo/client";

import {QUERY_CHARACTERS,GET_ITEMS_DATA,GET_SUPPORT_MEMORY_DATA,GET_USERDATA, GET_USERCHARACTERSBYID} from "./api/queries";

import { useMutation } from "@apollo/client";
import { UPDATE_SAVED_CHARACTERS, ADD_TEAM_TO_DECK } from "../components/util/mutations";
import CardDetails from "../components/main-components/CardDetails";
import DeckSelection from "../components/main-components/DeckSelection.js";
import Auth from "../components/util/auth";
import NewsAndUpdatesModal from "../components/modals/modals-home/NewsAndUpdates";
import CalculatorATK from "../components/main-components/CalculatorATK";
import CalculatorDEF from "../components/main-components/CalculatorDEF";
import Announcement from "../components/modals/modals-home/Announcement";
import DeckSelectButton from "../components/main-components/DeckSelectButton";
import SaveAndGrayCharactersButton from "../components/main-components/SaveAndGrayCharactersButton";

import { useSortedCharacters } from "../components/util/sorting";
import { findCharacterLeaderCategories } from "../components/util/allCategories";

import { UserContext } from '../pages/_app';

import Image from 'next/image';
import dynamic from 'next/dynamic';

import DeckSelect from "@/main-components/DeckSelectButton";

const arrow = "/dokkanIcons/icons/right-arrow-icon.png"

const MyDeckSelectButton = dynamic(() => import('../components/main-components/DeckSelectButton'), {
  ssr: false,
});

const MySaveAndGrayCharacterButton = dynamic(() => import('../components/main-components/SaveAndGrayCharactersButton'), {
  ssr: false,
});

function AllComponents({  }) {
  const { profileData, showMiddleDiv, setShowMiddleDiv, hoverCharacterStats, setHoverCharacterStats, showCardDetails, setShowCardDetails, showCalculator, setShowCalculator, showDEFCalculator, setShowDEFCalculator, grayCharactersInSelectedDeck, setGrayCharactersInSelectedDeck, allCharacterIDsInDeck, setAllCharacterIDsInDeck } = useContext(UserContext);
  
  const { loading: allCharactersLoading, data: allCharactersData, error: allCharactersError } = useQuery(QUERY_CHARACTERS);
  const allCharacters = allCharactersData?.characters || [];
  
  const characterDictionary = Object.fromEntries(
    allCharacters.map((characterObj) => [characterObj.id, characterObj])
  );

  const { loading: allItemsLoading, data: allItemsData } = useQuery(GET_ITEMS_DATA);
  const allItems = allItemsData?.items || [];
  
  const { loading: allSupportMemoryLoading, data: allSupperMemoryData } = useQuery(GET_SUPPORT_MEMORY_DATA);
  const allSupportMemories = allSupperMemoryData?.supportMemory || [];

  const [selectedDeck, setSelectedDeck] = useState("");

  const [cardDetails, setCardDetails] = useState({
    id: 1331,
    thumb: 1003310,
    art: null,
    title: "Heartless Destruction",
    name: "Buu (Kid)",
    rarity: "UR",
    type: "EPHY",
    cost: "42",
    ls_description: "Allies’ ATK increases (MAX +50%) based on HP left",
    ls_description_eza:
      "All Types Ki +3 and HP & DEF +50%, raises ATK by up to 80% (the more HP remaining, the greater the ATK boost)",
    sa_type: "Ki ",
    sa_name: "Planet Burst",
    sa_description:
      "Causes supreme damage and lowers DEF <Lowers enemy's DEF by 40% for 3 turns>  ",
    sa_description_eza:
      "Causes immense damage to enemy and lowers DEF<Lowers enemy's DEF by 40% for 3 turns>  ",
    ultra_sa_type: null,
    ultra_sa_name: null,
    ultra_sa_description: null,
    ultra_sa_description_eza: null,
    ps_name: "Planetary Destruction",
    ps_description: "ATK & DEF +50% for all allies when HP is 80% or above",
    ps_description_eza:
      "All allies' Ki +2 and ATK & DEF +50% when HP is 80% or above; all allies' ATK & DEF +30% when HP is 79% or below",
    sa_type_active: null,
    active_skill_name: null,
    active_skill: null,
    active_skill_condition: null,
    active_skill_condition_eza: null,
    transform_type: null,
    transform_condition: null,
    transform_condition_eza: null,
    link_skill: [
      "Majin",
      "Brutal Beatdown",
      "More Than Meets the Eye",
      "Big Bad Bosses",
      "Infinite Regeneration",
      "Fierce Battle",
      "The Wall Standing Tall",
    ],
    category: [
      "Resurrected Warriors",
      "Majin Buu Saga",
      "Transformation Boost",
      "Artificial Life Forms",
      "Majin Power",
      "Planetary Destruction",
      "Storied Figures",
      "Legendary Existence",
      "Sworn Enemies",
      "Accelerated Battle",
      "Worldwide Chaos",
      "Battle of Fate",
    ],
    jp_date: "1 Dec 2015",
    glb_date: "6 Apr 2016",
    jp_date_eza: "11 Oct 2018",
    glb_date_eza: "22 Jan 2019",
  });

  //setting a state of webOfTeam for characeters in graph
  const [webOfTeam, setWebOfTeam] = useState([]);

  // These are both needed to edit the teams, this logic is what is also passed to SuggestToWeb for editing the Web there too
  function addToWebOfTeam(character) {
    setWebOfTeam((prev) => {
        return [...prev, character];
    })
  }
  function removeFromWebOfTeam(character) {
    setWebOfTeam((prev) => prev.filter((c) => c.id !== character.id))
  }
  
  // useEffect(() => {
    // // setWebOfTeam();
  // }, [addToWebOfTeam, removeFromWebOfTeam]);

  // call initial query to find savedCharacters (array of IDs from user) the onComplete allows the saved characters to be set to the deck (important for adding and removing characters)
  const [getUserData, { loading: isUserDataLoading, data: userData }] = useLazyQuery(
    GET_USERDATA,
    {
      variables: {
        profileId: profileData?.data?._id || "",
      },
      onCompleted: (data) => {
        setSavedToMyCharacterDeck(data.findOneUser.savedCharacters);
        if(selectedDeck !== ''){
          setAllCharacterIDsInDeck(data.findOneUser.decks.find(deck => deck._id === selectedDeck)?.teams.flatMap(team => team.characters.map(character => character.id)))
        }
      },
    }
  );

  useEffect(() => {
    getUserData()
  }, [selectedDeck]);

  const userDeckData = userData?.findOneUser?.decks || [];
  const userCharacterIds = userData?.findOneUser?.savedCharacters || [];

  // lazyQuery which is called in a useEffect to find the character objects from their IDs (results in an array of the character objects saved to the user) this is used for finding characters in My Deck
  const [getUserCharacterObjects,{ loading: isUserCharactersLoading, data: userCharacterData }] = useLazyQuery(GET_USERCHARACTERSBYID, {
    variables: {
      dokkanIds: userCharacterIds,
    },
    skip: userCharacterIds.length === 0,
  });
  const userCharacters = userCharacterData?.charactersWithIds || [];

  // this allows the lazyQuery to load on page load, putting characters into the My Deck filter
  useEffect(() => {
    getUserCharacterObjects();
  }, []);

  // this useEffect renders selected card based on which cards are in the persons deck already
  useEffect(() => {
    if (userCharacters) {
      setSavedToMyCharacterDeck(userCharacters.map((c) => c.id));
    }
  }, []);

  //adding state for saved to deck...initially composed of userCharacterIds
  const [savedToMyCharacterDeck, setSavedToMyCharacterDeck] = useState(userCharacterIds);
  //adds or remove characters from the state deck
  function changeDeck(characterId) {
    setSavedToMyCharacterDeck((prev) => {
      if (prev.includes(characterId)) {
        return prev.filter((id) => id !== characterId);
      } else {
        return [...prev, characterId];
      }
    });
  }

  const [multiCardSelection, setMultiCardSelection] = useState(false);

  const [updateSavedCharacters,{ error: updateSavedCharactersError, data: updatedSavedCharacters }] = useMutation(UPDATE_SAVED_CHARACTERS);
  //this runs on the save button click
  async function handleUpdateSavedCharacters() {
    await updateSavedCharacters({
      variables: {
        profileId: profileData?.data?._id,
        newSavedCharacters: savedToMyCharacterDeck,
      },
    });
    // closes out card selection for deck building
    setMultiCardSelection(false);
    //TODO: pretty sure this is unecessary // the savedToMyCharacterDeck is updated to the most recent array of ids
    // setSavedToMyCharacterDeck(savedToMyCharacterDeck);
    // After mutation is completed, re-run the lazy query to get the updated userCharacters
    await getUserCharacterObjects({
      variables: { dokkanIds: savedToMyCharacterDeck },
    });
  }

  function newCardDetails(characterId) {
    setCardDetails(characterDictionary[characterId])
  }

  const [selectedCategories, setSelectedCategories] = useState([])
  const [newFilterData, setNewFilterData] = useState({})
  const [filteredCharacters, setFilteredCharacters] = useState(null)
  
  // this function allows for filtered characters to be set to the reults of the getFilteredCharacters (which is extracted from the search form)
  const filterAndSetCharacters = (filterData) => [setFilteredCharacters(getFilteredCharacters(allCharacters, userCharacters, filterData, selectedCategories)),setNewFilterData(filterData)]
  
  const [filterByGame, setFilterByGame] = useState(true);

  let charactersToDisplay = useSortedCharacters(allCharacters, filteredCharacters, filterByGame)

  if(newFilterData?.characterCategory?.length > 0 && filteredCharacters?.length === 0){
    charactersToDisplay = []
  }
  
  const cardContainerRef = useRef(null);
  const handleNewCategorySelected = (e) => {
    if(e.target.value === ''){
      cardContainerRef.current.scrollTo({ top: 0, behavior: "smooth" })
      return setSelectedCategories([])
    }else if(selectedCategories.includes(e.target.value)){
      return selectedCategories
    }else{
      cardContainerRef.current.scrollTo({ top: 0, behavior: "smooth" })
      return setSelectedCategories([...selectedCategories, e.target.value])
    }
  }
  
  const handleSelectedCategoryRemoval = (categoryToRemove) => {
    setSelectedCategories(selectedCategories.filter(singleCategory => singleCategory !== categoryToRemove))
  }
  
  useEffect(() => {
    const filteredChars = getFilteredCharacters(allCharacters, userCharacters, newFilterData, selectedCategories);
    setFilteredCharacters(filteredChars);
  }, [selectedCategories]); 

  // this allows the screen to change sizes and auto update revealing/hiding the middle column
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);
  
  const [showCardSelection, setShowCardSelection] = useState(true)
  const [showTeamWeb, setShowTeamWeb] = useState(false)
  const [showCardStats, setShowCardStats] = useState(false)

    //scroll ability through buttons on mobile
    const handleShowSingleCardStats = () => {
      setShowCardSelection(false)
      setShowTeamWeb(false)
      setShowCardStats(true)
      const middleColumn = document.getElementById("SingleCardDetails");
      middleColumn.scrollIntoView({ top: 0, left: 0 });
    };
    const handleShowCharacterSelection = () => {
      setShowCardSelection(true)
      setShowTeamWeb(false)
      setShowCardStats(false)
      const middleColumn = document.getElementById("CardSelection");
      middleColumn.scrollIntoView({ top: 0, left: 0 });
    };
    const handleShowTeam = () => {
      setShowCardSelection(false)
      setShowTeamWeb(true)
      setShowCardStats(false)
      const middleColumn = document.getElementById("Team");
      middleColumn.scrollIntoView({ top: 0, left: 0 });
    };
  
    const [showFilters, setShowFilters] = useState(true)

    const [announcementOpen, setAnnouncementOpen] = useState(false)

    const [openNewsModal, setOpenNewsModal] = useState(false)

    if (typeof window !== 'undefined') {
      const firstLogInShowNews = localStorage.getItem('announcement2');
      const timestamp = localStorage.getItem('announcement2Timestamp');
    
      if (!firstLogInShowNews || (timestamp && Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000)) {
        setOpenNewsModal(true);
        localStorage.setItem('announcement2', 'true');
        localStorage.setItem('announcement2Timestamp', Date.now());
      }
    }
    
    function handleCharacterSelection(character){
      const existingCharacter = webOfTeam.find(webCharacter => webCharacter.id === character.id)
      if (existingCharacter) {
        removeFromWebOfTeam(existingCharacter)
      } else {
        addToWebOfTeam(character)
        setCardDetails(character)
      }
    }

    const [viewableCharacters, setViewableCharacters] = useState(200)
    // this useEffect is for automatically loading characters by increasing the viewableCharacters
    useEffect(() => {
      if(cardContainerRef.current !== null){
        if((filteredCharacters?.length > 0 && viewableCharacters >= filteredCharacters?.length) || (viewableCharacters >= allCharacters?.length)){
          return
        }
        const cardContainer = cardContainerRef.current;
    
        const handleScroll = () => {
          if ((cardContainer.scrollTop + cardContainer.clientHeight) >= (cardContainer.scrollHeight - 400)) {
            setViewableCharacters(viewableCharacters + 100);
          }
        };
    
        cardContainer.addEventListener("scroll", handleScroll);
    
        return () => {
          cardContainer.removeEventListener("scroll", handleScroll);
        };

      }
    }, [allCharactersLoading, viewableCharacters, charactersToDisplay]);
    
    useEffect(() => {
      if(cardContainerRef.current){
        cardContainerRef.current.scrollTo({ top: 0, behavior: "smooth" })
        setViewableCharacters(100)
      }
    },[selectedCategories])

    const [characterComparisonForCalculator, setCharacterComparisonForCalculator] = useState([])
    function handleCharacterComparisonSelection(character) {
      if(!characterComparisonForCalculator[0] || characterComparisonForCalculator[0]?.id === 0){
        setCardDetails(character)
      }
      setCharacterComparisonForCalculator((prev) => {
        if (prev.includes(character)) {
          if (prev[0].id === character.id) {
            const newArray = [{ id: 0, rarity: null, type: null }, prev[1]];
            return newArray;
          } else {
            return prev.filter((characterToRemove) => characterToRemove.id !== character.id);
          }
        } else if(characterComparisonForCalculator[0]?.id === 0){
          return [character, prev[1]]
        } else {
          if (prev.length < 2) {
            return [...prev, character];
          } else {
            return [prev[0], character];
          }
        }
      });
       
    }
  return (
    <div className="fixed flex flex-col h-full bg-slate-900">
      {/* TODO: for important information to announce on page load */}
      {/* <Announcement open={announcementOpen} onClose={() => setAnnouncementOpen(false)}/> */}
      <NewsAndUpdatesModal open={openNewsModal} onClose={() => setOpenNewsModal(false)}/>
      <Navbar handleShowSingleCardStats={handleShowSingleCardStats} handleShowCharacterSelection={handleShowCharacterSelection} handleShowTeam={handleShowTeam} showCardSelection={showCardSelection} showTeamWeb={showTeamWeb} showCardStats={showCardStats}/>

      {/* TODO: contains all the cardseoection stuff. h is set to zero with a flex-1 because it allows for expansion to fill rest of space */}
      <div className={`flex flex-1 h-0 ${showMiddleDiv ? '' : 'lg:px-10 xl:px-20'} relative`}>

        {/* this conditional hides the button if showMiddleDiv is false AND window width is greater than the mobile screen break */}
        {(!showMiddleDiv && (windowWidth > 900)) && 
        <div className="flex transform rotate-90 origin-bottom-left absolute left-0 -top-10">

          <button 
          onClick={()=> setShowMiddleDiv(!showMiddleDiv)}
          className="flex p-2 font-bold border-t-2 border-r-2 border-black bg-orange-200 hover:bg-orange-300">
            Show Cards and Decks
          </button>

          <button 
          onClick={()=> setShowCalculator(!showCalculator)}
          className="flex p-2 font-bold border-t-2 border-r-2 border-black bg-orange-200 hover:bg-orange-300">
            {showCalculator ? 'Show Team Web' : 'Show Calculator'}
          </button>
          
        </div>
        }

        {/* TODO: card detail styling */}
        <div
          id="SingleCardDetails"
          className={`${showCardStats || (showMiddleDiv && (windowWidth > 900)) ? '' : 'hidden'} flex flex-1 flex-col w-screen lg:w-1/4 lg:max-w-[400px] lg:min-w-[0px] bg-gradient-radial from-slate-500 via-slate-600 to-slate-900 overflow-y-auto`}
          >

          {(showMiddleDiv && (windowWidth > 900)) &&
          <div className="flex w-full p-2">
            <button
            onClick={() => setShowMiddleDiv(false)}
            className="flex py-2 px-4 w-1/2 text-md card-sm:text-base lg:text-sm <1000px>:text-[.77rem] xl:text-[.85rem] font-bold justify-center items-center text-center cursor-pointer border-2 border-black bg-orange-200 hover:bg-orange-300"
            >
              Hide Character Details
            </button>

            <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex py-2 px-4 w-1/2 text-md card-sm:text-base lg:text-sm <1000px>:text-[.77rem] xl:text-[.85rem] font-bold justify-center items-center text-center cursor-pointer border-2 border-black bg-orange-200 hover:bg-orange-300"
            >
              {showCalculator ? 'Show Team Web' : 'Show Calculator' }
            </button>
          </div>
          }

          <div className="flex flex-row w-full h-fit px-2 mt-2">

            <div className="w-1/2">
              <div
                onClick={() => setShowCardDetails(true)}
                className={`flex py-2 px-4 w-full h-full border-black card-sm:text-lg font-bold rounded-l-lg justify-center items-center text-center cursor-pointer ${showCardDetails ? "border-4 bg-orange-400" : "border-2 bg-orange-200"}`}
              >
                Card Details
              </div>
            </div>

            <div className="w-1/2 h-full border-black card-sm:text-lg font-bold">
              <MyDeckSelectButton userDeckData={userDeckData} selectedDeck={selectedDeck} setSelectedDeck={setSelectedDeck} allCharactersLoading={allCharactersLoading}/>
            </div>

          </div>

          {showCardDetails ? (
            <CardDetails
              cardDetails={cardDetails}
              hoverCharacterStats={hoverCharacterStats}
            />
          ) : (
            <DeckSelection
              characterDictionary={characterDictionary}
              webOfTeam={webOfTeam}
              userDeckData={userDeckData}
              selectedDeck={selectedDeck}
              addToWebOfTeam={addToWebOfTeam}
              removeFromWebOfTeam={removeFromWebOfTeam}
            />
          )}
        </div>

        {/* TODO: Card selection styling */}
        <div
          id="CardSelection"
          className={`${(showCardSelection || (windowWidth > 900)) ? '' : 'hidden'} flex flex-1 flex-col w-screen lg:w-[45%] bg-gradient-radial overflow-y-auto`}
        >

          {/* <h1 className="font-header text-2xl text-center lg:m-4">Search by Filters</h1> */}


          <div className={`bg-orange-200 border-b-4 border-x-4 border-black`}>
            <div 
            onClick={() => setShowFilters(!showFilters)}
            className="flex flex h-fit pt-1 items-center justify-center"
            >
              <p
              className="font-header text-2xl font-light cursor-pointer">Filters</p>
              <Image
              src={arrow}
              title={showFilters ? 'click to hide filters' : 'click to show filters'}
              width={300}
              height={100}
              alt={'arrow to show or hide characters in web'}
              className={`w-[7.5%] card-sm:w-[4%] ml-4 mb-1 cursor-pointer transform rotate-90 transition-transform duration-300 ${showFilters ? "scale-y-[-1] scale-x-[-1]" : "scale-y-[-1]"}`}
              />
            </div>

            <div className={`max-h-0 overflow-hidden transition-all duration-500 ${showFilters ? 'max-h-[100vh] ease-in-out' : ''}`}>
              <div className="flex pb-2 items-center justify-center">
                <span className="mr-4 flex h-fit items-center justify-center text-center text-md lg:text-sm  <1000px>:text-base font-bold">
                  Game Filter
                </span>
                <label className="inline-flex relative items-center mr-5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={!filterByGame}
                    readOnly
                  />
                  <div
                    onClick={() => {setFilterByGame(!filterByGame)}}
                    className="border border-black w-6 card-sm:w-11 h-3 card-sm:h-6 bg-orange-100 rounded-full peer peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[24%] card-sm:after:top-[10%] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 card-sm:after:h-5 after:w-3 card-sm:after:w-5 after:transition-all peer-checked:bg-orange-500"
                  ></div>
                  <div className="ml-4 flex h-fit items-center justify-center text-center text-md lg:text-sm  <1000px>:text-base font-bold">
                    Release Date
                  </div>
                </label>
              </div>

              {/* //contains filters/buttons/search field/etc. */}
              <SearchForm
                isDisabled={allCharactersLoading}
                onFormChange={filterAndSetCharacters}
                selectedCategories={selectedCategories}
                handleNewCategorySelected={handleNewCategorySelected}
                handleSelectedCategoryRemoval={handleSelectedCategoryRemoval}
              />
            
              <div className="flex w-full py-1 items-center justify-center">
                <MySaveAndGrayCharacterButton multiCardSelection={multiCardSelection} setMultiCardSelection={setMultiCardSelection} handleUpdateSavedCharacters={handleUpdateSavedCharacters} allCharactersLoading={allCharactersLoading}/>
              </div>

            </div>
          </div>

          {/* //character select box */}

          {/* <CharacterSelectionBox cardContainerRef={cardContainerRef} setHoverCharacterStats={setHoverCharacterStats} webOfTeam={webOfTeam} multiCardSelection={multiCardSelection} viewableCharacters={viewableCharacters} charactersToDisplay={charactersToDisplay} allCharactersLoading={allCharactersLoading}/> */}

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
        </div>

        {/* TODO: team web styling */}
        <div
          id="Team"
          className={`${showTeamWeb || (windowWidth > 900) ? '' : 'hidden'} flex flex-1 flex-col w-screen lg:w-[45%] bg-gradient-radial from-slate-500 via-slate-600 to-slate-900`}
        >
          {showCalculator ?
          (showDEFCalculator ?
            <CalculatorDEF 
            showCalculator={showCalculator} 
            setShowCalculator={setShowCalculator} 
            setShowDEFCalculator={setShowDEFCalculator}
            characterComparisonForCalculator={characterComparisonForCalculator} 
            setCharacterComparisonForCalculator={setCharacterComparisonForCalculator}
            handleCharacterComparisonSelection={handleCharacterComparisonSelection}
            setCardDetails={setCardDetails}
            />
            :
            <CalculatorATK 
            showCalculator={showCalculator} 
            setShowCalculator={setShowCalculator}
            setShowDEFCalculator={setShowDEFCalculator}
            characterComparisonForCalculator={characterComparisonForCalculator} 
            setCharacterComparisonForCalculator={setCharacterComparisonForCalculator}
            handleCharacterComparisonSelection={handleCharacterComparisonSelection}
            setCardDetails={setCardDetails}
            />
          )
          :
          <SuggestToWeb
            selectedCharacter={cardDetails}
            userCharacters={userCharacters}
            handleNewDetails={newCardDetails}
            addToWebOfTeam={addToWebOfTeam}
            webOfTeam={webOfTeam}
            removeFromWebOfTeam={removeFromWebOfTeam}
            allCharacters={allCharacters}
            allCharactersLoading={allCharactersLoading}
          />
          }
        </div>
      </div>

    </div>
  );
}

// returns a new array of characters derived from either allCharacters or userCharacters based on the criteria in filterData
const getFilteredCharacters = (allCharacters, userCharacters, filterData, selectedCategories) => {
  const baseChars = filterData.isUserDeck ? userCharacters : allCharacters || [];
  return baseChars.filter((character) => {
    
    const leaderNumbers = character.ls_description.match(/\d+/g) || []
    let characterLeadCategories
    if(selectedCategories.length > 0 && leaderNumbers.length > 0 && leaderNumbers.some(num => num >= 150) && leaderNumbers.some(num => num <= 200)){
      characterLeadCategories = (findCharacterLeaderCategories(character))
    }
    
    return (
      (!selectedCategories.length || (filterData.matchAllCategories
        ? selectedCategories.every(category => character.category && character.category.includes(category))
        : selectedCategories.some(category => character.category && character.category.includes(category))
      )) &&
      (!filterData.isCommonLeader || (selectedCategories.length > 0 ?
        filterData.matchAllCategories
        ? selectedCategories.every(category => characterLeadCategories?.includes(category))
        : selectedCategories.some(category => characterLeadCategories?.includes(category))
        :
        (leaderNumbers ? leaderNumbers.map(string => parseInt(string)).some(num => num >= 150 && num <= 200) : false))) &&      
      (!filterData.searchTerm || character.name.toLowerCase().includes(filterData.searchTerm.toLowerCase())) &&
      (!filterData.characterType || character.type.includes(filterData.characterType)) &&
      (!filterData.characterSuperOrExtreme || character.type.slice(0, 1).includes(filterData.characterSuperOrExtreme)) &&
      (!filterData.characterRarity ||filterData.characterRarity === character.rarity)
    );
  });
};

export default AllComponents;