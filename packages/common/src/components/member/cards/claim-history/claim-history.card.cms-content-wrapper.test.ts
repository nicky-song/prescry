// Copyright 2022 Prescryptive Health, Inc.

import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { claimHistoryCardCMSContentWrapper } from './claim-history.card.cms-content-wrapper';
import { IClaimHistoryCardContent } from './claim-history.card.content';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('claimHistoryCardCMSContentWrapper', () => {
  it('has correct content', () => {
    const pharmacyMock = 'pharmacy-mock';
    const orderNumberMock = 'order-number-mock';
    const deductibleAppliedMock = 'deductible-applied-mock';
    const youPaidLabelMock = 'you-paid-label-mock';
    const dateFilledLabelMock = 'date-filled-label-mock';

    findContentValueMock.mockReturnValueOnce(pharmacyMock);
    findContentValueMock.mockReturnValueOnce(orderNumberMock);
    findContentValueMock.mockReturnValueOnce(deductibleAppliedMock);
    findContentValueMock.mockReturnValueOnce(youPaidLabelMock);
    findContentValueMock.mockReturnValueOnce(dateFilledLabelMock);

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
        CmsGroupKey.accumulatorsCard,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = claimHistoryCardCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.claimHistoryCard,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(5);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'pharmacy',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'order-number',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      3,
      'deductible-applied',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      4,
      'you-paid-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      5,
      'date-filled-label',
      uiContentMock
    );

    const expectedContent: IClaimHistoryCardContent = {
      pharmacy: pharmacyMock,
      orderNumber: orderNumberMock,
      deductibleApplied: deductibleAppliedMock,
      youPaidLabel: youPaidLabelMock,
      dateFilledLabel: dateFilledLabelMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
