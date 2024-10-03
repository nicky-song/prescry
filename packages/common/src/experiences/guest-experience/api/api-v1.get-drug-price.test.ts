// Copyright 2021 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { call } from '../../../utils/api.helper';
import { RequestHeaders } from './api-request-headers';
import { GuestExperienceConfig } from '../guest-experience-config';
import { ensureGetPrescriptionPharmaciesResponse } from './ensure-api-response/ensure-get-prescription-pharmacies-response';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../__mocks__/pharmacy-drug-price.mock';
import { IPharmacyPriceSearchResponse } from '../../../models/api-response/pharmacy-price-search.response';
import { getDrugPrice } from './api-v1.get-drug-price';
import { ILocationCoordinates } from '../../../models/location-coordinates';

jest.mock('../../../utils/api.helper', () => ({
  ...(jest.requireActual('../../../utils/api.helper') as object),
  call: jest.fn(),
}));
const mockCall = call as jest.Mock;

jest.mock('./ensure-api-response/ensure-get-prescription-pharmacies-response');
const ensureGetPrescriptionPharmaciesResponseMock =
  ensureGetPrescriptionPharmaciesResponse as jest.Mock;
jest.mock('./api-v1-helper', () => ({
  ...(jest.requireActual('./api-v1-helper') as object),
  handleHttpErrors: jest.fn(),
}));

const locationMock = { zipCode: 'zip-code' } as ILocationCoordinates;
const ndcMock = 'ndc';
const supplyMock = 5;
const quantityMock = 10;
const sortByMock = 'youpay';
const distanceMock = 25;

const tokenMock = 'token';
const deviceTokenMock = 'device-token';

describe('getDrugPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    ensureGetPrescriptionPharmaciesResponseMock.mockReturnValue(true);
  });

  it('makes api request for unauth flow', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: { pharmacyPrices: [] } }),
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    await getDrugPrice(
      apiConfigMock,
      locationMock,
      sortByMock,
      ndcMock,
      supplyMock,
      quantityMock,
      true,
      distanceMock
    );

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/drug/search-price?zipcode=${locationMock.zipCode}&latitude=&longitude=&ndc=${ndcMock}&supply=${supplyMock}&quantity=${quantityMock}&sortby=${sortByMock}&distance=${distanceMock}`;
    const expectedBody = undefined;

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'GET',
      {
        [RequestHeaders.apiVersion]: version
      },
      undefined
    );
  });

  it('makes api request for unauth flow with coordinates if provided', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: { pharmacyPrices: [] } }),
      ok: true,
    });

    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;
    const locationWithCoordinatesMock = {
      ...locationMock,
      latitude: 43,
      longitude: -122,
    };

    await getDrugPrice(
      apiConfigMock,
      locationWithCoordinatesMock,
      sortByMock,
      ndcMock,
      supplyMock,
      quantityMock,
      true,
      distanceMock
    );

    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/drug/search-price?zipcode=${locationWithCoordinatesMock.zipCode}&latitude=${locationWithCoordinatesMock.latitude}&longitude=${locationWithCoordinatesMock.longitude}&ndc=${ndcMock}&supply=${supplyMock}&quantity=${quantityMock}&sortby=${sortByMock}&distance=${distanceMock}`;
    const expectedBody = undefined;

    expect(mockCall).toHaveBeenCalledWith(
      expectedUrl,
      expectedBody,
      'GET',
      {
        [RequestHeaders.apiVersion]: version
      },
      undefined
    );
  });

  it('makes api request for auth "pick up pharmacy" flow', async () => {
    mockCall.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: { pharmacyPrices: [] } }),
      ok: true,
    });
    const apiConfigMock = GuestExperienceConfig.apis.guestExperienceApi;

    await getDrugPrice(
      apiConfigMock,
      locationMock,
      sortByMock,
      ndcMock,
      supplyMock,
      quantityMock,
      false,
      distanceMock,
      tokenMock,
      deviceTokenMock,
      undefined
    );
    const { protocol, host, port, url, version } = apiConfigMock.env;
    const expectedUrl = `${protocol}://${host}:${port}${url}/drug/auth-search-price?zipcode=${locationMock.zipCode}&latitude=&longitude=&ndc=${ndcMock}&supply=${supplyMock}&quantity=${quantityMock}&sortby=${sortByMock}&distance=${distanceMock}`;
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
      await getDrugPrice(
        GuestExperienceConfig.apis.guestExperienceApi,
        locationMock,
        sortByMock,
        ndcMock,
        supplyMock,
        quantityMock,
        true,
        distanceMock,
        undefined,
        undefined,
        undefined
      );
      fail('Exception expected but none thrown!');
    } catch (ex) {
      expect(ex).toEqual(errorMock);
    }
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

    const response = await getDrugPrice(
      GuestExperienceConfig.apis.guestExperienceApi,
      locationMock,
      sortByMock,
      ndcMock,
      supplyMock,
      quantityMock,
      true,
      distanceMock,
      undefined,
      undefined,
      undefined
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

    const response = await getDrugPrice(
      GuestExperienceConfig.apis.guestExperienceApi,
      locationMock,
      sortByMock,
      ndcMock,
      supplyMock,
      quantityMock,
      true,
      distanceMock
    );

    expect(response.refreshToken).toEqual(refreshToken);
  });
});
