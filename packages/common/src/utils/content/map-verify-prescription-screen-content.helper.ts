// Copyright 2022 Prescryptive Health, Inc.

import { IVerifyPrescriptionScreenContent } from '../../models/cms-content/verify-prescription-screen.ui-content';
import { IVerifyPrescriptionCMSContent } from '../../models/cms-content/verify-prescription.cms-content';

export const mapVerifyPrscriptionScreenContent = (
  uiContent: IVerifyPrescriptionCMSContent
): IVerifyPrescriptionScreenContent => {
  return {
    verifyPrescriptionHeader: uiContent.verifyPrescriptionHeader,
    verifyPrescriptionContent: uiContent.verifyPrescriptionContent,
    prescriptionArrivalNotice: uiContent.prescriptionArrivalNotice,
    prescriptionInfoHeader: uiContent.prescriptionInfoHeader,
    quantityLabel: 'qty',
    daysLabel: 'days',
    prescriptionNumberText: uiContent.prescriptionNumberText,
    prescriptionNumberPlaceholder: uiContent.prescriptionNumberPlaceholder,
    submitButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    addressComponentHeaderText: uiContent.addressComponentHeaderText,
    fromLabel: 'From',
    toLabel: 'To',
    needMoreInformationNotice: uiContent.needMoreInformationNotice,
  };
};
