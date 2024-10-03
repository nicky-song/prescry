// Copyright 2023 Prescryptive Health, Inc.

import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { ISmartPriceSectionContent } from './smart-price.section.content';

export const smartPriceSectionCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ISmartPriceSectionContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.smartPriceSection,
    2
  );

  return {
    heading: findContentValue('heading', uiContent),
    description: findContentValue('description', uiContent),
    learnMore: findContentValue('learn-more', uiContent),
  };
};
