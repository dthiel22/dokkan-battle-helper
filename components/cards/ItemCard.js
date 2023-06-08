import {Cloudinary} from "@cloudinary/url-gen";
import {AdvancedImage, lazyload} from '@cloudinary/react';

const ItemCard = ({ item, mobilesize, desktopsize }) => {
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
    let itemThumb = cld.image(`Items/${item.id}`);
    let itemBackground = item.type ? cld.image(`Items/background-${item.type.toLowerCase()}`) : null;
    return (
          <div className='w-fit relative m-1'>
            <AdvancedImage
              className={`h-[${mobilesize}] card-sm:h-[${desktopsize}] w-[${mobilesize}] card-sm:w-[${desktopsize}] bg-no-repeat relative z-50 top-[1%] card-sm:top-[.5%] right-[0%] card-sm:right-[0%] z-40`}
              cldImg={itemThumb}
              alt={item.name}
              plugins={[lazyload({rootMargin: '10px 20px 10px 30px', threshold: 0.05})]}
              />
            {itemBackground && (
              <AdvancedImage
                className="w-[100%] card-sm:w-[100%] absolute top-[0%] card-sm:top-[0%] right-[0%] card-sm:right-[0%] z-0"
                cldImg={itemBackground}
                plugins={[lazyload({rootMargin: '10px 20px 10px 30px', threshold: 0.05})]}
              />
            )}
          </div>
    );
}

export default ItemCard