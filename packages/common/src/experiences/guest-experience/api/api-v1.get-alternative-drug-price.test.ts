// Copyright 2022 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IAlternativeDrugPriceSearchResponse } from '../../../models/api-response/alternative-drug-price.response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
  ICommonHeaders,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { getAlternativeDrugPrice } from './api-v1.get-alternative-drug-price';
import { withRefreshToken } from './with-refresh-token';
import { ensureGetPrescriptionPharmaciesResponse } from './ensure-api-response/ensure-get-prescription-pharmacies-response';

jest.mock('../../../utils/api.helper');
const callMock = call as jest.Mock;
const buildUrlMock = buildUrl as jest.Mock;
const buildCommonHeadersMock = buildCommonHeaders as jest.Mock;

jest.mock('./with-refresh-token');
const withRefreshTokenMock = withRefreshToken as jest.Mock;

jest.mock('./api-v1-helper');
const handleHttpErrorsMock = handleHttpErrors as jest.Mock;

jest.mock('./ensure-api-response/ensure-get-prescription-pharmacies-response');
const ensureGetPrescriptionPharmaciesResponseMock =
  ensureGetPrescriptionPharmaciesResponse as jest.Mock;

const apiConfigMock = {} as IApiConfig;
const ndcMock = 'ndc-mock';
const ncpdpMock = 'ncpdp-mock';
const tokenMock = 'token-mock';
const deviceTokenMock = 'device-token-mock';
const retryPolicyMock = {} as IRetryPolicy;
const urlMock = 'url-mock';
const commonHeadersMock = {} as ICommonHeaders;
const responseJsonMock = {} as IAlternativeDrugPriceSearchResponse;
const responseMock = {
  json: jest.fn().mockReturnValue(responseJsonMock),
  ok: true,
  data: {},
  status: 'status-mock',
};

describe('getAlternativeDrugPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    buildUrlMock.mockReturnValue(urlMock);
    buildCommonHeadersMock.mockReturnValue(commonHeadersMock);
    callMock.mockReturnValue(responseMock);
    ensureGetPrescriptionPharmaciesResponseMock.mockReturnValue(true);
  });

  it('calls buildUrl with expected args to return url', async () => {
    await getAlternativeDrugPrice(
      apiConfigMock,
      ndcMock,
      ncpdpMock,
      tokenMock,
      deviceTokenMock,
      retryPolicyMock
    );

    expect(buildUrlMock).toHaveBeenCalledTimes(1);
    expect(buildUrlMock).toHaveBeenNthCalledWith(
      1,
      apiConfigMock,
      'searchAlternativeDrugPrice',
      {
        ':ndc': ndcMock,
        ':ncpdp': ncpdpMock,
      }
    );
  });

  it('calls call with expected args to return response', async () => {
    await getAlternativeDrugPrice(
      apiConfigMock,
      ndcMock,
      ncpdpMock,
      tokenMock,
      deviceTokenMock,
      retryPolicyMock
    );

    expect(buildCommonHeadersMock).toHaveBeenCalledTimes(1);
    expect(buildCommonHeadersMock).toHaveBeenNthCalledWith(
      1,
      apiConfigMock,
      tokenMock,
      deviceTokenMock
    );

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenNthCalledWith(
      1,
      urlMock,
      undefined,
      'GET',
      commonHeadersMock,
      retryPolicyMock
    );
  });

  it('calls withRefreshToken with searchResponse and response if ok', async () => {
    await getAlternativeDrugPrice(
      apiConfigMock,
      ndcMock,
      ncpdpMock,
      tokenMock,
      deviceTokenMock,
      retryPolicyMock
    );

    expect(ensureGetPrescriptionPharmaciesResponseMock).toHaveBeenCalledTimes(
      1
    );

    expect(withRefreshTokenMock).toHaveBeenCalledTimes(1);
    expect(withRefreshTokenMock).toHaveBeenNthCalledWith(
      1,
      responseJsonMock,
      responseMock
    );
  });

  it('throws handleHttpErrors if response not ok', async () => {
    const expectedError = new Error('Failed');

    handleHttpErrorsMock.mockReturnValue(expectedError);

    const responseJsonMock2 = {
      code: 1,
      message: 'message-mock',
      status: 'status-mock',
    } as IFailureResponse;

    const responseMock2 = {
      json: jest.fn().mockReturnValue(responseJsonMock2),
      ok: false,
      data: {},
      status: 'status-mock',
    };

    callMock.mockReturnValue(responseMock2);

    try {
      await getAlternativeDrugPrice(
        apiConfigMock,
        ndcMock,
        ncpdpMock,
        tokenMock,
        deviceTokenMock,
        retryPolicyMock
      );
    } catch (error) {
      expect(handleHttpErrorsMock).toHaveBeenCalledTimes(1);
      expect(handleHttpErrorsMock).toHaveBeenNthCalledWith(
        1,
        responseMock.status,
        ErrorConstants.errorForGettingAlternativeDrugPrices,
        APITypes.GET_ALTERNATIVE_DRUG_PRICE,
        responseJsonMock2.code,
        responseJsonMock2
      );
      expect(error).toEqual(expectedError);
    }
  });
});
