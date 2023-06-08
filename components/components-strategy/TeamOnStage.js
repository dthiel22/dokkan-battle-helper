import React, { useState, memo, useEffect } from "react";

import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_ONE_TEAM_POST } from "../../pages/api/queries";
import { LIKE_TEAM_POST, REMOVE_LIKE_FROM_TEAM_POST } from "../util/mutations";

import CharacterCard from "@/cards/CharacterCard";
import ItemCard from '../cards/ItemCard'
import WarningRemoveTeamPostModal from "../modals/modals-strategy/WarningRemoveTeamPostModal";
import Auth from "../util/auth"

import Image from 'next/image';

const addIcon = "/dokkanIcons/icons/add-icon.png";
const trashIcon = "/dokkanIcons/icons/trash-icon.png";
const editIcon = "/dokkanIcons/icons/edit-icon.png";
const analysisIcon = "/dokkanIcons/icons/analysis-icon.png";
const leaderIcon = "/dokkanIcons/icons/leader-icon.png";
const friendIcon = "/dokkanIcons/icons/friend-icon.png";
const likeIcon = "/dokkanIcons/icons/like-icon.png";
const downIcon = "/dokkanIcons/icons/down-icon.png";
const ezaIcon = "/dokkanIcons/icons/z.png";

function TeamOnStage({ team, handleSetSelectedTeam, selectedStage, selectedTeam, characterDictionary, reloadTeams }) {
  const [getTeamPostData, { loading: teamPostLoading, data: teamPostData }] = useLazyQuery(GET_ONE_TEAM_POST, {
    variables: {
      teamId: team._id,
    },
    onCompleted(data){
      // console.log(data.findOnePostTeam.likes.length)
      setArrayOfLikesOnTeamPost(data.findOnePostTeam.likes)
    }
  });

  const [likeTeamPost, { error: likedPostError, data: likedPostData }] = useMutation(LIKE_TEAM_POST)
  const [removeLikeFromTeamPost, { error: removeLikeOnTeamPostError, data: removeLikeOnTeamPostData }] = useMutation(REMOVE_LIKE_FROM_TEAM_POST)

  const [arrayOfLikesOnTeamPost, setArrayOfLikesOnTeamPost] = useState(teamPostData?.findOnePostTeam?.likes || [])

  const [openWarningModal, setOpenWarningModal] = useState(false)
  const [showComments, setShowComments] = useState(false)


  const [teamToUse, setTeamToUse] = useState([])

  const profileId = Auth.getProfile()?.data?._id;

  function handleWarningModal (e, team){
    e.stopPropagation()
    setTeamToUse(team)
    setOpenWarningModal(true)
  }

  function handleCommentDropDown (e, team){
    e.stopPropagation()
    setShowComments(!showComments)
  }

  function handleLikeTeamPost (e, teamPostId) {
    e.stopPropagation()
    likeTeamPost({
      variables:{
        userId: profileId,
        teamPostId:teamPostId
      }
    })
    .then((result) => {
      // console.log(result)
      // getTeamPostData({
      //   variables: {
      //     teamId: team._id,
      //   }
      // })
    })
    .catch((error) => {
      // console.log(error)
    })
  }

  function handleRemoveLikeFromTeamPost (e, teamPostId){
    e.stopPropagation()
    removeLikeFromTeamPost({
      variables:{
        userId: profileId,
        teamPostId: teamPostId
      }
    })
    .then((result) => {
      // console.log(result)
      // getTeamPostData({
      //   variables: {
      //     teamId: team._id,
      //   }
      // })
    })
    .catch((error) => {
      // console.log(error)
    })
  }

  useEffect(() => {
    getTeamPostData()
  },[likedPostData, removeLikeOnTeamPostData])

  const entireTeamObject = [team?.character1, team?.character2, team?.character3, team?.character4, team?.character5, team?.character6, team?.character7]
  const teamDeck = entireTeamObject.filter(character => character.leaderOrSubLeader !== 'subLeader')
  const subLeaderCharacter = entireTeamObject.filter(character => character.leaderOrSubLeader === 'subLeader')[0]

  return (
    <>
    <WarningRemoveTeamPostModal reloadTeams={reloadTeams} profileId={profileId} team={teamToUse} selectedStage={selectedStage} open={openWarningModal} onClose={() => setOpenWarningModal(false)}/>
      <div key={team._id} className='relative max-w-[350px] lg:max-w-[450px]' onClick={() => handleSetSelectedTeam()}> 
              {/* <img src={editIcon} onClick={() => handleEditTeamInfo(team)} className="w-10 h-fit p-1 mt-2 mr-2 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 absolute top-0 right-0 cursor-pointer"/> */}
              {/* <img src={analysisIcon} className={`${!team.info.leader || window.innerHeight<1080 ? 'hidden' : ''}`}/> */}
            <div className={`font-header flex w-full h-fit pt-4 pb-2 border-x-4 border-t-4 border-black text-xl card-sm:text-2xl underline underline-offset-8 decoration-solid decoration-2 rounded-t-lg justify-center items-center text-center ${selectedTeam && selectedTeam._id === team._id ? 'bg-orange-400' : 'bg-orange-200'} relative`}>
              {profileId === team.creator._id ? 
                <img src={trashIcon} onClick={(e) => handleWarningModal(e, team)} className="w-8 card-sm:w-10 h-8 card-sm:h-10 p-1 mb-1 mr-1 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 absolute top-1 left-1 cursor-pointer"/>
                :
                null 
              }
              {/* {profileId === team.creator._id ? 
                <img src={editIcon} onClick={() => handleWarningModal(team)} className="w-8 card-sm:w-10 h-fit p-1 mb-1 mr-1 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 absolute top-1 right-1 cursor-pointer"/>
                :
                null 
              } */}
              {team.name}
            </div>
            
            <div className={`flex flex-wrap pt-2 pb-10 px-6 ${showComments ? '' : 'mb-2'} border-x-4 border-b-4 border-black ${showComments ? '' : 'rounded-b-lg'} justify-around ${selectedTeam && selectedTeam._id === team._id ? 'bg-orange-400' : 'bg-orange-200'} relative`}>
              
              <div className="flex w-full justify-around items-stretch">
                <div className="w-full grid grid-cols-2 justify-items-center">
                  <p className="col-span-2 w-full font-header text-xl card-sm:text-2xl font-light border-black">Team</p>
                  {entireTeamObject &&
                    teamDeck.sort((a, b) => {
                        if (a.leaderOrSubLeader === 'leader' && b.leaderOrSubLeader !== 'leader') {
                          return -1; // a should come before b
                        } else if (a.leaderOrSubLeader !== 'leader' && b.leaderOrSubLeader === 'leader') {
                          return 1; // b should come before a
                        } else if (a.leaderOrSubLeader === 'subLeader' && b.leaderOrSubLeader !== 'subLeader') {
                          return 1; // b should come before a
                        } else if (a.leaderOrSubLeader !== 'subLeader' && b.leaderOrSubLeader === 'subLeader') {
                          return -1; // a should come before b
                        } else {
                          return 0; // no change in order
                        }
                      }).map((character) => (
                        <div key={character.characterId}>
                        <CharacterCard
                          individualCharacter={characterDictionary[character.characterId]}
                          mobilesize={'80px'}
                          desktopsize={'100px'}
                          EZA={character.EZA}
                          leaderOrSubLeader={character.leaderOrSubLeader}
                        />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-between">
                  <div className="">
                    <p className="font-header text-xl card-sm:text-2xl font-light border-black">Friend</p>
                    <div>
                      <CharacterCard 
                      individualCharacter={characterDictionary[subLeaderCharacter.characterId]}
                      mobilesize={'80px'}
                      desktopsize={'100px'}
                      EZA={subLeaderCharacter.EZA}
                      leaderOrSubLeader={subLeaderCharacter.leaderOrSubLeader}
                      />
                    </div>
                  </div>
                  <div className="">
                    <p className="font-header text-xl card-sm:text-2xl font-light border-black">items</p>
                      {(team.items.length === 0 || team.items[0].id === 0) &&
                      <div className="flex flex-wrap flex-row p-2 justify-center items-center">
                        <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'50px'}/>
                      </div>
                      }
                      {(team.items.length === 1 && team.items[0].id !== 0) &&
                      <div className="flex flex-wrap flex-row p-2 justify-center items-center">
                        <ItemCard item={team.items[0]} key={team.items[0].id} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'50px'}/>
                      </div>
                      }
                      {(team.items.length === 2) &&
                      <div className="flex flex-wrap flex-row p-2 justify-center items-center">
                        <ItemCard item={team.items[0]} key={team.items[0].id} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={team.items[1]} key={team.items[1].id} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'50px'}/>
                      </div>
                      }
                      {(team.items.length === 3) &&
                      <div className="flex flex-wrap flex-row p-2 justify-center items-center">
                        <ItemCard item={team.items[0]} key={team.items[0].id} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={team.items[1]} key={team.items[1].id} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={team.items[2]} key={team.items[2].id} mobilesize={'40px'} desktopsize={'50px'}/>
                        <ItemCard item={{id:0, type:'bronze'}} mobilesize={'40px'} desktopsize={'50px'}/>
                      </div>
                      }
                      {(team.items.length === 4) &&
                      <div className="flex flex-wrap flex-row p-2 justify-center items-center">
                      {team.items && team.items.map((item) => (
                        <ItemCard item={item} key={item.id} mobilesize={'40px'} desktopsize={'50px'}/>
                      ))}
                    </div>
                      }
                  </div>
                </div>
              </div>
                
              {team.mission !== 'No Mission' &&
              <div className="flex w-full p-2 items-center">
                <p className="font-header text-xl font-light border-black">Mission:</p>
                <p className="font-bold max-w-full pl-4 card-sm:text-xl truncate text-left justify-center">{team.mission}</p>
              </div>
              }

                <div 
                onClick={Auth.loggedIn() ? (
                  arrayOfLikesOnTeamPost.includes(profileId) 
                    ? (e) => handleRemoveLikeFromTeamPost(e, team._id) 
                    : (e) => handleLikeTeamPost(e, team._id)
                ) : null}
                className={`${arrayOfLikesOnTeamPost.includes(profileId) ? 'bg-blue-500 hover:bg-blue-700': `${profileId ? 'hover:bg-gray-500/[.75]' : ''}`} flex h-8 p-1 justify-center items-center absolute bottom-1 right-1 cursor-pointer transition ease-in-out rounded-lg z-50`}>
                  <p className="text-xl font-bold">{arrayOfLikesOnTeamPost && arrayOfLikesOnTeamPost.length}</p>
                  <img 
                    className='w-8'
                    src={likeIcon} 
                  />
                </div>

              {/* <div className="flex h-8 p-1 justify-center items-center absolute bottom-1 left-1 cursor-pointer hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50">
                <p className="text-xl font-bold">{team.comments.length}</p>
                <img src={commentIcon} onClick={(e) => handleCommentDropDown(e, team)} className="w-8"/>
              </div> */}
              
              <p className="max-w-[80%] p-2 card-sm:text-xl font-bold text-center absolute bottom-0 left-0 truncate">creator: {team.creator.username}</p>

            </div>
            {/* {showComments ? <CommentSection comments={team.comments}/> : null } */}
      </div>
    </>
  );
};

// function CommentSection({ comments }) {
//   console.log(comments)
//   return (
//     <div className="w-full h-[200px] max-h-[200px] border-x-4 border-b-4 border-black z-50 bg-orange-100 rounded-b-lg p-4 shadow-md">
//       <p className="font-header">Comments:</p>
//       {comments && comments.map((comment) => 
//         comment
//       )}
//     </div>
//   );
// }

export default memo(TeamOnStage);
