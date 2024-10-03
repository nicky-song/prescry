// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { Language } from '../../../models/language';
import { IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { IDrugDetailsTextContent } from './drug-details.text.content';

export const drugDetailsTextCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IDrugDetailsTextContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.drugDetailsText,
    2
  );

  return {
    asOf: findContentValue('as-of', uiContent),
    daySingle: findContentValue('day-single', uiContent),
    dayPlural: findContentValue('day-plural', uiContent),
    refillSingle: findContentValue('refill-single', uiContent),
    refillPlural: findContentValue('refill-plural', uiContent),
  };
};
