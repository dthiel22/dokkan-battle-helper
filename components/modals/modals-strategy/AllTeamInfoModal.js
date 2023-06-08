import React, { memo } from "react";
import ReactDom from "react-dom";

import CharacterCard from "@/cards/CharacterCard";
import ItemCard from '../../cards/ItemCard'

import {Cloudinary} from "@cloudinary/url-gen";
import {AdvancedImage, lazyload} from '@cloudinary/react';

import Image from 'next/image';

const leaderIcon = "/dokkanIcons/icons/leader-icon.png";
const friendIcon = "/dokkanIcons/icons/friend-icon.png";
const hiddenPotentialIcon = "/dokkanIcons/icons/hidden-potential.png";
const ezaIcon = "/dokkanIcons/icons/z.png";


export default function AllTeamInfo({  team, characterDictionary, open, onClose }) {
  if (!open) return null;

  const rotationIds = [...team.rotation1, ...team.rotation2];
  //set entire float to team array of ids
  let floaterIds = [...team.teamArray]
  for (let i = 0; i < rotationIds.length; i++) {
    const index = floaterIds.indexOf(rotationIds[i]);
    //remove the rotation characters to have the 3 left over characters
    if (index > -1) {
      floaterIds.splice(index, 1);
    }
  }
  
  const teamArrayWithCharacterData = [team.character1, team.character2, team.character3, team.character4, team.character5, team.character6, team.character7]

  const ezaDictionary = Object.fromEntries(teamArrayWithCharacterData.map((characterData) => [characterData.characterId, characterData.EZA]));


  return ReactDom.createPortal(
    <div 
    onClick={onClose}
    className="flex fixed top-0 left-0 right-0 bottom-0 bg-black/[.7] z-[999] justify-center items-center">
      <div 
      onClick={(e) => e.stopPropagation()}
      className="w-[90%] lg:w-2/5 lg:min-w-[600px] h-[75vh] py-4 border-8 border-black rounded-lg shadow-lg fixed bg-orange-200 z-[1000] overflow-y-auto">
        
        <div className="flex flex-col w-full mb-6 justify-center items-center">
          <p className="font-header w-[80%] text-xl card-sm:text-3xl text-center">{team.name}</p>
          <p className="w-[80%] pb-2 text-base card-sm:text-2xl font-bold text-center truncate">creator: {team.creator.username.replace(/(.+)@.+\..+/, "$1")}</p>
          {team.mission === 'No Mission' ? null : <p className="w-[80%] pb-2 text-md card-sm:text-lg font-bold text-center">Mission: {team.mission}</p>}
          <div className="w-[80%] border-b-black border-b-4"></div>
        </div>

        <div className="flex flex-wrap w-full justify-around">

          <div className="flex flex-col justify-center items-center">

            <p className="font-header text-base card-sm:text-xl">Leader:</p>
            <div>
              <CharacterCard individualCharacter={characterDictionary[team.leader]} mobilesize={'80px'} desktopsize={'100px'} EZA={ezaDictionary[team.leader]} leaderOrSubLeader='leader'/>
            </div>
            <p className="font-header text-base card-sm:text-xl">Sub Leader:</p>
            <div>
              <CharacterCard individualCharacter={characterDictionary[team.subLeader]} mobilesize={'80px'} desktopsize={'100px'} EZA={ezaDictionary[team.subLeader]} leaderOrSubLeader='subLeader'/>
            </div>
            
          </div>

          <div className="justify-center items-center">

            <div className="flex flex-col">
              <p className="font-header w-full text-center text-base card-sm:text-xl">Rotation 1:</p>
              <div className="flex justify-center w-full">
                <div>
                  <CharacterCard individualCharacter={characterDictionary[team.character1.characterId]} mobilesize={'80px'} desktopsize={'100px'} EZA={ezaDictionary[team.character1.characterId]} leaderOrSubLeader={team.character1.leaderOrSubLeader}/>
                </div>
                <div>
                  <CharacterCard individualCharacter={characterDictionary[team.character2.characterId]} mobilesize={'80px'} desktopsize={'100px'} EZA={ezaDictionary[team.character2.characterId]} leaderOrSubLeader={team.character2.leaderOrSubLeader}/>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="font-header w-full text-center text-base card-sm:text-xl">Rotation 2:</p>
              <div className="flex justify-center w-full">
              <div>
                <CharacterCard individualCharacter={characterDictionary[team.character3.characterId]} mobilesize={'80px'} desktopsize={'100px'} EZA={ezaDictionary[team.character3.characterId]} leaderOrSubLeader={team.character3.leaderOrSubLeader}/>
              </div>
              <div>
                <CharacterCard individualCharacter={characterDictionary[team.character4.characterId]} mobilesize={'80px'} desktopsize={'100px'} EZA={ezaDictionary[team.character4.characterId]} leaderOrSubLeader={team.character4.leaderOrSubLeader}/>
              </div>
              </div>
            </div>

          </div>

        </div>

        <div className="flex flex-col lg:flex-row w-full pt-4 justify-center items-center">
          <p className="font-header flex mr-4 justify-around text-base card-sm:text-xl">Float:</p>
          <div className="flex flex-wrap justify-center">
            <div>
              <CharacterCard individualCharacter={characterDictionary[team.character5.characterId]} mobilesize={'80px'} desktopsize={'100px'} EZA={ezaDictionary[team.character5.characterId]} leaderOrSubLeader={team.character5.leaderOrSubLeader}/>
            </div>
            <div>
              <CharacterCard individualCharacter={characterDictionary[team.character6.characterId]} mobilesize={'80px'} desktopsize={'100px'} EZA={ezaDictionary[team.character6.characterId]} leaderOrSubLeader={team.character6.leaderOrSubLeader}/>
            </div>
            <div>
              <CharacterCard individualCharacter={characterDictionary[team.character7.characterId]} mobilesize={'80px'} desktopsize={'100px'} EZA={ezaDictionary[team.character7.characterId]} leaderOrSubLeader={team.character7.leaderOrSubLeader}/>
            </div>
          </div>

        </div>

        <div className="flex flex-row w-full justify-center items-center">
          <p className="font-header flex mr-4 justify-around text-base card-sm:text-xl">Items:</p>
          
          {(team.items.length === 0 || team.items[0].id === 0) ?
          <div className="flex flex-row p-2">
          <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'60px'}/>
          <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'60px'}/>
          <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'60px'}/>
          <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'60px'}/>
          </div>
          :
          <div className="flex flex-row p-2">
            {team.items && team.items.map((item) => (
              <ItemCard item={item} key={item.id} mobilesize={'40px'} desktopsize={'60px'}/>
            ))}
          </div>
          }
        </div>

        <div className="flex flex-row w-full mb-4 justify-center items-center">
          <p className="font-header flex mr-4 justify-around text-base card-sm:text-xl">Support Memory:</p>
          {team.supportMemory ? 
          <SupportMemoryCard supportMemory={team.supportMemory}/>
          :
          <SupportMemoryCard supportMemory={{id:0}}/>
          }
        </div>

        <div className="h-full w-full border-t-4 border-black">
          <CharacterBar singleCharacter={team.character1} characterDictionary={characterDictionary} leaderOrSubLeader={team.character1.leaderOrSubLeader}/>
          <CharacterBar singleCharacter={team.character2} characterDictionary={characterDictionary} leaderOrSubLeader={team.character2.leaderOrSubLeader}/>
          <CharacterBar singleCharacter={team.character3} characterDictionary={characterDictionary} leaderOrSubLeader={team.character3.leaderOrSubLeader}/>
          <CharacterBar singleCharacter={team.character4} characterDictionary={characterDictionary} leaderOrSubLeader={team.character4.leaderOrSubLeader}/>
          <CharacterBar singleCharacter={team.character5} characterDictionary={characterDictionary} leaderOrSubLeader={team.character5.leaderOrSubLeader}/>
          <CharacterBar singleCharacter={team.character6} characterDictionary={characterDictionary} leaderOrSubLeader={team.character6.leaderOrSubLeader}/>
          <CharacterBar singleCharacter={team.character7} characterDictionary={characterDictionary} leaderOrSubLeader={team.character7.leaderOrSubLeader}/>

        <div className="flex flex-col w-full pb-10 justify-center items-center">
          <p className="font-header flex pt-2 justify-around text-base card-sm:text-xl">Team Strategy:</p>
          <p className="p-4 lg:text-lg font-bold">
            {team.strategy}
          </p>
        </div>
        </div>
      </div>
    </div>,document.getElementById("AllTeamInfoModal")
  );
};

function CharacterBar({ singleCharacter, characterDictionary, leaderOrSubLeader }){
  return (
  <div className="flex flex-row w-full h-[17vh] items-center border-b-4 border-black bg-orange-200">
    <div className="flex flex-col w-fit h-full justify-center items-center border-r-2 border-black">
      <div className="p-2">
        <CharacterCard individualCharacter={characterDictionary[singleCharacter?.characterId]} leaderOrSubLeader={leaderOrSubLeader} mobilesize={'80px'} desktopsize={'100px'} EZA={singleCharacter.EZA}/>
      </div>
      <div className="flex w-full border-black">
          <div 
          className={`grayscale inline-flex items-center justify-between w-full p-1 grayscale ${singleCharacter?.hiddenPotential?.hiddenPotential1 ? 'grayscale-0' : ''}`}>                           
            <img src={hiddenPotentialIcon} className="w-full"/>
          </div>
          <div 
          className={`grayscale inline-flex items-center justify-between w-full p-1 grayscale ${singleCharacter?.hiddenPotential?.hiddenPotential2 ? 'grayscale-0' : ''}`}>                           
            <img src={hiddenPotentialIcon} className="w-full"/>
          </div>
          <div 
          className={`grayscale inline-flex items-center justify-between w-full p-1 grayscale ${singleCharacter?.hiddenPotential?.hiddenPotential3 ? 'grayscale-0' : ''}`}>                           
            <img src={hiddenPotentialIcon} className="w-full"/>
          </div>
          <div 
          className={`grayscale inline-flex items-center justify-between w-full p-1 grayscale ${singleCharacter?.hiddenPotential?.hiddenPotential4 ? 'grayscale-0' : ''}`}>                           
            <img src={hiddenPotentialIcon} className="w-full"/>
          </div>            
      </div>
    </div>

    <div className="flex flex-col h-full w-full justify-center items-center text-center bg-orange-300">
      <div className="flex flex-col w-full h-full p-2 flex-grow">
        <p className="flex font-header font-light justify-center text-md logo-md:text-lg border-b-2 border-black">
          Character Strategy:
        </p>
        <p className="flex h-full text-sm lg:text-base font-bold overflow-y-auto">
          {singleCharacter?.info}
        </p>
      </div>
    </div>
  </div>
  )
}

const SupportMemoryCard = ({supportMemory}) => {
  // Set the Cloud configuration and URL configuration
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
  let supportMemoryThumb = cld.image(`Support Memories/${supportMemory.id}`);
  
  return (
    <>
        <div className='w-fit relative'>
          <AdvancedImage
            className={`w-[60px] card-sm:w-[80px] bg-no-repeat relative z-50 top-[1%] card-sm:top-[.5%] right-[0%] card-sm:right-[0%] z-40`}
            cldImg={supportMemoryThumb}
            alt={supportMemory.name}
            plugins={[lazyload({rootMargin: '10px 20px 10px 30px', threshold: 0.05})]}
            />
        </div>
    </>
  );
}