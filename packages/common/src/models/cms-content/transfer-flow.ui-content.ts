// Copyright 2022 Prescryptive Health, Inc.

export interface ITransferFlowContent {
  hoursNotSpecified: string;
  pharmacyHoursHeading: string;
  pharmacyInfoHeading: string;
  sendButton: string;
  title: string;
  premierDescription: string;
  mailDelivery: string;
  mailOrderInstructions: (pharmacyName: string) => string;
  outOfNetworkDescription: string;
  outOfNetworkPrefix: string;
  deliveryInfoHeader: string;
  deliveryInfoDescription: string;
  couponDeliveryInfoDescription: string;
  pickUpHeader: string;
  estimatedPriceNoticeText: string;
}
