// Copyright 2021 Prescryptive Health, Inc.

import { IWhatComesNextCMSContent } from '../../../../../../models/cms-content/what-comes-next.cms-content';
import { defaultLanguage } from '../../../../../../models/language';
import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../cms-group-key';
import { whatComesNextCMSContentWrapper } from './what-comes-next.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('whatComesNextCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedContent: IWhatComesNextCMSContent = {
      whatComesNextAnotherPharmacy: 'another-pharmacy-mock',
      whatComesNextAnotherPharmacySubtitle: 'another-pharmacy-subtitle-mock',
      whatComesNextNewPrescription: 'new-prescription-mock',
      whatComesNextNewPrescriptionSubtitle: 'new-prescrition-subtitle-mock',
      prescriptionAtThisPharmacyInstructionsText:
        'prescription-at-this-pharmacy-instructions-text-mock',
      prescriptionAtThisPharmacyHeadingText:
        'prescription-at-this-pharmacy-heading-text-mock',
      prescriptionAtThisPharmacyUnAuthInformationText:
        'prescription-at-this-pharmacy-unauth-information-text-mock',
      prescriptionAtThisPharmacySignUpText:
        'prescription-at-this-pharmacy-signup-text-mock',
    };

    findContentValueMock.mockReturnValueOnce(
      expectedContent.whatComesNextAnotherPharmacy
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.whatComesNextAnotherPharmacySubtitle
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.whatComesNextNewPrescription
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.whatComesNextNewPrescriptionSubtitle
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescriptionAtThisPharmacyInstructionsText
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescriptionAtThisPharmacyHeadingText
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescriptionAtThisPharmacyUnAuthInformationText
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescriptionAtThisPharmacySignUpText
    );

    const uiContentMock: IUIContent[] = [
      {
        fieldKey: 'field-key',
        language: 'English',
        type: 'Text',
        value: 'value',
      },
    ];
    getContentMock.mockReturnValue(uiContentMock);

    const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
      [
        CmsGroupKey.whatComesNext,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = whatComesNextCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.whatComesNext,
      2
    );

    const expectedFieldKeys = [
      'what-comes-next-another-pharmacy',
      'what-comes-next-another-pharmacy-subtitle',
      'what-comes-next-new-prescription',
      'what-comes-next-new-prescription-subtitle',
      'prescription-at-this-pharmacy-instructions-text',
      'prescription-at-this-pharmacy-heading-text',
      'prescription-at-this-pharmacy-unauth-information-text',
      'prescription-at-this-pharmacy-signup-text',
    ];
    expect(findContentValueMock).toHaveBeenCalledTimes(
      expectedFieldKeys.length
    );
    expectedFieldKeys.forEach((key, index) => {
      expect(findContentValueMock).toHaveBeenNthCalledWith(
        index + 1,
        key,
        uiContentMock
      );
    });

    expect(result).toEqual(expectedContent);
  });
});
