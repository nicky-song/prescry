// Copyright 2021 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { prescriptionFhirMock } from '../mock/get-mock-fhir-object';
import { getPrescriptionById } from './get-prescription-by-id';

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

describe('getPrescriptionById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes expected api request and return response if success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => prescriptionFhirMock,
      ok: true,
    });

    const prescriptionIdMock = 'prescription-id';
    const actual = await getPrescriptionById(
      prescriptionIdMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      `${configurationMock.platformGearsApiUrl}/whitefish/1.0/prescription/${prescriptionIdMock}`,
      undefined,
      'GET',
      {
        ['Ocp-Apim-Subscription-Key']:
          configurationMock.gearsApiSubscriptionKey,
      },
      undefined,
      undefined,
      { pause: 2000, remaining: 3 }
    );
    expect(actual).toEqual({ prescription: prescriptionFhirMock });
  });

  it('returns error if prescription api returns error', async () => {
    const errorMock = {
      status: 404,
      title: 'error',
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => errorMock,
      ok: false,
      status: 404,
    });

    const actual = await getPrescriptionById(
      'prescription-id',
      configurationMock
    );
    expect(actual).toEqual({
      errorCode: errorMock.status,
      message: errorMock.title,
    });
  });
});
