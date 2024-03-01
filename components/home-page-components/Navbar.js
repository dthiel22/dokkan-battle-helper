import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

import ConnectWalletModal from "@/modals/ConnectWallet";
import Image from 'next/image';

const AppNavbar = ({  }) => {

  const router = useRouter();

  function handleToHomePage() {
    router.push('/');
  }
  
  const currentPath = router.pathname;

  const [openConnectWalletModal, setOpenConnectWalletModal] = useState(false)

  // appropriately render windowsize
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <ConnectWalletModal open={openConnectWalletModal} onClose={() => setOpenConnectWalletModal(false)}/>
      <div className="flex flex-col w-screen p-2 justify-between items-center bg-slate-700">
        <div className="flex w-full p-2 justify-between items-center">
          <h1 className="font-bold text-2xl">GameBet</h1>
          <input className="p-2 w-1/3 rounded-lg" placeholder="Search"></input>
          <button 
          onClick={() => setOpenConnectWalletModal(true)}
          className="p-2 bg-blue-500 rounded-lg text-white font-bold">Connect Wallet</button>
        </div>
      </div>
    </>
  );
};

export default AppNavbar;
