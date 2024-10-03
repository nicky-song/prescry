// Copyright 2022 Prescryptive Health, Inc.

import {
  ExpectedFileKeys,
  ExpectedObjectFileKeys,
} from '@phx/common/src/theming/assets';
import { ImageSourcePropType } from 'react-native';
import alertCircle from '../../assets/images/alert-circle.png';
import brand from '../../assets/images/brand.svg';
import brandBackground from '../../assets/images/brand-background.svg';
import closeGreyButton from '../../assets/images/close-grey-button.png';
import closeWhiteButton from '../../assets/images/close-white-button.png';
import diabetesVideoImage from '../../assets/images/video-image.png';
import dollarMagnifier from '../../assets/images/dollar-magnifier.svg';
import errorCircle from '../../assets/images/error-circle.png';
import headerBackButton from '../../assets/images/header-back-button.png';
import headerMyRxLogo from '../../assets/images/header-myrx-logo.svg';
import headerMyPrescryptiveLogo from '../../assets/images/header-myprescryptive-logo.svg';
import poweredByPrescryptivePurple120 from '../../assets/images/powered-by-prescryptive-purple-120.svg';
import sideMenuAvatarIcon from '../../assets/images/ic-profile.svg';
import splashScreen from '../../assets/images/splash-screen-background-image-with-logo.png';
import yellowBang from '../../assets/images/yellowBang.png';
import stethoscopeIcon from '../../assets/images/stethoscope-icon.svg';
import pillCartIcon from '../../assets/images/pill-cart-icon.svg';
import pillHandIcon from '../../assets/images/pill-hand-icon.svg';
import lockIcon from '../../assets/images/lock-icon.svg';
import poweredByPrescryptiveLogoWhite from '../../assets/images/powered-by-prescryptive-logo-white.svg';
import sectionBackgroundImage from '../../assets/images/section-background-image.svg';
import sectionBackground from '../../assets/images/section-background.svg';
import smartpriceCaedIcon from '../../assets/images/smartprice-card-icon.png';
import virusSyringeIcon from '../../assets/images/virus-syringe-icon.svg';
import pillBottleIcon from '../../assets/images/pill-bottle-icon.svg';
import newPrescriptionIcon from '../../assets/images/new-prescription-icon.svg';
import dottedLine from '../../assets/images/dotted-line.svg';
import couponLogo from '../../assets/images/coupon-logo.png';
import semiCircle from '../../assets/images/semi-circle.svg';
import couponIcon from '../../assets/images/coupon-icon.svg';
import uiCMSContent from '../../assets/json/ui-cms-content.json';
import emptyMedicineCabinet from '../../assets/images/empty-medcab.svg';
import emptyClaimsImage from '../../assets/images/empty-claims.svg';
import prescryptiveBrand from '../../assets/images/prescryptive-brand.svg';
import prescryptiveBrandWhite from '../../assets/images/prescryptive-brand-white.svg';
import rxIdCardFlower from '../../assets/images/rx-id-card-flower.svg';
import rxIdSavingsCardPattern from '../../assets/images/rx-id-savings-card-pattern.svg';
import myPrescryptiveLogo from '../../assets/images/myPrescryptive_logo.svg';
import prescryptiveLogo from '../../../myrx/assets/images/prescryptive-logo.svg';
import claimReversal from '../../assets/images/claim-reversal.svg';
import profileIcon from '../../assets/images/profile-icon.svg';

export const LocalFileSourcesMap = new Map<
  ExpectedFileKeys,
  ImageSourcePropType
>();
LocalFileSourcesMap.set('alertCircle', alertCircle);
LocalFileSourcesMap.set('brand', brand);
LocalFileSourcesMap.set('brandBackground', brandBackground);
LocalFileSourcesMap.set('closeGreyButton', closeGreyButton);
LocalFileSourcesMap.set('closeWhiteButton', closeWhiteButton);
LocalFileSourcesMap.set('diabetesVideoImage', diabetesVideoImage);
LocalFileSourcesMap.set('dollarMagnifier', dollarMagnifier);
LocalFileSourcesMap.set('errorCircle', errorCircle);
LocalFileSourcesMap.set('headerMyRxLogo', headerMyRxLogo);
LocalFileSourcesMap.set('headerMyPrescryptiveLogo', headerMyPrescryptiveLogo);
LocalFileSourcesMap.set('leftArrow', headerBackButton);
LocalFileSourcesMap.set(
  'poweredByPrescryptivePurple120',
  poweredByPrescryptivePurple120
);
LocalFileSourcesMap.set('sideMenuAvatarIcon', sideMenuAvatarIcon);
LocalFileSourcesMap.set('splashScreen', splashScreen);
LocalFileSourcesMap.set('yellowBang', yellowBang);
LocalFileSourcesMap.set('stethoscopeIcon', stethoscopeIcon);
LocalFileSourcesMap.set('pillCartIcon', pillCartIcon);
LocalFileSourcesMap.set('pillHandIcon', pillHandIcon);
LocalFileSourcesMap.set('lockIcon', lockIcon);
LocalFileSourcesMap.set(
  'poweredByPrescryptiveLogoWhite',
  poweredByPrescryptiveLogoWhite
);
LocalFileSourcesMap.set('sectionBackgroundImage', sectionBackgroundImage);
LocalFileSourcesMap.set('sectionBackground', sectionBackground);
LocalFileSourcesMap.set('smartpriceCardIcon', smartpriceCaedIcon);
LocalFileSourcesMap.set('virusSyringeIcon', virusSyringeIcon);
LocalFileSourcesMap.set('newPrescriptionIcon', newPrescriptionIcon);
LocalFileSourcesMap.set('pillBottleIcon', pillBottleIcon);
LocalFileSourcesMap.set('dottedLine', dottedLine);
LocalFileSourcesMap.set('couponLogo', couponLogo);
LocalFileSourcesMap.set('semiCircle', semiCircle);
LocalFileSourcesMap.set('couponIcon', couponIcon);
LocalFileSourcesMap.set('emptyClaimsImage', emptyClaimsImage);
LocalFileSourcesMap.set('emptyMedicineCabinet', emptyMedicineCabinet);
LocalFileSourcesMap.set('prescryptiveBrand', prescryptiveBrand);
LocalFileSourcesMap.set('prescryptiveBrandWhite', prescryptiveBrandWhite);
LocalFileSourcesMap.set('rxIdCardFlower', rxIdCardFlower);
LocalFileSourcesMap.set('rxIdSavingsCardPattern', rxIdSavingsCardPattern);
LocalFileSourcesMap.set('myPrescryptiveLogo', myPrescryptiveLogo);
LocalFileSourcesMap.set('prescryptiveLogo', prescryptiveLogo);
LocalFileSourcesMap.set('claimReversal', claimReversal);
LocalFileSourcesMap.set('profileIcon', profileIcon);

export const LocalStaticFileSourcesMap = new Map<
  ExpectedObjectFileKeys,
  unknown[]
>();

LocalStaticFileSourcesMap.set('uiCMSContent', uiCMSContent);
