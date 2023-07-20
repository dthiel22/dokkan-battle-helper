import React from 'react'

export default function Introduction({setOpenNewsModal}) {
  return (
    <div className="flex flex-1 mt-2 flex-col w-full border-2 border-black bg-orange-200 overflow-y-auto items-center rounded-md">
      <div className="pb-4">
        <h1 className="font-header pt-2 text-xl card-sm:text-2xl lg:text-4xl font-light text-center underline underline-offset-8 decoration-2">Dokkan Team Builder</h1>
        <p className="px-4 pt-2 text-base card-sm:text-lg font-bold indent-10">Welcome to Dokkan Battle Helper! The biggest reason we wanted to make this web app was to help players build effective teams that link well with each other. Whether you are a beginner looking for a team that can complete an event or a long time veteran looking for an easy place to post teams on our strategy page, we believe this app can be used by everyone. A couple of use cases for the app include seeing what characters link well with others, saving teams to a deck (great feature to help those looking to make teams to complete Ultimate Clash), seeing/posting teams on specific stages for others to see, and calculating attack and damage stats for cards. The team building page can be accessed at <a className='text-blue-500' href={`https://dokkan.team/`}>dokkan.team</a> while the team strategies and team postings can be found at <a className='text-blue-500' href={`https://dokkan.team/strategy`}>dokkan.team/strategy</a>. We hope you enjoy this app. If there is any information missing or is incorrect, please fill out the information in this <a className='text-blue-500' href={'https://docs.google.com/forms/d/e/1FAIpQLSdmglG-bsdZL1R41EYEsfrnN5tgJyK-CPfs1D4cNwNBpcxfxg/viewform?usp=sf_link'} target={'_blank'}>form</a>.</p>
      </div>
      <div className="pb-4">
        <p className="px-4 pt-2 text-base card-sm:text-lg font-bold indent-10">To begin using the app, click on any character to begin building the team web. If you need more help on how to use the app, access <a className='text-blue-500' href={`https://dokkan.team/help`}>the help page</a>.</p>
      </div>
      <button 
      onClick={() => setOpenNewsModal(true)}
      className='flex w-1/2 p-4 m-2 border-2 border-black bg-orange-300 font-bold items-center justify-center text-center'>Open Updates Log</button>
    </div>
  )
}
