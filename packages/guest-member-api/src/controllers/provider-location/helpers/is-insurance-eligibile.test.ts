// Copyright 2022 Prescryptive Health, Inc.

import { IConfiguration } from '../../../configuration';
import { getInsuranceEligibility } from '../../../utils/external-api/insurance-eligibility/get-insurance-eligibility';
import { isInsuranceEligible } from './is-insurance-eligibile';

jest.mock(
  '../../../utils/external-api/insurance-eligibility/get-insurance-eligibility'
);
const getInsuranceEligibilityMock = getInsuranceEligibility as jest.Mock;

describe('isInsuranceEligible', () => {
  beforeEach(() => {
    getInsuranceEligibilityMock.mockReset();
  });

  it('should return false if response from function getInsuranceEligibility is undefined', async () => {
    const insuranceCardMock = {
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      memberId: 'member-id-mock',
      dateOfBirth: '01/01/2021',
      policyId: 'policy-id-mock',
      payerId: 'payer-id-mock',
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

    getInsuranceEligibilityMock.mockResolvedValue(undefined);

    const actual = await isInsuranceEligible(
      insuranceCardMock,
      providerNameMock,
      configurationMock
    );

    const expected = false;

    expect(getInsuranceEligibilityMock).toBeCalledTimes(1);
    expect(actual).toEqual(expected);
  });

  it('should return false if response from function getInsuranceEligibility is defined but does not contain active coverage text', async () => {
    const insuranceCardMock = {
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      memberId: 'member-id-mock',
      dateOfBirth: '01/01/2021',
      policyId: 'policy-id-mock',
      payerId: 'payer-id-mock',
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

    getInsuranceEligibilityMock.mockResolvedValue(
      'get-insurance-eligibility-response-no-active-coverage-text-mock'
    );

    const actual = await isInsuranceEligible(
      insuranceCardMock,
      providerNameMock,
      configurationMock
    );

    const expected = false;

    expect(getInsuranceEligibilityMock).toBeCalledTimes(1);
    expect(actual).toEqual(expected);
  });

  it('should return true if response from function getInsuranceEligibility is defined but does contain active coverage text', async () => {
    const insuranceCardMock = {
      firstName: 'first-name-mock',
      lastName: 'last-name-mock',
      memberId: 'member-id-mock',
      dateOfBirth: '01/01/2021',
      policyId: 'policy-id-mock',
      payerId: 'payer-id-mock',
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

    getInsuranceEligibilityMock.mockResolvedValue(
      'get-insurance-eligibility-response-has-active-coverage-text-mock => Status: Active Coverage'
    );

    const actual = await isInsuranceEligible(
      insuranceCardMock,
      providerNameMock,
      configurationMock
    );

    const expected = true;

    expect(getInsuranceEligibilityMock).toBeCalledTimes(1);
    expect(actual).toEqual(expected);
  });
});
