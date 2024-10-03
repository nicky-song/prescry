// Copyright 2021 Prescryptive Health, Inc.

import {
  IPharmacyHoursContainerContent,
  pharmacyHoursContainerContent,
} from './pharmacy-hours-container.content';

describe('pharmacyHoursContainerContent', () => {
  it('has expected content', () => {
    const expectedContent: IPharmacyHoursContainerContent = {
      pharmacyHours: 'Pharmacy hours',
      today: 'Today',
    };
    expect(pharmacyHoursContainerContent).toEqual(expectedContent);
  });
});
