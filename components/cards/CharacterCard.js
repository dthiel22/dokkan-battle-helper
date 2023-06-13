import React, { useContext, memo } from 'react'

import {Cloudinary} from "@cloudinary/url-gen";
import {AdvancedImage, lazyload, accessibility, responsive, placeholder} from '@cloudinary/react';

const leaderIcon = "/dokkanIcons/icons/leader-icon.png";
const friendIcon = "/dokkanIcons/icons/friend-icon.png";
const subIcon = "/dokkanIcons/icons/subleader-icon.png";
const ezaIcon = "/dokkanIcons/icons/z.png";

const CharacterCard = React.memo(({ individualCharacter, mobilesize, desktopsize, EZA, leaderOrSubLeader }) => {
    // allows for initial render to have no selected character
    if(individualCharacter === null || typeof individualCharacter === 'undefined'){
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

    const characterThumb = cld.image(`Character Thumb/${individualCharacter.id}`);
    
    if (individualCharacter.id === 0){
        return(
            <AdvancedImage
            className={`w-[70px] card-sm:w-[100px] bg-no-repeat relative z-40`}
            cldImg={characterThumb}
            alt={individualCharacter.name}
            />
        )
    }

    const characterRarity = cld.image(`rarities-types/${individualCharacter.rarity}`)
    let characterTypeBadge = '';
    if (individualCharacter.jp_date && !individualCharacter.glb_date){
        characterTypeBadge = cld.image(`rarities-types/j${individualCharacter?.type?.toLowerCase()}`)
    } else {
        characterTypeBadge = cld.image(`rarities-types/${individualCharacter?.type?.toLowerCase()}`)
    }
    const characterTypeBackground = cld.image(`rarities-types/${individualCharacter?.type?.slice(1,4)?.toLowerCase()}-background`)


    return (
        <div 
        className={`flex w-fit justify-center items-center relative`}>
            <AdvancedImage
                className={`w-[${mobilesize}] card-sm:w-[${desktopsize}] bottom-[5%] bg-no-repeat relative z-40`}
                cldImg={characterThumb}
                alt={individualCharacter.name}
                // plugins={[lazyload({rootMargin: '1000px 200px 1000px 200px', threshold: 0.1})]} //top, right, bottom, left
            />
            {leaderOrSubLeader === 'leader' ? <img src={leaderIcon} className='w-[80%] -top-[2%] right-[33%] absolute z-50'/> : null}
            {leaderOrSubLeader === 'subLeader' ? <img src={friendIcon} className='w-[80%] -top-[2%] right-[33%] absolute z-50'/> : null}
            {leaderOrSubLeader === 'sub' ? <img src={subIcon} className='w-[80%] -top-[2%] right-[33%] absolute z-50'/> : null}
            {EZA ? <img src={ezaIcon} className='w-[30%] bottom-[5%] right-[0%] absolute z-50'/> : null}
            {individualCharacter.rarity &&
                <AdvancedImage
                    cldImg={characterRarity}
                    className={
                        individualCharacter.rarity === "UR"
                            ? "h-[26.67%] card-sm:h-[27%] absolute bottom-[6%] card-sm:bottom-[6%] left-[-2%] card-sm:left-[-5%] z-50"
                            : individualCharacter.rarity === "LR"
                            ? "h-[31.67%] card-sm:h-[32%] absolute bottom-[6%] card-sm:bottom-[5%] left-[0%] card-sm:left-[-1%] z-50"
                            : individualCharacter.rarity === "SSR"
                            ? "h-[35%] card-sm:h-[35%] absolute bottom-[0%] card-sm:bottom-[0%] left-[-4%] card-sm:left-[-6%] z-50"
                            : ""
                    }
                    // plugins={[lazyload({rootMargin: '1000px 200px 1000px 200px', threshold: 0.1})]} //top, right, bottom, left
                />
            }
            {individualCharacter.type &&
            <AdvancedImage
                className="w-[80%] card-sm:w-[81%] absolute top-[13%] z-0"
                cldImg={characterTypeBackground}
                // plugins={[lazyload({rootMargin: '1000px 200px 1000px 200px', threshold: 0.1})]} //top, right, bottom, left
            />
            }
            {individualCharacter.type &&
            <AdvancedImage
                className="w-[40%] card-sm:w-[40%] absolute top-[0%] card-sm:top-[0%] right-[-1%] card-sm:right-[-2%] z-50"
                cldImg={characterTypeBadge}
                // plugins={[lazyload({rootMargin: '1000px 200px 1000px 200px', threshold: 0.1})]} //top, right, bottom, left
            />
            }
        </div>
    );
})

export default memo(CharacterCard);