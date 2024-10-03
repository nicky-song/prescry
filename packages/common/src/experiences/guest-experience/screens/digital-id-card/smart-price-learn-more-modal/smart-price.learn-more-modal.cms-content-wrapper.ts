// Copyright 2023 Prescryptive Health, Inc.

import { Language } from '../../../../../models/language';
import { IUIContentGroup } from '../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { ISmartPriceLearnMoreModalContent } from './smart-price.learn-more-modal.content';

export const smartPriceLearnMoreModalCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ISmartPriceLearnMoreModalContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.smartPriceLearnMoreModal,
    2
  );

  return {
    heading: findContentValue('heading', uiContent),
    headingOneA: findContentValue('heading-one-a', uiContent),
    headingOneB: findContentValue('heading-one-b', uiContent),
    descriptionOne: findContentValue('description-one', uiContent),
    headingTwoA: findContentValue('heading-two-a', uiContent),
    headingTwoB: findContentValue('heading-two-b', uiContent),
    headingTwoC: findContentValue('heading-two-c', uiContent),
    descriptionTwo: findContentValue('description-two', uiContent),
  };
};
