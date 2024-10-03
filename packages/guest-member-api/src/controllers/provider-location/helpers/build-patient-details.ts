// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import AddressValidator from '@phx/common/src/utils/validators/address.validator';
import { getLoggedInUserPatientForRxGroupType } from '../../../utils/person/get-dependent-person.helper';
import { updatePatientByMasterId } from '../../../utils/external-api/identity/update-patient-by-master-id';
import { IConfiguration } from '../../../configuration';
import { IPatient } from '../../../models/fhir/patient/patient';
import { IAddress } from '../../../models/fhir/address';

export async function buildPatientDetails(
  request: Request,
  response: Response,
  configuration: IConfiguration
): Promise<IPatient | undefined> {
  const patientInfo: IPatient | undefined =
    getLoggedInUserPatientForRxGroupType(response, 'CASH');
  const { memberAddress } = request.body;

  if (!patientInfo?.id) {
    return;
  }

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

  await updatePatientByMasterId(patientInfo.id, patientInfo, configuration);

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
