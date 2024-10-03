// Copyright 2022 Prescryptive Health, Inc.

import { ITransferFlowCMSContent } from '../../models/cms-content/transfer-flow.cms-content';
import { mapTransferFlowContent } from './map-transfer-flow-content.helper';

const transferFlowCMSMock: ITransferFlowCMSContent = {
  mailOrderPharmacyDescription: 'pharmacy-description-mail-order-mock',
  outOfNetworkPharmacyDescription: 'pharmacy-description-out-of-network-mock',
  deliveryInfoHeader: 'delivery-info-header-mock',
  deliveryInfoDescription: 'delivery-info-description-mock',
  couponDeliveryInfoDescription: 'delivery-info-coupon-description-mock',
  pickUpHeader: 'pick-up-header-mock',
  sendButton: 'send-button-mock',
  estimatedPriceNoticeText: 'estimated-price-notice-text-mock',
};

describe('mapSmartPriceScreenContent', () => {
  it('should map the correct ui content from cms content', () => {
    const expectedTransferFlowContentMock = {
      hoursNotSpecified: 'Hours not specified',
      pharmacyHoursHeading: 'Pharmacy hours',
      pharmacyInfoHeading: 'Pharmacy info',
      sendButton: transferFlowCMSMock.sendButton,
      title: 'Order preview',
      premierDescription: transferFlowCMSMock.mailOrderPharmacyDescription,
      mailDelivery: 'Mail delivery',
      mailOrderInstructions: expect.any(Function),
      outOfNetworkDescription:
        transferFlowCMSMock.outOfNetworkPharmacyDescription,
      outOfNetworkPrefix: 'Out of network.',
      deliveryInfoHeader: transferFlowCMSMock.deliveryInfoHeader,
      deliveryInfoDescription: transferFlowCMSMock.deliveryInfoDescription,
      couponDeliveryInfoDescription:
        transferFlowCMSMock.couponDeliveryInfoDescription,
      pickUpHeader: transferFlowCMSMock.pickUpHeader,
      estimatedPriceNoticeText: transferFlowCMSMock.estimatedPriceNoticeText,
    };

    const result = mapTransferFlowContent(transferFlowCMSMock);

    expect(result).toEqual(expectedTransferFlowContentMock);
  });
});
