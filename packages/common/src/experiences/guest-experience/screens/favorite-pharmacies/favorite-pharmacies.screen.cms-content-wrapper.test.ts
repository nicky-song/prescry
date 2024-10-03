// Copyright 2022 Prescryptive Health, Inc.

import {
  favoritePharmaciesScreenCMSContentWrapper,
  IFavoritePharmaciesScreenContent,
} from './favorite-pharmacies.screen.cms-content-wrapper';
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

describe('favoritePharmaciesScreenCmsContentWrapper', () => {
  it('has correct content', () => {
    const expectedFavoritePharmaciesCMSMock: IFavoritePharmaciesScreenContent =
      {
        favoritePharmaciesTitle: 'favorite-pharmacies-title-mock',
        favoritePharmaciesErrorMessage:
          'favorite-pharmacies-error-message-mock',
      };

    findContentValueMock.mockReturnValueOnce(
      expectedFavoritePharmaciesCMSMock.favoritePharmaciesTitle
    );
    findContentValueMock.mockReturnValueOnce(
      expectedFavoritePharmaciesCMSMock.favoritePharmaciesErrorMessage
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
        CmsGroupKey.favoritePharmaciesScreen,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = favoritePharmaciesScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.favoritePharmaciesScreen,
      2
    );

    const expectedFieldKeys = [
      'favorite-pharmacies-title',
      'favorite-pharmacies-error-message',
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

    expect(result).toEqual(expectedFavoritePharmaciesCMSMock);
  });
});
