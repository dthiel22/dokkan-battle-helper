import React, { memo } from "react";


import {AdvancedImage, lazyload} from '@cloudinary/react';
import {CloudinaryImage} from "@cloudinary/url-gen";
import {URLConfig} from "@cloudinary/url-gen";
import {CloudConfig} from "@cloudinary/url-gen";

function EventTab({ event }) {
  // Set the Cloud configuration and URL configuration
  let cloudConfig = new CloudConfig({cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME});
  let urlConfig = new URLConfig({secure: true});
  // Instantiate and configure a CloudinaryImage object.
  let eventPhoto = new CloudinaryImage(`Events/${event.name.replace(/ /g, '_').replace(/[^\w\s]|_/g, '')}`, cloudConfig, urlConfig);

  return (
    <div>
      <AdvancedImage cldImage={eventPhoto}/>
    </div>
  );
};

export default memo(EventTab);
