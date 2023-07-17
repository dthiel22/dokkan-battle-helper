import React, {useEffect, useState} from 'react'
import Comment from './Comment'
import EventTab from './EventTab'

import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ONE_STAGE_FOR_HELP_BOARD, GET_ONE_EVENT_FOR_HELP_BOARD } from "../../pages/api/queries";
import StageTab from './StageTab';


export default function CommentForHelpBoard( {comment, allCharacters, characterDictionary, reloadCommentsReplies}) {
    //find stage through comment
    const { loading: singleStageLoading, data: singleStageData } = useQuery(GET_ONE_STAGE_FOR_HELP_BOARD, {
        variables: {
          stageId: comment?.stage || "",
        },
      });

    const singleStage = singleStageData?.findStageForHelpBoard || ""
    
    // find event through stage (trigger lazy query when event data is found through useEffect)
    const [singleEventData, setSingleEventData] = useState(null)
    const [getEventData, { loading: eventDataLoading, data:eventData, error: eventError}] = useLazyQuery(GET_ONE_EVENT_FOR_HELP_BOARD, 
        {
        variables: {
            eventId: singleStageData?.findStageForHelpBoard?.eventId || "",
        },
        onCompleted: (data) => {
            setSingleEventData(data?.findEventForHelpBoard)
        }
        }
    );

    useEffect (() => { 
        getEventData()
    },[singleStageData])

    console.log(comment)

  return (
    <div className='my-4'>
        <div className='flex p-4 justify-between items-center border-t-2 border-x-2 border-gray-500 bg-gray-500/[.3]'>
          {(singleEventData?.name || singleEventData?.name !== '' || singleEventData?.name !== null) && (singleStage.name || singleStage.name !== '' || singleStage.name !== null) &&
            <>
              <EventTab event={singleEventData}/>
              <StageTab stageName={singleStage?.name} />
            </>
          }
        </div>
        <Comment comment={comment} allCharacters={allCharacters} characterDictionary={characterDictionary} selectedStage={singleStage} reloadCommentsReplies={reloadCommentsReplies} key={comment._id}/>
    </div>
  )
}
