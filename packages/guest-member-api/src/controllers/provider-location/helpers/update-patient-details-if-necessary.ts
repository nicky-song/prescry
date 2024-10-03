// Copyright 2023 Prescryptive Health, Inc.

import { Request } from 'express';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import AddressValidator from '@phx/common/src/utils/validators/address.validator';
import { updatePatientByMasterId } from '../../../utils/external-api/identity/update-patient-by-master-id';
import { IConfiguration } from '../../../configuration';
import { IPatient } from '../../../models/fhir/patient/patient';
import { IAddress } from '../../../models/fhir/address';
import { getCurrentAnswer } from '@phx/common/src/utils/answer.helper';
import { AdministrativeGender } from '../../../models/fhir/types';

export async function updatePatientDetailsIfNecessary(
  request: Request,
  patientInfo: IPatient | undefined,
  configuration: IConfiguration
): Promise<IPatient | undefined> {
  const { memberAddress, questions } = request.body;

  if (!patientInfo?.id) {
    return;
  }

  const updatedPatientInfo = await updatePatientAddress(
    patientInfo,
    memberAddress
  );

  if (questions) {
    const gender = getCurrentAnswer('patient-gender', 'text', questions) as
      | AdministrativeGender
      | undefined;
    if (gender) {
      updatedPatientInfo.gender = gender;
    }
  }

  await updatePatientByMasterId(
    patientInfo.id,
    updatedPatientInfo,
    configuration
  );

  return updatedPatientInfo;
}

function updatePatientAddress(
  patientInfo: IPatient,
  memberAddress: IMemberAddress
) {
  const existingAddress = patientInfo.address?.[0] ?? {};
  const address = {
    address1: existingAddress.line?.[0],
    address2: existingAddress.line?.[1],
    city: existingAddress.city,
    state: existingAddress.state,
    zip: existingAddress.postalCode,
  } as IMemberAddress;

  if (AddressValidator.isAddressWithoutCountyValid(address)) {
    return patientInfo;
  }

  const newPatientAddress = mapMemberAddressToPatientAddress(memberAddress);

  patientInfo.address = [
    newPatientAddress,
    ...(patientInfo.address?.filter(
      (x) => x.use !== 'home' || x.type !== 'physical'
    ) ?? []),
  ];

  return patientInfo;
}

export function mapMemberAddressToPatientAddress(
  memberAddress: IMemberAddress
): IAddress {
  return {
    line: [
      memberAddress.address1.trim().toUpperCase(),
      ...(memberAddress.address2
        ? [(memberAddress.address2?.trim() ?? '').toUpperCase()]
        : []),
    ],
    city: memberAddress.city.trim().toUpperCase(),
    state: memberAddress.state.toUpperCase(),
    postalCode: memberAddress.zip,
    use: 'home',
    type: 'physical',
  };
}
