// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IFhir } from '../../../models/fhir/fhir';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { getPharmaciesAndPricesForNdc } from '../../../utils/external-api/get-pharmacy-and-prices-for-ndc';
import { searchPharmaciesAndPrices } from './search-pharmacies-and-prices';
import { findPrescriberNPIForPrescriptionFhir } from '../../../utils/fhir/prescriber-npi.helper';

jest.mock('../../../utils/fhir/prescriber-npi.helper');
const findPrescriberNPIForPrescriptionFhirMock =
  findPrescriberNPIForPrescriptionFhir as jest.Mock;

jest.mock('../../../utils/external-api/get-pharmacy-and-prices-for-ndc');
const getPharmaciesAndPricesForNdcMock =
  getPharmaciesAndPricesForNdc as jest.Mock;

const isRTPBMock = true;
const useDualPriceMock = true;
const useTestThirdPartyPricingMock = false;
const responseMock = {} as Response;
const ndcMock = '00186077660';
const quantityMock = 50;
const supplyMock = 5;
const refillMock = '10';
const prescriptionMock = {
  resourceType: 'Bundle',
  id: 'mock',
  identifier: {
    value: 'MOCK-RXNUMBER',
  },
  entry: [
    { resource: { resourceType: 'Medication', code: { text: ndcMock } } },
    {
      resource: {
        resourceType: 'MedicationRequest',
        dispenseRequest: {
          numberOfRepeatsAllowed: parseInt(refillMock, 10),
          expectedSupplyDuration: { value: supplyMock },
          initialFill: { quantity: { value: quantityMock } },
        },
      },
    },
  ],
} as IFhir;
const latitudeMock = 10;
const longitudeMock = -20;
const distanceMock = 100;
const memberIdMock = 'member-id';
const groupPlanCodeMock = 'gpc';
const sortingAttributeMock = 'price';
const limitMock = 20;
const prescriberNpiMock = 'prescriber-npi-mock';

beforeEach(() => {
  jest.clearAllMocks();

  findPrescriberNPIForPrescriptionFhirMock.mockReturnValue(prescriberNpiMock);
});

describe('searchPharmaciesAndPrices', () => {
  it('Return error if api return error', async () => {
    const expected = {};
    getPharmaciesAndPricesForNdcMock.mockRejectedValueOnce(expected);
    try {
      await searchPharmaciesAndPrices(
        responseMock,
        prescriptionMock,
        latitudeMock,
        longitudeMock,
        distanceMock,
        configurationMock,
        memberIdMock,
        groupPlanCodeMock,
        sortingAttributeMock,
        limitMock,
        isRTPBMock,
        useDualPriceMock,
        useTestThirdPartyPricingMock
      );
    } catch (error) {
      expect(error).toBe(expected);
    }
    expect(getPharmaciesAndPricesForNdcMock).toBeCalledWith(
      responseMock,
      latitudeMock,
      longitudeMock,
      distanceMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      sortingAttributeMock,
      limitMock,
      ndcMock,
      quantityMock,
      supplyMock,
      refillMock,
      'MOCK-RXNUMBER',
      true,
      isRTPBMock,
      prescriberNpiMock,
      useDualPriceMock,
      useTestThirdPartyPricingMock
    );
  });

  it('Return pharmacy information with prices if api return success', async () => {
    const expected = {};
    getPharmaciesAndPricesForNdcMock.mockReturnValueOnce(expected);

    const actual = await searchPharmaciesAndPrices(
      responseMock,
      prescriptionMock,
      latitudeMock,
      longitudeMock,
      distanceMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      sortingAttributeMock,
      limitMock,
      isRTPBMock,
      useDualPriceMock,
      useTestThirdPartyPricingMock
    );

    expect(actual).toBe(expected);

    expect(getPharmaciesAndPricesForNdcMock).toBeCalledWith(
      responseMock,
      latitudeMock,
      longitudeMock,
      distanceMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      sortingAttributeMock,
      limitMock,
      ndcMock,
      quantityMock,
      supplyMock,
      refillMock,
      'MOCK-RXNUMBER',
      true,
      isRTPBMock,
      prescriberNpiMock,
      useDualPriceMock,
      useTestThirdPartyPricingMock
    );
  });
});
