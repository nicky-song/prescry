// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import {
  IPrescriptionPriceSectionContent,
  prescriptionPriceSectionCMSContentWrapper,
} from './prescription-price-section.cms-content-wrapper';

jest.mock('../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('prescriptionPriceSectionCMSContentWrapper', () => {
  it('has correct content', () => {
    const prescriptionPriceSectionContentKeys: IPrescriptionPriceSectionContent =
      {
        price: 'price',
        noPrice: 'no-price',
        youPay: 'you-pay',
        planPays: 'plan-pays',
        assistanceProgram: 'assistance-program',
        contactPharmacyForPricing: 'contact-pharmacy-for-pricing',
        skeletonPlaceHolder: 'skeleton-place-holder',
        withInsurance: 'with-insurance',
        verifyRealPrice: 'verify-real-price',
        totalPrice: 'total-price',
      };

    const prescriptionPriceSectionVals = Object.values(
      prescriptionPriceSectionContentKeys
    );

    prescriptionPriceSectionVals.forEach((val) => {
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
        CmsGroupKey.prescriptionPriceSection,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = prescriptionPriceSectionCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.prescriptionPriceSection,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(10);

    prescriptionPriceSectionVals.forEach((val) => {
      expect(findContentValueMock).toHaveBeenCalledWith(val, uiContentMock);
    });

    expect(result).toEqual(prescriptionPriceSectionContentKeys);
  });
});
