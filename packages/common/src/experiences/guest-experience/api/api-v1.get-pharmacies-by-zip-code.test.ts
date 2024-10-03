// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { ErrorConstants } from '../../../theming/constants';
import { call } from '../../../utils/api.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { RequestHeaders } from './api-request-headers';
import { GuestExperienceConfig } from '../guest-experience-config';
import { getPharmaciesByZipCode } from './api-v1.get-pharmacies-by-zip-code';
import { ensureSearchPharmacyResponse } from './ensure-api-response/ensure-search-pharmacy-response';
import { IPharmacySearchResponse } from '../../../models/api-response/pharmacy-search.response';

jest.mock('../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('./ensure-api-response/ensure-search-pharmacy-response');
const ensureSearchPharmacyResponseMock = ensureSearchPharmacyResponse as jest.Mock;
jest.mock('./api-v1-helper', () => ({
  ...(jest.requireActual('./api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

const zipCodeMock = 'zip-code';
const tokenMock = 'token';
const deviceTokenMock = 'device-token';
describe('getPharmaciesByZipCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ensureSearchPharmacyResponseMock.mockReturnValue(true);
  });

  it('makes api request for unauth experience', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: [] }),
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    await getPharmaciesByZipCode(
      apiConfigMock,
      zipCodeMock,
      true,
      undefined,
      tokenMock,
      deviceTokenMock
    );

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/pharmacy/search?zipcode=${zipCodeMock}&start=0`;
    const expectedBody = undefined;
    const expectedHeaders = {
      ['Authorization']: 'token',
      ['x-prescryptive-device-token']: 'device-token',
      [RequestHeaders.apiVersion]: version
    };
    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'GET',
      expectedHeaders,
      undefined
    );
  });

  it('makes api request for auth experience', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: [] }),
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    await getPharmaciesByZipCode(
      apiConfigMock,
      zipCodeMock,
      false,
      undefined,
      tokenMock,
      deviceTokenMock
    );

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/pharmacy/auth-search?zipcode=${zipCodeMock}&start=0`;
    const expectedBody = undefined;
    const expectedHeaders = {
      ['Authorization']: 'token',
      ['x-prescryptive-device-token']: 'device-token',
      [RequestHeaders.apiVersion]: version
    };

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'GET',
      expectedHeaders,
      undefined
    );
  });
  it('makes api request with value of start if pased', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: [] }),
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    await getPharmaciesByZipCode(
      apiConfigMock,
      zipCodeMock,
      true,
      '20',
      tokenMock,
      deviceTokenMock
    );

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/pharmacy/search?zipcode=${zipCodeMock}&start=20`;
    const expectedBody = undefined;
    const expectedHeaders = {
      ['Authorization']: 'token',
      ['x-prescryptive-device-token']: 'device-token',
      [RequestHeaders.apiVersion]: version
    };
    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'GET',
      expectedHeaders,
      undefined
    );
  });
  it('throws error if response format invalid', async () => {
    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;
    const errorMock = new Error('Boom!');
    ensureSearchPharmacyResponseMock.mockImplementation(() => {
      throw errorMock;
    });

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    try {
      await getPharmaciesByZipCode(
        apiConfigMock,
        zipCodeMock,
        true,
        undefined,
        tokenMock,
        deviceTokenMock
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(errorMock);
    }
  });

  it('returns response', async () => {
    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;
    const responseMock: IPharmacySearchResponse = {
      data: [],
      message: '',
      status: 'success',
    };
    const expectedResponse: IPharmacySearchResponse = {
      ...responseMock,
      data: [],
    };

    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue(responseMock),
      ok: true,
    });

    const response = await getPharmaciesByZipCode(
      apiConfigMock,
      zipCodeMock,
      true,
      undefined,
      tokenMock,
      deviceTokenMock
    );
    expect(response).toEqual(expectedResponse);
  });

  it('includes refresh token in response', async () => {
    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;
    const refreshToken = 'refresh-token';
    const headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);

    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: [] }),
      ok: true,
      headers,
    });

    const response = await getPharmaciesByZipCode(
      apiConfigMock,
      zipCodeMock,
      true,
      undefined,
      tokenMock,
      deviceTokenMock
    );

    expect(response.refreshToken).toEqual(refreshToken);
  });

  it('throws error if response failed', async () => {
    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;
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
      await getPharmaciesByZipCode(
        apiConfigMock,
        zipCodeMock,
        true,
        undefined,
        tokenMock,
        deviceTokenMock
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForGettingPharmacies(zipCodeMock),
      APITypes.GET_PHARMACIES,
      errorCode,
      {
        code: errorCode,
      }
    );
  });
});
