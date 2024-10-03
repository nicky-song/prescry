// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from '../../../../../../models/ui-content';
import { IWhatComesNextCMSContent } from '../../../../../../models/cms-content/what-comes-next.cms-content';
import { Language } from '../../../../../../models/language';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';

export const whatComesNextCMSContentWrapper = (
  language: Language,
  content: Map<string, IUIContentGroup> | undefined
): IWhatComesNextCMSContent => {
  const uiContent = getContent(language, content, CmsGroupKey.whatComesNext, 2);

  return {
    whatComesNextAnotherPharmacy: findContentValue(
      'what-comes-next-another-pharmacy',
      uiContent
    ),
    whatComesNextAnotherPharmacySubtitle: findContentValue(
      'what-comes-next-another-pharmacy-subtitle',
      uiContent
    ),
    whatComesNextNewPrescription: findContentValue(
      'what-comes-next-new-prescription',
      uiContent
    ),
    whatComesNextNewPrescriptionSubtitle: findContentValue(
      'what-comes-next-new-prescription-subtitle',
      uiContent
    ),
    prescriptionAtThisPharmacyInstructionsText: findContentValue(
      'prescription-at-this-pharmacy-instructions-text',
      uiContent
    ),
    prescriptionAtThisPharmacyHeadingText: findContentValue(
      'prescription-at-this-pharmacy-heading-text',
      uiContent
    ),
    prescriptionAtThisPharmacyUnAuthInformationText: findContentValue(
      'prescription-at-this-pharmacy-unauth-information-text',
      uiContent
    ),
    prescriptionAtThisPharmacySignUpText: findContentValue(
      'prescription-at-this-pharmacy-signup-text',
      uiContent
    ),
  };
};
