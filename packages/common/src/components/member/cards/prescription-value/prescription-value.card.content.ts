// Copyright 2021 Prescryptive Health, Inc.

export interface IPrescriptionValueCardContent {
  bestValue: string;
  youPay: string;
  planPays: string;
  emailDeliveryLabel: string;
  estimatedPriceLabel: string;
  priceLabel: string;
  mailDelivery: string;
  distanceInMiles: (distance: number) => string;
}

export const prescriptionValueCardContent: IPrescriptionValueCardContent = {
  bestValue: 'Best value',
  youPay: 'You pay',
  planPays: 'Plan pays',
  priceLabel: 'Price',
  estimatedPriceLabel: 'Estimated price',
  emailDeliveryLabel: 'Mail delivery',
  mailDelivery: 'Mail delivery',
  distanceInMiles: (distance: number) => `${distance} miles`,
};
