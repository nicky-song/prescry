// Copyright 2022 Prescryptive Health, Inc.

import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithUnverifiedMock,
} from '../../mock-data/patient-account.mock';
import { getPinDetails } from './get-pin-details';

describe('getPinDetails', () => {
  it('returns undefined if patientAccount does not exist or does not contain authentication', () => {
    expect(getPinDetails(undefined)).toBe(undefined);
    expect(getPinDetails(patientAccountPrimaryWithUnverifiedMock)).toBe(
      undefined
    );
    const patientAccountEmptyAuthentication = {
      ...patientAccountPrimaryWithUnverifiedMock,
      authentication: {
        metadata: {},
      },
    };
    expect(getPinDetails(patientAccountEmptyAuthentication)).toBe(undefined);
  });
  it('returns undefined if patientAccount contains empty pin array', () => {
    const patientAccountEmptyAuthentication = {
      ...patientAccountPrimaryWithUnverifiedMock,
      authentication: {
        metadata: { PIN: [] },
      },
    };
    expect(getPinDetails(patientAccountEmptyAuthentication)).toBe(undefined);
  });
  it('returns pin details as expected fpr valid patient account', () => {
    expect(getPinDetails(patientAccountPrimaryMock)).toEqual({
      pinHash: 'pin-hash',
      accountKey: 'account-key',
    });
  });
});
