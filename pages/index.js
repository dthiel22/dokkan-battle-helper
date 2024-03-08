import React, { useState, useEffect, useRef, useMemo, useContext } from "react";

function AllComponents({  }) {

  return (
    <>
    <div 
    key={"top div"}
     className="flex fixed top-0 left-0 right-0 bottom-0 bg-slate-900 z-[999] justify-center items-center">
       <div 
       className="flex flex-col w-3/4 lg:w-3/5 h-[70vh] lg:max-h-3/4 border-4 border-black rounded-lg shadow-lg fixed bg-gray-100 z-[1000] overflow-y-auto">
         
         <div className="flex flex-col w-full h-full bg-orange-200">
             <div className="pb-14">
               <p className="font-header pt-2 text-xl card-sm:text-2xl lg:text-4xl font-light text-center underline underline-offset-8 decoration-2">Goodbye...for now</p>

               <div className="h-full bg-orange-200">
               <div className="flex flex-wrap justify-around">
                 <NewsDiv date={'March 7th, 2024'} information={
                     <>
                      <p className="px-2 card-sm:px-4 py-2 text-md card-sm:text-base font-bold indent-4">It is with a sad heart that I have come to say that I will be closing down Dokkan Battle Helper. It was such a blast to make and critique the site based upon your guys needs...then hear back about how much you liked the site and how helpful it was. This was the first website I had ever built and I am pretty proud of it. The reason I am closing it down is multiple reasons. The site became too time-consuming, as some of you can see, I did not update the characters for over 4 months, and I never got the chance to automate character generating as other sites have. I got a new job 4 months ago and figured I would be able to keep up with my workload while also maintaining the site, but I was incredibly wrong. On top of that, to keep the website running became too expensive.</p>
                      <p className="px-2 card-sm:px-4 py-2 text-md card-sm:text-base font-bold indent-4">I learned so much from building out this website and I truly thank each and every one of you for using it. I hope you enjoyed it and found it as useful as I did. Sites that are incredibly useful and very well-maintained include <a className='text-blue-500' href={`https://dokkan.wiki/`}>Dokkan Wiki</a> (the creator of this website was incredibly helpful while I was making mine, please support his site, it is incredibly well made) and <a className='text-blue-500' href={`https://dokkantools.com/`}>Dokkan Tools</a>, which is a website that functioned a lot like mine and will help your generate teams. My only suggestion to the Dokkan Tools creator would be to have the ability to see character stat gains from their links + team saving.</p>
                      <p className="px-2 card-sm:px-4 py-2 text-md card-sm:text-base font-bold indent-4">Again, thank you for using and contributing to this site. I will be keeping my eye on Dokkan and if the Japan and Global database ever do end up merging, I will debate working slowly to generate a team-building app that is not expensive to maintain and also can automatically be updated. However, it seems like Dokkan Tools is close to accomplishing this! If you ever want to reach me, I casually check this email: matt.alex.projects@gmail.com</p>

                      <break></break>

                      <p className="px-2 card-sm:px-4 py-2 text-md card-sm:text-base font-bold indent-4">Take care.</p>
                     </>
                   }
                   key={"Update 1"}
                 />
               </div>
               </div>
             </div>
         </div>
       </div>
     </div>
    </>
  );
}

function NewsDiv ({ date, information }) {

  return (
    <div className="w-[90%] mt-4 mx-4 border-4 border-black rounded-lg bg-orange-300 overflow-y-auto">
      <p className="w-full h-fit p-2 border-b-2 border-black text-xl font-bold text-center bg-orange-400">{date}</p>
      <p className="">{information}</p>
    </div>
  )
}

export default AllComponents;