// Copyright 2023 Prescryptive Health, Inc.

import { getPatientByPhoneNumber } from '../../utilities/api/get-patient-by-phone-number';
import { validateAddressInPatient } from './validate-address-in-patient';

export const getPatientAndValidateAddress = async (phoneNumber: string) => {
  let result = false;
  const patient = await getPatientByPhoneNumber(phoneNumber);
  if (patient) {
    result = validateAddressInPatient(patient);
  }
  return result;
};
