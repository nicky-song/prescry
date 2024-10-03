// Copyright 2022 Prescryptive Health, Inc.

import { IVerifyPrescriptionCMSContent } from '../../models/cms-content/verify-prescription.cms-content';
import { IVerifyPrescriptionScreenContent } from '../../models/cms-content/verify-prescription-screen.ui-content';
import { mapVerifyPrscriptionScreenContent } from './map-verify-prescription-screen-content.helper';

const verifyPrescriptionCMSMock: IVerifyPrescriptionCMSContent = {
  verifyPrescriptionHeader: 'verify-prescription-header-mock',
  verifyPrescriptionContent: 'verify-prescription-content-mock',
  prescriptionArrivalNotice: 'prescription-arrival-notice-mock',
  prescriptionInfoHeader: 'prescription-info-header-mock',
  prescriptionNumberText: 'prescription-number-text-mock',
  prescriptionNumberPlaceholder: 'prescription-number-placeholder-mock',
  addressComponentHeaderText: 'address-component-header-text-mock',
  needMoreInformationNotice: 'need-more-information-notice-mock',
};

describe('mapWhatComesNextContent', () => {
  it('should map the correct ui content from cms content', () => {
    const expectedVerifyPrescriptionContentMock: IVerifyPrescriptionScreenContent =
      {
        verifyPrescriptionHeader:
          verifyPrescriptionCMSMock.verifyPrescriptionHeader,
        verifyPrescriptionContent:
          verifyPrescriptionCMSMock.verifyPrescriptionContent,
        prescriptionArrivalNotice:
          verifyPrescriptionCMSMock.prescriptionArrivalNotice,
        prescriptionInfoHeader:
          verifyPrescriptionCMSMock.prescriptionInfoHeader,
        quantityLabel: 'qty',
        daysLabel: 'days',
        prescriptionNumberText:
          verifyPrescriptionCMSMock.prescriptionNumberText,
        prescriptionNumberPlaceholder:
          verifyPrescriptionCMSMock.prescriptionNumberPlaceholder,
        submitButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        addressComponentHeaderText:
          verifyPrescriptionCMSMock.addressComponentHeaderText,
        fromLabel: 'From',
        toLabel: 'To',
        needMoreInformationNotice:
          verifyPrescriptionCMSMock.needMoreInformationNotice,
      };

    const result = mapVerifyPrscriptionScreenContent(verifyPrescriptionCMSMock);

    expect(result).toEqual(expectedVerifyPrescriptionContentMock);
  });
});
