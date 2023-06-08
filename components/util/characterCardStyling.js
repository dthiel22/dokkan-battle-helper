export const getCharacterThumbNail = (cardDetails) => {
  if (!cardDetails.thumb) {
    return cardDetails.art;
  } else {
    return cardDetails.thumb;
  }
};

export const getCharacterRarityBackground = (cardDetails) => {
  if (cardDetails.rarity === null) {
    return undefined;
  }
  if (cardDetails.rarity === "UR") {
    return "/dokkanIcons/rarities/UR.png";
  } else {
    return "/dokkanIcons/rarities/LR.png";
  }
};

export const getCharacterTypeBackground = (cardDetails) => {
  if (cardDetails.type === null) {
    return undefined;
  }
  if (cardDetails.type.includes("PHY")) {
    return "/dokkanIcons/types/phy-background.png";
  } else if (cardDetails.type.includes("AGL")) {
    return "/dokkanIcons/types/agl-background.png";
  } else if (cardDetails.type.includes("STR")) {
    return "/dokkanIcons/types/str-background.png";
  } else if (cardDetails.type.includes("INT")) {
    return "/dokkanIcons/types/int-background.png";
  } else {
    return "/dokkanIcons/types/teq-background.png";
  }
};

export const getCharacterTypeText = (cardDetails) => {
  if (cardDetails.type === null) {
    return undefined;
  }
  if (cardDetails.type.trim() === "EPHY" || cardDetails.type === "PHY-E") {
    return "/dokkanIcons/types/ephy.png";
  } else if (
    cardDetails.type.trim() === "SPHY" ||
    cardDetails.type === "PHY-S"
  ) {
    return "/dokkanIcons/types/sphy.png";
  } else if (
    cardDetails.type.trim() === "EAGL" ||
    cardDetails.type === "AGL-E"
  ) {
    return "/dokkanIcons/types/eagl.png";
  } else if (
    cardDetails.type.trim() === "SAGL" ||
    cardDetails.type === "AGL-S"
  ) {
    return "/dokkanIcons/types/sagl.png";
  } else if (
    cardDetails.type.trim() === "ESTR" ||
    cardDetails.type === "STR-E"
  ) {
    return "/dokkanIcons/types/estr.png";
  } else if (
    cardDetails.type.trim() === "SSTR" ||
    cardDetails.type === "STR-S"
  ) {
    return "/dokkanIcons/types/sstr.png";
  } else if (
    cardDetails.type.trim() === "EINT" ||
    cardDetails.type === "INT-E"
  ) {
    return "/dokkanIcons/types/eint.png";
  } else if (
    cardDetails.type.trim() === "SINT" ||
    cardDetails.type === "INT-S"
  ) {
    return "/dokkanIcons/types/sint.png";
  } else if (
    cardDetails.type.trim() === "EINT" ||
    cardDetails.type === "INT-E"
  ) {
    return "/dokkanIcons/types/eint.png";
  } else if (
    cardDetails.type.trim() === "STEQ" ||
    cardDetails.type === "TEQ-S"
  ) {
    return "/dokkanIcons/types/steq.png";
  } else {
    return "/dokkanIcons/types/eteq.png";
  }
};
