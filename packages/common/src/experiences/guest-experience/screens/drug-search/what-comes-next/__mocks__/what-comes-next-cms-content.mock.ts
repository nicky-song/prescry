// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentGroup } from './../../../../../../models/ui-content';
import { IWhatComesNextCMSContent } from '../../../../../../models/cms-content/what-comes-next.cms-content';

export const whatComesNextCMSContentMock: IWhatComesNextCMSContent = {
  whatComesNextAnotherPharmacy: 'what-comes-next-another-pharmacy-mock',
  whatComesNextAnotherPharmacySubtitle:
    'what-comes-next-another-pharmacy-subtitle-mock',
  whatComesNextNewPrescription: 'what-comes-next-new-prescription-mock',
  whatComesNextNewPrescriptionSubtitle:
    'what-comes-next-new-prescription-subtitle-mock',
  prescriptionAtThisPharmacyInstructionsText:
    'prescription-at-this-pharmacy-instructions-text-mock',
  prescriptionAtThisPharmacyHeadingText:
    'prescription-at-this-pharmacy-heading-text-mock',
  prescriptionAtThisPharmacyUnAuthInformationText:
    'prescription-at-this-pharmacy-unauth-information-text-mock',
  prescriptionAtThisPharmacySignUpText:
    'prescription-at-this-pharmacy-signup-text-mock',
};

export const cmsContentWithWhatComesNextMock: Map<string, IUIContentGroup> =
  new Map([
    [
      'what-comes-next',
      {
        content: [
          {
            fieldKey: 'what-comes-next-another-pharmacy',
            language: 'English',
            type: 'text',
            value: 'what-comes-next-another-pharmacy-mock',
          },
          {
            fieldKey: 'what-comes-next-another-pharmacy-subtitle',
            language: 'English',
            type: 'text',
            value: 'what-comes-next-another-pharmacy-subtitle-mock',
          },
          {
            fieldKey: 'what-comes-next-new-prescription',
            language: 'English',
            type: 'text',
            value: 'what-comes-next-new-prescription-mock',
          },
          {
            fieldKey: 'what-comes-next-new-prescription-subtitle',
            language: 'English',
            type: 'text',
            value: 'what-comes-next-new-prescription-subtitle-mock',
          },
          {
            fieldKey: 'prescription-at-this-pharmacy-instructions-text',
            language: 'English',
            type: 'text',
            value: 'prescription-at-this-pharmacy-instructions-text-mock',
          },
          {
            fieldKey: 'prescription-at-this-pharmacy-heading-text',
            language: 'English',
            type: 'text',
            value: 'prescription-at-this-pharmacy-heading-text-mock',
          },
          {
            fieldKey: 'prescription-at-this-pharmacy-unauth-information-text',
            language: 'English',
            type: 'text',
            value: 'prescription-at-this-pharmacy-unauth-information-text-mock',
          },
          {
            fieldKey: 'prescription-at-this-pharmacy-signup-text',
            language: 'English',
            type: 'text',
            value: 'prescription-at-this-pharmacy-signup-text-mock',
          },
        ],
        lastUpdated: 0,
        isContentLoading: true,
      },
    ],
  ]);
