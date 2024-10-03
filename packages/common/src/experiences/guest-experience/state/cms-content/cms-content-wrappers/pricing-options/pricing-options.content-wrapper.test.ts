// Copyright 2023 Prescryptive Health, Inc.

import { IPricingOptionContent } from '../../../../../../models/cms-content/pricing-options.content';
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
import { pricingOptionsWrapper } from './pricing-options.content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('pricingOptionsContentWrapper', () => {
  it('has correct content', () => {
    const pricingOptionsContentKeys: IPricingOptionContent = {
      pbmTitle: 'pbm-title',
      pbmSubText: 'pbm-sub-text',
      smartPriceTitle: 'smart-price-title',
      smartPriceSubText: 'smart-price-sub-text',
      thirdPartyTitle: 'third-party-title',
      thirdPartySubText: 'third-party-sub-text',
      noPriceLabel: 'no-price-label',
      pricingOptionsTitle: 'pricing-options-title',
      pricingOptionsDescription: 'pricing-options-description',
      pricingOptionsFooterLabel: 'pricing-options-footer-label',
    };

    const pricingOptionsContentSectionVals = Object.values(
      pricingOptionsContentKeys
    );

    pricingOptionsContentSectionVals.forEach((val) => {
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
        CmsGroupKey.pricingOptions,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = pricingOptionsWrapper(defaultLanguage, cmsContentMapMock);

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.pricingOptions,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(
      Object.keys(pricingOptionsContentKeys).length
    );

    pricingOptionsContentSectionVals.forEach((val) => {
      expect(findContentValueMock).toHaveBeenCalledWith(val, uiContentMock);
    });

    expect(result).toEqual(pricingOptionsContentKeys);
  });
});
