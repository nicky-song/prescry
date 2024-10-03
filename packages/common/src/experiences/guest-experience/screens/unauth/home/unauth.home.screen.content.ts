// Copyright 2021 Prescryptive Health, Inc.

import { Language } from '../../../../../models/language';
import { IUIContentGroup } from '../../../../../models/ui-content';
import { homePageCMSContentWrapper } from '../../../state/cms-content/cms-content-wrappers/home-page/home-page.cms-content-wrapper';

export interface IUnauthHomeScreenContent {
  heading: string;
  drugSearchCardTitle: string;
  drugSearchCardSubtitle: string;
  drugSearchCardButtonLabel: string;
  prescriptionBenefitsTitle: string;
  prescriptionBenefitsDescription: string;
  getStarted: string;
  healthcareTechnologySectionTitle: string;
  healthcareTechnologySectionDescription: string;
  ownPrescriptionsTitle: string;
  ownPrescriptionsDescription: string;
  shopToSaveTitle: string;
  shopToSaveDescription: string;
  trustedCliniciansTitle: string;
  trustedCliniciansDescription: string;
  secureTitle: string;
  secureDescription: string;
  learnMore: string;
  privacyPolicy: string;
  termsAndConditions: string;
  clinicalServicesHeader: string;
  clinicalServicesDescription: string;
  clinicalServicesButton: string;
  smartPriceHeader: string;
  smartPriceDescription: string;
  smartPriceButton: string;
  clinicalServicesLearnMoreTitle: string;
  clinicalServicesBullet1: string;
  clinicalServicesBullet2: string;
  clinicalServicesBullet3: string;
  clinicalServicesIcon: string;
  smartPriceLearnMoreTitle: string;
  smartPriceBullet1: string;
  smartPriceBullet2: string;
  smartPriceBullet3: string;
  smartPriceIcon: string;
}

export const unauthHomeScreenContent = (
  uiCMSContentMap: Map<string, IUIContentGroup>,
  language: Language
): IUnauthHomeScreenContent => {
  const homeUIContent = homePageCMSContentWrapper(language, uiCMSContentMap);

  return {
    heading: homeUIContent.homeHeader,
    drugSearchCardTitle: homeUIContent.homeSearchHeader,
    drugSearchCardSubtitle: homeUIContent.homeSearchDescription,
    drugSearchCardButtonLabel: homeUIContent.homeSearchButton,
    prescriptionBenefitsTitle: homeUIContent.pbmHeader,
    prescriptionBenefitsDescription: homeUIContent.pbmDescription,
    getStarted: homeUIContent.pbmButton,
    healthcareTechnologySectionTitle: homeUIContent.homeUVPHeader,
    healthcareTechnologySectionDescription: homeUIContent.homeUVPDescription,
    ownPrescriptionsTitle: homeUIContent.homeUVP1Header,
    ownPrescriptionsDescription: homeUIContent.homeUVP1Description,
    shopToSaveTitle: homeUIContent.homeUVP2Header,
    shopToSaveDescription: homeUIContent.homeUVP2Description,
    trustedCliniciansTitle: homeUIContent.homeUVP3Header,
    trustedCliniciansDescription: homeUIContent.homeUVP3Description,
    secureTitle: homeUIContent.homeUVP4Header,
    secureDescription: homeUIContent.homeUVP4Description,
    learnMore: homeUIContent.learnMore,
    privacyPolicy: homeUIContent.privacyPolicy,
    termsAndConditions: homeUIContent.termsAndConditions,
    clinicalServicesHeader: homeUIContent.clinicalServicesHeader,
    clinicalServicesDescription: homeUIContent.clinicalServicesDescription,
    clinicalServicesButton: homeUIContent.clinicalServicesButton,
    smartPriceHeader: homeUIContent.smartPriceHeader,
    smartPriceDescription: homeUIContent.smartPriceDescription,
    smartPriceButton: homeUIContent.smartPriceButton,
    clinicalServicesLearnMoreTitle:
      homeUIContent.clinicalServicesLearnMoreTitle,
    clinicalServicesBullet1: homeUIContent.clinicalServicesBullet1,
    clinicalServicesBullet2: homeUIContent.clinicalServicesBullet2,
    clinicalServicesBullet3: homeUIContent.clinicalServicesBullet3,
    clinicalServicesIcon: 'virusSyringeIcon',
    smartPriceLearnMoreTitle: homeUIContent.smartPriceLearnMoreTitle,
    smartPriceBullet1: homeUIContent.smartPriceBullet1,
    smartPriceBullet2: homeUIContent.smartPriceBullet2,
    smartPriceBullet3: homeUIContent.smartPriceBullet3,
    smartPriceIcon: 'smartpriceCardIcon',
  };
};
