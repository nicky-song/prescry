// Copyright 2022 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import { IFhir } from '../../../models/fhir/fhir';
import { IGetPrescriptionsHelperResponse } from './get-prescriptions-endpoint.helper';
import { prescriptionBlockchainFhirMock } from '../mock/get-mock-fhir-object';
import { getBlockchainPrescriptionsEndpointHelper } from './get-blockchain-prescriptions-endpoint.helper';
import { ResourceWrapper } from '../../../models/fhir/resource-wrapper';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ErrorConstants } from '../../../constants/response-messages';
import { getDataFromUrlWithAuth0 } from '../../../utils/get-data-from-url-with-auth0';

jest.mock('../../../utils/get-data-from-url-with-auth0');
const getDataFromUrlWithAuth0Mock = getDataFromUrlWithAuth0 as jest.Mock;

const responseMock: Partial<Response> = {
  ok: true,
  json: jest.fn().mockResolvedValue(undefined),
};
getDataFromUrlWithAuth0Mock.mockResolvedValue(responseMock);

describe('getBlockchainPrescriptionsEndpointHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return undefined if api return error', async () => {
    const masterIdMock = 'mock-id';

    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const actual = await getBlockchainPrescriptionsEndpointHelper(
      'mock-id',
      configurationMock
    );
    expect(getDataFromUrlWithAuth0Mock).toHaveBeenLastCalledWith(
      'identity',
      configurationMock.auth0,
      `platform-gears-url/myrx-account/accounts/${masterIdMock}/digital-rx`,
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    const expectedResponseMock: IGetPrescriptionsHelperResponse = {
      errorCode: 500,
    };

    expect(actual).toEqual(expectedResponseMock);
  });

  it('Return undefined if any exception ocurs', async () => {
    const masterIdMock = 'mock-id';

    getDataFromUrlWithAuth0Mock.mockImplementationOnce(() => {
      throw new Error();
    });

    const actual = await getBlockchainPrescriptionsEndpointHelper(
      'mock-id',
      configurationMock
    );
    expect(getDataFromUrlWithAuth0Mock).toHaveBeenLastCalledWith(
      'identity',
      configurationMock.auth0,
      `platform-gears-url/myrx-account/accounts/${masterIdMock}/digital-rx`,
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    const expectedResponseMock: IGetPrescriptionsHelperResponse = {
      errorCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorConstants.INTERNAL_SERVER_ERROR,
    };

    expect(actual).toEqual(expectedResponseMock);
  });

  it('makes expected api request and return response if success', async () => {
    const masterIdMock = 'mock-id';

    const expectedBlockchainPrescriptionsResponse: IGetPrescriptionsHelperResponse =
      {
        prescriptions: [prescriptionBlockchainFhirMock],
      };

    const apiResponseMock: Partial<IFhir> = {
      resourceType: 'Bundle',
      entry: [
        {
          resource: prescriptionBlockchainFhirMock,
        } as ResourceWrapper,
      ],
    };

    getDataFromUrlWithAuth0Mock.mockResolvedValue({
      json: () => apiResponseMock,
      ok: true,
    });

    const actual = await getBlockchainPrescriptionsEndpointHelper(
      masterIdMock,
      configurationMock
    );
    expect(getDataFromUrlWithAuth0Mock).toHaveBeenLastCalledWith(
      'identity',
      configurationMock.auth0,
      `platform-gears-url/myrx-account/accounts/${masterIdMock}/digital-rx`,
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual(expectedBlockchainPrescriptionsResponse);
  });
});
