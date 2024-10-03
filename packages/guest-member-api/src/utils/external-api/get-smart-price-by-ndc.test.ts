// Copyright 2021 Prescryptive Health, Inc.

import { getDataFromUrl } from '../get-data-from-url';
import { generateSmartPriceToken } from './generate-smart-price-token';
import { ISmartPriceProviderPrice } from '../../models/content/smart-price.response';

import { configurationMock } from '../../mock-data/configuration.mock';
import { getSmartPriceByNdc } from './get-smart-price-by-ndc';
import { smartPricePharmacyPriceMock1 } from '../../mock-data/smart-price-pharmacy-price.mock';
import { ISmartPriceLookupRequest } from '../../models/content/smart-price.request';

jest.mock('../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

jest.mock('./generate-smart-price-token');
const generateSmartPriceTokenMock = generateSmartPriceToken as jest.Mock;

const patientPriceMock = {
  providerIds: ['1234'],
  date: '2021-10-12',
  quantity: 1,
  daysSupply: 10,
} as ISmartPriceLookupRequest;
const ndcMock = 'ndc1';

describe('getSmartPriceByNdc', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return error if api return error', async () => {
    const mockError = {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid token.',
    };
    const tokenMock = 'token';
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 401,
    });
    generateSmartPriceTokenMock.mockReturnValueOnce(tokenMock);
    const actual = await getSmartPriceByNdc(
      patientPriceMock,
      ndcMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/pricing-smart-prices/calculate/ndc1/NDC/',
      {
        date: '2021-10-12',
        daysSupply: 10,
        providerIds: ['1234'],
        quantity: 1,
      },
      'POST',
      {
        ['Authorization']: `Bearer ${tokenMock}`,
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    const expectedResponse = {
      errorCode: 401,
      message: 'Unauthorized : Invalid token.',
    };
    expect(actual).toEqual(expectedResponse);
  });

  it('Return pharmacy prices if api return success', async () => {
    const mockPharmacyPrices = [
      smartPricePharmacyPriceMock1 as ISmartPriceProviderPrice,
    ];
    const tokenMock = 'token';
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockPharmacyPrices,
      ok: true,
      status: 200,
    });
    generateSmartPriceTokenMock.mockReturnValueOnce(tokenMock);
    const actual = await getSmartPriceByNdc(
      patientPriceMock,
      ndcMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'content-api-url/pricing-smart-prices/calculate/ndc1/NDC/',
      {
        date: '2021-10-12',
        daysSupply: 10,
        providerIds: ['1234'],
        quantity: 1,
      },
      'POST',
      {
        ['Authorization']: `Bearer ${tokenMock}`,
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    const expectedResponse = {
      pharmacyPrices: mockPharmacyPrices,
    };
    expect(actual).toEqual(expectedResponse);
  });
});
