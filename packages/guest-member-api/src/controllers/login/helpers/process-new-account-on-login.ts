// Copyright 2022 Prescryptive Health, Inc.

import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { IConfiguration } from '../../../configuration';
import { LoginMessages } from '../../../constants/response-messages';
import { ForbiddenRequestError } from '../../../errors/request-errors/forbidden.request-error';
import { IIdentity } from '../../../models/identity';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { getPatientAccountByAccountId } from '../../../utils/external-api/patient-account/get-patient-account-by-account-id';
import { createPatientAccountWithCoverage } from '../../../utils/patient-account/create-patient-account-with-coverage';
import { isPatientAccountVerified } from '../../../utils/patient-account/patient-account.helper';
import { transitionPatientAccountToVerified } from '../../../utils/patient-account/transition-patient-account-to-verified';

export const processNewAccountOnLogin = async (
  configuration: IConfiguration,
  patientAccount: IPatientAccount | undefined,
  identity: IIdentity,
  familyId: string,
  fromIP: string | undefined,
  browser: string | undefined
): Promise<IPatientAccount | undefined> => {
  if (!patientAccount) {
    return await createPatientAccountWithCoverage(
      configuration,
      identity,
      familyId,
      fromIP,
      browser
    );
  } else {
    if (isPatientAccountVerified(patientAccount)) {
      throw new ForbiddenRequestError(LoginMessages.PHONE_NUMBER_EXISTS);
    }

    await transitionPatientAccountToVerified(
      configuration,
      patientAccount,
      identity,
      familyId
    );

    const accountId = patientAccount.accountId;

    assertHasAccountId(accountId);

    const updatedPatientAccount = await getPatientAccountByAccountId(
      configuration,
      accountId,
      true,
      true
    );

    return updatedPatientAccount;
  }
};
