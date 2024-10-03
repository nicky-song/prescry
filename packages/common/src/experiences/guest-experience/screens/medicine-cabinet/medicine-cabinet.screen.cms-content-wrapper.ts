// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';
import { IUIContentGroup } from '../../../../models/ui-content';
import {
  getContent,
  findContentValue,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IMedicineCabinetScreenContent } from './medicine-cabinet.screen.content';

export const medicineCabinetScreenCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IMedicineCabinetScreenContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.medicineCabinetScreen,
    2
  );

  return {
    prescriptionBenefitPlanLink: findContentValue(
      'prescription-benefit-plan-link',
      uiContent
    ),
    title: findContentValue('title', uiContent),
    seeMorePrescriptionsLink: findContentValue(
      'see-more-prescriptions',
      uiContent
    ),
    noPrescriptionText: findContentValue('no-prescription-text', uiContent),
    howToSendPrescriptionText: findContentValue(
      'how-to-send-prescription-text',
      uiContent
    ),
    transferExistingPrescriptionHeading: findContentValue(
      'transfer-existing-prescription-heading',
      uiContent
    ),
    transferExistingPrescriptionText: findContentValue(
      'transfer-existing-prescription-text',
      uiContent
    ),
    sayTheWordPrescryptiveHeading: findContentValue(
      'say-the-word-prescryptive-heading',
      uiContent
    ),
    sayTheWordPrescryptiveText: findContentValue(
      'say-the-word-prescryptive-text',
      uiContent
    ),
    transferAPrescriptionLink: findContentValue(
      'transfer-a-prescription-link',
      uiContent
    ),
    learnMoreModalText: findContentValue('learn-more-modal-text', uiContent),
    learnMoreModalHeading: findContentValue(
      'learn-more-modal-heading',
      uiContent
    ),
    learnMoreText: findContentValue('learn-more-text', uiContent),
    loadingPrescriptionsText: findContentValue(
      'loading-prescriptions-text',
      uiContent
    ),
  };
};
