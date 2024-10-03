// Copyright 2022 Prescryptive Health, Inc.

import { ITransferFlowCMSContent } from '../../models/cms-content/transfer-flow.cms-content';
import { ITransferFlowContent } from '../../experiences/guest-experience/screens/shopping/order-preview/transfer-flow.ui-content.model';

export const mapTransferFlowContent = (
  uiContent: ITransferFlowCMSContent
): ITransferFlowContent => {
  return {
    hoursNotSpecified: 'Hours not specified',
    pharmacyHoursHeading: 'Pharmacy hours',
    pharmacyInfoHeading: 'Pharmacy info',
    sendButton: uiContent.sendButton,
    title: 'Order preview',
    premierDescription: uiContent.mailOrderPharmacyDescription,
    mailDelivery: 'Mail delivery',
    mailOrderInstructions: (pharmacyName: string) =>
      `Once your order is submitted, ${pharmacyName} will contact you to verify your eligibility and determine if you qualify for a patient assistance program.\n\nIf you decide to follow through with your order, they will arrange for payment and shipment.`,
    outOfNetworkDescription: uiContent.outOfNetworkPharmacyDescription,
    outOfNetworkPrefix: 'Out of network.',
    deliveryInfoHeader: uiContent.deliveryInfoHeader,
    deliveryInfoDescription: uiContent.deliveryInfoDescription,
    couponDeliveryInfoDescription: uiContent.couponDeliveryInfoDescription,
    pickUpHeader: uiContent.pickUpHeader,
    estimatedPriceNoticeText: uiContent.estimatedPriceNoticeText,
  };
};
