// Copyright 2023 Prescryptive Health, Inc.

import { IConfiguration } from '../configuration';
import { ApiConstants } from '../constants/api-constants';
import { IPatient } from '../models/fhir/patient/patient';
import { getPatientByMasterId } from './external-api/identity/get-patient-by-master-id';
import { getPreferredContactForSystem } from './fhir-patient/get-contact-info-from-patient';

export const isPrescriptionPhoneNumberValid = async (
  prescriptionMasterId: string,
  loggedInPatient: IPatient,
  configuration: IConfiguration
): Promise<boolean> => {
  const prescriptionPatient = await getPatientByMasterId(
    prescriptionMasterId,
    configuration
  );

  if (prescriptionPatient) {
    const prescriptionTelecom = prescriptionPatient.telecom;

    const loggedInPatientTelecom = loggedInPatient.telecom;

    if (prescriptionTelecom && loggedInPatientTelecom) {
      const prescriptionPhoneNumber = getPreferredContactForSystem(
        prescriptionTelecom,
        'mobile',
        'phone'
      );

      const loggedInPatientPhoneNumber = getPreferredContactForSystem(
        loggedInPatientTelecom,
        'mobile',
        'phone'
      );

      if (prescriptionPhoneNumber && loggedInPatientPhoneNumber) {
        const prescriptionPhoneNumberHasCountryCode =
          prescriptionPhoneNumber.startsWith(ApiConstants.COUNTRY_CODE);

        if (!prescriptionPhoneNumberHasCountryCode) {
          const prescriptionPhoneNumberWithCountryCode = `${ApiConstants.COUNTRY_CODE}${prescriptionPhoneNumber}`;

          if (
            phoneNumbersMatches([
              loggedInPatientPhoneNumber,
              prescriptionPhoneNumberWithCountryCode,
            ])
          ) {
            return true;
          }
        }

        if (
          phoneNumbersMatches([
            loggedInPatientPhoneNumber,
            prescriptionPhoneNumber,
          ])
        ) {
          return true;
        }
      }
    }
  }

  return false;
};

const phoneNumbersMatches = (phoneNumbers: string[]): boolean => {
  return new Set(phoneNumbers).size === 1;
};
