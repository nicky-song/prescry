// Copyright 2021 Prescryptive Health, Inc.

import { IHomePageCMSContent } from '../../../../../../models/cms-content/home-page.cms-content';
import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';

export const homePageCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IHomePageCMSContent => {
  const uiContent = getContent(language, content, CmsGroupKey.homePage, 2);

  return {
    homeHeader: findContentValue('unauth-home-header', uiContent),
    homeSearchHeader: findContentValue('unauth-home-search-header', uiContent),
    homeSearchDescription: findContentValue(
      'unauth-home-search-description',
      uiContent
    ),
    homeSearchButton: findContentValue('unauth-home-search-button', uiContent),
    pbmHeader: findContentValue('pbm-header', uiContent),
    pbmDescription: findContentValue('pbm-description', uiContent),
    pbmButton: findContentValue('pbm-button', uiContent),
    homeUVPHeader: findContentValue('unauth-home-uvp-header', uiContent),
    homeUVPDescription: findContentValue(
      'unauth-home-uvp-description',
      uiContent
    ),
    homeUVP1Header: findContentValue('unauth-home-uvp-1-header', uiContent),
    homeUVP1Description: findContentValue(
      'unauth-home-uvp-1-description',
      uiContent
    ),
    homeUVP2Header: findContentValue('unauth-home-uvp-2-header', uiContent),
    homeUVP2Description: findContentValue(
      'unauth-home-uvp-2-description',
      uiContent
    ),
    homeUVP3Header: findContentValue('unauth-home-uvp-3-header', uiContent),
    homeUVP3Description: findContentValue(
      'unauth-home-uvp-3-description',
      uiContent
    ),
    homeUVP4Header: findContentValue('unauth-home-uvp-4-header', uiContent),
    homeUVP4Description: findContentValue(
      'unauth-home-uvp-4-description',
      uiContent
    ),
    clinicalServicesHeader: findContentValue(
      'unauth-clinical-services-header',
      uiContent
    ),
    clinicalServicesDescription: findContentValue(
      'unauth-clinical-services-description',
      uiContent
    ),
    clinicalServicesButton: findContentValue(
      'unauth-clinical-services-button',
      uiContent
    ),
    smartPriceHeader: findContentValue('unauth-smartprice-header', uiContent),
    smartPriceDescription: findContentValue(
      'unauth-smartprice-description',
      uiContent
    ),
    smartPriceButton: findContentValue('unauth-smartprice-button', uiContent),
    learnMore: findContentValue('learn-more', uiContent),
    privacyPolicy: findContentValue('privacy-policy', uiContent),
    termsAndConditions: findContentValue('t-&-c', uiContent),
    clinicalServicesLearnMoreTitle: findContentValue(
      'unauth-clinical-services-learn-more-title',
      uiContent
    ),
    clinicalServicesBullet1: findContentValue(
      'unauth-clinical-services-bullet-1',
      uiContent
    ),
    clinicalServicesBullet2: findContentValue(
      'unauth-clinical-services-bullet-2',
      uiContent
    ),
    clinicalServicesBullet3: findContentValue(
      'unauth-clinical-services-bullet-3',
      uiContent
    ),
    smartPriceLearnMoreTitle: findContentValue(
      'unauth-smartprice-learn-more-title',
      uiContent
    ),
    smartPriceBullet1: findContentValue(
      'unauth-smartprice-bullet-1',
      uiContent
    ),
    smartPriceBullet2: findContentValue(
      'unauth-smartprice-bullet-2',
      uiContent
    ),
    smartPriceBullet3: findContentValue(
      'unauth-smartprice-bullet-3',
      uiContent
    ),
  };
};
