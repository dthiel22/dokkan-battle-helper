import { useState } from 'react';
import SalesChart from './SalesChart';
import StatsTable from './StatsTable';

import SalesDataObject from '../util/SalesObject'

import { useLazyQuery } from '@apollo/client';

export default function SalesPage() {
  const [salesData, setSalesData] = useState([]);
  const [collectionStats, setCollectionStats] = useState({})

  const options = {
    method: 'GET',
    headers: {accept: '*/*', 'x-api-key': '29583580-b3f3-5526-a57e-0215da821eb0'}
  };

  const fetchCollectionStats = async () => {
    const url = 'https://api.reservoir.tools/collections/v7?id=0xB9951B43802dCF3ef5b14567cb17adF367ed1c0F';

    const fetchData = async (url, options) => {
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    try {
      const data = await fetchData(url, options);
      if (data) {
        setCollectionStats(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //TODO: still need to establish a pagination/continuation 
  const fetchSalesStats = async () => {
    let continuationToken = ''; // Initialize the continuation token
  
    const url = 'https://api.reservoir.tools/sales/v6?contract=0xB9951B43802dCF3ef5b14567cb17adF367ed1c0F&includeTokenMetadata=true&limit=1000';
  
    const fetchData = async (url, options) => {
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    };
  
    try {
      // Fetch the initial page of data
      let data = await fetchData(url + '&continuation=' + continuationToken);
  
      while (data && data.continuation) {
        // Update the continuation token for the next page
        continuationToken = data.continuation;
        
        // Fetch the next page of data
        data = await fetchData(url + '&continuation=' + continuationToken);
  
        // Process or store the fetched data, you might want to concatenate or aggregate it.
        // Here, we are just logging the data for demonstration purposes.
        console.log(data);
      }
  
    } catch (error) {
      console.error(error);
    }

    try {
      const data = await fetchData(url, options);
      if (data) {
        setCollectionStats(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDuneData = async () => {
    const queryUrl = 'https://api.dune.com/api/v1/query/3271412/execute';
    const apiKey = 'g0N1cl6e31PskCytU6PEZf8hwEk5Lxm8';

    try {
        const headers = {
            "x-dune-api-key": apiKey,
            "Content-Type": "application/json"
        };

        // Make the initial request to execute the query
        const response = await fetch(queryUrl, {
            method: 'POST',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Error executing query');
        }

        // Parse the response data to get the execution ID
        const { execution_id } = await response.json();
        console.log('Execution ID:', execution_id);

        // Construct the status endpoint URL using the execution ID
        const statusUrl = `https://api.dune.com/api/v1/execution/${execution_id}/status`;

        // Poll the status endpoint until the execution reaches a terminal state
        let executionState = 'QUERY_STATE_PENDING';
        while (executionState === 'QUERY_STATE_PENDING' || executionState === 'QUERY_STATE_EXECUTING') {
            // Make a request to the status endpoint
            const statusResponse = await fetch(statusUrl, {
                method: 'GET',
                headers: headers
            });

            if (!statusResponse.ok) {
                throw new Error('Error fetching query status');
            }

            // Parse the response data
            const { state } = await statusResponse.json();
            executionState = state;

            // Log the status every 2.5 seconds
            console.log('Execution state:', executionState);

            // If the execution is still pending or executing, wait for a short interval before polling again
            if (executionState === 'QUERY_STATE_PENDING' || executionState === 'QUERY_STATE_EXECUTING') {
                await new Promise(resolve => setTimeout(resolve, 2500)); // Poll every 2.5 seconds
            }
        }

        // Once the execution reaches a terminal state, log the final execution state
        console.log('Final execution state:', executionState);

        // Fetch the results once the query execution is completed
        if (executionState === 'QUERY_STATE_COMPLETED') {
            const resultUrl = `https://api.dune.com/api/v1/execution/${execution_id}/results`;

            const resultResponse = await fetch(resultUrl, {
                method: 'GET',
                headers: headers
            });

            if (!resultResponse.ok) {
                throw new Error('Error fetching query results');
            }

            const results = await resultResponse.json();
            console.log('Query results:', results);
        } else {
            console.log('Query execution failed or was cancelled.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
  };

  const fetchDuneDataWithParameters = async () => {
    const url = 'https://api.dune.com/api/v1/query/3271412/execute';
    const apiKey = 'g0N1cl6e31PskCytU6PEZf8hwEk5Lxm8';

    try {
        // Define the parameters to be passed to the query
        const params = {
            "query_parameters": {
                "nft_token_contract": "0xB9951B43802dCF3ef5b14567cb17adF367ed1c0F",
                "staking_contract": "0x67e1eCFA9232E27EAf3133B968A33A9a0dCa9e16"
            }
        };

        // Convert the parameters object to JSON string
        const body = JSON.stringify(params);

        const headers = {
            "x-dune-api-key": apiKey,
            "Content-Type": "application/json"
        };

        // Make the request
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        // Handle the response
        if (response.ok) {
            const responseData = await response.json(); // Parse JSON response
            console.log(responseData); // Log the parsed response data

            // Now you can access responseData.execution_id and responseData.state
            // and further process the response data as needed
        } else {
            throw new Error('Error fetching data from Dune API');
        }
    } catch (error) {
        console.error(error);
    }
  };
  
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={() => fetchDuneData()}
      className='bg-white'>Load Collection Stats</button>
      <SalesChart salesData={salesData} />

      <StatsTable />
    </main>
  )
}
