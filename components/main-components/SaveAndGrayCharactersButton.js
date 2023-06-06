import React, { useContext } from 'react'
import { UserContext } from '../../pages/_app'

export default function SaveAndGrayCharactersButton({ profileData, multiCardSelection, setMultiCardSelection, handleUpdateSavedCharacters, allCharactersLoading}) {
    const { grayCharactersInSelectedDeck, setGrayCharactersInSelectedDeck, selectedDeck } = useContext(UserContext)

    if (!profileData?.data) {
        return (
            <h2 className="p-2 text-sm lg:text-base font-bold">
                Please log in to add players
            </h2>
        );
      }

  return (
    <div className="flex flex-col">
    <div className="flex flex-row items-center">
      <h2 className="pr-3 card-sm:p-2 text-sm card-sm:text-base text-center font-bold">
        Save Characters
      </h2>
      <div className="flex items-center">
        <label className="inline-flex relative items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={multiCardSelection}
            readOnly
          />
          <div
            onClick={() => {setMultiCardSelection(!multiCardSelection)}}
            className="w-6 card-sm:w-11 h-3 card-sm:h-6 bg-orange-100 rounded-full peer peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[18%] card-sm:after:top-[8%] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 card-sm:after:h-5 after:w-3 card-sm:after:w-5 after:transition-all peer-checked:bg-orange-500"
          ></div>
          <span className="ml-2 text-sm card-sm:text-base font-bold text-gray-900">
            ON
          </span>
        </label>
      </div>
      <div>
        <button
          disabled={!multiCardSelection || allCharactersLoading}
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="disabled:bg-gray-500 inline-block px-3 card-sm:px-3 py-2 card-sm:py-2 bg-blue-600 text-white font-medium text-sm card-sm:text-base leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          onClick={() => handleUpdateSavedCharacters()}
        >
          Save
        </button>
      </div>
    </div>
    {selectedDeck !== '' &&
    <div className="flex p-2 justify-center items-center">
        <h2 className="pr-3 text-sm card-sm:text-base font-bold">
          Gray Characters In Deck
        </h2>
        <div className="flex items-center">
          <label className="inline-flex relative items-center mr-5 cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={grayCharactersInSelectedDeck}
              readOnly
            />
            <div
              onClick={() => setGrayCharactersInSelectedDeck(!grayCharactersInSelectedDeck)}
              className="w-6 card-sm:w-11 h-3 card-sm:h-6 bg-orange-100 rounded-full peer peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[21%] card-sm:after:top-[8%] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 card-sm:after:h-5 after:w-3 card-sm:after:w-5 after:transition-all peer-checked:bg-orange-500"
            ></div>
            <span className="ml-2 text-sm card-sm:text-base font-bold text-gray-900">
              ON
            </span>
          </label>
        </div>
    </div>
    }
  </div>
  )
}
