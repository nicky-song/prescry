// Copyright 2022 Prescryptive Health, Inc.

import {
  defaultAccountAndFamilyState,
  IAccountAndFamilyState,
} from './account-and-family.state';

describe('AccountAndFamilyState', () => {
  it('has expected default state', () => {
    const expectedState: IAccountAndFamilyState = {};

    expect(defaultAccountAndFamilyState).toEqual(expectedState);
  });
});
