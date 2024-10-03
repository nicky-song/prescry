// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { keepCurrentPrescriptionSectionCMSContentWrapper } from './keep-current-prescription.section.cms-content-wrapper';
import { IKeepCurrentPrescriptionSectionContent } from './keep-current-prescription.section.content';

jest.mock('../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('keepCurrentPrescriptionSectionCmsContentWrapper', () => {
  it('has correct content', () => {
    const expectedKeepCurrentPrescriptionSectionCMSMock: IKeepCurrentPrescriptionSectionContent =
      {
        heading: 'heading',
        description: 'description',
        buttonLabel: 'button-label',
      };

    findContentValueMock.mockReturnValueOnce(
      expectedKeepCurrentPrescriptionSectionCMSMock.heading
    );
    findContentValueMock.mockReturnValueOnce(
      expectedKeepCurrentPrescriptionSectionCMSMock.description
    );
    findContentValueMock.mockReturnValueOnce(
      expectedKeepCurrentPrescriptionSectionCMSMock.buttonLabel
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
        CmsGroupKey.keepCurrentPrescriptionSection,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = keepCurrentPrescriptionSectionCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.keepCurrentPrescriptionSection,
      2
    );

    const expectedFieldKeys = ['heading', 'description', 'button-label'];
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

    expect(result).toEqual(expectedKeepCurrentPrescriptionSectionCMSMock);
  });
});
