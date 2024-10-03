// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../../../models/language';
import { IUIContentGroup } from '../../../../../../models/ui-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { ILowestPriceSlideUpModalContent } from './lowest-price.slide-up-modal.content';

export const lowestPriceSlideUpModalCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ILowestPriceSlideUpModalContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.lowestPriceSlideUpModal,
    2
  );

  return {
    heading: findContentValue('heading', uiContent),
    description: findContentValue('description', uiContent),
  };
};
