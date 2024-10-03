// Copyright 2023 Prescryptive Health, Inc.

import { IRxIdCardSectionContent } from '../../../../../../models/cms-content/rx-id-card-section';
import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';

export const rxIdCardSectionWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IRxIdCardSectionContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.rxIdCardSection,
    2
  );

  return {
    pbmTitle: findContentValue('pbm-title', uiContent),
    pbmDescription: findContentValue('pbm-description', uiContent),
    smartPriceTitle: findContentValue('smart-price-title', uiContent),
    smartPriceDescription: findContentValue(
      'smart-price-description',
      uiContent
    ),
  };
};
