// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { gearsClaimsPath } from '../../../configuration';
import { ApiConstants } from '../../../constants/api-constants';
import { claimsResponseMock } from '../../../controllers/claims/mocks/claims.mock';
import { EndpointError } from '../../../errors/endpoint.error';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import { getClaims, IGetClaimsResponse } from './get-claims';

jest.mock('../../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('getClaims', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes expected api request and returns response if success', async () => {
    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => claimsResponseMock,
      ok: true,
    });

    const memberIdMock = 'member-id';
    const rxSubGroupMock = 'rx-sub-group';

    const actual = await getClaims(
      memberIdMock,
      rxSubGroupMock,
      configurationMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0Mock,
      'claims',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}${gearsClaimsPath}/${rxSubGroupMock}/${memberIdMock}`,
      undefined,
      'GET',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
        [ApiConstants.VERSION_HEADER_KEY]: '1.0',
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      defaultRetryPolicy
    );

    const expected: IGetClaimsResponse = {
      claims: claimsResponseMock.claimData,
    };
    expect(actual).toEqual(expected);
  });

  it('returns empty array if api return NOT_FOUND', async () => {
    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: jest.fn(),
      ok: false,
      status: HttpStatusCodes.NOT_FOUND,
    });

    const response = await getClaims(
      'member-id',
      'rx-sub-group',
      configurationMock
    );

    const expectedResponse: IGetClaimsResponse = {
      claims: [],
    };
    expect(response).toEqual(expectedResponse);
  });

  it('throws endpoint error if api returns error', async () => {
    const mockError = 'error';
    const statusMock = 400;
    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: statusMock,
    });

    try {
      await getClaims('member-id', 'rx-sub-group', configurationMock);
      fail('Exception expected but none thrown!');
    } catch (ex) {
      const expectedError = new EndpointError(statusMock, mockError);
      expect(ex).toEqual(expectedError);
    }
  });
});
