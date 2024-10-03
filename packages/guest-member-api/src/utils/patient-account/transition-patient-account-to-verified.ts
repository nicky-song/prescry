// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { getPatientByMasterId } from '../external-api/identity/get-patient-by-master-id';
import {
  doesPatientBirthDateMatch,
  doPatientFirstNameMatch,
} from '../fhir-patient/patient.helper';
import { getMasterId } from './patient-account.helper';
import { setPatientAccountStatusToVerified } from './set-patient-account-status-to-verified';
import { setPatientAndPatientAccountIdentifiers } from './set-patient-and-patient-account-identifiers';
import { IIdentity } from '../../models/identity';
import {
  createCashCoverageRecord,
  IDependentInfo,
} from '../coverage/create-cash-coverage-record';
import { assertHasMasterId } from '../../assertions/assert-has-master-id';
import { assertHasAccountId } from '../../assertions/assert-has-account-id';
import { assertHasPersonCodeNum } from '../../assertions/assert-has-person-code-num';
import { BadRequestError } from '../../errors/request-errors/bad.request-error';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { InternalResponseCode } from '@phx/common/src/errors/error-codes';

export type ITransitionIdentityProps = Omit<IIdentity, 'email'>;

export const transitionPatientAccountToVerified = async (
  configuration: IConfiguration,
  patientAccount: IPatientAccount,
  { phoneNumber, firstName, isoDateOfBirth }: ITransitionIdentityProps,
  familyId: string,
  dependentPersonInfo?: IDependentInfo
): Promise<void> => {
  const masterId = getMasterId(patientAccount);
  assertHasMasterId(masterId, phoneNumber);

  const patient = await getPatientByMasterId(masterId, configuration);

  const doPatientDetailsMatch =
    doesPatientBirthDateMatch(patient, isoDateOfBirth) &&
    doPatientFirstNameMatch(patient, firstName);
  if (doPatientDetailsMatch) {
    const patientAccountId = patientAccount.accountId;
    assertHasAccountId(patientAccountId);

    await setPatientAndPatientAccountIdentifiers(
      configuration,
      patientAccount,
      familyId,
      masterId,
      phoneNumber
    );

    await setPatientAccountStatusToVerified(configuration, patientAccountId);

    let updatedDependentInfo = {} as IDependentInfo;

    if (dependentPersonInfo) {
      const personCodeNum = dependentPersonInfo?.dependentNumber;

      assertHasPersonCodeNum(personCodeNum);

      updatedDependentInfo = {
        dependentNumber: personCodeNum,
        masterId,
      };
    }

    await createCashCoverageRecord(
      configuration,
      masterId,
      familyId,
      dependentPersonInfo ? updatedDependentInfo : undefined
    );
  } else {
    throw new BadRequestError(
      ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH,
      InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH
    );
  }
};
