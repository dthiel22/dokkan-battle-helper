import React, { useState } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { QUERY_CHARACTERS, GET_ITEMS_DATA, GET_SUPPORT_MEMORY_DATA } from "./api/queries"

import '../styles/index.css'

export const UserContext = React.createContext(null);

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_KEY,
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;

  // const profileData = Auth.getProfile() || [];

  const [showMiddleDiv, setShowMiddleDiv] = useState(true);
  const [showCardDetails, setShowCardDetails] = useState(true);
  const [filterByGame, setFilterByGame] = useState(false)
  const [hoverCharacterStats, setHoverCharacterStats] = useState(null);
  const [turnOnEZAStats, setTurnOnEZAStats] = useState(false);
  const [selectedLeaderCategories, setSelectedLeaderCategories] = useState(null)
  const [showCalculator, setShowCalculator] = useState(false);
  const [showDEFCalculator, setShowDEFCalculator] = useState(false);
  const [showSummationLinks, setShowSummationLinks] = useState(true);
  const [grayCharactersInSelectedDeck, setGrayCharactersInSelectedDeck] = useState(false);
  const [allCharacterIDsInDeck, setAllCharacterIDsInDeck] = useState([]);
  const [allNodePositions, setAllNodePositions] = useState([]);
  const [levelOfLinks, setLevelOfLinks] = useState(1);
  const [showSuggestedCardsByStats, setShowSuggestedCardsByStats] = useState(true);
  const [showGridLayout, setShowGridLayout] = useState(true)
  const [showTransformedCharacters, setShowTransformedCharacters] = useState(true)
  const [statsSelectedOptions, setStatsSelectedOptions] = useState("None");

  // Auth.loggedIn()

return (
  <ApolloProvider client={client}>
    <UserContext.Provider
      value={{
        // profileData,
        showMiddleDiv,
        setShowMiddleDiv,
        showCardDetails,
        setShowCardDetails,
        filterByGame, 
        setFilterByGame,
        hoverCharacterStats,
        setHoverCharacterStats,
        turnOnEZAStats,
        setTurnOnEZAStats,
        selectedLeaderCategories, 
        setSelectedLeaderCategories,
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
        showGridLayout,
        setShowGridLayout,
        showTransformedCharacters,
        setShowTransformedCharacters,
        statsSelectedOptions,
        setStatsSelectedOptions
      }}
    >
      <Head>
        <title>Bytes Analytics</title>
      </Head>
      <Component {...pageProps} />
    </UserContext.Provider>
  </ApolloProvider>
);

}

export default MyApp;