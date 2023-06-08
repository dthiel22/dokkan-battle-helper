import React, { useContext } from 'react'
import { UserContext } from '../../pages/_app'

const addIcon = "/dokkanIcons/icons/add-icon.png";

export default function AddTeamToStageButton({ selectedTeam, handleOpenSelectTeamToStageModal}) {
    const { profileData } = useContext(UserContext)

    if (!profileData?.data) {
        return (
            <div className="flex justify-center items-center text-center w-[90%] h-fit px-4 py-2 my-2 border-4 border-black text-md card-sm:text-lg font-bold rounded-full bg-orange-200">
                Please Log In To Add A Team To This Stage
            </div>
        );
    }
    
  return (
    <button onClick={() => handleOpenSelectTeamToStageModal(selectedTeam)} className="disabled:bg-gray-500 flex justify-center items-center w-[90%] h-fit p-2 my-2 border-4 border-black text-md card-sm:text-lg font-bold rounded-full bg-orange-200 hover:bg-orange-400 transition ease-in-out">
        <img src={addIcon} className="w-6 card-sm:w-8 mr-2"/>ADD TEAM TO STAGE
    </button>
  )
}
