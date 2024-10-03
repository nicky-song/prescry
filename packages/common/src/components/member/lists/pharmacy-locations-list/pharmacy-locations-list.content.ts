// Copyright 2020 Prescryptive Health, Inc.

export const PharmacySearchLocationsListContent = {
  placeholder: 'Enter zip code',
  searchresults: 'Search results',
  maxLength: 5,
  errorNearbyPharmacyNotFound:
    'We couldn’t find a provider near you. Check back soon as we are continuously adding more service locations or join our waitlist.',
  errorInvalidZipcodeInput: 'Invalid entry. Please try again',
  joinWaitlistHeader: 'Join waitlist',
  joinWaitlistText:
    'We will text you when an appointment is available at a provider near you.',
  distances: [
    { text: '5 mi.', value: 5 },
    { text: '10 mi.', value: 10 },
    { text: '25 mi.', value: 25 },
    { text: '50 mi.', value: 50 },
    { text: '100 mi.', value: 100, default: true },
    { text: '500 mi.', value: 500 },
  ],
  distancePickerTitle: 'Distance:',
  pharmacyNotFoundErrorWithoutWaitlist:
    'We couldn’t find a provider near you. Check back soon as we are continuously adding more service locations.',
};
