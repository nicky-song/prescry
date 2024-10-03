// Copyright 2021 Prescryptive Health, Inc.

import { ExpectedFileKeys } from '../theming/assets';
import { ImageSourcePropType } from 'react-native';
import { initializeImageAssets } from '../utils/assets.helper';

import alertCircle from '../../../myrx/assets/images/alert-circle.png';
import brand from '../../../myrx/assets/images/brand.svg';
import brandBackground from '../../../myrx/assets/images/brand-background.svg';
import couponIcon from '../../../myrx/assets/images/coupon-icon.svg';
import closeGreyButton from '../../../myrx/assets/images/close-grey-button.png';
import closeWhiteButton from '../../../myrx/assets/images/close-white-button.png';
import diabetesVideoImage from '../../../myrx/assets/images/video-image.png';
import dollarMagnifier from '../../../myrx/assets/images/dollar-magnifier.svg';
import errorCircle from '../../../myrx/assets/images/error-circle.png';
import headerBackButton from '../../../myrx/assets/images/header-back-button.png';
import headerMyRxLogo from '../../../myrx/assets/images/header-myrx-logo.svg';
import headerMyPrescryptiveLogo from '../../../myrx/assets/images/header-myprescryptive-logo.svg';
import poweredByPrescryptivePurple120 from '../../../myrx/assets/images/powered-by-prescryptive-purple-120.svg';
import sideMenuAvatarIcon from '../../../myrx/assets/images/ic-profile.svg';
import splashScreen from '../../../myrx/assets/images/splash-screen-background-image-with-logo.png';
import yellowBang from '../../../myrx/assets/images/yellowBang.png';
import stethoscopeIcon from '../../../myrx/assets/images/stethoscope-icon.svg';
import pillCartIcon from '../../../myrx/assets/images/pill-cart-icon.svg';
import pillHandIcon from '../../../myrx/assets/images/pill-hand-icon.svg';
import lockIcon from '../../../myrx/assets/images/lock-icon.svg';
import newPrescriptionIcon from '../../../myrx/assets/images/new-prescription-icon.svg';
import pillBottleIcon from '../../../myrx/assets/images/pill-bottle-icon.svg';
import poweredByPrescryptiveLogoWhite from '../../../myrx/assets/images/powered-by-prescryptive-logo-white.svg';
import sectionBackgroundImage from '../../../myrx/assets/images/section-background-image.svg';
import sectionBackground from '../../../myrx/assets/images/section-background.svg';
import smartpriceCardIcon from '../../../myrx/assets/images/smartprice-card-icon.png';
import virusSyringeIcon from '../../../myrx/assets/images/virus-syringe-icon.svg';
import emptyMedicineCabinet from '../../../myrx/assets/images/empty-medcab.svg';
import emptyClaimsImage from '../../../myrx/assets/images/empty-claims.svg';
import prescryptiveBrand from '../../../myrx/assets/images/prescryptive-brand.svg';
import prescryptiveBrandWhite from '../../../myrx/assets/images/prescryptive-brand-white.svg';
import rxIdCardFlower from '../../../myrx/assets/images/rx-id-card-flower.svg';
import rxIdSavingsCardPattern from '../../../myrx/assets/images/rx-id-savings-card-pattern.svg';
import myPrescryptiveLogo from '../../../myrx/assets/images/myPrescryptive_logo.svg';
import prescryptiveLogo from '../../../myrx/assets/images/prescryptive-logo.svg';
import profileIcon from '../../../myrx/assets/images/profile-icon.svg';

export const StorybookFileSourcesMap = new Map<
  ExpectedFileKeys,
  ImageSourcePropType
>();

StorybookFileSourcesMap.set('alertCircle', alertCircle);
StorybookFileSourcesMap.set('brand', brand);
StorybookFileSourcesMap.set('brandBackground', brandBackground);
StorybookFileSourcesMap.set('closeGreyButton', closeGreyButton);
StorybookFileSourcesMap.set('closeWhiteButton', closeWhiteButton);
StorybookFileSourcesMap.set('couponIcon', couponIcon);
StorybookFileSourcesMap.set('diabetesVideoImage', diabetesVideoImage);
StorybookFileSourcesMap.set('dollarMagnifier', dollarMagnifier);
StorybookFileSourcesMap.set('errorCircle', errorCircle);
StorybookFileSourcesMap.set('headerMyRxLogo', headerMyRxLogo);
StorybookFileSourcesMap.set(
  'headerMyPrescryptiveLogo',
  headerMyPrescryptiveLogo
);
StorybookFileSourcesMap.set('leftArrow', headerBackButton);
StorybookFileSourcesMap.set(
  'poweredByPrescryptivePurple120',
  poweredByPrescryptivePurple120
);
StorybookFileSourcesMap.set('sideMenuAvatarIcon', sideMenuAvatarIcon);
StorybookFileSourcesMap.set('splashScreen', splashScreen);
StorybookFileSourcesMap.set('yellowBang', yellowBang);
StorybookFileSourcesMap.set('stethoscopeIcon', stethoscopeIcon);
StorybookFileSourcesMap.set('pillCartIcon', pillCartIcon);
StorybookFileSourcesMap.set('pillHandIcon', pillHandIcon);
StorybookFileSourcesMap.set('lockIcon', lockIcon);
StorybookFileSourcesMap.set('pillBottleIcon', pillBottleIcon);
StorybookFileSourcesMap.set('newPrescriptionIcon', newPrescriptionIcon);
StorybookFileSourcesMap.set(
  'poweredByPrescryptiveLogoWhite',
  poweredByPrescryptiveLogoWhite
);
StorybookFileSourcesMap.set('sectionBackgroundImage', sectionBackgroundImage);
StorybookFileSourcesMap.set('sectionBackground', sectionBackground);
StorybookFileSourcesMap.set('smartpriceCardIcon', smartpriceCardIcon);
StorybookFileSourcesMap.set('virusSyringeIcon', virusSyringeIcon);
StorybookFileSourcesMap.set('emptyClaimsImage', emptyClaimsImage);
StorybookFileSourcesMap.set('emptyMedicineCabinet', emptyMedicineCabinet);
StorybookFileSourcesMap.set('prescryptiveBrand', prescryptiveBrand);
StorybookFileSourcesMap.set('prescryptiveBrandWhite', prescryptiveBrandWhite);
StorybookFileSourcesMap.set('rxIdCardFlower', rxIdCardFlower);
StorybookFileSourcesMap.set('rxIdSavingsCardPattern', rxIdSavingsCardPattern);
StorybookFileSourcesMap.set('myPrescryptiveLogo', myPrescryptiveLogo);
StorybookFileSourcesMap.set('prescryptiveLogo', prescryptiveLogo);
StorybookFileSourcesMap.set('profileIcon', profileIcon);
initializeImageAssets(StorybookFileSourcesMap);
