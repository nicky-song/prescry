// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorConstants } from '../../../theming/constants';
import { call, IApiConfig } from '../../../utils/api.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { verifyPrescription } from './api-v1.verify-prescription';
import { ensureVerifyPrescriptionResponse } from './ensure-api-response/ensure-verify-prescription-response';
import { IVerifyPrescriptionRequestBody } from '../../../models/api-request-body/verify-prescription.request-body';
import { RequestHeaders } from './api-request-headers';

jest.mock('../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('./api-v1-helper', () => ({
  ...(jest.requireActual('./api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

jest.mock('./ensure-api-response/ensure-verify-prescription-response');
const ensureVerifyPrescriptionResponseMock =
  ensureVerifyPrescriptionResponse as jest.Mock;
const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    verifyPrescription: '/prescription/verify/:prescriptionId',
  },
};

const requestBody: IVerifyPrescriptionRequestBody = {
  firstName: 'Johnny',
  lastName: 'AppleSeed',
  dateOfBirth: 'January-01-2010',
};

const mockResponse = {
  message: 'all good',
  status: 'ok',
};

describe('verifyPrescription', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockHandleHttpErrors.mockReset();
  });

  it('makes expected api request', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });
    ensureVerifyPrescriptionResponseMock.mockReturnValueOnce({
      data: { phoneNumber: '+1PhoneNumber' },
    });
    const prescriptionIdMock = 'test-prescription-id';

    await verifyPrescription(mockConfig, requestBody, prescriptionIdMock);

    const { protocol, host, port, url, version } = mockConfig.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/prescription/verify/${prescriptionIdMock}`;
    const expectedHeaders = {
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      requestBody,
      'POST',
      expectedHeaders
    );
  });

  it('returns expected response', async () => {
    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });
    ensureVerifyPrescriptionResponseMock.mockReturnValueOnce({
      data: { phoneNumber: '+1PhoneNumber' },
    });
    const response = await verifyPrescription(mockConfig, requestBody);
    expect(response).toEqual(mockResponse);
  });

  it('should call handleHttpErrors in case of error', async () => {
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
      await verifyPrescription(mockConfig, requestBody);
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorInVerifyingPrescription,
      APITypes.VERIFY_MEMBERSHIP,
      errorCode,
      {
        code: errorCode,
      }
    );
  });

  it('makes V2 api request', async () => {
    const mockConfigV2: IApiConfig = {
      env: {
        host: 'localhost',
        port: '4300',
        protocol: 'https',
        version: 'v2',
        url: '/api',
      },
      paths: {
        verifyPrescription: '/prescription/verify/:prescriptionId',
      },
    };

    mockCall.mockResolvedValue({
      json: () => mockResponse,
      ok: true,
    });
    ensureVerifyPrescriptionResponseMock.mockReturnValueOnce({
      data: { phoneNumber: '+1PhoneNumber' },
    });
    const prescriptionIdMock = 'test-prescription-id';

    const requestBodyBlockchain: IVerifyPrescriptionRequestBody = {
      ...requestBody,
      blockchain: true,
    };

    await verifyPrescription(
      mockConfigV2,
      requestBodyBlockchain,
      prescriptionIdMock
    );

    const { protocol, host, port, url, version } = mockConfigV2.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/prescription/verify/${prescriptionIdMock}`;
    const expectedHeaders = {
      [RequestHeaders.apiVersion]: version,
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      requestBodyBlockchain,
      'POST',
      expectedHeaders
    );
  });
});
