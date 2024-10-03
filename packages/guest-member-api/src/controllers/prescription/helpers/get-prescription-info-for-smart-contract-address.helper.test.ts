// Copyright 2022 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { IGetPrescriptionHelperResponse } from './get-prescription-by-id';
import { prescriptionBlockchainFhirMock } from '../mock/get-mock-fhir-object';
import { getPrescriptionInfoForSmartContractAddress } from './get-prescription-info-for-smart-contract-address.helper';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

describe('getPrescriptionInfoForSmartContractAddress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return undefined if api return error', async () => {
    const smartContractAddressMock = 'mock-id';

    getDataFromUrlMock.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const actual = await getPrescriptionInfoForSmartContractAddress(
      'mock-id',
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      `platform-gears-url/myrx-account/digital-rx/${smartContractAddressMock}`,
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    const expectedResponseMock: IGetPrescriptionHelperResponse = {
      errorCode: 500,
    };

    expect(actual).toEqual(expectedResponseMock);
  });

  it('makes expected api request and return response if success', async () => {
    const smartContractAddressMock = 'mock-id';

    const expectedBlockchainPrescriptionResponse: IGetPrescriptionHelperResponse =
      {
        prescription: prescriptionBlockchainFhirMock,
      };

    getDataFromUrlMock.mockResolvedValue({
      json: () => prescriptionBlockchainFhirMock,
      ok: true,
    });

    const actual = await getPrescriptionInfoForSmartContractAddress(
      smartContractAddressMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      `platform-gears-url/myrx-account/digital-rx/${smartContractAddressMock}`,
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual(expectedBlockchainPrescriptionResponse);
  });
});
