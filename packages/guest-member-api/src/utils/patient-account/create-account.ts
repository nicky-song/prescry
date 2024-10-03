// Copyright 2022 Prescryptive Health, Inc.

import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { IConfiguration } from '../../configuration';
import { IContactPoint } from '../../models/fhir/contact-point';
import { IHumanName } from '../../models/fhir/human-name';
import { IPatient } from '../../models/fhir/patient/patient';
import {
  IPatientAccount,
  PATIENT_ACCOUNT_SOURCE_MYRX,
} from '../../models/platform/patient-account/patient-account';
import { createPatientAccount } from '../external-api/patient-account/create-patient-account';
import { splitFirstName } from '../fhir/human-name.helper';
import {
  buildPatientAccountMetadata,
  buildPatientAccountReferences,
  getMasterId,
} from './patient-account.helper';
import {
  buildMemberId,
  buildPatientIdentifiers,
} from '../fhir-patient/patient.helper';
import { IIdentity } from '../../models/identity';
import { assertIsIsoDate } from '../../assertions/assert-is-iso-date';
import { IAddress } from '../../models/fhir/address';
import { AdministrativeGender } from '../../models/fhir/types';

export const createAccount = async (
  configuration: IConfiguration,
  { isoDateOfBirth, lastName, firstName, phoneNumber, email }: IIdentity,
  memberFamilyId: string,
  accountKey: string | undefined,
  pinHash: string | undefined,
  fromIP: string | undefined,
  browser: string | undefined,
  dependentNumber = 1,
  patientAddress?: IAddress,
  gender?: AdministrativeGender
): Promise<IPatientAccount> => {
  const createdDate = getNewDate().toISOString();

  const memberId = buildMemberId(memberFamilyId, dependentNumber);

  const isDependent = dependentNumber > 1;

  const name: IHumanName = {
    use: 'official',
    family: lastName,
    given: splitFirstName(firstName),
  };

  const emailContactPoint: IContactPoint = {
    system: 'email',
    value: email,
    use: 'home',
  };
  const phoneContactPoint: IContactPoint = {
    system: 'phone',
    value: phoneNumber,
    use: 'mobile',
  };

  const address: IAddress[] = [];

  if (patientAddress) address.push(patientAddress);

  assertIsIsoDate(isoDateOfBirth);

  const patient: IPatient = {
    resourceType: 'Patient',
    active: true,
    birthDate: isoDateOfBirth,
    name: [name],
    gender,
    communication: [],
    identifier: buildPatientIdentifiers(memberFamilyId, memberId, phoneNumber),
    telecom: [...(!isDependent ? [emailContactPoint] : []), phoneContactPoint],
    address,
  };

  const patientAccount: IPatientAccount = {
    accountType: 'myrx',
    source: PATIENT_ACCOUNT_SOURCE_MYRX,
    reference: buildPatientAccountReferences(
      phoneNumber,
      memberId,
      isDependent
    ),
    patient,
    authentication: {
      metadata: buildPatientAccountMetadata(accountKey, pinHash),
    },
    roles: [],
    status: {
      state: isDependent ? 'UNVERIFIED' : 'VERIFIED',
      lastStateUpdate: createdDate,
    },
    termsAndConditions: isDependent
      ? undefined
      : {
          hasAccepted: true,
          allowSmsMessages: true,
          allowEmailMessages: true,
          acceptedDateTime: createdDate,
          fromIP,
          browser,
        },
  };
  const patientAccountResponse = await createPatientAccount(
    configuration,
    patientAccount
  );
  patientAccountResponse.patient = {
    ...patient,
    id: getMasterId(patientAccountResponse),
  };
  return patientAccountResponse;
};
