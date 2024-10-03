// Copyright 2021 Prescryptive Health, Inc.

import {
  prescriptionValueCardContent,
  IPrescriptionValueCardContent,
} from './prescription-value.card.content';

describe('prescriptionValueCardContent', () => {
  it('has expected content', () => {
    const expectedContent: IPrescriptionValueCardContent = {
      bestValue: 'Best value',
      youPay: 'You pay',
      planPays: 'Plan pays',
      emailDeliveryLabel: 'Mail delivery',
      priceLabel: 'Price',
      estimatedPriceLabel: 'Estimated price',
      mailDelivery: 'Mail delivery',
      distanceInMiles: expect.any(Function),
    };
    expect(prescriptionValueCardContent).toEqual(expectedContent);
  });

  it.each([-100, 0, 10, 256])(
    'renders distance in miles correctly when distance is %p',
    (mockMiles) => {
      expect(prescriptionValueCardContent.distanceInMiles(mockMiles)).toEqual(
        `${mockMiles} miles`
      );
    }
  );
});
