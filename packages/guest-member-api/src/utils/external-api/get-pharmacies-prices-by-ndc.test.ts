// Copyright 2021 Prescryptive Health, Inc.

import { getDataFromUrl } from '../get-data-from-url';
import { IPatientPriceRequest } from '../../models/platform/pharmacy-pricing-lookup.request';
import { getPharmaciesPricesByNdc } from './get-pharmacies-prices-by-ndc';
import { IPharmacyPrice } from '../../models/platform/pharmacy-pricing-lookup.response';
import { configurationMock } from '../../mock-data/configuration.mock';

jest.mock('../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

const patientPriceMock = {
  pharmacyIds: [],
  fillDate: '',
  quantity: 0,
  daysSupply: 0,
  groupPlanCode: '',
  memberId: 'id',
  ndcs: [],
  refillNo: '0',
  rxNumber: '12345',
} as IPatientPriceRequest;

describe('getPharmaciesPricesByGpi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return undefined if api return error', async () => {
    const mockError = 'One or more validation errors occurred.';
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 400,
    });
    const actual = await getPharmaciesPricesByNdc(
      patientPriceMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-gears-url/pharmacypricing/getbestpharmacydrugprices',
      {
        daysSupply: 0,
        fillDate: '',
        groupPlanCode: '',
        memberId: 'id',
        ndcs: [],
        pharmacyIds: [],
        quantity: 0,
        refillNo: '0',
        rxNumber: '12345',
      },
      'POST',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    const expectedResponse = {
      errorCode: 400,
      message: 'One or more validation errors occurred.',
    };
    expect(actual).toEqual(expectedResponse);
  });

  it('Return pharmacy prices if api return success', async () => {
    const mockPharmacyPrices = [
      {
        daysSupply: 20,
        fillDate: new Date().toISOString(),
        nationalDrugCode: '123',
        pharmacyId: 'id',
        copayAmount: 20,
        patientAmountDue: 20,
        totalPrice: 30,
        totalAmountPaid: 20,
        genericProductIdentifier: 'gpi',
        patientPayAmount: 10,
      } as IPharmacyPrice,
    ];
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockPharmacyPrices,
      ok: true,
      status: 200,
    });
    const actual = await getPharmaciesPricesByNdc(
      patientPriceMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-gears-url/pharmacypricing/getbestpharmacydrugprices',
      {
        daysSupply: 0,
        fillDate: '',
        groupPlanCode: '',
        memberId: 'id',
        pharmacyIds: [],
        quantity: 0,
        ndcs: [],
        refillNo: '0',
        rxNumber: '12345',
      },
      'POST',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
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
