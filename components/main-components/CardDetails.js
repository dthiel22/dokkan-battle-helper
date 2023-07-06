import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import * as characterStyling from "../util/characterCardStyling";
import * as linkSkillInfo from "../util/linkSkillInfo";

import {AdvancedImage, lazyload} from '@cloudinary/react';
import {CloudinaryImage} from "@cloudinary/url-gen";
import {URLConfig} from "@cloudinary/url-gen";
import {CloudConfig} from "@cloudinary/url-gen";
import CharacterCard from "../cards/CharacterCard";

import { UserContext } from '../../pages/_app';

import Image from 'next/image';
import SuggestCard from "@/cards/SuggestCard";

function CardDetails({ cardDetails, hoverCharacterStats, characterDictionary }) {  
  const { turnOnEZAStats, setTurnOnEZAStats } = useContext(UserContext)

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
            <div>
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
            <div>
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
            <div>
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
            <div>
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
                return <CharacterLinkDisplay key={linkText} linkText={linkText} />;
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
    </div>
  );
}

//ChatGPT helped with basically all of this. Allows for * to be clickable / off click, hovers text on click
const CardDescription = ({ text }) => {
  
  const [hover, setHover] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [hoverX, setHoverX] = useState(0);
  const [hoverY, setHoverY] = useState(0);
  
  const handleHover = (index, event) => {
    setHover(!hover);
    setHoverIndex(index);
    setHoverX(event.clientX);
    setHoverY(event.clientY);
  };

  const handleLeaveHover = (index,event) => {
    setHover(false)
    setHoverIndex(index)
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
            onClick={(event) => (handleHover(i + 1, event))}>
            {/* onMouseEnter={(event) => ((window.innerWidth > 900) && handleHover(i + 1, event))}
            onMouseLeave={(event) => ((window.innerWidth > 900) && handleLeaveHover(i + 1, event))}
            onClick={(event) => (window.innerWidth < 900) && (handleHover(i + 1, event))}> */}
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

const CharacterLinkDisplay = ({ linkText }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  return (
    <>
      <div className="relative">
        {showPopUp && (
          <div className="absolute top-[-110%] p-2 bg-gray-200 text-gray-700 z-50">
            {linkSkillInfo.getLinkSkillInfo(linkText)[2]}
          </div>
        )}
        <div
          className="w-fit mx-2 font-bold bg-orange-100 border-2 border-black mt-1 p-2 shadow-[inset_0_-5px_6px_rgba(0,0,0,0.6)] text-sm card-sm:text-md"
          // onMouseEnter={() => setShowPopUp(true)}
          // onMouseLeave={() => setShowPopUp(false)}
        >
          {linkText}
        </div>
      </div>
    </>
  );
};

// ability for divs to become auto-scroll horizonally
const ScrollingDiv = ({ text }) => {
  const ScrollRate = 50;
  let DivElmnt = null;
  let ReachedMaxScroll = false;
  let PreviousScrollLeft = 0;
  let ScrollInterval = null;
  
  const divRef = useRef(null)
  const [divClass, setDivClass] = useState("flex px-4 w-full font-header text-lg card-sm:text-2xl whitespace-nowrap justify-center");
    
  useEffect(() => {
    function handleResize() {
      if (divRef.current) {
        if (divRef.current.scrollWidth <= divRef.current.clientWidth) {
          setDivClass(
            "flex px-4 w-full font-header text-lg card-sm:text-2xl whitespace-nowrap justify-center"
          );
        } else {
          setDivClass(
            "flex w-[90%] px-6 overflow-x-auto font-header text-lg card-sm:text-2xl whitespace-nowrap"
          );
        }
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [text, divRef]);
  
  useEffect(() => {
    DivElmnt = divRef.current;
    ReachedMaxScroll = false;

    DivElmnt.scrollLeft = 0;
    PreviousScrollLeft = 0;
    
    ScrollInterval = setInterval(scrollDiv, ScrollRate);
    
    return () => {
      clearInterval(ScrollInterval);
    };
  }, [text]);
  
  function scrollDiv() {
    if (!ReachedMaxScroll) {
      DivElmnt.scrollLeft = PreviousScrollLeft;
      PreviousScrollLeft++;
      
      if (DivElmnt.scrollLeft >= DivElmnt.scrollWidth - DivElmnt.offsetWidth) {
        ReachedMaxScroll = true;
      }
    } else {
      if (DivElmnt.scrollLeft === 0) {
        ReachedMaxScroll = false;
      }
      PreviousScrollLeft--;
      DivElmnt.scrollLeft = PreviousScrollLeft;
    }
  }
  
  return (
    <div className={divClass} ref={divRef} key={text}>
      {text}
    </div>
  );
};

export default CardDetails;