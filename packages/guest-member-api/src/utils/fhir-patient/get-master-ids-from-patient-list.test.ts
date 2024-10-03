// Copyright 2022 Prescryptive Health, Inc.

import {
  getMasterIdsFromDependentPatientList,
  getMasterIdsFromPrimaryPatientList,
} from './get-master-ids-from-patient-list';
import {
  mockAdultDependentPatient,
  mockChildPbmDependentPatient,
  mockPatient,
  mockPatientEmailAndPhone,
  mockChildDependentPatient,
} from '../../mock-data/fhir-patient.mock';

import {
  IPatientDependents,
  IPatientProfile,
} from '../../models/patient-profile';

describe('getMasterIdsFromPatientList', () => {
  it('returns masterId of cash profile only when there is only cash profile', () => {
    const patientProfileMock: IPatientProfile[] = [
      {
        rxGroupType: 'CASH',
        primary: mockPatient,
      },
    ];
    const expected = ['patient-id'];
    const actual = getMasterIdsFromPrimaryPatientList(patientProfileMock);
    expect(actual).toEqual(expected);
  });
  it('returns masterId of both profiles when there are cash as well as pbm profile', () => {
    const pbmProfile = { ...mockPatientEmailAndPhone, id: 'pbm-id' };
    const patientProfileMock: IPatientProfile[] = [
      {
        rxGroupType: 'CASH',
        primary: mockPatient,
      },
      {
        rxGroupType: 'SIE',
        primary: pbmProfile,
      },
    ];
    const expected = ['patient-id', 'pbm-id'];
    const actual = getMasterIdsFromPrimaryPatientList(patientProfileMock);
    expect(actual).toEqual(expected);
  });
});

describe('getMasterIdsFromDependentPatientList', () => {
  it('returns masterIds of cash dependents only when there are cash dependents', () => {
    const patientProfileMock: IPatientDependents[] = [
      {
        rxGroupType: 'CASH',
        childMembers: {
          activePatients: [mockChildDependentPatient],
        },
        adultMembers: {
          activePatients: [mockAdultDependentPatient],
        },
      },
    ];
    const expected = ['patient-id2', 'patient-id3'];
    const actual = getMasterIdsFromDependentPatientList(patientProfileMock);
    expect(actual).toEqual(expected);
  });
  it('returns masterIds of both profiles when there are cash as well as pbm dependents', () => {
    const patientProfileMock: IPatientDependents[] = [
      {
        rxGroupType: 'CASH',
        childMembers: {
          activePatients: [mockChildDependentPatient],
        },
      },
      {
        rxGroupType: 'SIE',
        childMembers: {
          activePatients: [mockChildPbmDependentPatient],
        },
      },
    ];
    const expected = ['patient-id2', 'patient-id4'];
    const actual = getMasterIdsFromDependentPatientList(patientProfileMock);
    expect(actual).toEqual(expected);
  });
});
