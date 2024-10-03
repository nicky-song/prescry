// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../models/language';
import { IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IPrescribedMedicationContent } from './prescribed-medication-content';

export const prescribedMedicationCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPrescribedMedicationContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.prescribedMedication,
    2
  );

  return {
    title: findContentValue('title', uiContent),
    youPay: findContentValue('you-pay', uiContent),
    planPays: findContentValue('plan-pays', uiContent),
    sentToMessage: findContentValue('sent-to-message', uiContent),
    estimatedPriceMessage: findContentValue(
      'estimated-price-message',
      uiContent
    ),
    sendToText: findContentValue('send-to-text', uiContent),
  };
};
