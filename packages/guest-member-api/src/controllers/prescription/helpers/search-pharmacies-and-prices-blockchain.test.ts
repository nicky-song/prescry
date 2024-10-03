// Copyright 2022 Prescryptive Health, Inc.

import { Response } from 'express';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { getPharmaciesAndPricesForNdc } from '../../../utils/external-api/get-pharmacy-and-prices-for-ndc';
import { searchPharmaciesAndPricesBlockchain } from './search-pharmacies-and-prices-blockchain';
import { prescriptionBlockchainFhirMock } from '../mock/get-mock-fhir-object';
import { findPrescriberNPIForPrescriptionFhir } from '../../../utils/fhir/prescriber-npi.helper';

jest.mock('../../../utils/fhir/prescriber-npi.helper');
const findPrescriberNPIForPrescriptionFhirMock =
  findPrescriberNPIForPrescriptionFhir as jest.Mock;

jest.mock('../../../utils/external-api/get-pharmacy-and-prices-for-ndc');
const getPharmaciesAndPricesForNdcMock =
  getPharmaciesAndPricesForNdc as jest.Mock;

const responseMock = {} as Response;
const ndcMock = '59746017210';
const quantityMock = 24;
const supplyMock = 6;
const refillMock = '1';
const latitudeMock = 10;
const longitudeMock = -20;
const distanceMock = 100;
const memberIdMock = 'member-id';
const groupPlanCodeMock = 'gpc';
const sortingAttributeMock = 'price';
const limitMock = 20;
const isRTPBMock = true;
const useDualPriceMock = true;
const prescriberNpiMock = 'prescriber-npi-mock';
const useTestThirdPartyPricingMock = false;

beforeEach(() => {
  jest.clearAllMocks();

  findPrescriberNPIForPrescriptionFhirMock.mockReturnValue(prescriberNpiMock);
});

describe('searchPharmaciesAndPrices', () => {
  it('Return error if api return error', async () => {
    const expected = {};
    getPharmaciesAndPricesForNdcMock.mockRejectedValueOnce(expected);
    try {
      await searchPharmaciesAndPricesBlockchain(
        responseMock,
        prescriptionBlockchainFhirMock,
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

    const actual = await searchPharmaciesAndPricesBlockchain(
      responseMock,
      prescriptionBlockchainFhirMock,
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
