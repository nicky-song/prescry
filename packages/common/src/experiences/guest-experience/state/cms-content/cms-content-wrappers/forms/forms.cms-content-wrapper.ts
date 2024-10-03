// Copyright 2022 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../../../../models/ui-content';
import { CmsGroupKey } from '../../cms-group-key';
import { Language } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { IFormsContent } from '../../../../../../models/cms-content/forms.ui-content';

export const formsCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IFormsContent => {
  const uiContent = getContent(language, content, CmsGroupKey.forms, 2);

  return {
    dayLabel: findContentValue('day-label', uiContent),
    monthLabel: findContentValue('month-label', uiContent),
    yearLabel: findContentValue('year-label', uiContent),
    dobLabel: findContentValue('dob-label', uiContent),
    ageNotMetError: findContentValue('age-not-met-error', uiContent),
    months: {
      januaryLabel: findContentValue('january-label', uiContent),
      februaryLabel: findContentValue('february-label', uiContent),
      marchLabel: findContentValue('march-label', uiContent),
      aprilLabel: findContentValue('april-label', uiContent),
      mayLabel: findContentValue('may-label', uiContent),
      juneLabel: findContentValue('june-label', uiContent),
      julyLabel: findContentValue('july-label', uiContent),
      augustLabel: findContentValue('august-label', uiContent),
      septemberLabel: findContentValue('september-label', uiContent),
      octoberLabel: findContentValue('october-label', uiContent),
      novemberLabel: findContentValue('november-label', uiContent),
      decemberLabel: findContentValue('december-label', uiContent),
    },
    phoneNumberLabel: findContentValue('phone-number-label', uiContent),
    phoneNumberPlaceholder: findContentValue(
      'phone-number-placeholder',
      uiContent
    ),
  };
};
