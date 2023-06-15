import React, { useState, useContext } from "react";
import Auth from "../util/auth";
import CharacterCard from "../cards/CharacterCard";
import MakeTeamForm from "../modals/modals-home/MakeTeamForm"
import EditTeamForm from "../modals/modals-home/EditTeamForm"
import ErrorModal from "../modals/modals-home/ErrorModal"
import WarningModal from "../modals/modals-home/WarningModal";
import TeamAnalysis from "../modals/modals-home/TeamAnalysis"

import { UserContext } from '../../pages/_app';

import { useMutation } from "@apollo/client";
import { RENAME_DECK, ADD_TEAM_TO_DECK } from "../util/mutations"

import Image from 'next/image';

const addIcon = "/dokkanIcons/icons/add-icon.png";
const trashIcon = "/dokkanIcons/icons/trash-icon.png";
const editIcon = "/dokkanIcons/icons/edit-icon.png";
const teamToWebIcon = "/dokkanIcons/icons/add-team-to-web.png";
const gridIcon = '/dokkanIcons/icons/grid-icon.png'


export default function DeckSelection({ characterDictionary, webOfTeam, userDeckData, selectedDeck, addToWebOfTeam, removeFromWebOfTeam }) {
  const [openErrorModal, setOpenErrorModal] = useState(false)
  const [openWarningModal, setOpenWarningModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [openTeamAnalysis, setOpenTeamAnalysis] = useState(false)
  const [openMakeTeamForm, setOpenMakeTeamForm] = useState(false)
  const [openEditTeamForm, setOpenEditTeamForm] = useState(false)
  const [showGridLayout, setShowGridLayout] = useState(true)
  
  const [teamUsedInMakeTeamForm, setTeamUsedInMakeTeamForm] = useState([])
  const [teamUsedInForm, setTeamUsedInForm] = useState([])
  const [teamUsedInAnalysis, setTeamUsedInAnalysis] = useState([])

  const { grayCharactersInSelectedDeck, setGrayCharactersInSelectedDeck } = useContext(UserContext);
  
  const [newDeckName, setNewDeckName] = useState("");

  const [renameDeck, { error: renameDeckError, data: updatedRenameDeck }] = useMutation(RENAME_DECK);

  //getting the profileId number for future mutations
  const profileId = Auth.getProfile()?.data?._id;
  const selectedDeckObj = userDeckData.find(deck => deck._id === selectedDeck);
  const allTeams = selectedDeckObj?.teams
  
  //this runs on the save button click
  async function handleRenameDeck (e) {
    e.preventDefault()
    await renameDeck({
      variables:{
        profileId: profileId,
        deckId: selectedDeckObj?._id,
        newDeckName: newDeckName
      }
    }).catch((error) => {
      setErrorMessage(error.message);
      setOpenErrorModal(true);
    })
  }
  
  async function handleAddTeamToDeck() {
    const cleanWebOfTeam = webOfTeam.map((character) => {
      const { __typename, ...cleanCharacter } = character;
      return cleanCharacter;
    });

    setTeamUsedInMakeTeamForm(cleanWebOfTeam)
    setOpenMakeTeamForm(true)
  }

  function handleTeamAnalytics (team){
    setTeamUsedInAnalysis(team)
    setOpenTeamAnalysis(true)
  }

  function handleMakeTeamForm (team){
    setTeamUsedInForm(team)    
    setOpenEditTeamForm(true)
  }

  function handleEditTeamInfo (team){
    setTeamUsedInForm(team)    
    setOpenEditTeamForm(true)
  }

  function handleWarningModal (team){
    setTeamUsedInForm(team)
    setOpenWarningModal(true)
  }

  function handleAddTeamToWeb (team){
    for (let i = 0; i < webOfTeam.length; i++) {
      removeFromWebOfTeam(webOfTeam[i])      
    }
    team.characters.map(character => {
      addToWebOfTeam(character)
    })
  }

  
  return (
    <>
    <TeamAnalysis team={teamUsedInAnalysis} open={openTeamAnalysis} onClose={() => setOpenTeamAnalysis(false)}/>
    <MakeTeamForm team={teamUsedInMakeTeamForm} selectedDeck={selectedDeck} open={openMakeTeamForm} onClose={() => setOpenMakeTeamForm(false)}/>
    <EditTeamForm team={teamUsedInForm} selectedDeck={selectedDeck} open={openEditTeamForm} onClose={() => setOpenEditTeamForm(false)}/>
    <WarningModal profileId={profileId} selectedDeck={selectedDeckObj} team={teamUsedInForm} open={openWarningModal} onClose={() => setOpenWarningModal(false)}/>
    <ErrorModal errorMessage={errorMessage} open={openErrorModal} onClose={() => setOpenErrorModal(false)} />


    <div className="mb-6">

      <div className="flex flex-wrap px-2 justify-center items-center">
        <form className='flex flew-wrap mt-2 w-full' onSubmit={handleRenameDeck}>
          {/* input field for new deck name */}
          <input 
            type="text" 
            id="newDeckName" 
            name="newDeckName" 
            value={newDeckName} 
            onChange={(e) => setNewDeckName(e.target.value)} 
            className="w-full h-full border-2 border-gray-400 p-2 rounded-lg" 
            placeholder="New Deck Name" 
            maxLength="50"
            required 
          />
          <button type="submit" className="-ml-11 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-lg">
          🗸
          </button>
        </form>
        <button 
        title={(webOfTeam.length < 6 || webOfTeam.length >= 8) && "team must have 6 to 7 characters in it to add it to a deck"}
        disabled={webOfTeam.length < 6 || webOfTeam.length >= 8} onClick={() => handleAddTeamToDeck()} className="disabled:bg-gray-500 flex justify-center items-center w-full card-sm:h-12 my-2 border-4 border-black text-md lg:text-base font-bold rounded-full bg-orange-200 hover:bg-orange-400 transition ease-in-out">
          <img src={addIcon} className="text-sm card-sm:text-base w-8 mr-2"/>ADD TEAM TO DECK
        </button>
        {/* {webOfTeam.length < 6 && <p className="w-full border border-black text-sm lg:text-base text-center rounded-lg bg-orange-200/[.75]">*team must have 6 to 7 characters in it to add it to a deck</p>} */}
        <div className="flex px-8 py-1 text-md card-sm:text-base font-bold items-center border-2 border-black bg-orange-200 rounded-full">
          Layout:
          <button 
          onClick={() => setShowGridLayout(true)}><img src={gridIcon} className={`h-fit w-8 mx-2 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg ${showGridLayout && 'bg-gray-500'}`}/></button>
          <button
          className={`${!showGridLayout ? 'w-12 h-5 mx-2 bg-black rounded-lg border-4 border-gray-500/[.75] transition ease-in-out' : 'w-10 h-3 mx-2 bg-black rounded-lg hover:w-12 hover:h-5 hover:border-4 hover:border-gray-500/[.75] transition ease-in-out'}`}
          onClick={() => setShowGridLayout(false)}></button>
        </div>
      </div>

      {showGridLayout ? 
        <GridLayout allTeams={allTeams} characterDictionary={characterDictionary} handleEditTeamInfo={handleEditTeamInfo} handleWarningModal={handleWarningModal} handleAddTeamToWeb={handleAddTeamToWeb}/>
      :
        <SinglePaneLayout allTeams={allTeams} characterDictionary={characterDictionary} handleEditTeamInfo={handleEditTeamInfo} handleWarningModal={handleWarningModal} handleAddTeamToWeb={handleAddTeamToWeb}/>
      }
    </div>
    </>
  );
}

const SinglePaneLayout = ({ allTeams, characterDictionary, handleEditTeamInfo, handleWarningModal, handleAddTeamToWeb }) => {
  return (
    <div className="flex flex-wrap w-full p-2" key={allTeams}>
    {allTeams ? allTeams.map(team => (
      <div key={team._id} className='flex flex-wrap w-full max-w-[400px] lg:max-w-full py-2 pl-2 pr-10 mb-2 border-4 border-black rounded-lg bg-orange-200 hover:bg-orange-400 relative'> 
        <img src={editIcon} onClick={() => handleEditTeamInfo(team)} className="w-8 card-sm:w-10 h-8 card-sm:h-10 p-1 mt-2 mr-2 text-center hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 absolute top-0 right-0 cursor-pointer"/>
        <img src={trashIcon} onClick={() => handleWarningModal(team)} className="w-8 card-sm:w-10 h-8 card-sm:h-10 p-1 mb-1 mr-1 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 absolute bottom-0 right-0 cursor-pointer"/>
        <img src={teamToWebIcon} title='clear current team web and add this team to web' onClick={() => handleAddTeamToWeb(team)} className="w-8 card-sm:w-10 h-8 card-sm:h-10 p-1 mr-1 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 absolute top-[37%] right-0 cursor-pointer"/>
        <div>
          <CharacterCard key={'leader'+team.info.leader} individualCharacter={characterDictionary[team.info.leader]} leaderOrSubLeader={'leader'} mobilesize={"60px"} desktopsize={"80px"}/>
        </div>
        <div>
          <CharacterCard key={'subleader'+team.info.subLeadereader} individualCharacter={characterDictionary[team.info.subLeader]} leaderOrSubLeader={'subLeader'} mobilesize={"60px"} desktopsize={"80px"}/>
        </div>
        {team.characters.map((character) => character.id !== team.info.leader && character.id !== team.info.subLeader ?
          <div key={character.id}>
            <CharacterCard key={'TeamCard'+character.id} individualCharacter={characterDictionary[character.id]} leaderOrSubLeader={''} mobilesize={"60px"} desktopsize={"80px"}/>
          </div>
          :
          null
        )}
      </div>
    ))
    :
    null
    }
    </div>
  )
}

const GridLayout = ({ allTeams, characterDictionary, handleEditTeamInfo, handleWarningModal, handleAddTeamToWeb }) => {
  return(
    <div className="flex flex-wrap w-full p-2 justify-around" key={allTeams}>
    {allTeams ? allTeams.map(team => (
      <div key={team._id} className='flex flex-col w-full max-w-[400px] lg:max-w-full pb-12 px-4 mb-2 border-4 border-black rounded-lg justify-around bg-orange-200 hover:bg-orange-400 relative'> 
          <img src={editIcon} onClick={() => handleEditTeamInfo(team)} className="w-8 card-sm:w-10 h-8 card-sm:h-10 p-1 mt-2 mr-2 text-center hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 absolute top-0 right-0 cursor-pointer"/>
          <img src={trashIcon} onClick={() => handleWarningModal(team)} className="w-8 card-sm:w-10 h-8 card-sm:h-10 p-1 mb-1 mr-1 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 absolute bottom-0 right-0 cursor-pointer"/>
          <img src={teamToWebIcon} title='clear current team web and add this team to web' onClick={() => handleAddTeamToWeb(team)} className="w-8 card-sm:w-10 h-8 card-sm:h-10 p-1 mb-1 ml-1 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 absolute bottom-0 left-0 cursor-pointer"/>
          {/* <button disabled={!team.info.leader || window.innerHeight<1080} onClick={() => handleTeamAnalytics(team)} className="disabled:opacity-100 w-10 h-fit p-1 mt-2 ml-2 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 absolute top-0 left-0">
            <img src={analysisIcon} className={`${!team.info.leader || window.innerHeight<1080 ? 'hidden' : ''}`}/>
          </button> */}
        <div className="font-header flex w-full h-fit py-4 border-black text-2xl card-sm:text-2xl  underline underline-offset-8 decoration-solid decoration-2 rounded-t-lg justify-center items-center text-center relative">
          {team.name}
        </div>
        {/* start at flex row, 900 to 1285 pxls we go to stack, then 1285 after we go back to row*/}
        <div className="flex lg:flex-col xl:flex-row justify-around">

          <div className="grid grid-cols-2 gap-y-6 justify-items-center">
            <p className="col-span-2 font-header w-full text-xl card-sm:text-xl font-[100] border-black text-center">Team</p>
            <div>
              <CharacterCard individualCharacter={characterDictionary[team.info.leader] || 0} leaderOrSubLeader={'leader'} mobilesize={'80px'} desktopsize={'80px'} />
            </div> 
              {team.characters.map((character) => 
                character.id !== team.info.leader && character.id !== team.info.subLeader ?
                <div key={character.id}>
                <CharacterCard key={'TeamCard'+character.id} individualCharacter={characterDictionary[character.id]} leaderOrSubLeader={''} mobilesize={'80px'} desktopsize={'80px'}/>
                </div>
                :
                null
              )}
          </div>

          <div className="flex flex-col items-center justify-between">
            <div className="flex flex-col items-center">
              <p className="font-header text-xl card-sm:text-xl font-[100] border-black text-center">Sub/Friend</p>
                <div>
                <CharacterCard individualCharacter={characterDictionary[team.info.subLeader] || 0} leaderOrSubLeader={'sub'} mobilesize={'80px'} desktopsize={'80px'}/>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="font-header text-xl card-sm:text-xl font-[100] border-black text-center">Rotation 1</p>
                <div className="flex">
                  <div>
                    <CharacterCard individualCharacter={characterDictionary[team.info.rotation1[0]] || 0} mobilesize={'80px'} desktopsize={'80px'}/>
                  </div>
                  <div>
                    <CharacterCard individualCharacter={characterDictionary[team.info.rotation1[1]] || 0} mobilesize={'80px'} desktopsize={'80px'}/>
                  </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="font-header text-xl card-sm:text-xl font-[100] border-black text-center">Rotation 2</p>
                <div className="flex">
                  <div>
                    <CharacterCard individualCharacter={characterDictionary[team.info.rotation2[0]] || 0} mobilesize={'80px'} desktopsize={'80px'}/>
                  </div>                                            
                  <div>
                    <CharacterCard individualCharacter={characterDictionary[team.info.rotation2[1]] || 0} mobilesize={'80px'} desktopsize={'80px'}/>
                  </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    )).reverse() : null }
  </div>
  )
}