// Copyright 2022 Prescryptive Health, Inc.

import { IInsuranceCard } from '@phx/common/src/models/insurance-card';
import { IConfiguration } from '../../../configuration';
import { getInsuranceEligibility } from '../../../utils/external-api/insurance-eligibility/get-insurance-eligibility';

export const isInsuranceEligible = async (
  insuranceCard: IInsuranceCard | undefined,
  providerName: string | undefined,
  configuration: IConfiguration
): Promise<boolean> => {
  const responseText: string | undefined = await getInsuranceEligibility(
    insuranceCard,
    providerName,
    configuration
  );

  return !!responseText && responseText.includes('Status: Active Coverage');
};
