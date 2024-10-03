// Copyright 2021 Prescryptive Health, Inc.

import { IMembershipState, defaultMembershipState } from './membership.state';

describe('MembershipState', () => {
  it('has expected default state', () => {
    const expectedState: IMembershipState = {
      account: { phoneNumber: '', favoritedPharmacies: [] },
      profileList: [],
      favoritingStatus: 'none',
      patientDependents: [],
      patientList: [],
      validateIdentity: {
        success: false,
        error: '',
      },
      addConsent: {
        success: false,
        error: '',
      },
    };

    expect(defaultMembershipState).toEqual(expectedState);
  });
});
