// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IFhir } from '../../../models/fhir/fhir';
import { IPlatformApiError } from '../../../models/platform/platform-api-error.response';
import { IRetryPolicy } from '../../../utils/fetch-retry.helper';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { prescriptionFhirMock } from '../mock/get-mock-fhir-object';
import {
  getPrescriptionsEndpointHelper,
  IGetPrescriptionsHelperResponse,
} from './get-prescriptions-endpoint.helper';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

describe('getPrescriptionsEndpointHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns expected error code if api return error', async () => {
    const mockError: IPlatformApiError = {
      title: 'One or more validation errors occurred.',
      status: 400,
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 400,
    });
    const actual = await getPrescriptionsEndpointHelper(
      'client-patient-id',
      configurationMock,
      true
    );
    const expectedResponse: IGetPrescriptionsHelperResponse = {
      errorCode: 400,
      message: 'One or more validation errors occurred.',
    };
    expect(actual).toEqual(expectedResponse);
  });

  it.each([
    [true, { remaining: 3, pause: 2000 }],
    [false, undefined],
  ])(
    'makes expected api request and returns response if success and passes retry policy based on flag (%p)',
    async (retryMock: boolean, policyMock: IRetryPolicy | undefined) => {
      const prescriptionsIFhirMock: IFhir[] = [prescriptionFhirMock];

      getDataFromUrlMock.mockResolvedValue({
        json: () => prescriptionsIFhirMock,
        ok: true,
      });

      const clientPatientIdMock = 'client-patient-id';
      const actual = await getPrescriptionsEndpointHelper(
        clientPatientIdMock,
        configurationMock,
        retryMock
      );
      expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
        `${configurationMock.platformGearsApiUrl}/whitefish/1.0/patient/${clientPatientIdMock}/prescriptions?sourceSystem=MyRx`,
        undefined,
        'GET',
        {
          ['Ocp-Apim-Subscription-Key']:
            configurationMock.gearsApiSubscriptionKey,
        },
        undefined,
        ApiConstants.MEDICINE_CABINET_API_TIMEOUT,
        policyMock
      );

      expect(actual).toEqual({ prescriptions: prescriptionsIFhirMock });
    }
  );

  it('makes expected api request and return response if success', async () => {
    const prescriptionsIFhirMock: IFhir[] = [prescriptionFhirMock];

    getDataFromUrlMock.mockResolvedValue({
      json: () => prescriptionsIFhirMock,
      ok: true,
    });

    const clientPatientIdMock = 'client-patient-id';
    const actual = await getPrescriptionsEndpointHelper(
      clientPatientIdMock,
      configurationMock,
      true
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      `${configurationMock.platformGearsApiUrl}/whitefish/1.0/patient/${clientPatientIdMock}/prescriptions?sourceSystem=MyRx`,
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      ApiConstants.MEDICINE_CABINET_API_TIMEOUT,
      { pause: 2000, remaining: 3 }
    );

    expect(actual).toEqual({ prescriptions: prescriptionsIFhirMock });
  });
});
