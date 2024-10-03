// Copyright 2020 Prescryptive Health, Inc.

import {
  pharmacyLocationsScreenContent,
  IPharmacyLocationsScreenContent,
} from './pharmacy-locations-screen.content';

describe('pharmacyLocationsScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IPharmacyLocationsScreenContent = {
      headerText: 'Find a provider nearby',
    };
    expect(pharmacyLocationsScreenContent).toEqual(expectedContent);
  });
});
