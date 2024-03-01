import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import Navbar from "../components/home-page-components/Navbar"
import Page from "../components/home-page-components/page2"

import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { } from "./api/queries";

import { UserContext } from '../pages/_app';
import Image from 'next/image';
import dynamic from 'next/dynamic';

function AllComponents({  }) {
  const { filterSelection } = useContext(UserContext);
  
  return (
    <>
      <div className="fixed flex flex-col h-full bg-slate-900">
        {/* NavBar is placed inside the home component to allow for proper flex filling...keeping it as a single page application */}
        <Navbar />
        <div className="flex flex-1 flex-row overflow-y-auto">
          <Page />
        </div>

      </div>
    </>
  );
}

export default AllComponents;