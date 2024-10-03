// Copyright 2022 Prescryptive Health, Inc.

import { IPrescriptionPersonScreenContent } from './prescription-person.screen.content';
import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';

export const prescriptionPersonScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPrescriptionPersonScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.prescriptionPersonScreen,
    2
  );

  return {
    prescriptionPersonTitle: findContentValue(
      'prescription-person-title',
      uiContent
    ),
    firstPersonOption: findContentValue('first-person-option', uiContent),
    secondPersonOption: findContentValue('second-person-option', uiContent),
  };
};
