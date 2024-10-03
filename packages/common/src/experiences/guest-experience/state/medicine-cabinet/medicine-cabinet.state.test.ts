// Copyright 2021 Prescryptive Health, Inc.

import {
  IMedicineCabinetState,
  defaultMedicineCabinetState,
} from './medicine-cabinet.state';

describe('MedicineCabinetState', () => {
  it('has expected default state', () => {
    const expectedState: IMedicineCabinetState = {
      prescriptions: [],
      claimHistory: { claims: [] },
    };

    expect(defaultMedicineCabinetState).toEqual(expectedState);
  });
});
