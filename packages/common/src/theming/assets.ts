// Copyright 2018 Prescryptive Health, Inc.

export type ImageInstanceNames =
  | 'brand'
  | 'brandBackground'
  | 'dollarMagnifier'
  | 'splashScreen'
  | 'closeWhiteButton'
  | 'closeGreyButton'
  | 'headerMyRxLogo'
  | 'headerMyPrescryptiveLogo'
  | 'sideMenuAvatarIcon'
  | 'alertCircle'
  | 'errorCircle'
  | 'yellowBang'
  | 'poweredByPrescryptivePurple120'
  | 'diabetesVideoImage'
  | 'stethoscopeIcon'
  | 'pillCartIcon'
  | 'pillHandIcon'
  | 'lockIcon'
  | 'poweredByPrescryptiveLogoWhite'
  | 'sectionBackgroundImage'
  | 'sectionBackground'
  | 'smartpriceCardIcon'
  | 'virusSyringeIcon'
  | 'newPrescriptionIcon'
  | 'pillBottleIcon'
  | 'dottedLine'
  | 'couponLogo'
  | 'semiCircle'
  | 'couponIcon'
  | 'emptyMedicineCabinet'
  | 'emptyClaimsImage'
  | 'prescryptiveBrand'
  | 'prescryptiveBrandWhite'
  | 'rxIdCardFlower'
  | 'rxIdSavingsCardPattern'
  | 'myPrescryptiveLogo'
  | 'prescryptiveLogo'
  | 'claimReversal'
  | 'profileIcon';

export type ObjectInstanceNames = 'uiCMSContent';

export type ExpectedFileKeys =
  | 'brand'
  | 'brandBackground'
  | 'dollarMagnifier'
  | 'downArrow'
  | 'leftArrow'
  | 'splashScreen'
  | 'closeWhiteButton'
  | 'closeGreyButton'
  | 'headerMyRxLogo'
  | 'headerMyPrescryptiveLogo'
  | 'sideMenuAvatarIcon'
  | 'alertCircle'
  | 'errorCircle'
  | 'yellowBang'
  | 'poweredByPrescryptivePurple120'
  | 'diabetesVideoImage'
  | 'stethoscopeIcon'
  | 'pillCartIcon'
  | 'pillHandIcon'
  | 'lockIcon'
  | 'poweredByPrescryptiveLogoWhite'
  | 'sectionBackgroundImage'
  | 'sectionBackground'
  | 'smartpriceCardIcon'
  | 'virusSyringeIcon'
  | 'newPrescriptionIcon'
  | 'pillBottleIcon'
  | 'dottedLine'
  | 'couponLogo'
  | 'semiCircle'
  | 'couponIcon'
  | 'emptyMedicineCabinet'
  | 'emptyClaimsImage'
  | 'prescryptiveBrand'
  | 'prescryptiveBrandWhite'
  | 'rxIdCardFlower'
  | 'rxIdSavingsCardPattern'
  | 'myPrescryptiveLogo'
  | 'prescryptiveLogo'
  | 'claimReversal'
  | 'profileIcon';

export type ExpectedObjectFileKeys = 'uiCMSContent';

export const ImageKeysMap = new Map<ImageInstanceNames, ExpectedFileKeys>();
ImageKeysMap.set('brand', 'brand');
ImageKeysMap.set('brandBackground', 'brandBackground');
ImageKeysMap.set('dollarMagnifier', 'dollarMagnifier');
ImageKeysMap.set('splashScreen', 'splashScreen');
ImageKeysMap.set('closeWhiteButton', 'closeWhiteButton');
ImageKeysMap.set('closeGreyButton', 'closeGreyButton');
ImageKeysMap.set('headerMyRxLogo', 'headerMyRxLogo');
ImageKeysMap.set('headerMyPrescryptiveLogo', 'headerMyPrescryptiveLogo');
ImageKeysMap.set('sideMenuAvatarIcon', 'sideMenuAvatarIcon');
ImageKeysMap.set('alertCircle', 'alertCircle');
ImageKeysMap.set('errorCircle', 'errorCircle');
ImageKeysMap.set('yellowBang', 'yellowBang');
ImageKeysMap.set(
  'poweredByPrescryptivePurple120',
  'poweredByPrescryptivePurple120'
);
ImageKeysMap.set('diabetesVideoImage', 'diabetesVideoImage');
ImageKeysMap.set('stethoscopeIcon', 'stethoscopeIcon');
ImageKeysMap.set('pillCartIcon', 'pillCartIcon');
ImageKeysMap.set('pillHandIcon', 'pillHandIcon');
ImageKeysMap.set('lockIcon', 'lockIcon');
ImageKeysMap.set(
  'poweredByPrescryptiveLogoWhite',
  'poweredByPrescryptiveLogoWhite'
);
ImageKeysMap.set('sectionBackgroundImage', 'sectionBackgroundImage');
ImageKeysMap.set('sectionBackground', 'sectionBackground');
ImageKeysMap.set('smartpriceCardIcon', 'smartpriceCardIcon');
ImageKeysMap.set('virusSyringeIcon', 'virusSyringeIcon');
ImageKeysMap.set('pillBottleIcon', 'pillBottleIcon');
ImageKeysMap.set('newPrescriptionIcon', 'newPrescriptionIcon');
ImageKeysMap.set('dottedLine', 'dottedLine');
ImageKeysMap.set('couponLogo', 'couponLogo');
ImageKeysMap.set('semiCircle', 'semiCircle');
ImageKeysMap.set('couponIcon', 'couponIcon');
ImageKeysMap.set('emptyClaimsImage', 'emptyClaimsImage');
ImageKeysMap.set('emptyMedicineCabinet', 'emptyMedicineCabinet');
ImageKeysMap.set('prescryptiveBrand', 'prescryptiveBrand');
ImageKeysMap.set('prescryptiveBrandWhite', 'prescryptiveBrandWhite');
ImageKeysMap.set('rxIdCardFlower', 'rxIdCardFlower');
ImageKeysMap.set('rxIdSavingsCardPattern', 'rxIdSavingsCardPattern');
ImageKeysMap.set('myPrescryptiveLogo', 'myPrescryptiveLogo');
ImageKeysMap.set('prescryptiveLogo', 'prescryptiveLogo');
ImageKeysMap.set('claimReversal', 'claimReversal');
ImageKeysMap.set('profileIcon', 'profileIcon');

export const ObjectKeysMap = new Map<
  ObjectInstanceNames,
  ExpectedObjectFileKeys
>();
ObjectKeysMap.set('uiCMSContent', 'uiCMSContent');
