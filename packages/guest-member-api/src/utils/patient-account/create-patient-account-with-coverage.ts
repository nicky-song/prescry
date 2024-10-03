// Copyright 2022 Prescryptive Health, Inc.

import { assertHasMasterId } from '../../assertions/assert-has-master-id';
import { IConfiguration } from '../../configuration';
import { IIdentity } from '../../models/identity';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { createCashCoverageRecord } from '../coverage/create-cash-coverage-record';
import { createAccount } from './create-account';
import { getMasterId } from './patient-account.helper';

export const createPatientAccountWithCoverage = async (
  configuration: IConfiguration,
  identity: IIdentity,
  familyId: string,
  fromIP: string | undefined,
  browser: string | undefined
): Promise<IPatientAccount> => {
  const newPatientAccount = await createAccount(
    configuration,
    identity,
    familyId,
    undefined,
    undefined,
    fromIP,
    browser
  );

  const masterId = getMasterId(newPatientAccount);
  assertHasMasterId(masterId, identity.phoneNumber);

  await createCashCoverageRecord(configuration, masterId, familyId);

  return newPatientAccount;
};
