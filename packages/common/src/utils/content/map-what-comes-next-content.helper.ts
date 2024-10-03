// Copyright 2022 Prescryptive Health, Inc.

import { IWhatComesNextScreenContent } from '../../models/cms-content/what-comes-next-ui-content.model';
import { IWhatComesNextCMSContent } from '../../models/cms-content/what-comes-next.cms-content';

export const mapWhatComesNextContent = (
  uiContent: IWhatComesNextCMSContent
): IWhatComesNextScreenContent => {
  return {
    anotherPharmacyLabel: uiContent.whatComesNextAnotherPharmacy,
    anotherPharmacySubtitle: uiContent.whatComesNextAnotherPharmacySubtitle,
    newPrescriptionLabel: uiContent.whatComesNextNewPrescription,
    newPrescriptionSubtitle: uiContent.whatComesNextNewPrescriptionSubtitle,
    getStartedLabel: 'Get started',
    prescriptionAtThisPharmacy: {
      instructions: uiContent.prescriptionAtThisPharmacyInstructionsText,
      heading: uiContent.prescriptionAtThisPharmacyHeadingText,
      unAuthInformation:
        uiContent.prescriptionAtThisPharmacyUnAuthInformationText,
      signUpButtonLabel: uiContent.prescriptionAtThisPharmacySignUpText,
    },
  };
};
