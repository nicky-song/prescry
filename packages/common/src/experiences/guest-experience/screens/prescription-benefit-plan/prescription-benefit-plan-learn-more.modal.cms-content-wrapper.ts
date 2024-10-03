// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IPrescriptionBenefitPlanLearnMoreModal } from './prescription-benefit-plan-learn-more.modal.content';

export const prescriptionBenefitPlanLearnMoreModalCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IPrescriptionBenefitPlanLearnMoreModal => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.prescriptionBenefitPlanLearnMoreModal,
    2
  );
  return {
    heading: findContentValue('heading', uiContent),
    deductiblesTitle: findContentValue('deductibles-title', uiContent),
    deductiblesDescription: findContentValue(
      'deductibles-description',
      uiContent
    ),
    outOfPocketTitle: findContentValue('out-of-pocket-title', uiContent),
    outOfPocketDescription: findContentValue(
      'out-of-pocket-description',
      uiContent
    ),
  };
};
