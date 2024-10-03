// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IGreatPriceScreenContent } from './great-price.screen.content';

export const greatPriceScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IGreatPriceScreenContent => {
  const uiContent = getContent(language, content, CmsGroupKey.greatPrice, 2);

  return {
    title: findContentValue('title', uiContent),
    description: findContentValue('description', uiContent),
    doneButton: findContentValue('done-button', uiContent),
  };
};
