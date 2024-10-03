// Copyright 2021 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../../provider-location/helpers/oauth-api-helper';
import { prescriptionWithPharmacyFhirMock } from '../mock/get-mock-fhir-object';
import { updatePrescriptionById } from './update-prescription-by-id';

jest.mock('../../provider-location/helpers/oauth-api-helper');
jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;
const generateBearerTokenMock = generateBearerToken as jest.Mock;

describe('updatePrescriptionById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    generateBearerTokenMock.mockReturnValue('token');
  });

  it('makes expected api request and return response if success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      ok: true,
    });

    const actual = await updatePrescriptionById(
      prescriptionWithPharmacyFhirMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-url/prescription/mock-pharmacy/pharmacy',
      prescriptionWithPharmacyFhirMock,
      'PATCH',
      {
        Authorization: 'Bearer token',
        ['Ocp-Apim-Subscription-Key']: 'platform-header-key',
      }
    );
    expect(actual).toEqual({ success: true });
  });
  it('returns error if update prescription api returns error', async () => {
    const mockError = {
      status: 404,
      title: 'error',
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 404,
    });

    const actual = await updatePrescriptionById(
      prescriptionWithPharmacyFhirMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-url/prescription/mock-pharmacy/pharmacy',
      prescriptionWithPharmacyFhirMock,
      'PATCH',
      {
        Authorization: 'Bearer token',
        ['Ocp-Apim-Subscription-Key']: 'platform-header-key',
      }
    );
    expect(actual).toEqual({
      success: false,
      errorCode: 404,
      message: 'error',
    });
  });
});
