// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { getPatientCoverageByQuery } from '../external-api/coverage/get-patient-coverage-by-query';

export const getPatientCoverageByFamilyId = async (
  configuration: IConfiguration,
  familyId: string
): Promise<ICoverage[] | undefined> => {
  const maxPersonCode = 999;

  return await getPatientCoverageByQuery(
    configuration,
    `_count=${maxPersonCode}&class-type=familyid&class-value=${familyId}`
  );
};
