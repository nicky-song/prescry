// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../../errors/error-codes';
import { ErrorConstants } from '../../../../theming/constants';
import { call, IApiConfig } from '../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../api-v1-helper';
import { RequestHeaders } from '../api-request-headers';
import { GuestExperienceConfig } from '../../guest-experience-config';
import { ensureApiResponse } from '../ensure-api-response/ensure-api-response';
import { sendPrescription } from './api-v1.send-prescription';
import { IPrescriptionSendRequestBody } from '../../../../models/api-request-body/prescription-send.request-body';
import { IApiResponse } from '../../../../models/api-response';

jest.mock('../../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('../ensure-api-response/ensure-api-response');
const ensureApiResponseMock = ensureApiResponse as jest.Mock;

jest.mock('../api-v1-helper', () => ({
  ...(jest.requireActual('../api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

describe('sendPrescription', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    ensureApiResponseMock.mockReturnValue(true);
  });

  it('makes api request', async () => {
    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const ncpdpMock = 'ncpdp';
    const prescriptionIdMock = 'prescription-id';
    const retryPolicyMock = {} as IRetryPolicy;

    await sendPrescription(
      apiConfigMock,
      ncpdpMock,
      prescriptionIdMock,
      authTokenMock,
      deviceTokenMock,
      retryPolicyMock
    );

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/prescription/send-prescription`;
    const expectedBody: IPrescriptionSendRequestBody = {
      identifier: prescriptionIdMock,
      ncpdp: ncpdpMock,
    };
    const expectedHeaders = {
      Authorization: authTokenMock,
      'x-prescryptive-device-token': deviceTokenMock,
      [RequestHeaders.apiVersion]: version,
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      retryPolicyMock
    );
  });

  it('makes V2 api request', async () => {
    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
    });

    const mockV2Config: IApiConfig = {
      env: {
        host: 'localhost',
        port: '4300',
        protocol: 'https',
        version: 'v2',
        url: '/api',
      },
      paths: {
        prescriptionSend: '/prescription/send-prescription',
      },
    };

    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const ncpdpMock = 'ncpdp';
    const prescriptionIdMock = 'prescription-id';
    const retryPolicyMock = {} as IRetryPolicy;

    await sendPrescription(
      mockV2Config,
      ncpdpMock,
      prescriptionIdMock,
      authTokenMock,
      deviceTokenMock,
      retryPolicyMock,
      true
    );

    const expectedAdditionalParams = '?blockchain=true';

    const { protocol, host, port, url, version } = mockV2Config.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/prescription/send-prescription${expectedAdditionalParams}`;
    const expectedBody: IPrescriptionSendRequestBody = {
      identifier: prescriptionIdMock,
      ncpdp: ncpdpMock,
    };
    const expectedHeaders = {
      Authorization: authTokenMock,
      'x-prescryptive-device-token': deviceTokenMock,
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'POST',
      expectedHeaders,
      retryPolicyMock
    );
  });

  it('throws error if response format invalid', async () => {
    const errorMock = new Error('Boom!');
    ensureApiResponseMock.mockImplementation(() => {
      throw errorMock;
    });

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    try {
      await sendPrescription(
        GuestExperienceConfig.apis.guestExperienceApi,
        'ncpdp',
        'prescription-id'
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(errorMock);
    }
  });

  it('returns response', async () => {
    const responseMock: IApiResponse = {
      message: '',
      status: 'success',
    };

    mockCall.mockResolvedValue({
      json: () => responseMock,
      ok: true,
    });

    const response = await sendPrescription(
      GuestExperienceConfig.apis.guestExperienceApi,
      'ncpdp',
      'prescription-id'
    );
    expect(response).toEqual(responseMock);
  });

  it('includes refresh token in response', async () => {
    const refreshToken = 'refresh-token';
    const headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      headers,
    });

    const response = await sendPrescription(
      GuestExperienceConfig.apis.guestExperienceApi,
      'ncpdp',
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
      await sendPrescription(
        GuestExperienceConfig.apis.guestExperienceApi,
        'ncpdp',
        'prescription-id'
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorSendingPrescription,
      APITypes.SEND_PRESCRIPTION,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});
