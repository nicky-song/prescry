// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { generateInsuranceEligibilityApiRequestUrl } from './generate-insurance-eligibility-api-request-url';
import { getProviderDetailsByProviderName } from '../get-provider-details-by-provider-name';
import {
  IProviderDetails,
  IProviderDetailsResponse,
} from '../../../models/pharmacy-portal/get-provider-details.response';
import { ApiConstants } from '../../../constants/api-constants';

jest.mock('../get-provider-details-by-provider-name');
const getProviderDetailsByProviderNameMock =
  getProviderDetailsByProviderName as jest.Mock;

describe('generateInsuranceEligibilityApiRequestUrl', () => {
  beforeEach(() => {
    getProviderDetailsByProviderNameMock.mockReset();
  });

  it('should return expected insurance eligibility api request url when insurance card is undefined', async () => {
    const insuranceCardMock = undefined;
    const providerNameMock = 'provider-name-mock';
    const configurationMock = {
      insuranceEligibilityApiRequestUrl:
        'insurance-eligibility-api-request-url-mock',
      waystarInsuranceEligibilityApiUserId:
        'waystar-insurance-eligibility-api-user-id-mock',
      waystarInsuranceEligibilityApiPassword:
        'waystar-insurance-eligibility-api-password-mock',
    } as IConfiguration;

    getProviderDetailsByProviderNameMock.mockResolvedValue({
      providerDetails: {
        providerName: providerNameMock,
        npiNumber: 'npi-number-mock',
      } as IProviderDetails,
      message: 'success',
    } as IProviderDetailsResponse);

    const actual = await generateInsuranceEligibilityApiRequestUrl(
      insuranceCardMock,
      providerNameMock,
      configurationMock
    );

    const expected = `${configurationMock.insuranceEligibilityApiRequestUrl}?UserID=${configurationMock.waystarInsuranceEligibilityApiUserId}&Password=${configurationMock.waystarInsuranceEligibilityApiPassword}&DataFormat=SF1&ResponseType=TEXT&Data=${providerNameMock}|X||||||||||||||||||HPI-npi-number-mock`;

    expect(getProviderDetailsByProviderNameMock).toBeCalledTimes(1);
    expect(actual).toEqual(expected);
  });

  it('should return expected insurance eligibility api request url when providerName is undefined', async () => {
    const insuranceCardMock = {
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      memberId: 'member-id-mock',
      dateOfBirth: '01/01/2021',
      payerId: 'payer-id-mock',
      payerName: 'payer-name-mock',
      policyId: 'policy-id-mock',
      isActive: true,
    };
    const providerNameMock = undefined;
    const configurationMock = {
      insuranceEligibilityApiRequestUrl:
        'insurance-eligibility-api-request-url-mock',
      waystarInsuranceEligibilityApiUserId:
        'waystar-insurance-eligibility-api-user-id-mock',
      waystarInsuranceEligibilityApiPassword:
        'waystar-insurance-eligibility-api-password-mock',
    } as IConfiguration;

    getProviderDetailsByProviderNameMock.mockResolvedValue({
      message: 'message-mock',
    } as IProviderDetailsResponse);

    const actual = await generateInsuranceEligibilityApiRequestUrl(
      insuranceCardMock,
      providerNameMock,
      configurationMock
    );

    const expected = `${configurationMock.insuranceEligibilityApiRequestUrl}?UserID=${configurationMock.waystarInsuranceEligibilityApiUserId}&Password=${configurationMock.waystarInsuranceEligibilityApiPassword}&DataFormat=SF1&ResponseType=TEXT&Data=X|${insuranceCardMock.payerName}|${insuranceCardMock.memberId}|||${insuranceCardMock.dateOfBirth}||||||${insuranceCardMock.payerId}||||||||HPI-${ApiConstants.WAYSTAR_INSURANCE_ELIGIBILITY_NPI_FALLBACK}`;

    expect(getProviderDetailsByProviderNameMock).toBeCalledTimes(0);
    expect(actual).toEqual(expected);
  });

  it('should return expected insurance eligibility api request url when expected inputs are passed - happy path', async () => {
    const insuranceCardMock = {
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      memberId: 'member-id-mock',
      dateOfBirth: '01/01/2021',
      payerId: 'payer-id-mock',
      policyId: 'policy-id-mock',
      isActive: true,
    };
    const providerNameMock = 'provider-name-mock';
    const configurationMock = {
      insuranceEligibilityApiRequestUrl:
        'insurance-eligibility-api-request-url-mock',
      waystarInsuranceEligibilityApiUserId:
        'waystar-insurance-eligibility-api-user-id-mock',
      waystarInsuranceEligibilityApiPassword:
        'waystar-insurance-eligibility-api-password-mock',
    } as IConfiguration;

    getProviderDetailsByProviderNameMock.mockResolvedValue({
      providerDetails: {
        providerName: providerNameMock,
        npiNumber: 'npi-number-mock',
      } as IProviderDetails,
      message: 'success',
    } as IProviderDetailsResponse);

    const actual = await generateInsuranceEligibilityApiRequestUrl(
      insuranceCardMock,
      providerNameMock,
      configurationMock
    );

    const expected = `${configurationMock.insuranceEligibilityApiRequestUrl}?UserID=${configurationMock.waystarInsuranceEligibilityApiUserId}&Password=${configurationMock.waystarInsuranceEligibilityApiPassword}&DataFormat=SF1&ResponseType=TEXT&Data=${providerNameMock}|X|${insuranceCardMock.memberId}|||${insuranceCardMock.dateOfBirth}||||||${insuranceCardMock.payerId}||||||||HPI-npi-number-mock`;

    expect(getProviderDetailsByProviderNameMock).toBeCalledTimes(1);
    expect(actual).toEqual(expected);
  });
});
