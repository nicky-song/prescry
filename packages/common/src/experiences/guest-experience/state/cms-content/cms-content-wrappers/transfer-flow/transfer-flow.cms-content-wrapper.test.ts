// Copyright 2021 Prescryptive Health, Inc.

import { ITransferFlowCMSContent } from '../../../../../../models/cms-content/transfer-flow.cms-content';
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
import { transferFlowCMSContentWrapper } from './transfer-flow.cms-content-wrapper';

jest.mock('../../../../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('transferFlowCMSContentWrapper', () => {
  it('has correct content', () => {
    const expectedContent: ITransferFlowCMSContent = {
      mailOrderPharmacyDescription: 'pharmacy-description-mail-order-mock',
      outOfNetworkPharmacyDescription:
        'pharmacy-description-out-of-network-mock',
      deliveryInfoHeader: 'delivery-info-header-mock',
      deliveryInfoDescription: 'delivery-info-description-mock',
      couponDeliveryInfoDescription: 'delivery-info-coupon-description-mock',
      pickUpHeader: 'pick-up-header-mock',
      sendButton: 'send-button-mock',
      estimatedPriceNoticeText: 'estimated-price-notice-text-mock',
    };

    findContentValueMock.mockReturnValueOnce(
      expectedContent.mailOrderPharmacyDescription
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.outOfNetworkPharmacyDescription
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.deliveryInfoHeader
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.deliveryInfoDescription
    );
    findContentValueMock.mockReturnValueOnce(
      expectedContent.couponDeliveryInfoDescription
    );
    findContentValueMock.mockReturnValueOnce(expectedContent.pickUpHeader);
    findContentValueMock.mockReturnValueOnce(expectedContent.sendButton);
    findContentValueMock.mockReturnValueOnce(
      expectedContent.estimatedPriceNoticeText
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
        CmsGroupKey.prescriptionPersonScreen,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const result = transferFlowCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.transferFlow,
      2
    );

    const expectedFieldKeys = [
      'pharmacy-description-mail-order',
      'pharmacy-description-out-of-network',
      'delivery-info-header',
      'delivery-info-description',
      'delivery-info-coupon-description',
      'pick-up-header',
      'send-to-pharmacy',
      'estimated-price-notice-text',
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

    expect(result).toEqual(expectedContent);
  });
});
