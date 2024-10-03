// Copyright 2022 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import {
  getPrescriberDetailsEndpointHelper,
  IPractitionerDetailsResponse,
} from './get-prescriber-details-endpoint.helper';
import {
  IPrescriberDetailsResponse,
  IResult,
} from '../../../models/prescriber-details-response';
import { IPractitioner } from '@phx/common/src/models/practitioner';
import { ErrorConstants } from '../../../constants/response-messages';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { IMedicationRequest } from '../../../models/fhir/medication-request/medication-request';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

describe('getPrescriberDetailsEndpointHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return failure response if npi is missing', async () => {
    const medicationRequest = {
      requester: undefined,
    } as IMedicationRequest;

    const actual = await getPrescriberDetailsEndpointHelper(
      medicationRequest,
      configurationMock
    );

    const expectedResponse: IPractitionerDetailsResponse = {
      isSuccess: false,
      responseCode: HttpStatusCodes.BAD_REQUEST,
      responseMessage: ErrorConstants.PRESCRIBER_NPI_MISSING,
    };

    expect(actual).toEqual(expectedResponse);
    expect(getDataFromUrlMock).not.toBeCalled();
  });

  it('Return failure response if api returns error', async () => {
    const npiMock = 'npi-mock';

    const medicationRequest = {
      requester: {
        reference: npiMock,
      },
    } as IMedicationRequest;

    const statusCodeMock = 400;

    getDataFromUrlMock.mockResolvedValue({
      ok: false,
      status: statusCodeMock,
    });

    const actual = await getPrescriberDetailsEndpointHelper(
      medicationRequest,
      configurationMock
    );

    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      `platform-gears-url/dds/api?version=2.1&number=${npiMock}&useFirstNameAlias=False&limit=10&skip=0&pretty=false`,
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    const expectedResponse: IPractitionerDetailsResponse = {
      isSuccess: false,
      responseCode: statusCodeMock,
      responseMessage: ErrorConstants.PRESCRIBER_DETAILS_NOT_FOUND,
    };

    expect(actual).toEqual(expectedResponse);
  });

  it('Return undefined if any exception ocurs', async () => {
    const npiMock = 'npi-mock';

    const medicationRequest = {
      requester: {
        reference: npiMock,
      },
    } as IMedicationRequest;

    getDataFromUrlMock.mockImplementationOnce(() => {
      throw new Error();
    });

    const actual = await getPrescriberDetailsEndpointHelper(
      medicationRequest,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      `platform-gears-url/dds/api?version=2.1&number=${npiMock}&useFirstNameAlias=False&limit=10&skip=0&pretty=false`,
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    const expectedResponse: IPractitionerDetailsResponse = {
      isSuccess: false,
      responseCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      responseMessage: ErrorConstants.INTERNAL_SERVER_ERROR,
    };

    expect(actual).toEqual(expectedResponse);
  });

  it('makes expected api request and return response if success', async () => {
    const npiMock = 1111122222;

    const npiStringMock = npiMock.toString();

    const medicationRequest = {
      requester: {
        reference: npiStringMock,
      },
    } as IMedicationRequest;

    const expectedPrescriberDetailResponse: IPractitioner = {
      id: npiStringMock,
      name: 'first-name-mock last-name-mock',
      phoneNumber: 'phone-number-mock',
    };

    const apiResponseMock = {
      results: [
        {
          number: npiMock,
          basic: {
            firstName: 'first-name-mock',
            lastName: 'last-name-mock',
          },
          addresses: [
            {
              telephoneNumber: 'phone-number-mock',
            },
          ],
        },
      ] as Partial<IResult[]>,
    } as Partial<IPrescriberDetailsResponse>;

    getDataFromUrlMock.mockResolvedValue({
      json: () => apiResponseMock,
      ok: true,
    });

    const actual = await getPrescriberDetailsEndpointHelper(
      medicationRequest,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      `platform-gears-url/dds/api?version=2.1&number=${npiMock}&useFirstNameAlias=False&limit=10&skip=0&pretty=false`,
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']: 'mock-key',
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );

    const expectedResponse: IPractitionerDetailsResponse = {
      practitioner: expectedPrescriberDetailResponse,
      isSuccess: true,
    };

    expect(actual).toEqual(expectedResponse);
  });
});
