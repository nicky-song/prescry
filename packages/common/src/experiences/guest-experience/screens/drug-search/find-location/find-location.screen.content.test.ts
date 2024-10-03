// Copyright 2022 Prescryptive Health, Inc.

import {
  findLocationScreenContent,
  IFindLocationScreenContent,
} from './find-location.screen.content';

describe('findLocationScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IFindLocationScreenContent = {
      applyLabel: 'Apply',
      mylocationLabel: 'Set my location',
      locationInputPlaceholderLabel: 'Enter a new address or ZIP code',
      wrongLocationErrorLabel:
        'We were unable to find a location with the information provided. Please try again by searching for another location.',
      deviceLocationErrorLabel: `Sorry, we couldn't detect your location, please enter it manually.`,
    };

    expect(findLocationScreenContent).toEqual(expectedContent);
  });
});
