import React, { useState } from 'react'

import CharacterCard from '@/cards/CharacterCard';

import Image from 'next/image';

const trashIcon = "/dokkanIcons/icons/trash-icon.png";

export default function Reply({ characterDictionary, reply, comment, profileData, handleReplyDelete }) {
  const [showDeleteReplyToolTip, setShowDeleteReplyToolTip] = useState(false)

  return (
    <div key={reply._id} className='p-2 pl-6 mt-4 border-l-4 border-gray-500'>
      <span className="flex justify-between">
        <div className='flex flex-row'>
          <p className="pr-4">{reply?.creator?.username && reply?.creator.username.replace(/(.+)@.+\..+/, "$1")}</p>
          <div>|</div>
          <p className="pl-4">{new Date(parseInt(reply.createdAt)).toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
        </div>

        {profileData?.data?._id === reply?.creator._id &&
        <div className="relative">
          <img src={trashIcon} 
          onClick={() => handleReplyDelete(comment, reply)}
          onMouseEnter={() => setShowDeleteReplyToolTip(true)}
          onMouseLeave={() => setShowDeleteReplyToolTip(false)} 
          className="w-8 h-8 p-1 mb-1 mr-1 hover:bg-gray-500/[.75] transition ease-in-out rounded-lg z-50 cursor-pointer relative z-[1000]"/>
          <div className={`absolute bottom-[110%] left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white rounded-lg text-center ${showDeleteReplyToolTip ? 'opacity-100 z-[1000]' : 'opacity-0 z-0'} transition-opacity`}>
            delete this reply
          </div>
        </div>
        }
      </span>
      <p className="my-2">{reply?.content}</p>
      {reply?.selectedCharacters &&
        <div className="flex flex-wrap w-fit p-2 border-2 border-black justify-center">
          <p className="w-full text-center text-lg font-bold underline decoration-2">Characters Suggested</p>
            {Object.entries(reply.selectedCharacters)
              .filter(([key]) => key === 'leader')
              .map(([key, value]) => (
                <div key={key}>
                  <CharacterCard
                    individualCharacter={characterDictionary[value]}
                    mobilesize={'60px'}
                    desktopsize={'85px'}
                    leaderOrSubLeader={key}
                  />
                </div>
            ))}
            {Object.entries(reply.selectedCharacters)
              .filter(([key]) => key !== 'leader' && key !== 'subLeader')
              .map(([key, value]) => (
                <div key={key}>
                  <CharacterCard
                    individualCharacter={characterDictionary[value]}
                    mobilesize={'60px'}
                    desktopsize={'85px'}
                    leaderOrSubLeader={key}
                  />
                </div>
            ))}
            {Object.entries(reply.selectedCharacters)
              .filter(([key]) => key === 'subLeader')
              .map(([key, value]) => (
                <div key={key}>
                  <CharacterCard
                    individualCharacter={characterDictionary[value]}
                    mobilesize={'60px'}
                    desktopsize={'85px'}
                    leaderOrSubLeader={key}
                  />
                </div>
            ))}
        </div>
      }
  </div>  
  )
}