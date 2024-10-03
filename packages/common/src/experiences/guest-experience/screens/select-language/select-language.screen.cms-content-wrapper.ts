// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { ISelectLanguageScreenContent } from './select-language.screen.content';

export const selectLanguageScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ISelectLanguageScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.selectLanguage,
    2
  );

  return {
    selectLanguageTitle: findContentValue(
      'select-language-title',
      uiContent
    ),
  };
};
