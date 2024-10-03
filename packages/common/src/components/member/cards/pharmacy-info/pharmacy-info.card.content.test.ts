// Copyright 2022 Prescryptive Health, Inc.

import {
  IPharmacyInfoCardContent,
  pharmacyInfoCardContent,
} from './pharmacy-info.card.content';

describe('pharmacyInfoCardContent', () => {
  it('has expected content properties', () => {
    const expectedPharmacyInfoCardContent: IPharmacyInfoCardContent = {
      distanceText: expect.any(Function),
    };

    expect(pharmacyInfoCardContent).toEqual(expectedPharmacyInfoCardContent);
  });

  it.each([[0.01], [1], [2], [99.9]])(
    'returns expected distance text: %d mi',
    (distance: number) => {
      expect(pharmacyInfoCardContent.distanceText(distance)).toEqual(
        `${distance} mi`
      );
    }
  );
});
