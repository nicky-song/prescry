// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../../../../models/ui-content';
import { IVerifyPrescriptionCMSContent } from '../../../../../../models/cms-content/verify-prescription.cms-content';
import { Language } from '../../../../../../models/language';
import { CmsGroupKey } from '../../cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';

export const verifyPrescriptionCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IVerifyPrescriptionCMSContent => {
  const uiContent = getContent(
    language,
    content,
    CmsGroupKey.verifyPrescription,
    2
  );

  return {
    verifyPrescriptionHeader: findContentValue(
      'verify-prescription-header',
      uiContent
    ),
    verifyPrescriptionContent: findContentValue(
      'verify-prescription-content',
      uiContent
    ),
    prescriptionArrivalNotice: findContentValue(
      'prescription-arrival-notice',
      uiContent
    ),
    prescriptionInfoHeader: findContentValue(
      'prescription-info-header',
      uiContent
    ),
    prescriptionNumberText: findContentValue(
      'prescription-number-text',
      uiContent
    ),
    prescriptionNumberPlaceholder: findContentValue(
      'prescription-number-placeholder',
      uiContent
    ),
    addressComponentHeaderText: findContentValue(
      'address-component-header-text',
      uiContent
    ),
    needMoreInformationNotice: findContentValue(
      'need-more-information-notice',
      uiContent
    ),
  };
};
