// Copyright 2023 Prescryptive Health, Inc.

import { LanguageCode, LanguageCodeMap } from '@phx/common/src/models/language';
import { IConfiguration } from '../../configuration';
import { ApiConstants } from '../../constants/api-constants';
import { ErrorConstants } from '../../constants/response-messages';
import { InternalServerRequestError } from '../../errors/request-errors/internal-server.request-error';
import { IPatient } from '../../models/fhir/patient/patient';
import { updatePatientByMasterId } from '../external-api/identity/update-patient-by-master-id';

export const updatePatientLanguageCode = async (
  configuration: IConfiguration,
  existingPatient: IPatient,
  languageCode: LanguageCode
): Promise<void> => {
  const languageCodeArray = [...LanguageCodeMap.entries()].find(
    (entry) => entry[1] === languageCode
  );
  const language = languageCodeArray ? languageCodeArray[0] : '';
  const existingPatientCommunication = existingPatient.communication ?? [];
  let isLanguagePresent = false;

  existingPatientCommunication.forEach((communication) => {
    communication.preferred = false;
    if (
      communication.language.coding?.filter(
        (coding) => coding.code === languageCode
      ).length
    ) {
      communication.preferred = true;
      isLanguagePresent = true;
    }
  });

  if (!isLanguagePresent) {
    existingPatientCommunication.push({
      language: {
        coding: [{ code: languageCode, system: ApiConstants.LANGUAGE_SYSTEM }],
        text: language,
      },
      preferred: true,
    });
  }

  const patient: IPatient = {
    ...existingPatient,
    communication: existingPatientCommunication,
  };
  const patientId = patient.id;
  if (!patientId) {
    throw new InternalServerRequestError(ErrorConstants.PATIENT_ID_MISSING);
  }
  await updatePatientByMasterId(patientId, patient, configuration);
};
