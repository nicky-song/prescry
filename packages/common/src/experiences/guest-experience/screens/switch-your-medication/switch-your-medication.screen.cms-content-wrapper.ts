// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { ISwitchYourMedicationScreenContent } from './switch-your-medication.screen.content';

export const switchYourMedicationScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): ISwitchYourMedicationScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.switchYourMedication,
    2
  );

  return {
    title: findContentValue('title', uiContent),
    switchingMedicationLabel: findContentValue(
      'switching-medication-label',
      uiContent
    ),
    combinationTitle: findContentValue('combination-title', uiContent),
    singleTitle: findContentValue('single-title', uiContent),
    description: findContentValue('description', uiContent),
    callButtonLabel: findContentValue('call-button-label', uiContent),
    actionButtonLabel: findContentValue('action-button-label', uiContent),
  };
};
