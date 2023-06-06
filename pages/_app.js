import React, { useState } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { QUERY_CHARACTERS, GET_ITEMS_DATA, GET_SUPPORT_MEMORY_DATA } from "./api/queries"

import Auth from '../components/util/auth'

import '../styles/index.css'

export const UserContext = React.createContext(null);

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_KEY,
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;

  const profileData = Auth.getProfile() || [];

  const [showMiddleDiv, setShowMiddleDiv] = useState(true);
  const [showCardDetails, setShowCardDetails] = useState(true);
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
    <UserContext.Provider
      value={{
        showMiddleDiv,
        setShowMiddleDiv,
        showCardDetails,
        setShowCardDetails,
        turnOnEZAStats,
        setTurnOnEZAStats,
        showCalculator,
        setShowCalculator,
        showDEFCalculator,
        setShowDEFCalculator,
        showSummationLinks,
        setShowSummationLinks,
        grayCharactersInSelectedDeck,
        setGrayCharactersInSelectedDeck,
        allCharacterIDsInDeck,
        setAllCharacterIDsInDeck,
        allNodePositions,
        setAllNodePositions,
        levelOfLinks,
        setLevelOfLinks,
        showSuggestedCardsByStats,
        setShowSuggestedCardsByStats,
      }}
    >
      <Component {...pageProps} profileData={profileData} />
    </UserContext.Provider>
  </ApolloProvider>
);

}

export default MyApp;
