// Copyright 2022 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { getHumanName } from '../../../utils/fhir/human-name.helper';
import { prescriptionFhirWithoutMemberIdMock } from '../mock/get-mock-fhir-object';
import { buildUpdatePrescriptionParams } from './build-update-prescription-params';

jest.mock('../../../utils/fhir/human-name.helper', () => ({
  ...jest.requireActual('../../../utils/fhir/human-name.helper'),
  getHumanName: jest.fn(),
}));
const getHumanNameMock = getHumanName as jest.Mock;

const cashPersonMock: IPerson = {
  dateOfBirth: '1980-01-01',
  email: 'mockEmail',
  firstName: 'DIAN',
  identifier: '',
  isPhoneNumberVerified: true,
  isPrimary: true,
  lastName: 'mockLastName',
  phoneNumber: 'mockPhoneNumber',
  primaryMemberFamilyId: 'family-id',
  primaryMemberPersonCode: 'person-code-id1',
  primaryMemberRxId: 'mock-id1',
  rxGroupType: 'CASH',
  rxGroup: 'group1',
  rxBin: 'rx-bin',
  carrierPCN: 'pcn',
};

const siePersonMock: IPerson = {
  email: 'fake_email',
  firstName: 'dian',
  lastName: 'fake_lastName',
  identifier: 'fake-identifier',
  phoneNumber: 'fake_phoneNumber',
  primaryMemberRxId: 'fake_primaryMemberRxId',
  rxGroupType: 'SIE',
  rxSubGroup: 'HMA01',
  dateOfBirth: '1980-01-01',
  isPhoneNumberVerified: true,
  isPrimary: true,
  rxGroup: 'group1',
  rxBin: 'rx-bin',
  carrierPCN: 'pcn',
  primaryMemberPersonCode: 'person-code-id1',
};

describe('buildUpdatePrescriptionParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('return params with empty clientpatientId when personlist is not passed', () => {
    const actual = buildUpdatePrescriptionParams(
      prescriptionFhirWithoutMemberIdMock
    );
    expect(actual).toEqual({
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    });
  });

  it('return params with empty clientpatientId when official name not found', () => {
    getHumanNameMock.mockReturnValue(undefined);

    const actual = buildUpdatePrescriptionParams(
      prescriptionFhirWithoutMemberIdMock,
      [cashPersonMock, siePersonMock]
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getHumanNameMock,
      [
        {
          family: 'ALAM',
          given: ['DIAN'],
        },
      ],
      'official'
    );
    expect(actual).toEqual({
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    });
  });

  it('return SIE memberID as the clientPatientId in the params when personlist is passed and contains SIE Profile for the user.', () => {
    getHumanNameMock.mockReturnValue({
      family: 'ALAM',
      given: ['DIAN'],
    });

    const actual = buildUpdatePrescriptionParams(
      prescriptionFhirWithoutMemberIdMock,
      [cashPersonMock, siePersonMock]
    );
    expect(actual).toEqual({
      clientPatientId: 'fake_primaryMemberRxId',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    });
  });

  it('return CASH memberID as the clientPatientId in the params when personlist is passed and contains only CASH Profile for the user.', () => {
    getHumanNameMock.mockReturnValue({
      family: 'ALAM',
      given: ['DIAN'],
    });

    const actual = buildUpdatePrescriptionParams(
      prescriptionFhirWithoutMemberIdMock,
      [cashPersonMock]
    );
    expect(actual).toEqual({
      clientPatientId: 'mock-id1',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    });
  });
});
