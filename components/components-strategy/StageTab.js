import React, { useEffect, memo, useState, useRef } from "react";

import {Cloudinary} from "@cloudinary/url-gen";
import {AdvancedImage, lazyload} from '@cloudinary/react';


function StageTab({ stageName }) {
  if (!stageName || stageName === ''){
    return
  }
  // Set the Cloud configuration and URL configuration
  const cld = new Cloudinary({
      cloud: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      },
      url: {
          // TODO: upgrade cloudinary to unlock secureDistribution
          // secureDistribution: 'www.dokkanbattlehelper.com', 
          secure: true // or false if you don't want to use HTTPS
      }
  });
  // Instantiate and configure a CloudinaryImage object.
  let stagePhoto = cld.image(`Character Categories/${stageName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').toLowerCase()}`);
  let backgroundPhoto = cld.image(`Character Categories/StageBackground`);

  const [showStageName, setShowStageName] = useState(false)

  const handleImageError = () => {
    setShowStageName(true)
  };
  
  return (
    showStageName ? 
      <div className={`flex w-fit h-fit justify-center items-center relative z-[900]`}>
        <AdvancedImage cldImg={backgroundPhoto} className='w-fit h-fit' />
        <p text={stageName} className="w-[75%] text-white text-shadow-black card-sm:text-2xl font-bold text-center absolute truncate">{stageName}</p>
      </div>  
    :
      <div className={`z-[900]`}>
        <AdvancedImage cldImg={stagePhoto} className='w-fit h-fit ' onError={handleImageError}/>
      </div>
  );
};

export default memo(StageTab);
