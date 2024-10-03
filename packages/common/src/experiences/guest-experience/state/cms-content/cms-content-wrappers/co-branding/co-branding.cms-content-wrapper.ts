// Copyright 2022 Prescryptive Health, Inc.

import { ICobrandingContent } from '../../../../../../models/cms-content/co-branding.ui-content';
import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';

export const coBrandingCMSContentWrapper = (
  groupKey: string,
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ICobrandingContent => {
  const uiContent = getContent(language, content, groupKey);

  return {
    logo: findContentValue('logo', uiContent),
    interstitialContent: findContentValue('interstitial-content', uiContent),
    idCardLogo: findContentValue('id-card-logo', uiContent),
    idCardHeaderColor: findContentValue('id-card-header-color', uiContent),
    recommendedAltsSlideUpModalHeading: findContentValue(
      'recommended-alts-slide-up-modal-heading',
      uiContent
    ),
    recommendedAltsSlideUpModalContent: findContentValue(
      'recommended-alts-slide-up-modal-content',
      uiContent
    ),
    switchYourMedsDescription: findContentValue(
      'switch-your-meds-description',
      uiContent
    ),
    switchYourMedsProviderName: findContentValue(
      'switch-your-meds-provider-name',
      uiContent
    ),
    switchYourMedsCallButtonLabel: findContentValue(
      'switch-your-meds-call-button-label',
      uiContent
    ),
    switchYourMedsPhoneNumber: findContentValue(
      'switch-your-meds-phone-number',
      uiContent
    ),
  };
};
