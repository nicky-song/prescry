// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionPersonScreenContent } from './prescription-person.screen.content';
import { prescriptionPersonScreenCMSContentWrapper } from './prescription-person.screen.cms-content-wrapper';
import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('prescriptionPersonScreenCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedPrescriptionPersonCMSMock: IPrescriptionPersonScreenContent =
      {
        prescriptionPersonTitle: 'prescription-person-title-mock',
        firstPersonOption: 'first-person-option-mock',
        secondPersonOption: 'second-person-option-mock',
      };

    findContentValueMock.mockReturnValueOnce(
      expectedPrescriptionPersonCMSMock.prescriptionPersonTitle
    );
    findContentValueMock.mockReturnValueOnce(
      expectedPrescriptionPersonCMSMock.firstPersonOption
    );
    findContentValueMock.mockReturnValueOnce(
      expectedPrescriptionPersonCMSMock.secondPersonOption
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
        CmsGroupKey.prescriptionPersonScreen,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = prescriptionPersonScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.prescriptionPersonScreen,
      2
    );

    const expectedFieldKeys = [
      'prescription-person-title',
      'first-person-option',
      'second-person-option',
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

    expect(result).toEqual(expectedPrescriptionPersonCMSMock);
  });
});
