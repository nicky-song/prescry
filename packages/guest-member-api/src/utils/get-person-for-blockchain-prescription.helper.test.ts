// Copyright 2022 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { getPersonForBlockchainPrescription } from './get-person-for-blockchain-prescription.helper';

describe('getPersonForBlockchainPrescription', () => {
  it('returns person with SIE rxGroupType as a priority', () => {
    const masterIdMock = 'master-id-mock';

    const expectedPersonMock = {
      rxGroupType: 'SIE',
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
      primaryMemberRxId: 'id-1',
      masterId: masterIdMock,
    } as IPerson;

    const personListMock = [
      expectedPersonMock,
      {
        rxGroupType: 'CASH',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'MYRX-ID',
        rxSubGroup: 'CASH01',
        masterId: masterIdMock,
      } as IPerson,
    ];

    const result = getPersonForBlockchainPrescription(
      personListMock,
      masterIdMock
    );

    expect(result).toEqual(expectedPersonMock);
  });

  it('returns person with CASH or any other rxGroupType when account is not PBM', () => {
    const masterIdMock = 'master-id-mock';

    const expectedPersonMock = {
      rxGroupType: 'CASH',
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
      primaryMemberRxId: 'MYRX-ID',
      rxSubGroup: 'CASH01',
      masterId: masterIdMock,
    } as IPerson;

    const personListMock = [expectedPersonMock];

    const result = getPersonForBlockchainPrescription(
      personListMock,
      masterIdMock
    );

    expect(result).toEqual(expectedPersonMock);
  });
});
