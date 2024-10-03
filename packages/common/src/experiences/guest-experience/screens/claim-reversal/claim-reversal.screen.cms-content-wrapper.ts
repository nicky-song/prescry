// Copyright 2023 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IClaimReversalScreenContent } from './claim-reversal.screen.content';

export const claimReversalScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IClaimReversalScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.claimReversalScreen,
    2
  );

  return {
    pharmacyPlaceholder: findContentValue('pharmacy-placeholder', uiContent),
    heading: findContentValue('heading', uiContent),
    descriptionOne: findContentValue('description-one', uiContent),
    descriptionTwo: findContentValue('description-two', uiContent),
    learnMore: findContentValue('learn-more', uiContent),
    phoneButton: findContentValue('phone-button', uiContent),
    homeButton: findContentValue('home-button', uiContent),
  };
};
