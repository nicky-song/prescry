// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { Language } from '../../../models/language';
import { IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { IAlternativeSavingsCardContent } from './alternative-savings.card.content';

export const alternativeSavingsCardCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IAlternativeSavingsCardContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.alternativeSavingsCard
  );

  return {
    message: findContentValue('message', uiContent),
  };
};
