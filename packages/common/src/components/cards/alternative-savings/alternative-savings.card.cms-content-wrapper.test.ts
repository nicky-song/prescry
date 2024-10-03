// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { alternativeSavingsCardCMSContentWrapper } from './alternative-savings.card.cms-content-wrapper';
import { IAlternativeSavingsCardContent } from './alternative-savings.card.content';

jest.mock('../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('coBrandingCMSContentWrapper', () => {
  it('has correct content', () => {
    const alternativeSavingsCardIdMock = CmsGroupKey.alternativeSavingsCard;

    const expectedAlternativeSavingsCardCMSContentMock: IAlternativeSavingsCardContent =
      {
        message: 'message-mock',
      };

    findContentValueMock.mockReturnValueOnce(
      expectedAlternativeSavingsCardCMSContentMock.message
    );

    const uiContentMock: IUIContent[] = [
      {
        fieldKey: 'field-key',
        language: 'English',
        type: 'RichText',
        value: 'value',
      },
    ];

    getContentMock.mockReturnValue(uiContentMock);

    const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
      [
        alternativeSavingsCardIdMock,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = alternativeSavingsCardCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      alternativeSavingsCardIdMock
    );

    const expectedFieldKeys = ['message'];

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

    expect(result).toEqual(expectedAlternativeSavingsCardCMSContentMock);
  });
});
