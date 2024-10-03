// Copyright 2022 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { assertHasDateOfBirth } from '../assertions/assert-has-date-of-birth';
import { IConfiguration } from '../configuration';
import { getPatientByPatientDetails } from './external-api/identity/get-patient-by-patient-details';
import { getMemberIdFromPatient } from './fhir-patient/patient-identifier.helper';
import {
  doesPatientBirthDateMatch,
  doesPatientPhoneNumberMatch,
  doPatientNamesMatch,
} from './fhir-patient/patient.helper';

export interface IGetDependentByPatientDetailsProps {
  firstName?: string;
  familyName?: string;
  birthDate?: string;
  phoneNumber?: string;
}

export const getDependentByPatientDetails = async (
  configuration: IConfiguration,
  props: IGetDependentByPatientDetailsProps
): Promise<IPerson | undefined> => {
  const { firstName, familyName, birthDate, phoneNumber } = props;

  assertHasDateOfBirth(birthDate);

  const formattedBirthDate = UTCDateString(birthDate);

  if (firstName && familyName && birthDate && phoneNumber) {
    const patients = await getPatientByPatientDetails(
      {
        familyName,
        firstName,
        birthDate: formattedBirthDate,
      },
      configuration
    );

    for (const patient of patients) {
      const namesMatch = doPatientNamesMatch(patient, firstName, familyName);

      const dateOfBirthMatch = doesPatientBirthDateMatch(patient, birthDate);

      const phoneNumberMatch = doesPatientPhoneNumberMatch(
        patient,
        phoneNumber
      );

      const personDetailsMatch =
        namesMatch && dateOfBirthMatch && phoneNumberMatch;

      const primaryMemberRxId = getMemberIdFromPatient(patient);
      const masterId = patient.id;

      if (personDetailsMatch) {
        const person: Partial<IPerson> = {
          firstName,
          lastName: familyName,
          dateOfBirth: birthDate,
          phoneNumber,
          primaryMemberRxId,
          masterId,
        };

        return person as IPerson;
      }
    }

    return undefined;
  }

  return undefined;
};
