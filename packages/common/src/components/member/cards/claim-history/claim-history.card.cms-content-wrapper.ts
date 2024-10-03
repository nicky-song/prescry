// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import {
  getContent,
  findContentValue,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IClaimHistoryCardContent } from './claim-history.card.content';

export const claimHistoryCardCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IClaimHistoryCardContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.claimHistoryCard,
    2
  );

  return {
    pharmacy: findContentValue('pharmacy', uiContent),
    orderNumber: findContentValue('order-number', uiContent),
    deductibleApplied: findContentValue('deductible-applied', uiContent),
    youPaidLabel: findContentValue('you-paid-label', uiContent),
    dateFilledLabel: findContentValue('date-filled-label', uiContent),
  };
};
