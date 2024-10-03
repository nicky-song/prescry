// Copyright 2022 Prescryptive Health, Inc.

import { ApiConstants } from '../../constants/api-constants';
import { IAuth0Config, IConfiguration } from '../../configuration';
import { defaultRetryPolicy } from '../fetch-retry.helper';
import { RTPBRequest, RTPBResponse } from '../../models/rtpb/rtpb';
import { buildRTPBUrl, getRTPBPrices, IRTPBResponse } from './get-rtpb-prices';
import { getDataFromUrlWithAuth0 } from '../get-data-from-url-with-auth0';

jest.mock('../get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

const rtpbMock = {} as RTPBResponse;

const rtpbRequestMock = {} as RTPBRequest;
const rtpbResponseMock = {
  text: jest.fn().mockResolvedValue('{}'),
  ok: true,
};

const configurationMock = {
  platformGearsApiUrl: 'platform-gears-api-url-mock',
  gearsApiSubscriptionKey: 'gears-api-subscription-key-mock',
  auth0: {} as IAuth0Config,
} as IConfiguration;

describe('getRTPBPrices', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getDataFromUrlWithAuth0Mock.mockReturnValue(rtpbResponseMock);

    JSON.parse = jest.fn().mockReturnValueOnce(rtpbMock);
  });

  it('calls getDataFromUrl with expected rtpb args', async () => {
    await getRTPBPrices(rtpbRequestMock, configurationMock);

    expect(getDataFromUrlWithAuth0Mock).toHaveBeenCalledTimes(1);
    expect(getDataFromUrlWithAuth0Mock).toHaveBeenNthCalledWith(
      1,
      'identity',
      configurationMock.auth0,
      buildRTPBUrl(configurationMock.platformGearsApiUrl),
      { message: { rtpbBody: { RTPBRequest: rtpbRequestMock } } },
      'POST',
      {
        [ApiConstants.PLATFORM_API_HEADER_KEY]:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      undefined,
      defaultRetryPolicy
    );
  });

  it('returns rtpb as expected if response ok', async () => {
    const rtpbResponse = await getRTPBPrices(
      rtpbRequestMock,
      configurationMock
    );

    expect(rtpbResponse).toEqual({ rtpb: rtpbMock } as IRTPBResponse);
  });

  it('returns rtpb as expected if response fails', async () => {
    const statusMock = 500;
    const errorMock = 'error-mock';
    getDataFromUrlWithAuth0Mock.mockReturnValue({
      status: statusMock,
      json: jest.fn().mockReturnValue(errorMock),
    });
    const rtpbResponse = await getRTPBPrices(
      rtpbRequestMock,
      configurationMock
    );

    expect(rtpbResponse).toEqual({
      errorCode: statusMock,
      message: errorMock,
    } as IRTPBResponse);
  });
});
