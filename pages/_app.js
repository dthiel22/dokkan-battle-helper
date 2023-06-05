import React, { useState } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { QUERY_CHARACTERS, GET_ITEMS_DATA, GET_SUPPORT_MEMORY_DATA } from "./api/queries"

import '../styles/index.css'

export const UserContext = React.createContext(null);

console.log(process.env.NEXT_PUBLIC_API_KEY)

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_KEY,
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;

  const [showMiddleDiv, setShowMiddleDiv] = useState(true);
  const [turnOnEZAStats, setTurnOnEZAStats] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showDEFCalculator, setShowDEFCalculator] = useState(false);
  const [showSummationLinks, setShowSummationLinks] = useState(true);
  const [grayCharactersInSelectedDeck, setGrayCharactersInSelectedDeck] = useState(false);
  const [allCharacterIDsInDeck, setAllCharacterIDsInDeck] = useState([]);
  const [allNodePositions, setAllNodePositions] = useState([]);
  const [levelOfLinks, setLevelOfLinks] = useState(1);
  const [showSuggestedCardsByStats, setShowSuggestedCardsByStats] = useState(true);

  return (
    <ApolloProvider client={client}>
      {/* <UserContext.Provider> */}
        <Component
          {...pageProps}
          showMiddleDiv={showMiddleDiv}
          setShowMiddleDiv={setShowMiddleDiv}
          turnOnEZAStats={turnOnEZAStats}
          setTurnOnEZAStats={setTurnOnEZAStats}
          showCalculator={showCalculator}
          setShowCalculator={setShowCalculator}
          showDEFCalculator={showDEFCalculator}
          setShowDEFCalculator={setShowDEFCalculator}
          showSummationLinks={showSummationLinks}
          setShowSummationLinks={setShowSummationLinks}
          grayCharactersInSelectedDeck={grayCharactersInSelectedDeck}
          setGrayCharactersInSelectedDeck={setGrayCharactersInSelectedDeck}
          allCharacterIDsInDeck={allCharacterIDsInDeck}
          setAllCharacterIDsInDeck={setAllCharacterIDsInDeck}
          allNodePositions={allNodePositions}
          setAllNodePositions={setAllNodePositions}
          levelOfLinks={levelOfLinks}
          setLevelOfLinks={setLevelOfLinks}
          showSuggestedCardsByStats={showSuggestedCardsByStats}
          setShowSuggestedCardsByStats={setShowSuggestedCardsByStats}
        />
      {/* </UserContext.Provider> */}
    </ApolloProvider>
  );
}

export default MyApp;
