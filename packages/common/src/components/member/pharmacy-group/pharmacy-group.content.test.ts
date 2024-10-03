// Copyright 2022 Prescryptive Health, Inc.

import {
  IPharmacyGroupContent,
  pharmacyGroupContent,
} from './pharmacy-group.content';

describe('pharmacyGroupContent', () => {
  it('has expected content properties', () => {
    const expectedPharmacyGroupContent: IPharmacyGroupContent = {
      showMessage: 'Show',
      singularLocationMessage: 'more location',
      pluralLocationMessage: 'more locations',
    };

    expect(pharmacyGroupContent).toEqual(expectedPharmacyGroupContent);
  });
});
