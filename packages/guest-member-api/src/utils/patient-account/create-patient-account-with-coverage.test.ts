// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { assertHasMasterId } from '../../assertions/assert-has-master-id';
import { configurationMock } from '../../mock-data/configuration.mock';
import { identityMock } from '../../mock-data/identity.mock';
import { patientAccountPrimaryMock } from '../../mock-data/patient-account.mock';
import { createCashCoverageRecord } from '../coverage/create-cash-coverage-record';
import { createAccount } from './create-account';
import { createPatientAccountWithCoverage } from './create-patient-account-with-coverage';
import { getMasterId } from './patient-account.helper';

jest.mock('./create-account');
const createAccountMock = createAccount as jest.Mock;

jest.mock('./patient-account.helper');
const getMasterIdMock = getMasterId as jest.Mock;

jest.mock('../coverage/create-cash-coverage-record');
const createCashCoverageRecordMock = createCashCoverageRecord as jest.Mock;

jest.mock('../../assertions/assert-has-master-id');
const assertHasMasterIdMock = assertHasMasterId as jest.Mock;

describe('createPatientAccountWithCoverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createAccountMock.mockResolvedValue(undefined);
    createCashCoverageRecordMock.mockResolvedValue(undefined);
  });

  it('creates patient and patient account', async () => {
    const familyIdMock = 'family-id';
    const fromIPMock = '0.0.0.0';
    const browserMock = 'browser';

    getMasterIdMock.mockReturnValue('master-id');

    await createPatientAccountWithCoverage(
      configurationMock,
      identityMock,
      familyIdMock,
      fromIPMock,
      browserMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      createAccountMock,
      configurationMock,
      identityMock,
      familyIdMock,
      undefined,
      undefined,
      fromIPMock,
      browserMock
    );
  });

  it('asserts master id exists in created patient account record', async () => {
    const masterIdMock = 'master-id';
    getMasterIdMock.mockReturnValue(masterIdMock);

    const patientAccountMock = patientAccountPrimaryMock;
    createAccountMock.mockResolvedValue(patientAccountMock);

    await createPatientAccountWithCoverage(
      configurationMock,
      identityMock,
      'family-id',
      '0.0.0.0',
      'browser'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      assertHasMasterIdMock,
      masterIdMock,
      identityMock.phoneNumber
    );
  });

  it('creates cash coverage record', async () => {
    const masterIdMock = 'master-id';
    getMasterIdMock.mockReturnValue(masterIdMock);

    const familyIdMock = 'family-id';

    await createPatientAccountWithCoverage(
      configurationMock,
      identityMock,
      familyIdMock,
      '0.0.0.0',
      'browser'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      createCashCoverageRecordMock,
      configurationMock,
      masterIdMock,
      familyIdMock
    );
  });
});
