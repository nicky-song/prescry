// Copyright 2022 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../../models/language';
import {
  IUIContent,
  IUIContentGroup,
} from '../../../../../../models/ui-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import {
  findContentValue,
  getContent,
} from '../../../../../../utils/content/cms-content-wrapper.helper';
import { ILowestPriceSlideUpModalContent } from './lowest-price.slide-up-modal.content';
import { lowestPriceSlideUpModalCMSContentWrapper } from './lowest-price.slide-up-modal.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('lowestPriceSlideUpModalCmsContentWrapper', () => {
  it('has correct content', () => {
    const expectedLowestPriceSlideUpModalCMSMock: ILowestPriceSlideUpModalContent =
      {
        heading: 'heading',
        description: 'description',
      };

    findContentValueMock.mockReturnValueOnce(
      expectedLowestPriceSlideUpModalCMSMock.heading
    );
    findContentValueMock.mockReturnValueOnce(
      expectedLowestPriceSlideUpModalCMSMock.description
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
        CmsGroupKey.lowestPriceSlideUpModal,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = lowestPriceSlideUpModalCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.lowestPriceSlideUpModal,
      2
    );

    const expectedFieldKeys = ['heading', 'description'];
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

    expect(result).toEqual(expectedLowestPriceSlideUpModalCMSMock);
  });
});
