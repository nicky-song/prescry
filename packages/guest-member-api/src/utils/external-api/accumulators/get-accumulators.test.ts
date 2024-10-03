// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { ApiConstants } from '../../../constants/api-constants';
import { EndpointError } from '../../../errors/endpoint.error';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { defaultRetryPolicy } from '../../fetch-retry.helper';
import { getDataFromUrlWithAuth0 } from '../../get-data-from-url-with-auth0';
import {
  getAccumulators,
  IAccumulatorsResponse,
  IGetAccumulatorsResponse,
} from './get-accumulators';

jest.mock('../../../utils/get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('getAccumulators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes expected api request and returns response if success', async () => {
    const claimsAccumulatorsResponseMock: IAccumulatorsResponse = {
      personCode: 'person-code',
      familyId: 'family-id',
      uniqueId: 'unique-id',
      individualTotalDeductible: 1500,
      familyTotalDeductible: 5000,
      individualTotalOutOfPocket: 1600,
      familyTotalOutOfPocket: 6000,
    };

    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => claimsAccumulatorsResponseMock,
      ok: true,
    });

    const memberIdMock = 'member-id';
    const rxSubGroupMock = 'rx-sub-group';

    const actual = await getAccumulators(
      memberIdMock,
      rxSubGroupMock,
      configurationMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      getDataFromUrlWithAuth0Mock,
      'accumulators',
      configurationMock.auth0,
      `${configurationMock.platformGearsApiUrl}/accumulator/api/v1/accumulator/${rxSubGroupMock}/member/${memberIdMock}/summary`,
      undefined,
      'GET',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.DEFAULT_API_TIMEOUT,
      defaultRetryPolicy
    );

    const expected: IGetAccumulatorsResponse = {
      claimsAccumulators: claimsAccumulatorsResponseMock,
    };
    expect(actual).toEqual(expected);
  });

  it('returns empty object if api return NOT_FOUND', async () => {
    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: jest.fn(),
      ok: false,
      status: HttpStatusCodes.NOT_FOUND,
    });

    const response = await getAccumulators(
      'member-id',
      'rx-sub-group',
      configurationMock
    );
    expect(response).toEqual({});
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
      await getAccumulators('member-id', 'rx-sub-group', configurationMock);
      fail('Expected exception but none thrown!');
    } catch (ex) {
      const expectedError = new EndpointError(statusMock, mockError);
      expect(ex).toEqual(expectedError);
    }
  });
});
