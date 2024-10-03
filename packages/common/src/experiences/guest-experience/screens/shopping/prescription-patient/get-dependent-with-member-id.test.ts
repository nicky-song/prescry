// Copyright 2023 Prescryptive Health, Inc.

import { ILimitedPatient } from '../../../../../models/patient-profile/limited-patient';
import { getDependentWithMemberId } from './get-dependent-with-member-id';

const testId = 'test-id';

const mockPatient = {
  firstName: 'first-name',
  lastName: 'last-name',
  dateOfBirth: '2000-01-01',
  phoneNumber: '+11111111111',
  recoveryEmail: 'email',
  memberId: testId,
  masterId: 'master-id-mock',
  rxGroupType: 'CASH',
  rxSubGroup: 'rx-sub-group',
} as ILimitedPatient;

describe('getDependentWithMemberId', () => {
  it('returns adult dependents', () => {
    const mockDependentList = [
      { rxGroupType: 'CASH', adultMembers: { activePatients: [mockPatient] } },
    ];
    const result = getDependentWithMemberId(mockDependentList, testId);

    expect(result).toEqual(mockPatient);
  });

  it('returns child dependents', () => {
    const mockDependentList = [
      { rxGroupType: 'CASH', childMembers: { activePatients: [mockPatient] } },
    ];
    const result = getDependentWithMemberId(mockDependentList, testId);

    expect(result).toEqual(mockPatient);
  });

  it('does not return inactive patients', () => {
    const mockDependentList = [
      {
        rxGroupType: 'CASH',
        childMembers: { activePatients: [], inactivePatients: [mockPatient] },
      },
    ];
    const result = getDependentWithMemberId(mockDependentList, testId);

    expect(result).toEqual(undefined);
  });
});
