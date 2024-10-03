// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../../errors/error-codes';
import { ErrorConstants } from '../../../../theming/constants';
import { call } from '../../../../utils/api.helper';
import { IRetryPolicy } from '../../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from '../api-v1-helper';
import { RequestHeaders } from '../api-request-headers';
import { GuestExperienceConfig } from '../../guest-experience-config';
import { getPrescriptionPharmacies } from './api-v1.get-prescription-pharmacies';
import { ensureGetPrescriptionPharmaciesResponse } from '../ensure-api-response/ensure-get-prescription-pharmacies-response';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../../__mocks__/pharmacy-drug-price.mock';
import { IPharmacyPriceSearchResponse } from '../../../../models/api-response/pharmacy-price-search.response';

jest.mock('../../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('../ensure-api-response/ensure-get-prescription-pharmacies-response');
const ensureGetPrescriptionPharmaciesResponseMock =
  ensureGetPrescriptionPharmaciesResponse as jest.Mock;

jest.mock('../api-v1-helper', () => ({
  ...(jest.requireActual('../api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));
const mockHandleHttpErrors = handleHttpErrors as jest.Mock;

const locationMock = { zipCode: 'zip-code' };
const prescriptionIdMock = 'prescription-id';
const sortByMock = 'youpay';
const distanceMock = 25;

describe('getPrescriptionPharmacies', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    ensureGetPrescriptionPharmaciesResponseMock.mockReturnValue(true);
  });

  it('makes api request', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: { pharmacyPrices: [] } }),
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const retryPolicyMock = {} as IRetryPolicy;

    await getPrescriptionPharmacies(
      apiConfigMock,
      locationMock,
      sortByMock,
      prescriptionIdMock,
      distanceMock,
      authTokenMock,
      deviceTokenMock,
      retryPolicyMock,
      undefined
    );

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/prescription/search-pharmacy/${prescriptionIdMock}?zipcode=${locationMock.zipCode}&latitude=&longitude=&sortby=${sortByMock}&distance=${distanceMock}`;
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

  it('makes api request with coordinates if provided', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: { pharmacyPrices: [] } }),
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const retryPolicyMock = {} as IRetryPolicy;
    const locationWithCoordinatesMock = {
      ...locationMock,
      latitude: 43,
      longitude: -122,
    };

    await getPrescriptionPharmacies(
      apiConfigMock,
      locationWithCoordinatesMock,
      sortByMock,
      prescriptionIdMock,
      distanceMock,
      authTokenMock,
      deviceTokenMock,
      retryPolicyMock,
      undefined
    );

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/prescription/search-pharmacy/${prescriptionIdMock}?zipcode=${locationWithCoordinatesMock.zipCode}&latitude=${locationWithCoordinatesMock.latitude}&longitude=${locationWithCoordinatesMock.longitude}&sortby=${sortByMock}&distance=${distanceMock}`;
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
    ensureGetPrescriptionPharmaciesResponseMock.mockImplementation(() => {
      throw errorMock;
    });

    mockCall.mockResolvedValue({
      json: () => ({}),
      ok: true,
      status: HttpStatusCodes.SUCCESS,
    });

    try {
      await getPrescriptionPharmacies(
        GuestExperienceConfig.apis.guestExperienceApi,
        locationMock,
        sortByMock,
        prescriptionIdMock,
        distanceMock
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(errorMock);
    }
  });

  it('returns response', async () => {
    const responseMock: IPharmacyPriceSearchResponse = {
      data: {
        pharmacyPrices: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
      },
      message: '',
      status: 'success',
    };
    const expectedResponse: IPharmacyPriceSearchResponse = {
      ...responseMock,
      data: {
        pharmacyPrices: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
      },
    };

    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue(responseMock),
      ok: true,
    });

    const response = await getPrescriptionPharmacies(
      GuestExperienceConfig.apis.guestExperienceApi,
      locationMock,
      sortByMock,
      prescriptionIdMock,
      distanceMock
    );
    expect(response).toEqual(expectedResponse);
  });

  it('returns response with bestPricePharmacy', async () => {
    const responseMock: IPharmacyPriceSearchResponse = {
      data: {
        bestPricePharmacy: pharmacyDrugPrice1Mock,
        pharmacyPrices: [pharmacyDrugPrice2Mock],
      },
      message: '',
      status: 'success',
    };
    const expectedResponse: IPharmacyPriceSearchResponse = {
      ...responseMock,
      data: {
        bestPricePharmacy: pharmacyDrugPrice1Mock,
        pharmacyPrices: [pharmacyDrugPrice2Mock],
      },
    };

    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue(responseMock),
      ok: true,
    });

    const response = await getPrescriptionPharmacies(
      GuestExperienceConfig.apis.guestExperienceApi,
      locationMock,
      sortByMock,
      prescriptionIdMock,
      distanceMock
    );
    expect(response).toEqual(expectedResponse);
  });

  it('includes refresh token in response', async () => {
    const refreshToken = 'refresh-token';
    const headers = new Headers();
    headers.append(RequestHeaders.refreshAccountToken, refreshToken);

    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: { pharmacyPrices: [] } }),
      ok: true,
      headers,
    });

    const response = await getPrescriptionPharmacies(
      GuestExperienceConfig.apis.guestExperienceApi,
      locationMock,
      sortByMock,
      prescriptionIdMock,
      distanceMock
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
      await getPrescriptionPharmacies(
        GuestExperienceConfig.apis.guestExperienceApi,
        locationMock,
        sortByMock,
        prescriptionIdMock,
        distanceMock
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(expectedError);
    }

    expect(mockHandleHttpErrors).toHaveBeenCalledWith(
      statusCode,
      ErrorConstants.errorForGettingPrescriptionPharmacies,
      APITypes.GET_PRESCRIPTION_PHARMACIES,
      errorCode,
      {
        code: errorCode,
      }
    );
  });

  it('makes V3 api request when blockchain parameter is true', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: { pharmacyPrices: [] } }),
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    const authTokenMock = 'auth-token';
    const deviceTokenMock = 'device-token';
    const retryPolicyMock = {} as IRetryPolicy;

    await getPrescriptionPharmacies(
      apiConfigMock,
      locationMock,
      sortByMock,
      prescriptionIdMock,
      distanceMock,
      authTokenMock,
      deviceTokenMock,
      retryPolicyMock,
      true
    );

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/prescription/search-pharmacy/${prescriptionIdMock}?zipcode=${locationMock.zipCode}&latitude=&longitude=&sortby=${sortByMock}&distance=${distanceMock}&blockchain=true`;
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
