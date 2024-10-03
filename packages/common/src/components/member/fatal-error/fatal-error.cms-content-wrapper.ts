// Copyright 2023 Prescryptive Health, Inc.

import { Language } from '../../../models/language';
import { IUIContentGroup } from '../../../models/ui-content';
import { IFatalErrorContent } from './fatal-error.content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { findContentValue, getContent } from '../../../utils/content/cms-content-wrapper.helper';

export const fatalErrorCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IFatalErrorContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.fatalError,
    2
  );

  return {
    loadingError: findContentValue(
      'fatal-error-loading',
      uiContent
    ),
    errorContact: findContentValue(
      'fatal-error-contact',
      uiContent
    ),
  };
};
