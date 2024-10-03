// Copyright 2021 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IDigitalIdCardScreenContent } from './digital-id-card.screen.content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { digitalIdCardScreenCMSContentWrapper } from './digital-id-card.screen.cms-content-wrapper';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('digitalIdCardScreenCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedContent: IDigitalIdCardScreenContent = {
      title: 'title-mock',
      preamble: 'preamble-mock',
      issuerNumber: 'issuer-number-mock',
    };

    findContentValueMock.mockReturnValueOnce(expectedContent.title);
    findContentValueMock.mockReturnValueOnce(expectedContent.preamble);
    findContentValueMock.mockReturnValueOnce(expectedContent.issuerNumber);

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
        CmsGroupKey.digitalIdCard,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = digitalIdCardScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.digitalIdCard,
      2
    );

    const expectedFieldKeys = ['title', 'preamble', 'issuer-number'];

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
