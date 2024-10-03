// Copyright 2022 Prescryptive Health, Inc.

import { greatPriceScreenCMSContentWrapper } from './great-price.screen.cms-content-wrapper';
import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { IGreatPriceScreenContent } from './great-price.screen.content';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('greatPriceScreenCmsContentWrapper', () => {
  it('has correct content', () => {
    const expectedGreatPriceCMSMock: IGreatPriceScreenContent = {
      title: 'title',
      description: 'description',
      doneButton: 'done-button',
    };

    findContentValueMock.mockReturnValueOnce(expectedGreatPriceCMSMock.title);
    findContentValueMock.mockReturnValueOnce(
      expectedGreatPriceCMSMock.description
    );
    findContentValueMock.mockReturnValueOnce(
      expectedGreatPriceCMSMock.doneButton
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
        CmsGroupKey.greatPrice,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = greatPriceScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.greatPrice,
      2
    );

    const expectedFieldKeys = ['title', 'description', 'done-button'];
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

    expect(result).toEqual(expectedGreatPriceCMSMock);
  });
});
