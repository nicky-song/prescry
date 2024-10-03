// Copyright 2023 Prescryptive Health, Inc.

import { LanguageCode, LanguageCodeMap } from '@phx/common/src/models/language';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { ApiConstants } from '../../constants/api-constants';
import { configurationMock } from '../../mock-data/configuration.mock';
import { mockPatient } from '../../mock-data/fhir-patient.mock';
import { IPatient } from '../../models/fhir/patient/patient';
import { updatePatientByMasterId } from '../external-api/identity/update-patient-by-master-id';
import { updatePatientLanguageCode } from './update-patient-language-code';

jest.mock('../external-api/identity/update-patient-by-master-id');
const updatePatientByMasterIdMock = updatePatientByMasterId as jest.Mock;

describe('updatePatientLanguageCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    updatePatientByMasterIdMock.mockResolvedValue(undefined);
  });

  it.each([['en'], ['es']])(
    'calls updatePatient with language code %p',
    async (languageCodeMock: string) => {
      const languageCodeArray = [...LanguageCodeMap.entries()].find(
        (entry) => entry[1] === languageCodeMock
      );
      const language = languageCodeArray ? languageCodeArray[0] : '';
      let isLanguagePresent = false;
      const existingPatientCommunication = mockPatient.communication ?? [];

      existingPatientCommunication.forEach((communication) => {
        communication.preferred = false;
        if (
          communication.language.coding?.filter(
            (coding) => coding.code === languageCodeMock
          ).length
        ) {
          communication.preferred = true;
          isLanguagePresent = true;
        }
      });

      if (!isLanguagePresent) {
        existingPatientCommunication.push({
          language: {
            coding: [
              {
                code: languageCodeMock,
                system: ApiConstants.LANGUAGE_SYSTEM,
              },
            ],
            text: language,
          },
          preferred: true,
        });
      }

      const patient: IPatient = {
        ...mockPatient,
        communication: existingPatientCommunication,
      };

      await updatePatientLanguageCode(
        configurationMock,
        patient,
        languageCodeMock as LanguageCode
      );

      expectToHaveBeenCalledOnceOnlyWith(
        updatePatientByMasterIdMock,
        patient.id,
        patient,
        configurationMock
      );
    }
  );
});
