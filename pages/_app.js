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

  const [filterSelection, setFilterSelection] = useState([])

return (
  <ApolloProvider client={client}>
    <UserContext.Provider
      value={{
        filterSelection,
        setFilterSelection
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