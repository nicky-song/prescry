// Copyright 2022 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import { ISendPrescriptionHelperResponse } from './update-prescription-by-id';
import { prescriptionBlockchainFhirMock } from '../../prescription/mock/get-mock-fhir-object';
import { assignPharmacyToBlockchainPrescription } from './assign-pharmacy-to-blockchain-prescription';
import { getDataFromUrlWithAuth0 } from '../../../utils/get-data-from-url-with-auth0';

jest.mock('../../../utils/get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

describe('assignPharmacyToBlockchainPrescription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return failure response if api return error', async () => {
    const smartContractAddressMock = 'mock-id';
    const accountIdMock = 'account-id-mock';
    const ncpdpMock = 'ncpdp-id-mock';

    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const actual = await assignPharmacyToBlockchainPrescription(
      smartContractAddressMock,
      accountIdMock,
      ncpdpMock,
      configurationMock
    );
    expect(getDataFromUrlWithAuth0Mock).toHaveBeenLastCalledWith(
      'identity',
      configurationMock.auth0,
      `platform-gears-url/myrx-account/digital-rx/${smartContractAddressMock}/assign-pharmacy`,
      { accountId: accountIdMock, ncpdpid: ncpdpMock, masterId: accountIdMock },
      'POST',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    const expectedResponseMock: ISendPrescriptionHelperResponse = {
      success: false,
      errorCode: 500,
    };

    expect(actual).toEqual(expectedResponseMock);
  });

  it('Return failure response if any exception occurs', async () => {
    const smartContractAddressMock = 'mock-id';
    const accountIdMock = 'account-id-mock';
    const ncpdpMock = 'ncpdp-id-mock';

    getDataFromUrlWithAuth0Mock.mockImplementationOnce(() => {
      throw new Error();
    });

    const actual = await assignPharmacyToBlockchainPrescription(
      smartContractAddressMock,
      accountIdMock,
      ncpdpMock,
      configurationMock
    );
    expect(getDataFromUrlWithAuth0Mock).toHaveBeenLastCalledWith(
      'identity',
      configurationMock.auth0,
      `platform-gears-url/myrx-account/digital-rx/${smartContractAddressMock}/assign-pharmacy`,
      { accountId: accountIdMock, ncpdpid: ncpdpMock, masterId: accountIdMock },
      'POST',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    const expectedResponseMock: ISendPrescriptionHelperResponse = {
      success: false,
      errorCode: 500,
    };

    expect(actual).toEqual(expectedResponseMock);
  });

  it('makes expected api request and return response if success', async () => {
    const smartContractAddressMock = 'mock-id';
    const accountIdMock = 'account-id-mock';
    const ncpdpMock = 'ncpdp-id-mock';

    const expectedResponse: ISendPrescriptionHelperResponse = {
      success: true,
    };

    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => prescriptionBlockchainFhirMock,
      ok: true,
    });

    const actual = await assignPharmacyToBlockchainPrescription(
      smartContractAddressMock,
      accountIdMock,
      ncpdpMock,
      configurationMock
    );
    expect(getDataFromUrlWithAuth0Mock).toHaveBeenLastCalledWith(
      'identity',
      configurationMock.auth0,
      `platform-gears-url/myrx-account/digital-rx/${smartContractAddressMock}/assign-pharmacy`,
      { accountId: accountIdMock, ncpdpid: ncpdpMock, masterId: accountIdMock },
      'POST',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual(expectedResponse);
  });
});
