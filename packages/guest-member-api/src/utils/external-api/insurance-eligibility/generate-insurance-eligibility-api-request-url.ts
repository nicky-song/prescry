// Copyright 2022 Prescryptive Health, Inc.

import { IInsuranceCard } from '@phx/common/src/models/insurance-card';
import { IConfiguration } from '../../../configuration';
import DateFormatter from '@phx/common/src/utils/formatters/date.formatter';
import { getProviderDetailsByProviderName } from '../get-provider-details-by-provider-name';
import { IProviderDetailsResponse } from '../../../models/pharmacy-portal/get-provider-details.response';
import { ApiConstants } from '../../../constants/api-constants';

export const generateInsuranceEligibilityApiRequestUrl = async (
  insuranceCard: IInsuranceCard | undefined,
  providerName: string | undefined,
  configuration: IConfiguration
): Promise<string> => {
  let npiNumber;

  if (providerName) {
    const providerDetailsResponse: IProviderDetailsResponse =
      await getProviderDetailsByProviderName(configuration, providerName);
    npiNumber = providerDetailsResponse.providerDetails?.npiNumber;
  }

  return `${configuration.insuranceEligibilityApiRequestUrl}?UserID=${
    configuration.waystarInsuranceEligibilityApiUserId
  }&Password=${
    configuration.waystarInsuranceEligibilityApiPassword
  }&DataFormat=SF1&ResponseType=TEXT&Data=${
    providerName ? providerName : 'X'
  }|${insuranceCard?.payerName ? insuranceCard.payerName : 'X'}|${
    insuranceCard?.memberId ? insuranceCard?.memberId : ''
  }|||${
    insuranceCard?.dateOfBirth
      ? DateFormatter.formatStringToMMDDYYYY(insuranceCard.dateOfBirth)
      : ''
  }||||||${insuranceCard?.payerId ? insuranceCard.payerId : ''}||||||||HPI-${
    npiNumber
      ? npiNumber
      : ApiConstants.WAYSTAR_INSURANCE_ELIGIBILITY_NPI_FALLBACK
  }`;
};
