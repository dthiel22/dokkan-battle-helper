import React, { memo } from "react";

import {Cloudinary} from "@cloudinary/url-gen";
import {AdvancedImage, lazyload} from '@cloudinary/react';

function EventTab({ event }) {
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
  let eventPhoto = cld.image(`Events/${event?.name.replace(/ /g, '_').replace(/[^\w\s]|_/g, '')}`);

  if (!event || event === ''){
    return
  }
  
  return (
    <div>
      <AdvancedImage cldImg={eventPhoto}/>
    </div>
  );
};

export default memo(EventTab);
