// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../configuration';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { getPatientCoverageByQuery } from '../external-api/coverage/get-patient-coverage-by-query';

export const getPatientCoverageByMemberId = async (
  configuration: IConfiguration,
  memberId: string
): Promise<ICoverage[] | undefined> => {
  return await getPatientCoverageByQuery(
    configuration,
    `identifier=https://prescryptive.io/memberidentifier|${memberId}`
  );
};
