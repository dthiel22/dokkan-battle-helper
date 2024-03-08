import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import * as characterStyling from "../util/characterCardStyling";
import * as linkSkillInfo from "../util/linkSkillInfo";

import {Cloudinary} from "@cloudinary/url-gen";
import {AdvancedImage, lazyload} from '@cloudinary/react';

import CharacterCard from "../cards/CharacterCard";
import SuggestCard from "@/cards/SuggestCard";

import { UserContext } from '../../pages/_app';

import { useSortedCharacters } from "../util/sorting";
import { find200Leaders, findCharacterLeaderCategories, findMainAndSubLeaderCategories } from '../util/allCategories'

import Image from 'next/image';

function CardDetails({ cardDetails, hoverCharacterStats, characterDictionary, webOfTeam, handleNewDetails, removeFromWebOfTeam, addToWebOfTeam }) {  
  const { turnOnEZAStats, setTurnOnEZAStats, filterByGame, selectedLeaderCategories, setSelectedLeaderCategories } = useContext(UserContext)

  const divRef1 = useRef(null);
  
  const characterDetails = useMemo(() => {
    if(hoverCharacterStats || hoverCharacterStats !== null){
      return hoverCharacterStats
    } else{
      return cardDetails
    }
  }, [cardDetails, hoverCharacterStats]);

  //this separate EZA state allows for the constant turnOnEZAStats to control it depending on if a character has an EZA or not
  const [showEZAStats, setShowEZAStats] = useState(false)

  useEffect(() => {
    if(hoverCharacterStats && turnOnEZAStats && (hoverCharacterStats?.glb_date_eza || hoverCharacterStats?.jp_date_eza)){
      setShowEZAStats(true)
    } else if ((hoverCharacterStats && turnOnEZAStats && (!hoverCharacterStats?.glb_date_eza || !hoverCharacterStats?.jp_date_eza))){
      setShowEZAStats(false)
    } else if((turnOnEZAStats && (cardDetails.glb_date_eza || cardDetails.jp_date_eza))){
      setShowEZAStats(true)
    } else {
      setShowEZAStats(false)
    }
  },[cardDetails, turnOnEZAStats, hoverCharacterStats])

  const leaderCategories = findMainAndSubLeaderCategories(characterDetails)

  useEffect(() => {
    setSelectedLeaderCategories(leaderCategories)
  },[cardDetails])

  const handleMainLeaderSelection = (category) => {
    const updatedCategories = selectedLeaderCategories.characterMainCategories.includes(category)
      ? selectedLeaderCategories.characterMainCategories.filter(cat => cat !== category)
      : [...selectedLeaderCategories.characterMainCategories, category];
  
    setSelectedLeaderCategories({
      ...selectedLeaderCategories,
      characterMainCategories: updatedCategories
    });
  };
  
  const handleSubLeaderSelection = (category) => {
    const updatedCategories = selectedLeaderCategories.characterSubCategories.includes(category)
    ? selectedLeaderCategories.characterSubCategories.filter(cat => cat !== category)
    : [...selectedLeaderCategories.characterSubCategories, category];

  setSelectedLeaderCategories({
    ...selectedLeaderCategories,
    characterSubCategories: updatedCategories
  });
  }

  const charactersWith200WithSelectedCategories = Object.values(characterDictionary).filter(character => {
    if (selectedLeaderCategories?.characterMainCategories && selectedLeaderCategories?.characterSubCategories) {
      const hasMainCategory = selectedLeaderCategories.characterMainCategories.some(mainCategory =>
        character?.category?.includes(mainCategory)
      );
  
      const hasSubCategory = selectedLeaderCategories.characterSubCategories.some(subCategory =>
        character?.category?.includes(subCategory)
      );
  
      return hasMainCategory && hasSubCategory;
    }
  });  

  const isCharacterLeader = findCharacterLeaderCategories(characterDetails)

  const charactersWith200WithSelectedCategoriesToDisplay = useSortedCharacters(charactersWith200WithSelectedCategories)
  
  const leadersWith200 = find200Leaders(hoverCharacterStats ? hoverCharacterStats : cardDetails, characterDictionary);

  return (
    <div className="flex flex-col w-full p-2">
      <div className="flex flex-col w-full">
        {/* character name, thumb, EZA button*/}
        <div className="flex flex-col w-full justify-center items-center">
          <div className="w-full bg-orange-100 p-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 ">
            <p className="flex px-4 w-full font-header text-lg card-sm:text-2xl items-center justify-center text-center">
              {characterDetails?.name}
            </p>
            <p className="flex px-4 pb-2 w-full font-bold text-md card-sm:text-base items-center justify-center text-center">
              {characterDetails?.title}
            </p>
          </div>

          <div>
            <CharacterCard individualCharacter={characterDetails} mobilesize={'80px'} desktopsize={'100px'}/>
          </div>

          <button
          disabled={!characterDetails?.jp_date_eza && !characterDetails?.glb_date_eza}
          onClick={() => setTurnOnEZAStats(!turnOnEZAStats)}
          className={`disabled:text-gray-900 font-header EZA-header text-2xl relative z-50`}>
            EZA
            {showEZAStats ? 
            <Image 
            width={100}
            height={30}
            src= {'/dokkanIcons/power-up.png'}
            className="absolute max-w-[200%] h-[120%] -bottom-[10%] -right-[50%] z-0 object-contain"
            alt='extreme awakening'
            /> : ''
            }
          </button>
        </div>

        {/* leader and super APPLY TO ALL CHARACTERS */}
          <div className="flex flex-wrap w-full bg-orange-100 p-2 mb-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 justify-center">
            <p className="w-full h-fit mb-2 font-header border-b-2 border-black text-center text-lg card-sm:text-2xl">
              Leader Skill
            </p>
            <div className="w-full h-fit font-bold text-sm card-sm:text-md">
              {!showEZAStats ? characterDetails?.ls_description: characterDetails?.ls_description_eza}
            </div>
          </div>


          <div className="flex flex-wrap w-full bg-orange-100 p-2 mb-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 justify-center">
            <p className="w-full h-fit font-header text-center text-lg card-sm:text-2xl">
              Passive Skill
            </p>
            <p className="w-full mb-2 border-b-2 border-black font-bold text-md card-sm:text-base text-center">
              {characterDetails?.ps_name}
            </p>
            <div className="flex w-full font-bold text-sm card-sm:text-md">
              {!showEZAStats ? 
                <CardDescription text={characterDetails?.ps_description} />
                : 
                <CardDescription text={characterDetails?.ps_description_eza} />
              }
            </div>
          </div>

          <div className="flex flex-wrap w-full bg-orange-100 p-2 mb-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 justify-center">
            <p className="w-full h-fit font-header text-center text-lg card-sm:text-2xl">
              Super Attack
            </p>
              <p className="w-full mb-2 border-b-2 border-black font-bold text-md card-sm:text-base text-center">
                {characterDetails?.sa_name}
              </p>
            {characterDetails?.sa_name === 'None' ? null :
              <div className="flex w-full font-bold text-sm card-sm:text-md">
                {!showEZAStats ? 
                  <CardDescription text={characterDetails?.sa_description} />
                  : 
                  <CardDescription text={characterDetails?.sa_description_eza} />
                }
              </div>
            }
          </div>
      </div>

      {characterDetails?.ultra_sa_description && 
        <div className="flex flex-wrap w-full bg-orange-100 p-2 mb-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 justify-center">
          <p className="w-full h-fit font-header text-center text-lg card-sm:text-2xl">
            Ultra Super Attack
          </p>
          <p className="w-full mb-2 border-b-2 border-black font-bold text-md card-sm:text-base text-center">
            {characterDetails?.ultra_sa_name}
          </p>
          <div className="flex w-full font-bold text-sm card-sm:text-md">
            {!showEZAStats ? 
              <CardDescription text={characterDetails?.ultra_sa_description} />
              : 
              <CardDescription text={characterDetails?.ultra_sa_description_eza} />
            }
          </div>
        </div>
      }

      {characterDetails?.active_skill_name && (
        <div className="flex flex-wrap w-full bg-orange-100 p-2 mb-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 justify-center">
          <p className="w-full h-fit font-header text-center text-lg card-sm:text-2xl">
            Active Skill
          </p>
          <p className="w-full mb-2 border-b-2 border-black font-bold text-md card-sm:text-base text-center">
            {characterDetails?.active_skill_name}
          </p>
          <div className="flex w-full font-bold text-sm card-sm:text-md">
            {!showEZAStats ? 
              <CardDescription text={characterDetails?.active_skill + '; ' + characterDetails?.active_skill_condition} />
              : 
              <CardDescription text={
                characterDetails?.active_skill_eza ? (characterDetails?.active_skill_eza + '; ' + characterDetails?.active_skill_condition_eza) 
                : 
                (characterDetails?.active_skill + '; ' + characterDetails?.active_skill_condition)} />
            }
          </div>
          {/* this statement allows for not a double character card if transforms in the active skill */}
          {!characterDetails?.transform_condition && characterDetails?.transform_to && characterDetails?.transform_to.map(singleCharacterId => 
            <div key={'Transition to' + singleCharacterId}>
              <CharacterCard individualCharacter={characterDictionary[singleCharacterId]} mobilesize={'80px'} desktopsize={'100px'}/>
            </div>
          )}
        </div>
      )}

      {characterDetails?.transform_condition && (
        <div className="flex flex-wrap w-full bg-orange-100 p-2 mb-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 justify-center">
          <p className="w-full h-fit mb-2 font-header border-b-2 border-black text-center text-lg card-sm:text-2xl">
            Transform: {characterDetails?.transform_type}
          </p>
          <div className="flex w-full font-bold text-sm card-sm:text-md">
            {!showEZAStats ? 
              <CardDescription text={characterDetails?.transform_condition} />
              : 
              <CardDescription text={characterDetails?.transform_condition_eza ? characterDetails?.transform_condition_eza : characterDetails?.transform_condition} />
            }
          </div>
          {characterDetails?.transform_to && characterDetails?.transform_to.map(singleCharacterId => 
            <div key={'Transform to' + singleCharacterId}>
              <CharacterCard individualCharacter={characterDictionary[singleCharacterId]} mobilesize={'80px'} desktopsize={'100px'}/>
            </div>
          )}
        </div>
      )}

      {characterDetails?.standby_name && (
        <div className="flex flex-wrap w-full bg-orange-100 p-2 mb-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 justify-center">
          <p className="w-full h-fit mb-2 font-header border-b-2 border-black text-center text-lg card-sm:text-2xl">
            Stand By: {characterDetails?.transform_type}
          </p>
          <div className="flex w-full font-bold text-sm card-sm:text-md">
            {!showEZAStats ? 
              <CardDescription text={characterDetails?.standby_condition} />
              : 
              <CardDescription text={characterDetails?.standby_condition_eza ? characterDetails?.standby_condition_eza : characterDetails?.transform_condition} />
            }
          </div>
          {characterDetails?.transform_to && characterDetails?.transform_to.map(singleCharacterId => 
            <div key={'Transform to' + singleCharacterId}>
              <CharacterCard individualCharacter={characterDictionary[singleCharacterId]} mobilesize={'80px'} desktopsize={'100px'}/>
            </div>
          )}
        </div>
      )}

      {characterDetails?.finish_attack_1_name && 
        <div className="flex flex-wrap w-full bg-orange-100 p-2 mb-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 justify-center">
          <p className="w-full h-fit font-header text-center text-lg card-sm:text-2xl">
            Finish Attack 1
          </p>
          <p className="w-full mb-2 border-b-2 border-black font-bold text-md card-sm:text-base text-center">
            {characterDetails?.finish_attack_1_name}
          </p>
          <div className="flex w-full font-bold text-sm card-sm:text-md">
            {!showEZAStats ? 
              <CardDescription text={characterDetails?.finish_attack_1_condition + '; ' + characterDetails?.finish_attack_1_description} />
              : 
              <CardDescription text={characterDetails?.finish_attack_1_condition_eza} />
            }
          </div>
        </div>
      }

      {characterDetails?.finish_attack_2_name && 
        <div className="flex flex-wrap w-full bg-orange-100 p-2 mb-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 justify-center">
          <p className="w-full h-fit font-header text-center text-lg card-sm:text-2xl">
            Finish Attack 2
          </p>
          <p className="w-full mb-2 border-b-2 border-black font-bold text-md card-sm:text-base text-center">
            {characterDetails?.finish_attack_2_name}
          </p>
          <div className="flex w-full font-bold text-sm card-sm:text-md">
            {!showEZAStats ? 
              <CardDescription text={characterDetails?.finish_attack_2_condition + '; ' + characterDetails?.finish_attack_2_description} />
              : 
              <CardDescription text={characterDetails?.finish_attack_2_condition_eza} />
            }
          </div>

          {characterDetails?.transform_to && characterDetails?.transform_to.map(singleCharacterId => 
            <div key={'Transform to' + singleCharacterId}>
              <CharacterCard individualCharacter={characterDictionary[singleCharacterId]} mobilesize={'80px'} desktopsize={'100px'}/>
            </div>
          )}
        </div>
      }

      {/* links + categories */}
      <div className="flex flex-wrap w-full">
        <div className="w-full">
          <p className="h-fit flex w-full font-header text-lg card-sm:text-2xl justify-center">
            Links:
          </p>
          <div className="flex flex-wrap w-full text-sm card-sm:text-md justify-center items-center">
            {characterDetails?.link_skill &&
              characterDetails?.link_skill.map((linkText) => {
                return (
                  <p className="w-fit mx-2 font-bold bg-orange-100 border-2 border-black mt-1 p-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] text-sm card-sm:text-md"
                  >
                    {linkText}
                  </p>
                )
              })}
          </div>
        </div>

        <div className="w-full pb-4">
          <p className="flex w-full font-header text-lg card-sm:text-2xl justify-center">
            Categories:
          </p>
          <div className="flex flex-wrap text-sm card-sm:text-md justify-center items-center">
            {characterDetails?.category &&
              characterDetails?.category.map((categoryText) => {
                return (
                  <div key={categoryText} className="w-fit font-bold bg-orange-100 border-2 border-black mt-1 mx-2 p-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] text-sm card-sm:text-md">
                    {categoryText}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap w-full bg-orange-100 p-2 mb-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 justify-center">
        <p className="font-header w-full h-fit border-b-2 border-black text-center text-lg card-sm:text-2xl">
          200% Leaders
        </p>
        <div className="flex flex-wrap w-full p-2 justify-center items-center">
          {leadersWith200?.length >= 1 ? leadersWith200.map((leader) => {
            return(
              <div key={leader?.id}>
                <SuggestCard
                character={leader}
                webOfTeam={webOfTeam}
                selectedCharacter={cardDetails}
                handleNewDetails={handleNewDetails}
                removeFromWebOfTeam={removeFromWebOfTeam}
                addToWebOfTeam={addToWebOfTeam}
                />
              </div>
            )
          })
        :
        <p className="w-full mb-2 font-bold text-md card-sm:text-base text-center">
          None
        </p>
        }
        </div>
      </div>
      
      {(leaderCategories?.characterMainCategories?.length > 1 && leaderCategories?.characterSubCategories?.length > 1) &&
            <p className="font-header w-full h-fit text-center text-lg card-sm:text-2xl">
              Characters With 200% Bonus
            </p>
          }
        </div>
  );
}

const CharactersWith200Div = ({ character,webOfTeam,cardDetails,handleNewDetails,removeFromWebOfTeam,addToWebOfTeam}) => {

return(

  <div className="flex flex-wrap w-full bg-orange-100 p-2 mb-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] border-2 border-slate-900 justify-center">
    <p className="font-bold border-b-2 border-black">170% Categories</p>
    <div className="flex flex-wrap w-full p-2 justify-center items-center">
      {leaderCategories?.characterMainCategories.map(singleCategory =>
        <div
        key={singleCategory}
        onClick={() => handleMainLeaderSelection(singleCategory)}
        className={`flex w-1/2 p-1 cursor-pointer items-center justify-center ${!selectedLeaderCategories?.characterMainCategories?.includes(singleCategory) && 'grayscale'}`}
        >
          <CharacterCategory category={singleCategory}/>
        </div>
      )}
    </div>
    <p className="font-bold border-b-2 border-black">130% Categories</p>
    <div className="flex flex-wrap w-full p-2 justify-center items-center">
      {leaderCategories?.characterSubCategories.map(singleCategory =>
        <div
        key={singleCategory}
        onClick={() => handleSubLeaderSelection(singleCategory)}
        className={`flex w-1/2 p-1 cursor-pointer items-center justify-center ${!selectedLeaderCategories?.characterSubCategories?.includes(singleCategory) && 'grayscale'}`}
        >
          <CharacterCategory category={singleCategory}/>
        </div>
      )}
    </div>
    
    <div className="flex flex-wrap justify-around max-h-[375px] overflow-y-auto">
    {charactersWith200WithSelectedCategoriesToDisplay?.length >= 1 ? charactersWith200WithSelectedCategoriesToDisplay.map((character) => {
        return(
          <div key={character?.id}>
            <SuggestCard
            character={character}
            webOfTeam={webOfTeam}
            selectedCharacter={cardDetails}
            handleNewDetails={handleNewDetails}
            removeFromWebOfTeam={removeFromWebOfTeam}
            addToWebOfTeam={addToWebOfTeam}
            />
          </div>
        )
      })
    :
    <p className="w-full mb-2 font-bold text-md card-sm:text-base text-center">
      None
    </p>
    }
    </div>
  </div>
)
}

//ChatGPT helped with basically all of this. Allows for * to be clickable / off click, hovers text on click
const CardDescription = ({ text }) => {
  
  const [hover, setHover] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);

  // this allows the screen to change sizes and auto update revealing/hiding the middle column
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();

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
  
  const handleHover = (index, event) => {
    if (windowWidth < 900){
      return
    }
    setHover(!hover);
    setHoverIndex(index);
  };
  
  const handleLeaveHover = (index,event) => {
    if (windowWidth < 900){
      return
    }
    setHover(false)
    setHoverIndex(index)
  }
  
  const handleClickAsterisk = (index, event) => {
    if (windowWidth > 900){
      return
    }
    setHover(!hover);
    setHoverIndex(index);
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (hover && !event.target.closest('.hover-box')) {
        setHover(false);
        setHoverIndex(-1);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [hover]);

  if (!text) {
  return null;
  }
  
  //formats the text to replace < and > with an * then we make the left over text into an array
  const formattedText = text.replace(/<(.*?)>/g, '*');
  const descriptionArray = formattedText.split('*');

  // grabs everything from < to >
  const textBetweenBrackets = text.match(/<(.*?)>/g);
  let hoverTextArray = [];

  // removes the < and > from the text 
  if (textBetweenBrackets) {
    hoverTextArray = textBetweenBrackets.map(t => t.slice(1, -1));
  }
  
  return (
    <div>
      {descriptionArray.map((t, i) => (
        <React.Fragment key={i}>
          {t}
          {i < descriptionArray.length - 1 && (
            <b className="text-md text-orange-600 cursor-pointer relative" 
            onMouseEnter={(event) => (handleHover(i + 1, event))}
            onMouseLeave={(event) => (handleLeaveHover(i + 1, event))}
            onClick={(event) => (handleClickAsterisk(i + 1, event))}>
              *
              {hover && hoverIndex === i + 1 ? (
                <div 
                className="w-40 h-fit p-2 text-black bg-orange-400 border border-black absolute bottom-[110%] hover-box z-40">
                  {hoverTextArray[i]}
                </div>
              ) : null}
            </b>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const CharacterCategory = ({ category }) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    },
    url: {
        // TODO: upgrade cloudinary to unlock secureDistribution
        // secureDistribution: 'www.dokkanbattlehelper.com', 
        secure: true // or false if you don't want to use HTTPS
    }
  });
  // Instantiate and configure a CloudinaryImage object.
  let stagePhoto = cld.image(`Character Categories/${category?.replace(/[^\w\s]/gi, '')?.replace(/\s+/g, '')?.toLowerCase()}`);
  
  return(
    <div>
      <AdvancedImage cldImg={stagePhoto} className=''/>
    </div>
  )
  }


export default CardDetails;