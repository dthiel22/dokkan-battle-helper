import React, { useState, useEffect, useRef, useContext } from "react";
import Auth from "../components/util/auth";

import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_ITEMS_DATA, GET_SUPPORT_MEMORY_DATA, QUERY_CHARACTERS, GET_ALL_EVENTS_WITH_STAGES, GET_ALL_TEAMS_IN_STAGE, GET_ONE_STAGE_COMMENTS_REPLIES, GET_USERDATA, GET_COMMENTS_WITH_USER_SAVED_CHARACTERS } from "./api/queries";
import { ADD_COMMENT_TO_STAGE, ADD_REPLY_TO_COMMENT, REMOVE_REPLY_FROM_COMMENT } from "../components/util/mutations";

import EventTab from "../components/components-strategy/EventTab";
import StageTab from "../components/components-strategy/StageTab";
import TeamOnStage from "../components/components-strategy/TeamOnStage"
import AllTeamInfo from "../components/modals/modals-strategy/AllTeamInfoModal"
import Navbar from "../components/main-components/Navbar"

import SelectTeamToStageModal from "../components/modals/modals-strategy/SelectTeamToStageModal";
import AddTeamToStageButton from "@/components-strategy/AddTeamToStageButton";
import Comment from "../components/components-strategy/Comment";
import CommentForm from "@/components-strategy/CommentForm";

import Image from 'next/image';
import dynamic from 'next/dynamic';

import { UserContext } from "./_app";
import Help from "./help";
import CommentForHelpBoard from "@/components-strategy/CommentForHelpBoard";

const commentIcon = "/dokkanIcons/icons/comment-icon.png";

const DynamicCommentForm = dynamic(() => import('../components/components-strategy/CommentForm'), {
  ssr: false,
});

const DynamicAddTeamToStageButton = dynamic(() => import('../components/components-strategy/AddTeamToStageButton'), {
  ssr: false,
});

function AllStrategy( {  } ) {
  const { loading: allCharactersLoading, data: allCharactersData } = useQuery(QUERY_CHARACTERS);
  const allCharacters = allCharactersData?.characters || [];

  const characterDictionary = Object.fromEntries(
    allCharacters.map((characterObj) => [characterObj.id, characterObj])
  );

  const { loading: allItemsLoading, data: allItemsData } = useQuery(GET_ITEMS_DATA);
  const allItems = allItemsData?.items || []
  
  const { loading: allSupportMemoryoading, data: allSupperMemoryData } = useQuery(GET_SUPPORT_MEMORY_DATA);
  const allSupportMemories = allSupperMemoryData?.supportMemory || []

  const { profileData } = useContext(UserContext)
  
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedStage, setSelectedStage] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [filterDecksBySavedCharacters, setFilterDecksBySavedCharacters] = useState(false)

  const [openSelectTeamToStage, setOpenSelectTeamToStage] = useState(false)
  const [openAllTeamInfoModal, setOpenAllTeamInfoModal] = useState(false)

  const { loading: isUserDataLoading, data: userData } = useQuery(GET_USERDATA,
    {
      variables: {
        profileId: profileData?.data?._id || "",
      },
    }
  );
  const userSavedCharacters = userData?.findOneUser?.savedCharacters
  const userDecks = userData?.findOneUser?.decks

  const [addCommentToStage, { error: commentAddedError, data: commentAddedData }] = useMutation(ADD_COMMENT_TO_STAGE)
  const [commentInput, setCommentInput] = useState('')

  const { loading: allEventsLoading, data: allEventsData } = useQuery(GET_ALL_EVENTS_WITH_STAGES)
  const allEvents = allEventsData?.findAllEventsWithStages || [];

  const [showHelpBoard, setShowHelpBoard] = useState(false)

  function handleShowHelpBoard () {
    getAllCommentsWithUserSavedCharacters()
    setShowHelpBoard(!showHelpBoard)
    handleShowAllTeamsOnStage()
    setSelectedEvent(null)
    setSelectedStage(null)
  }

  const [allCommentsWithUserSavedCharacters, setAllCommentsWithUserSavedCharacters] = useState([])

  console.log(allCommentsWithUserSavedCharacters)

  const [getAllCommentsWithUserSavedCharacters, { loading: allCommentsWithUserCharactersLoading, data:allCommentsWithUserCharactersData, error: allCommentsWithUserCharactersError}] = useLazyQuery(GET_COMMENTS_WITH_USER_SAVED_CHARACTERS, {
    onCompleted: (data) => {
      setAllCommentsWithUserSavedCharacters(data?.findCommentsWithUserSavedCharacters)
    },
    fetchPolicy: 'network-only', // Add this option to disable caching, allows to requery and change data with no page load
  })

  const [getAllTeamsInStage, { loading: allTeamsLoading, data: allTeamsData, error: allTeamsError }] = useLazyQuery(GET_ALL_TEAMS_IN_STAGE, {
    variables: {
      stageId: selectedStage?._id || "",
    },
    fetchPolicy: 'network-only', // Add this option to disable caching
  });
  const [allTeamsOnStage, setAllTeamsOnStage] = useState([])
  
  // this runs the query when ever a selected stage is selected and queries for that stage teams and comments/replies
  useEffect(() => {
    if (selectedStage) {
      getAllTeamsInStage({
        variables: {
          stageId: selectedStage._id,
        },
      });
      getCommentsAndReplies({
        variables: {
          stageId: selectedStage?._id || "",
        },
      });
    }
  }, [selectedStage]);
  
  // Update `allTeamsOnStage` state whenever `allTeamsData` changes
  useEffect(() => {
    setAllTeamsOnStage(allTeamsData?.findOneStageTeams?.teams || []);
  }, [allTeamsData]);
  
  function reloadTeams () {
    getAllTeamsInStage({
      variables: {
        stageId: selectedStage?._id || "",
      },
    });
  }

  const [getCommentsAndReplies, { loading: allCommentsAndRepliesLoading, data: allCommentsAndRepliesData, error: allCommentsAndRepliesError }] = useLazyQuery(GET_ONE_STAGE_COMMENTS_REPLIES, {
    variables: {
      stageId: selectedStage?._id || "",
    },
    fetchPolicy: 'network-only', // Add this option to disable caching
  });
  const [allCommentsAndReplies, setAllCommentsAndReplies] = useState()
  
  //Update 'allCommentsAndReplies' state whenever 'allCommentsAndRepliesData' changes
  useEffect(() => {
    setAllCommentsAndReplies(allCommentsAndRepliesData?.findOneStageCommentsReplies?.comments || []);
  }, [allCommentsAndRepliesData]);
  
  function reloadCommentsReplies () {
    getCommentsAndReplies({
      variables:{
        stageId: selectedStage?._id || "",
      },
    })
  }

  function handleSetSelectedEvent (event) {
    if (event === selectedEvent){
      return
    }
    setSelectedEvent(null)
    setShowHelpBoard(false)
    setSelectedStage(null)
    setSelectedTeam(null)
    setSelectedEvent(event)
    setShowComments(false)
    setAllTeamsOnStage(null)
  }

  function handleSetSelectedStage (stage) {
    if (stage === selectedStage){
      handleShowAllTeamsOnStage()
      return
    }
    setAllTeamsOnStage(null)
    setSelectedTeam(null)
    setSelectedStage(stage)
    handleShowAllTeamsOnStage()
  }

  function handleSetSelectedTeam (team) {
    setSelectedTeam(team)
    setOpenAllTeamInfoModal(true)
    // scrollToTeamInfo()
  }

  function handleOpenSelectTeamToStageModal(){
    setOpenSelectTeamToStage(true)
  }

  function handleFilterBySavedCharacters (){
    setFilterDecksBySavedCharacters(!filterDecksBySavedCharacters)
  }
  
  const [showEventsAndStages, setShowEventsAndStages] = useState(true)
  const [showTeamsOnStage, setShowTeamsOnStage] = useState(false)
  const handleShowStagesAndEvents = () => {
    setShowTeamsOnStage(false)
    setShowEventsAndStages(true)
    const middleColumn = document.getElementById("eventAndStageSelection");
    middleColumn.scrollIntoView({ top: 0, left: 0 });
  };
  const handleShowAllTeamsOnStage = () => {
    setShowEventsAndStages(false)
    setShowTeamsOnStage(true)
    const middleColumn = document.getElementById("stageAllTeams");
    middleColumn.scrollIntoView({ top: 0, left: 0 });
  };

  //to sort the events how I wanted
  const sortedEvents = allEvents.slice().sort((a, b) => {
    const nameOrder = [
      "Ultimate Red Zone Red Ribbon Army Edition",
      "Ultimate Red Zone SDBH Edition",
      "Ultimate Red Zone Wicked Bloodline Edition",
      "Ultimate Red Zone Movie Edition",
      "Ultimate Red Zone GT Edition",
      "Fearsome Activation! Cell Max",
      "Fighting Spirit of the Saiyans and Pride of the Wicked Bloodline",
      "Collection of Epic Battles",
      "Gods of Destruction Assemble",
      "Fighting Legend: Vegeta",
      "Fighting Legend: Goku",
      "Fighting Legend: Goku GT Edition",
      "Extreme Super Battle Road",
      "Super Battle Road",
    ]
    const nameA = nameOrder.indexOf(a.name);
    const nameB = nameOrder.indexOf(b.name);
    return nameA - nameB;
  });

  const [showComments, setShowComments] = useState(false)
  
  function handleCommentDropDown (e, team){
    e.stopPropagation()
    setShowComments(!showComments)
  }

  const commentFormRef = useRef(null)

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(commentFormRef.current);
    const formObject = Object.fromEntries(formData);
    for (const [key, value] of formData.entries()) {
      // convert the value of the checkbox to a boolean
      const newValue = (value === 'on' || value === 'true') ? true : value;
      formObject[key] = newValue;
    }
    let userSavedCharactersInput = null
    if (formObject.addSavedCharacter){
      userSavedCharactersInput = userSavedCharacters
    }
    addCommentToStage({
      variables:{
        userId: profileData?.data?._id,
        stageId: selectedStage._id,
        comment: commentInput,
        userSavedCharacters: userSavedCharactersInput
      }
    })
    .then((result) => {
      // console.log(result)
      setCommentInput('')
      // console.log(commentInput)
      reloadCommentsReplies()
    })
    .catch((error) => {
      console.log(error)
    });
  }

  // this allows the screen to change sizes and auto update revealing/hiding the middle column
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize()
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div key={'AllStrategy'} className="fixed flex flex-col h-full w-full bg-slate-900">
      <SelectTeamToStageModal reloadTeams={reloadTeams} userDecks={userDecks} userData={userData?.findOneUser} stageData={selectedStage} characterDictionary={characterDictionary} allItems={allItems} allSupportMemories={allSupportMemories} open={openSelectTeamToStage} onClose={() => setOpenSelectTeamToStage(!openSelectTeamToStage)} key={'selectTeamToStageModal'}/>
      <AllTeamInfo team={selectedTeam} characterDictionary={characterDictionary} open={openAllTeamInfoModal} onClose={() => setOpenAllTeamInfoModal(false)} key={"selectedTeam" + selectedTeam?._id}/>

      <Navbar showEventsAndStages={showEventsAndStages} handleShowStagesAndEvents={handleShowStagesAndEvents} />

      <div className="flex flex-1 h-0 w-full lg:px-10">

        {/* //left column styling */}

        {(showEventsAndStages || (windowWidth > 800)) &&
        <div key={'leftColumn'} id="eventAndStageSelection" className="flex flex-col w-screen lg:w-2/5 bg-gradient-radial from-slate-500 via-slate-600 to-slate-900 border-slate-900">

          <div className="flex flex-col w-screen lg:w-full border-4 border-black rounded-lg overflow-y-auto">
            
            {/* events container and tabs */}
            <div className="h-1/2 border-b-4 border-black">
              <div className={`flex flex-col ${allCharactersLoading ? 'h-[300px]' : 'h-full'} items-center overflow-y-auto`}>
                <p className="font-header flex w-full h-fit justify-center items-center text-3xl sticky top-0 border-x-4 border-b-4 border-black bg-orange-200 z-[998]">Events</p>
                
                {allCharactersLoading ? <div className="w-[90%] h-fit p-4 mt-4 text-lg font-bold border-2 border-black bg-orange-200 text-center rounded-lg">events loading...</div>
                :
                <div className="p-2">
                  <div className={`p-3 hover:bg-slate-900/[.4] ${showHelpBoard ? 'bg-slate-900/[.75] hover:bg-slate-900/[.9]' : ''}`}>
                    <button 
                    onClick={() => handleShowHelpBoard()}
                    className={`font-header w-full py-6 border-4 border-black bg-orange-200 text-2xl font-light`}>
                      Help Board
                    </button>
                  </div>

                  {allEvents && sortedEvents.map(event => 
                    <div 
                    key={event._id} 
                    onClick={() => handleSetSelectedEvent(event)} 
                    className={`p-3 m-1 hover:bg-slate-900/[.4] ${selectedEvent?._id === event._id ? 'bg-slate-900/[.75] hover:bg-slate-900/[.9]' : ''} cursor-pointer`}>
                      <EventTab event={event}/>
                    </div>
                  ).reverse()}
                </div>
                }

              </div>
            </div>
            
            {/* stage container and tabs */}
            <div className="h-1/2">
              <div className="flex h-full flex-wrap mb-1 justify-around overflow-y-auto">
                <p className="font-header flex w-full h-fit justify-center items-center text-3xl sticky top-0 border-x-4 border-b-4 border-black bg-orange-200 z-[998]">Stages</p>
                {selectedEvent ?
                  (selectedEvent.stages.map((stage) =>
                      <div key={stage._id} 
                      onClick={() => handleSetSelectedStage(stage)} 
                      className={`my-2 mx-4 hover:bg-slate-900/[.4] ${selectedStage?._id === stage._id ? 'bg-slate-900/[.75] hover:bg-slate-900/[.9]' : ''} cursor-pointer`}>
                        <StageTab stageName={stage.name}/>
                      </div>
                    )
                    )
                    :
                    (
                      <div className="w-[90%] h-fit p-4 mt-4 text-lg font-bold border-2 border-black bg-orange-200 text-center rounded-lg">{allCharactersLoading ? 'events loading...' : 'Please select an event'}</div>
                    )
                }
              </div>
            </div>
          </div>
        </div>
        }

          
        {/* //right column styling */}
        <div key={'middleColumn'} id="stageAllTeams" className="flex flex-col w-screen lg:w-full bg-gradient-radial from-slate-500 via-slate-600 to-slate-900 border-slate-900">

          {/* Introduction for when nothing is selected and page loads */}
          {!selectedEvent && !selectedStage && !showHelpBoard &&
          <div className="flex flex-col w-full h-full border-4 border-black bg-orange-200 rounded-lg overflow-y-auto">
              <h1 className="font-header pt-2 text-xl card-sm:text-2xl lg:text-4xl font-light text-center underline underline-offset-8 decoration-2">Dokkan Strategy</h1>
              <p className="px-4 pt-2 text-base card-sm:text-lg font-bold indent-10">Welcome to the Dokkan Battle Helper Strategy page! Here we have a majority of the Dokkan events stored and allows players to view and post teams on individual stages to show how they completed them. The events currently include the Super Battle Roads, Extreme Super Battle Road, the Red Zones, Cell Max, Collection of Epic Battles, Gods of Destruction Assemble, and a couple more. We will be working on adding more events as we find time to do so.</p>
              <p className="px-4 pt-2 text-base card-sm:text-lg font-bold indent-10">Some fun features include:</p>
              <li className="pl-20 card-sm:pl-20 text-md card-sm:text-base font-bold">posting teams to individual stages along with mission accomplished, individual characters hidden potential, and items/support memory used</li>
              <li className="pl-20 card-sm:pl-20 text-md card-sm:text-base font-bold">the ability to comment on stages and ask for help from others by posting characters you have saved to your account</li>
              <li className="pl-20 card-sm:pl-20 text-md card-sm:text-base font-bold">allow people to reply to comments with characters they have selected from a persons saved characters</li>
              <p className="mt-4 px-4 pt-2 text-base card-sm:text-lg font-bold indent-10">The goal with this page is to allow people to collaborate with one another. We wanted to generate a fun and user friendly space for Dokkan veterans to show off teams they used to complete specific stages and missions while simutaneously helping new players by showing them characters they could use to complete events. We hope you continue to enjoy the app. If you have an issues, comments, or ideas, please fill out this google <a className='text-blue-500' href="https://docs.google.com/forms/d/e/1FAIpQLSdmglG-bsdZL1R41EYEsfrnN5tgJyK-CPfs1D4cNwNBpcxfxg/viewform?usp=sf_link" target={'_blank'}>form</a>.</p>
          </div>
          }

          {/* help board is true */}
          {!selectedEvent && showHelpBoard &&
          <div className="flex flex-col w-full h-full px-10 border-4 border-black bg-orange-200 items-center rounded-lg overflow-y-auto">
            <h1 className="font-header pt-2 mb-4 text-xl card-sm:text-2xl lg:text-4xl font-light text-center underline underline-offset-8 decoration-2">Help Board</h1>
            {allCommentsWithUserSavedCharacters && allCommentsWithUserSavedCharacters
            .slice()
            .sort((a,b) => b.createdAt - a.createdAt)
            .map(singleComment => 
              <CommentForHelpBoard comment={singleComment} allCharacters={allCharacters} characterDictionary={characterDictionary} reloadCommentsReplies={getAllCommentsWithUserSavedCharacters} key={singleComment._id}/>) 
            }
          </div>
          }

          
          {/* if an event is selected */}
          {selectedEvent && !showHelpBoard &&
          <div className="flex flex-col w-full h-full border-4 border-black items-center rounded-lg overflow-y-auto">
            <div className={`flex flex-col lg:flex-row w-full p-4 bg-orange-200 ${showComments ? 'border-b-2' : 'border-b-4 rounded-b-lg '} border-black justify-around relative`}>
              <div className="flex flex-row pr-2 lg:w-1/2 pb-2 items-center">
                <p className="font-header mr-4 text-lg card-sm:text-xl font-light">Event</p>
                {selectedEvent ? 
                  <div className="flex w-full justify-center items-center">
                    <EventTab key={selectedEvent.name} event={selectedEvent}/>
                  </div> 
                  : 
                  null
                }
              </div>

              <div className="flex justify-center items-center h-[95%] border-2 border-black"/>

              <div className="flex flex-row pl-2 lg:max-w-[50%] items-center">
                <p className="font-header mr-4 text-lg card-sm:text-xl font-light">Stage</p>
                {selectedStage ? 
                <div className="flex w-full p-4 justify-center items-center">
                  <StageTab key={selectedStage.name} stageName={selectedStage.name}/>
                  </div> 
                  : 
                  null
                } 
              </div>
              {selectedStage &&
              <div className="flex h-8 p-1 justify-center items-center absolute bottom-1 right-1 cursor-pointer hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50">
                <span onClick={(e) => handleCommentDropDown(e, selectedStage)} className="flex justify-center intems-center text-center"><p className="font-header text-lg font-light pr-2">{showComments ? 'Hide Comments' : 'Show Comments'}</p><img src={commentIcon} className="w-8"/></span>
              </div>
              }
            </div>

              {showComments && 
                  <div className="w-full min-h-[600px] max-h-[600px] border-b-4 border-black z-50 bg-orange-100 rounded-b-lg p-4 pb-14 shadow-md black-scrollbar overflow-y-auto">
                    <p className="flex w-full py-6 font-header justify-center items-center text-xl text-center underline decoration-2 underline-offset-8">Comments</p>

                    <DynamicCommentForm commentFormRef={commentFormRef} commentInput={commentInput} setCommentInput={setCommentInput} handleCommentSubmit={handleCommentSubmit}/>

                  {allCommentsAndRepliesLoading ? <div className="flex w-full p-4 mt-4 text-lg font-bold border-2 border-black bg-orange-200 justify-center items-center rounded-lg">Comments are loading...</div> :
                    allCommentsAndReplies.length > 0 ? 
                      allCommentsAndReplies
                        .slice()
                        .sort((a, b) => b.createdAt - a.createdAt)  
                        .map(singleComment => 
                          <Comment comment={singleComment} allCharacters={allCharacters} characterDictionary={characterDictionary} selectedStage={selectedStage} reloadCommentsReplies={reloadCommentsReplies} key={singleComment._id}/>)
                  :
                    <div className="flex w-full p-4 mt-4 text-lg font-bold border-2 border-black bg-orange-200 justify-center items-center rounded-lg">No comments yet</div>
                  }
                </div>
              }

              {selectedEvent && selectedStage &&
                <DynamicAddTeamToStageButton selectedTeam={selectedTeam} handleOpenSelectTeamToStageModal={handleOpenSelectTeamToStageModal}/>
              }
              
            {!selectedEvent &&
            <div className="flex w-[90%] p-4 mt-4 text-lg font-bold border-2 border-black bg-orange-200 justify-center items-center rounded-lg">Please select an event</div>
            }      

            {!selectedStage &&
            <div className="flex w-[90%] p-4 mt-4 text-lg font-bold border-2 border-black bg-orange-200 justify-center items-center rounded-lg">Please select a stage</div>
            }      
            
            {selectedStage && allTeamsLoading && (
              <div className="flex w-[90%] p-4 my-4 text-lg font-bold border-2 border-black bg-orange-200 justify-center items-center rounded-lg">
                Teams are loading...
              </div>
            )}

            {selectedStage && !allTeamsLoading && allTeamsOnStage && allTeamsOnStage.length === 0 && (
              <div className="flex w-[90%] p-4 text-lg font-bold border-2 border-black bg-orange-200 justify-center items-center rounded-lg">
                No teams have been posted for this stage yet. Have you completed this stage? Feel free to make a team and post it here!
              </div>
            )}

            {allTeamsOnStage && allTeamsOnStage.map((team) =>  
              <button 
                key={team._id} 
                className="flex flex-wrap w-full justify-around" 
                title="click on team to show details"
              >
                <div className={
                  filterDecksBySavedCharacters && userData?.findOneUser?.savedCharacters ?
                    userData.findOneUser.savedCharacters.every(c => team.teamArray.includes(c)) ? '' : 'grayscale'
                    : ''
                }>
                  <TeamOnStage team={team} handleSetSelectedTeam={() => handleSetSelectedTeam(team)} selectedStage={selectedStage} selectedTeam={selectedTeam} characterDictionary={characterDictionary} reloadTeams={reloadTeams} key={team._id}/>
                </div>
              </button>
            ).reverse()}

          </div>
          }
        </div>
        </div>
    </div>
)}

export default AllStrategy;
