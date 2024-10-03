// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { Language } from '../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IDigitalIdCardScreenContent } from './digital-id-card.screen.content';

export const digitalIdCardScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IDigitalIdCardScreenContent => {
  const uiContent = getContent(language, content, CmsGroupKey.digitalIdCard, 2);

  return {
    title: findContentValue('title', uiContent),
    preamble: findContentValue('preamble', uiContent),
    issuerNumber: findContentValue('issuer-number', uiContent),
  };
};
