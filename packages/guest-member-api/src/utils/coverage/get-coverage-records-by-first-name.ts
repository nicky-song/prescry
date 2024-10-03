// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { getPatientByMasterId } from '../external-api/identity/get-patient-by-master-id';
import { matchFirstName } from '../fhir/human-name.helper';
import { getMasterIdFromCoverage } from '../get-master-id-from-coverage.helper';

export const getCoverageRecordsByFirstName = async (
  familyCoverages: ICoverage[],
  firstName: string,
  configuration: IConfiguration
): Promise<ICoverage[]> => {
  const familyMatchingFirstNameCollection: Set<ICoverage> = new Set();
  for (const coverage of familyCoverages) {
    const masterId = getMasterIdFromCoverage(coverage);
    const familyPatient = masterId
      ? await getPatientByMasterId(masterId, configuration)
      : undefined;

    if (familyPatient && familyPatient.name) {
      const familyMatchedFirstNameObject = matchFirstName(
        firstName,
        familyPatient.name
      );

      if (familyMatchedFirstNameObject) {
        familyMatchingFirstNameCollection.add(coverage);
      }
    }
  }
  return Array.from(familyMatchingFirstNameCollection);
};
