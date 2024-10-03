// Copyright 2022 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { findYourPharmacyContentWrapper } from './find-your-pharmacy.cms-content-wrapper';
import { IFindPharmacyContent } from './find-your-pharmacy.screen.content';

jest.mock('../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('findYourPharmacyContentWrapper', () => {
  it('has correct content', () => {
    const placeholderMock = 'place-holder-label-mock';
    const searchresultsMock = 'search-results-label-mock';
    const headerMock = 'header-label-mock';
    const subHeaderMock = 'sub-header-label-mock';
    const displayMoreMock = 'display-more-label-mock';
    const backToTheTopMock = 'back-to-the-top-label-mock';

    findContentValueMock.mockReturnValueOnce(placeholderMock);
    findContentValueMock.mockReturnValueOnce(searchresultsMock);
    findContentValueMock.mockReturnValueOnce(headerMock);
    findContentValueMock.mockReturnValueOnce(subHeaderMock);
    findContentValueMock.mockReturnValueOnce(displayMoreMock);
    findContentValueMock.mockReturnValueOnce(backToTheTopMock);

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
        CmsGroupKey.findYourPharmacy,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = findYourPharmacyContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.findYourPharmacy,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(6);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'place-holder-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'search-results-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      3,
      'header-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      4,
      'sub-header-label',
      uiContentMock
    );

    expect(findContentValueMock).toHaveBeenNthCalledWith(
      5,
      'display-more-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      6,
      'back-to-the-top-label',
      uiContentMock
    );

    const expectedContent: IFindPharmacyContent = {
      placeholder: placeholderMock,
      searchresults: searchresultsMock,
      header: headerMock,
      subHeader: subHeaderMock,
      displayMore: displayMoreMock,
      backToTheTop: backToTheTopMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
