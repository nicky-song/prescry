// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IPrescriptionBenefitPlanScreenContent } from './prescription-benefit-plan.screen.content';

export const prescriptionBenefitPlanScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPrescriptionBenefitPlanScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.prescriptionBenefitPlanScreen,
    2
  );

  return {
    claimHistoryLink: findContentValue('claim-history-link', uiContent),
    title: findContentValue('title', uiContent),
    learnMoreText: findContentValue('learn-more-text', uiContent),
    openPlanDetails: findContentValue('open-plan-details', uiContent),
    openPlanDetailsNotAvailable: findContentValue(
      'open-plan-details-not-available',
      uiContent
    ),
  };
};
