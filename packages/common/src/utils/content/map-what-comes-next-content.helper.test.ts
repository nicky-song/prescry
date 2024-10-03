// Copyright 2022 Prescryptive Health, Inc.

import { IWhatComesNextCMSContent } from '../../models/cms-content/what-comes-next.cms-content';
import { mapWhatComesNextContent } from './map-what-comes-next-content.helper';
import { IWhatComesNextScreenContent } from '../../models/cms-content/what-comes-next-ui-content.model';

const whatComesNextCMSContentMock: IWhatComesNextCMSContent = {
  whatComesNextAnotherPharmacy: 'what-comes-next-another-pharmacy-es-mock',
  whatComesNextAnotherPharmacySubtitle:
    'what-comes-next-another-pharmacy-subtitle-es-mock',
  whatComesNextNewPrescription: 'what-comes-next-new-prescription-es-mock',
  whatComesNextNewPrescriptionSubtitle:
    'what-comes-next-new-prescription-subtitle-es-mock',
  prescriptionAtThisPharmacyInstructionsText:
    'prescription-at-this-pharmacy-instructions-text-es-mock',
  prescriptionAtThisPharmacyHeadingText:
    'prescription-at-this-pharmacy-heading-text-es-mock',
  prescriptionAtThisPharmacyUnAuthInformationText:
    'prescription-at-this-pharmacy-unauth-information-text-es-mock',
  prescriptionAtThisPharmacySignUpText:
    'prescription-at-this-pharmacy-signup-text-es-mock',
};

describe('mapWhatComesNextContent', () => {
  it('should map the correct ui content from cms content', () => {
    const expectedWhatComesNextContentMock: IWhatComesNextScreenContent = {
      anotherPharmacyLabel:
        whatComesNextCMSContentMock.whatComesNextAnotherPharmacy,
      anotherPharmacySubtitle:
        whatComesNextCMSContentMock.whatComesNextAnotherPharmacySubtitle,
      newPrescriptionLabel:
        whatComesNextCMSContentMock.whatComesNextNewPrescription,
      newPrescriptionSubtitle:
        whatComesNextCMSContentMock.whatComesNextNewPrescriptionSubtitle,
      getStartedLabel: 'Get started',
      prescriptionAtThisPharmacy: {
        instructions:
          whatComesNextCMSContentMock.prescriptionAtThisPharmacyInstructionsText,
        heading:
          whatComesNextCMSContentMock.prescriptionAtThisPharmacyHeadingText,
        unAuthInformation:
          whatComesNextCMSContentMock.prescriptionAtThisPharmacyUnAuthInformationText,
        signUpButtonLabel:
          whatComesNextCMSContentMock.prescriptionAtThisPharmacySignUpText,
      },
    };

    const result = mapWhatComesNextContent(whatComesNextCMSContentMock);

    expect(result).toEqual(expectedWhatComesNextContentMock);
  });
});
