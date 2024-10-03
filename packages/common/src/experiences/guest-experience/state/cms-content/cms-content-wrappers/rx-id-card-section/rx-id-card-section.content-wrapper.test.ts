// Copyright 2023 Prescryptive Health, Inc.

import { IRxIdCardSectionContent } from '../../../../../../models/cms-content/rx-id-card-section';
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
import { rxIdCardSectionWrapper } from './rx-id-card-section.content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('rxIdCardSectionContentWrapper', () => {
  it('has correct content', () => {
    const rxIdCardSectionContentKeys: IRxIdCardSectionContent = {
      pbmTitle: 'pbm-title',
      pbmDescription: 'pbm-description',
      smartPriceTitle: 'smart-price-title',
      smartPriceDescription: 'smart-price-description',
    };

    const rxIdCardSectionContentSectionVals = Object.values(
      rxIdCardSectionContentKeys
    );

    rxIdCardSectionContentSectionVals.forEach((val) => {
      findContentValueMock.mockReturnValueOnce(val);
    });

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
        CmsGroupKey.rxIdCardSection,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = rxIdCardSectionWrapper(defaultLanguage, cmsContentMapMock);

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.rxIdCardSection,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(
      Object.keys(rxIdCardSectionContentKeys).length
    );

    rxIdCardSectionContentSectionVals.forEach((val) => {
      expect(findContentValueMock).toHaveBeenCalledWith(val, uiContentMock);
    });

    expect(result).toEqual(rxIdCardSectionContentKeys);
  });
});
