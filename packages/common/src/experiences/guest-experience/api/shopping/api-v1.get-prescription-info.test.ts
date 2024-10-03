// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../../errors/error-codes';
import { ErrorConstants } from '../../../../theming/constants';
import { call, IApiConfig } from '../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../api-v1-helper';
import { RequestHeaders } from '../api-request-headers';
import { getPrescriptionInfo } from './api-v1.get-prescription-info';
import { GuestExperienceConfig } from '../../guest-experience-config';
import { ensureGetPrescriptionInfoResponse } from '../ensure-api-response/ensure-get-prescription-info-response';
import { IPrescriptionInfoResponse } from '../../../../models/api-response/prescryption-info.response';
import { prescriptionInfoMock } from '../../__mocks__/prescription-info.mock';
import { IPrescriptionInfo } from '../../../../models/prescription-info';

jest.mock('../../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('../ensure-api-response/ensure-get-prescription-info-response');
const ensureGetPrescriptionInfoResponseMock =
  ensureGetPrescriptionInfoResponse as jest.Mock;

jest.mock('../api-v1-helper', () => ({
  ...(jest.requireActual('../api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

describe('getPrescriptionInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    ensureGetPrescriptionInfoResponseMock.mockReturnValue(true);
  });

  it('makes api request', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: {} }),
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const prescriptionIdMock = 'prescription-id';
    const retryPolicyMock = {} as IRetryPolicy;

    await getPrescriptionInfo(
      apiConfigMock,
      prescriptionIdMock,
      authTokenMock,
      deviceTokenMock,
      retryPolicyMock
    );

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/prescription/${prescriptionIdMock}`;
    const expectedBody = undefined;
    const expectedHeaders = {
      Authorization: authTokenMock,
      'x-prescryptive-device-token': deviceTokenMock,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'GET',
      expectedHeaders,
      retryPolicyMock
    );
  });

  it('throws error if response format invalid', async () => {
    const errorMock = new Error('Boom!');
    ensureGetPrescriptionInfoResponseMock.mockImplementation(() => {
      throw errorMock;
    });

    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    try {
      await getPrescriptionInfo(
        GuestExperienceConfig.apis.guestExperienceApi,
        'prescription-id'
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(errorMock);
    }
  });

  it('returns response', async () => {
    const responseData: IPrescriptionInfo = {
      ...prescriptionInfoMock,
      orderDate:
        prescriptionInfoMock.orderDate?.toISOString() as unknown as Date, // emulate serialized date
    };

    const responseMock: IPrescriptionInfoResponse = {
      data: responseData,
      message: '',
      status: 'success',
    };

    const expectedResponse = {
      ...responseMock,
      data: prescriptionInfoMock,
    };

    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue(responseMock),
      ok: true,
    });

    const response = await getPrescriptionInfo(
      GuestExperienceConfig.apis.guestExperienceApi,
      'prescription-id'
    );
    expect(response).toEqual(expectedResponse);
  });

  it('includes refresh token in response', async () => {
    const refreshToken = 'refresh-token';
    const headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);

    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: {} }),
      ok: true,
      headers,
    });

    const response = await getPrescriptionInfo(
      GuestExperienceConfig.apis.guestExperienceApi,
      'prescription-id'
    );

    expect(response.refreshToken).toEqual(refreshToken);
  });

  it('throws error if response failed', async () => {
    const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const expectedError = Error('Failed');
    const errorCode = 1;

    mockCall.mockResolvedValue({
      json: () => ({
        code: errorCode,
      }),
      ok: false,
      status: statusCode,
    });

    mockHandleHttpErrors.mockReturnValue(expectedError);

    try {
      await getPrescriptionInfo(
        GuestExperienceConfig.apis.guestExperienceApi,
        'prescription-id'
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForGettingPrescriptionInfo,
      APITypes.GET_PRESCRIPTION_INFO,
      errorCode,
      {
        code: errorCode,
      }
    );
  });

  it('makes v2 api request', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: {} }),
      ok: true,
    });

    const apiConfigMock: IApiConfig = {
      ...GuestExperienceConfig.apis.guestExperienceApi,
      env: {
        ...GuestExperienceConfig.apis.guestExperienceApi.env,
        version: 'v2',
        url: '/api',
      },
    };

    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const prescriptionIdMock = 'prescription-id';
    const retryPolicyMock = {} as IRetryPolicy;

    await getPrescriptionInfo(
      apiConfigMock,
      prescriptionIdMock,
      authTokenMock,
      deviceTokenMock,
      retryPolicyMock,
      true
    );

    const expectedAdditionalParams = '?blockchain=true';

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/prescription/${prescriptionIdMock}${expectedAdditionalParams}`;
    const expectedBody = undefined;
    const expectedHeaders = {
      Authorization: authTokenMock,
      'x-prescryptive-device-token': deviceTokenMock,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'GET',
      expectedHeaders,
      retryPolicyMock
    );
  });
});
