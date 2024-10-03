// Copyright 2020 Prescryptive Health, Inc.

import { PharmacySearchLocationsListContent } from './pharmacy-locations-list.content';

describe('PharmacyLocationsScreenContent', () => {
  it('has expected content', () => {
    expect(PharmacySearchLocationsListContent.placeholder).toEqual(
      'Enter zip code'
    );

    expect(PharmacySearchLocationsListContent.searchresults).toEqual(
      'Search results'
    );

    expect(PharmacySearchLocationsListContent.maxLength).toEqual(5);

    expect(
      PharmacySearchLocationsListContent.errorNearbyPharmacyNotFound
    ).toEqual(
      'We couldn’t find a provider near you. Check back soon as we are continuously adding more service locations or join our waitlist.'
    );

    expect(PharmacySearchLocationsListContent.errorInvalidZipcodeInput).toEqual(
      'Invalid entry. Please try again'
    );

    expect(PharmacySearchLocationsListContent.joinWaitlistHeader).toEqual(
      'Join waitlist'
    );
    expect(PharmacySearchLocationsListContent.joinWaitlistText).toEqual(
      'We will text you when an appointment is available at a provider near you.'
    );
    expect(
      PharmacySearchLocationsListContent.pharmacyNotFoundErrorWithoutWaitlist
    ).toEqual(
      'We couldn’t find a provider near you. Check back soon as we are continuously adding more service locations.'
    );
  });
  expect(PharmacySearchLocationsListContent.distancePickerTitle).toEqual(
    'Distance:'
  );
  expect(PharmacySearchLocationsListContent.distances).toEqual([
    { text: '5 mi.', value: 5 },
    { text: '10 mi.', value: 10 },
    { text: '25 mi.', value: 25 },
    { text: '50 mi.', value: 50 },
    { text: '100 mi.', value: 100, default: true },
    { text: '500 mi.', value: 500 },
  ]);
});
