// Copyright 2022 Prescryptive Health, Inc.

import axios from 'axios';
import { IConfiguration } from '../../../configuration';
import { generateInsuranceEligibilityApiRequestUrl } from './generate-insurance-eligibility-api-request-url';
import { getInsuranceEligibility } from './get-insurance-eligibility';

jest.mock('./generate-insurance-eligibility-api-request-url');
const generateInsuranceEligibilityApiRequestUrlMock =
  generateInsuranceEligibilityApiRequestUrl as jest.Mock;

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

describe('getInsuranceEligibility', () => {
  beforeEach(() => {
    generateInsuranceEligibilityApiRequestUrlMock.mockReset();
  });

  it('should return undefined if there was an exception encountered', async () => {
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

    generateInsuranceEligibilityApiRequestUrlMock.mockImplementation(() => {
      throw new Error('Mock Error');
    });

    const actual = await getInsuranceEligibility(
      insuranceCardMock,
      providerNameMock,
      configurationMock
    );

    const expected = undefined;

    expect(actual).toEqual(expected);
  });

  it("should return axios post response data if there wasn't an exception encountered", async () => {
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

    const axiosResponseDataMock = 'axios-post-response-data-mock';

    axiosMock.post.mockReturnValueOnce({
      data: axiosResponseDataMock,
    } as unknown as Promise<unknown>);

    const actual = await getInsuranceEligibility(
      insuranceCardMock,
      providerNameMock,
      configurationMock
    );

    const expected = axiosResponseDataMock;

    expect(actual).toEqual(expected);
  });
});
