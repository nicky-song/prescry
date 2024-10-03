// Copyright 2022 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../../../../models/ui-content';
import { CmsGroupKey } from '../../cms-group-key';
import { Language } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { IAlternativesContent } from '../../../../../../models/cms-content/alternatives-content';

export const alternativesCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IAlternativesContent => {
  const uiContent = getContent(language, content, CmsGroupKey.alternatives, 2);

  return {
    pricingAt: findContentValue('pricing-at', uiContent),
  };
};
