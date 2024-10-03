// Copyright 2023 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IClaimReversalSlideUpModalContent } from './claim-reversal.slide-up-modal.content';

export const claimReversalSlideUpModalCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IClaimReversalSlideUpModalContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.claimReversalSlideUpModal,
    2
  );

  return {
    heading: findContentValue('heading', uiContent),
    headingOne: findContentValue('heading-one', uiContent),
    descriptionOne: findContentValue('description-one', uiContent),
    headingTwo: findContentValue('heading-two', uiContent),
    descriptionTwo: findContentValue('description-two', uiContent),
    headingThree: findContentValue('heading-three', uiContent),
    descriptionThree: findContentValue('description-three', uiContent),
  };
};
