// Copyright 2021 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../../provider-location/helpers/oauth-api-helper';
import { prescriptionWithPharmacyFhirMock } from '../mock/get-mock-fhir-object';
import { transferPrescriptionEndpointHelper } from './transfer-prescription-endpoint.helper';

jest.mock('../../provider-location/helpers/oauth-api-helper');
jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;
const generateBearerTokenMock = generateBearerToken as jest.Mock;

describe('Transfer Prescription Endpoint Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    generateBearerTokenMock.mockReturnValue('token');
  });

  it('makes expected api request and return response if success', async () => {
    const successResponse = 'bundleId';
    getDataFromUrlMock.mockResolvedValue({
      ok: true,
      json: () => successResponse,
      status: 200,
    });

    const actual = await transferPrescriptionEndpointHelper(
      prescriptionWithPharmacyFhirMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-url/prescription/route',
      prescriptionWithPharmacyFhirMock,
      'POST',
      {
        Authorization: 'Bearer token',
        ['Ocp-Apim-Subscription-Key']: 'platform-header-key',
      }
    );
    expect(actual).toEqual({ success: true, bundleId: successResponse });
  });
  it('returns error if transfer prescription returns error', async () => {
    const mockError = 'invalid resource';
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 400,
    });

    const actual = await transferPrescriptionEndpointHelper(
      prescriptionWithPharmacyFhirMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-url/prescription/route',
      prescriptionWithPharmacyFhirMock,
      'POST',
      {
        Authorization: 'Bearer token',
        ['Ocp-Apim-Subscription-Key']: 'platform-header-key',
      }
    );
    expect(actual).toEqual({
      success: false,
      errorMessage: 'invalid resource',
    });
  });
});
