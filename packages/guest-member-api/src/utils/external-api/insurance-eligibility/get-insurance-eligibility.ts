// Copyright 2022 Prescryptive Health, Inc.

import axios from 'axios';
import { IInsuranceCard } from '@phx/common/src/models/insurance-card';
import { IConfiguration } from '../../../configuration';
import { generateInsuranceEligibilityApiRequestUrl } from './generate-insurance-eligibility-api-request-url';

export const getInsuranceEligibility = async (
  insuranceCard: IInsuranceCard | undefined,
  providerName: string | undefined,
  configuration: IConfiguration
): Promise<string | undefined> => {
  try {
    const resp = await axios.post(
      await generateInsuranceEligibilityApiRequestUrl(
        insuranceCard,
        providerName,
        configuration
      )
    );
    return resp.data;
  } catch (err) {
    return undefined;
  }
};
