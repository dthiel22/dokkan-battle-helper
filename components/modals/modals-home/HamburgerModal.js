import React, { useState, useEffect, useContext } from "react";
import ReactDom from "react-dom";

import LoginSignUpModal from "./LoginSignUpModal";
import NewsAndUpdatesModal from "./NewsAndUpdates";

import Auth from "../../util/auth";

import { UserContext } from '../../../pages/_app';

export default function HamburgerModal({open, onClose}) {

  const { showMiddleDiv, setShowMiddleDiv, showCalculator, setShowCalculator } = useContext(UserContext);

  const [loginOpen, setLoginOpen] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false)

  const webLocationObject = window.location

  function handleLoginOpen (e) {
    e.stopPropagation()
    setLoginOpen(true)
  }

  function handleOpenNewsAndUpdates (e) {
    e.stopPropagation()
    setUpdatesOpen(true)
  }

  function handleToHelp (e) {
    e.stopPropagation()
    window.location.assign(window.location.origin + '/help')
  }

  function handleToTeamBuild (e) {
    e.stopPropagation()
    window.location.assign(window.location.origin)
  }

  function handleToStrategy (e) {
    e.stopPropagation()
    window.location.assign(window.location.origin + '/strategy')
  }

  function handleSetShowCalculator (e) {
    e.preventDefault()
    e.stopPropagation()
    setShowCalculator(!showCalculator)
  }

  if (!open){
    return null
  }

  return ReactDom.createPortal(
    <>
      <LoginSignUpModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <NewsAndUpdatesModal open={updatesOpen} onClose={() => setUpdatesOpen(false)}/>
      <div 
      onClick={() => onClose()} 
      className={`fixed top-0 left-0 right-0 bottom-0 bg-black/[.1] z-[999]`}>
        <div className={`flex flex-col w-[30vh] justify-center absolute top-[7vh] right-[1vh] border-4 border-black rounded-lg z-[1000]`}>
        {Auth.loggedIn() ? 
            <button
            className={`font-header text-lg card-sm:text-2xl flex justify-center items-center h-1/3 w-full col-span-1 p-4 bg-orange-200 border-2 border-black`}
            onClick={Auth.logout}
          >
            Log Out
          </button>
        :
          <button
            className={`font-header text-lg card-sm:text-2xl flex justify-center items-center h-1/3 w-full col-span-1 p-4 bg-orange-200 border-2 border-black`}
            onClick={(e) => handleLoginOpen(e)}
          >
            Login/Sign Up
          </button>
        }
          <button
            className={`font-header text-lg card-sm:text-2xl flex justify-center items-center h-1/3 w-full col-span-1 p-4 bg-orange-200 border-2 border-black`}
            onClick={(e) => handleOpenNewsAndUpdates(e)}
          >
            News & Updates
          </button>
          <a
            className={`font-header text-lg card-sm:text-2xl flex justify-center items-center text-center h-1/3 w-full col-span-1 p-4 bg-orange-200 border-2 border-black`}
            href={`/help`}
          >
            Help
          </a>
          {webLocationObject.pathname === ('/') &&
          <p
          onClick={(e) => handleSetShowCalculator(e)}
          className={`font-header text-lg card-sm:text-2xl flex justify-center items-center text-center h-1/3 w-full col-span-1 p-4 bg-orange-200 border-2 border-black`}
          >
            {showCalculator ? 'Show Team Web' : 'Show Calculator'}
          </p>
          }
          {(webLocationObject.pathname === ('/') || webLocationObject.pathname === ('/help')) &&
            <a
              className={`font-header text-lg card-sm:text-2xl flex justify-center items-center text-center h-1/3 w-full col-span-1 p-4 bg-orange-200 border-2 border-black`}
              href={`/strategy`}
            >
              Events and Strategy
            </a>
          }
          {(webLocationObject.pathname === ('/strategy') || webLocationObject.pathname === ('/help')) &&
            <button
              className={`font-header text-lg card-sm:text-2xl flex justify-center items-center h-fit w-full col-span-1 p-4 bg-orange-200 border-2 border-black`}
              onClick={(e) => window.location.assign(window.location.origin)}
            >
              Team & Deck Build
            </button>
          }
        </div>
      </div>
    </>,
    document.getElementById("HamburgerPortal")
  );
}

