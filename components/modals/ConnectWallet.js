import React, { useState } from "react";
import ReactDom from "react-dom";

import Image from "next/image";

const metaMaskLogo = "/images/metamask-logo.png";

export default function ConnectWalletModal( {open, onClose} ) {

  if (!open) return null;
  
  return ReactDom.createPortal(
    <>
     <div 
      onClick={onClose}
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/[.7] z-[1000]">
        <div 
        onClick={(e) => e.stopPropagation()}
        className="w-3/4 lg:w-1/3 p-10 rounded-lg shadow-lg fixed top-[30%] right-[13%] lg:top-[25%] lg:right-[33.5%] bg-white z-[1000]">
          <div className="flex w-full p-2 bg-gray-300 rounded-lg items-center justify-between">

            <p className="font-bold">MetaMask</p> <img src={metaMaskLogo} className="w-10 h-10"/>
            
          </div>
        </div>
      </div>
    </>,
    document.getElementById("ConnectWalletModal")
  );
}
