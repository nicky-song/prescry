// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { HttpStatusCodes } from '../../../../errors/error-codes';
import { IPrescriptionUserStatusResponse } from '../../../../models/api-response/prescription-user-status-response';
import { ErrorConstants } from '../../../../theming/constants';
import { buildUrl, call, IApiConfig } from '../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../api-v1-helper';
import { getPrescriptionUserStatus } from './api-v1.get-prescription-user-status';

jest.mock('../../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../../utils/api.helper') as object),
  call: jest.fn(),
  buildUrl: jest.fn(),
  buildCommonHeaders: jest.fn(),
}));

jest.mock('../api-v1-helper', () => ({
  ...(jest.requireActual('../api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockBuildURL = buildUrl as jest.Mock;
const mockCall = call as jest.Mock;
const handleHttpErrorsMock = handleHttpErrors as jest.Mock;

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    prescrition: '/prescription/',
  },
};

const mockRetryPolicy = {} as IRetryPolicy;

const mockResponse: IPrescriptionUserStatusResponse = {
  data: {
    personExists: true,
  },
  message: '',
  status: 'success',
};
const prescriptionIdMock = 'prescription-id';
const retryPolicyMock = {} as IRetryPolicy;

describe('getPrescriptionUserStatus', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockBuildURL.mockReset();
    mockBuildURL.mockReturnValue('route-url');
    handleHttpErrorsMock.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getPrescriptionUserStatus(
      mockConfig,
      prescriptionIdMock,
      retryPolicyMock
    );

    const expectedUrl = buildUrl(mockConfig, 'prescriptionUserStatus', {
      ':identifier': prescriptionIdMock,
    });

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      undefined,
      'GET',
      undefined,
      mockRetryPolicy
    );
  });

  it('throws expected error if response invalid', async () => {
    const statusCode = HttpStatusCodes.SUCCESS;
    const expectedError = new ErrorApiResponse(
      ErrorConstants.errorInternalServer()
    );

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      status: statusCode,
    });

    try {
      await getPrescriptionUserStatus(
        mockConfig,
        prescriptionIdMock,
        retryPolicyMock
      );

      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }
  });

  it('returns expected response', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    const response = await getPrescriptionUserStatus(
      mockConfig,
      prescriptionIdMock,
      retryPolicyMock
    );

    const expectedResponse = mockResponse;

    expect(response).toEqual(expectedResponse);
  });

  it('throws expected error if response failed', async () => {
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

    handleHttpErrorsMock.mockReturnValue(expectedError);

    try {
      await getPrescriptionUserStatus(
        mockConfig,
        prescriptionIdMock,
        retryPolicyMock
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(handleHttpErrorsMock).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorInGettingUserStatus,
      APITypes.GET_PRESCRIPTION_USER_STATUS,
      errorCode,
      {
        code: errorCode,
      }
    );
  });

  it('makes expected V2 api request', async () => {
    const mockV2Config: IApiConfig = {
      env: {
        host: 'localhost',
        port: '4300',
        protocol: 'https',
        version: 'v2',
        url: '/api',
      },
      paths: {
        prescrition: '/prescription/',
      },
    };

    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });

    await getPrescriptionUserStatus(
      mockV2Config,
      prescriptionIdMock,
      retryPolicyMock
    );

    const expectedAdditionalParams = '?blockchain=true';

    const expectedUrl = buildUrl(
      mockConfig,
      'prescriptionUserStatus',
      {
        ':identifier': prescriptionIdMock,
      },
      expectedAdditionalParams
    );

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      undefined,
      'GET',
      undefined,
      mockRetryPolicy
    );
  });
});
