import React, {useState, useRef} from 'react'

import Auth from "../util/auth";

import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_EVENT_DATA, GET_USERDATA } from "../../pages/api/queries";
import { ADD_COMMENT_TO_STAGE, ADD_REPLY_TO_COMMENT, REMOVE_REPLY_FROM_COMMENT } from "../util/mutations";

import CharacterCard from '@/cards/CharacterCard';
import Reply from './Reply';
import CharacterSelectionForReply from "./CharacterSelectionForReply";
import WarningRemoveCommentModal from '../modals/modals-strategy/WarningRemoveCommentModal';
import WarningRemoveReplyModal from '../modals/modals-strategy/WarningRemoveReplyModal';

import {AdvancedImage, lazyload} from '@cloudinary/react';
import {CloudinaryImage} from "@cloudinary/url-gen";
import {URLConfig} from "@cloudinary/url-gen";
import {CloudConfig} from "@cloudinary/url-gen";

const replyIcon = "/dokkanIcons/icons/reply-icon.png";
const trashIcon = "/dokkanIcons/icons/trash-icon.png";
const cardIcon = "/dokkanIcons/icons/card-icon.png";

import Image from 'next/image';

export default function Comment({ comment, characterDictionary, selectedStage, reloadCommentsReplies }) {
  const [addReplyToComment, { error: replyAddedError, data: replyAddedData }] = useMutation(ADD_REPLY_TO_COMMENT)
  
  const [openWarningRemoveComment, setOpenWarningRemoveComment] = useState(false)
  const [openWarningRemoveReply, setOpenWarningRemoveReply] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [replyToDelete, setReplyToDelete] = useState(null)
  const [commentToRemoveReplyFrom, setCommentToRemoveReplyFrom] = useState(null)
  const [showUsersCards, setShowUserCards] = useState(false)
  // const [showReplyForm, setShowReplyForm] = useState(false)
  const [showCardToolTip, setShowCardToolTip] = useState(false)
  const [showReplyTollTip, setShowReplyTollTip] = useState(false)
  const [showDeleteToolTip, setShowDeleteToolTip] = useState(false)
  
  const profileData = Auth.getProfile() || [];

  function handleCommentDelete (comment) {
    setCommentToDelete(comment?._id)
    setOpenWarningRemoveComment(true)
  }

  function handleReplyDelete (comment, reply) {
    setReplyToDelete(reply?._id)
    setCommentToRemoveReplyFrom(comment?._id)
    setOpenWarningRemoveReply(true)
  }

  const replyFormRef = useRef(null)
  const [replyInput, setReplyInput] = useState('')

  function handleReplySubmit (e, comment) {
    e.preventDefault();
    const formData = new FormData(replyFormRef.current);
    const formObject = Object.fromEntries(formData);
    for (const [key, value] of formData.entries()) {
      // convert the value of the checkbox to a boolean
      const newValue = (value === 'on' || value === 'true') ? true : value;
      formObject[key] = newValue;
    }

    addReplyToComment({
      variables: {
        userId: profileData?.data?._id,
        commentId: comment?._id,
        reply: replyInput,
        selectedCharacters: characterSelection,
      }
    })
    .then((results) => {
      // console.log(results)
      reloadCommentsReplies()
      setReplyInput('')
      // setShowReplyForm(false)
      setShowUserCards(false)
      setCharacterSelection([])
    })
    .catch((error) => {
      // console.log(error)
    })
  }

  const [characterSelection, setCharacterSelection] = useState([])
  function handleCommentCharacterSelection(characterId) {
    setCharacterSelection((prev) => {
      if (prev.includes(characterId)) {
        return prev.filter((id) => id !== characterId);
      } else {
        if (prev.length < 7) {
          return [...prev, characterId];
        } else {
          return [prev[1], prev[2], prev[3], prev[4], prev[5], prev[6], characterId];
        }
      }
    });
  }

  // function handleShowReplyForm () {
  //   if (showUsersCards){
  //     return
  //   }
  //   setShowReplyForm(!showReplyForm)
  // }

  function handleShowCharacterCards () {
    setShowUserCards(!showUsersCards)
    // setShowReplyForm(true)
  }

  return (
    <>
    <WarningRemoveCommentModal profileId={profileData?.data?._id} selectedStageId={selectedStage?._id} commentId={commentToDelete} open={openWarningRemoveComment} onClose={() => setOpenWarningRemoveComment(!openWarningRemoveComment)} reloadCommentsReplies={reloadCommentsReplies}/>
    <WarningRemoveReplyModal profileId={profileData?.data?._id} selectedStageId={selectedStage?._id} replyId={replyToDelete} commentToRemoveReplyFrom={commentToRemoveReplyFrom} open={openWarningRemoveReply} onClose={() => setOpenWarningRemoveReply(!openWarningRemoveReply)} reloadCommentsReplies={reloadCommentsReplies}/>
    
      <div key={comment?._id}>
          <div className='w-full p-2 mb-4 border-2 border-gray-500 bg-gray-500/[.3] rounded-lg'>
            <span className="flex justify-between">
              <div className="flex flex-wrap">
                <p className="pr-4">{comment?.creator?.username ? comment.creator.username.replace(/(.+)@.+\..+/, "$1") : ''}</p>
                <div>|</div>
                <p className="pl-4">{new Date(parseInt(comment?.createdAt)).toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
              </div>


              <div className="flex flex-wrap">
                {/* {profileData?.data?._id && 
                  <div className="relative">
                    <img src={replyIcon} 
                    onClick={() => handleShowReplyForm(!showReplyForm)} 
                    onMouseEnter={() => setShowReplyTollTip(true)}
                    onMouseLeave={() => setShowReplyTollTip(false)}
                    className='w-8 h-8 transform scale-x-[-1] hover:bg-gray-500 rounded-lg z-50 cursor-pointer relative'/>
                    <div className={`absolute bottom-[110%] left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white rounded-lg text-center ${showReplyTollTip ? 'opacity-100 z-[1000]' : 'opacity-0 z-[0]'} transition-opacity`}>
                        click to reply to this comment
                    </div>
                  </div>
                } */}
                
                {comment?.userSavedCharacters && 
                  <div className="relative">
                    <img
                      src={cardIcon}
                      onClick={() => handleShowCharacterCards()}
                      onMouseEnter={() => setShowCardToolTip(true)}
                      onMouseLeave={() => setShowCardToolTip(false)}
                      className="w-8 h-8 p-1 mb-1 mr-1 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 cursor-pointer relative"
                      />
                    <div className={`absolute bottom-[110%] left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white rounded-lg text-center ${showCardToolTip ? 'opacity-100 z-[1000]' : 'opacity-0 z-[0]'} transition-opacity`}>
                      show {comment?.creator?.username && comment?.creator?.username.replace(/(.+)@.+\..+/, "$1")}'s characters
                    </div>
                  </div>
                }
                {profileData?.data?._id === comment?.creator._id &&
                <div className="relative">
                  <img src={trashIcon} 
                  onClick={() => handleCommentDelete(comment)}
                  onMouseEnter={() => setShowDeleteToolTip(true)}
                  onMouseLeave={() => setShowDeleteToolTip(false)} 
                  className="w-8 h-8 p-1 mb-1 mr-1 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 cursor-pointer relative"/>
                  <div className={`absolute bottom-[110%] left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white rounded-lg text-center ${showDeleteToolTip ? 'opacity-100 z-[1000]' : 'opacity-0 z-[0]'} transition-opacity`}>
                    delete this comment
                  </div>
                </div>
                }
              </div>
            

            </span>

            <p className="flex">{comment?.content}</p>

            <div className="w-full border-2 my-6"></div>
            
              {showUsersCards && 
              <div>
                <CharacterSelectionForReply characterDictionary={characterDictionary} username={comment?.creator?.username && comment?.creator?.username.replace(/(.+)@.+\..+/, "$1")} usersSavedCharacterIds={comment?.userSavedCharacters} handleCommentCharacterSelection={handleCommentCharacterSelection} characterSelection={characterSelection}/>
                
                <div className="flex w-full justify-center">
                  <div className="flex flex-wrap w-fit p-2 my-2 border-2 border-black justify-center">

                    {profileData?.data?._id ? <p className="w-full text-center text-lg font-bold underline decoration-2">Characters Suggesting</p> : <p className="w-full text-center text-lg font-bold">Log In To Suggest Characters</p>}

                    {characterSelection && characterSelection.map(characterId => 
                    <div key={characterId} className={`hover:bg-amber-600`}
                    onClick={() => handleCommentCharacterSelection(characterId)}
                    >
                      <CharacterCard individualCharacter={characterDictionary[characterId]} mobilesize={'60px'} desktopsize={'75px'}/>
                    </div>  
                      )}

                  </div>
                </div>
                
              </div>
              }


              {
              // showReplyForm && 
              profileData?.data?._id ?
                <form
                ref={replyFormRef}
                onSubmit={(e) => handleReplySubmit(e, comment)}
                className='flex flex-col mt-2 justify-end items-end'
                >
                  <textarea
                    name="replyInput"
                    className="w-full p-2 border-2 border-black resize-none"
                    maxLength="500"
                    placeholder="write reply here..."
                    onChange={(e) => setReplyInput(e.target.value)}
                    value={replyInput}
                    required
                    style={{ minHeight: "50px" }}
                  ></textarea>
                  <button type='submit' className="w-fit px-2 py-1 mt-4 border-2 border-black bg-orange-300 hover:bg-orange-400 relative z-[1000]">Submit Reply</button>
                </form> 
                :
                null
              }

            {comment?.replies.length > 0 && comment?.replies
              .slice()
              .sort((a,b) => b.createdAt - a.createdAt)
              .map(singleReply => 
                <Reply characterDictionary={characterDictionary} reply={singleReply} comment={comment} handleReplyDelete={handleReplyDelete} profileData={profileData} key={singleReply._id}/>
            )}

          </div>
      </div>
    </>
  )
}

