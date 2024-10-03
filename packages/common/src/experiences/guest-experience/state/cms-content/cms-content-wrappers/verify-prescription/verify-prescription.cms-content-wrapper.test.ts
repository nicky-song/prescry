// Copyright 2021 Prescryptive Health, Inc.

import { IVerifyPrescriptionCMSContent } from '../../../../../../models/cms-content/verify-prescription.cms-content';
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
import { verifyPrescriptionCMSContentWrapper } from './verify-prescription.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('verifyPrescriptionCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedContent: IVerifyPrescriptionCMSContent = {
      verifyPrescriptionHeader: 'verify-prescription-header-mock',
      verifyPrescriptionContent: 'verify-prescription-content-mock',
      prescriptionArrivalNotice: 'prescription-arrival-notice-mock',
      prescriptionInfoHeader: 'prescription-info-header-mock',
      prescriptionNumberText: 'prescription-number-text-mock',
      prescriptionNumberPlaceholder: 'prescription-number-placeholder-mock',
      addressComponentHeaderText: 'address-component-header-text-mock',
      needMoreInformationNotice: 'need-more-information-notice-mock',
    };

    findContentValueMock.mockReturnValueOnce(
      expectedContent.verifyPrescriptionHeader
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.verifyPrescriptionContent
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescriptionArrivalNotice
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescriptionInfoHeader
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescriptionNumberText
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.prescriptionNumberPlaceholder
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.addressComponentHeaderText
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.needMoreInformationNotice
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
        CmsGroupKey.verifyPrescription,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = verifyPrescriptionCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.verifyPrescription,
      2
    );

    const expectedFieldKeys = [
      'verify-prescription-header',
      'verify-prescription-content',
      'prescription-arrival-notice',
      'prescription-info-header',
      'prescription-number-text',
      'prescription-number-placeholder',
      'address-component-header-text',
      'need-more-information-notice',
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
