// Copyright 2022 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import { defaultRetryPolicy } from '../../../utils/fetch-retry.helper';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../../provider-location/helpers/oauth-api-helper';
import { updatePrescriptionWithMemberId } from './update-prescriptions-with-member-id';

jest.mock('../../provider-location/helpers/oauth-api-helper');
const generateBearerTokenMock = generateBearerToken as jest.Mock;

jest.mock('../../../utils/get-data-from-url');
const getDataFromUrlMock = getDataFromUrl as jest.Mock;

describe('updatePrescriptionWithMemberId', () => {
  const updatePrescriptionParamsMock = {
    clientPatientId: 'member-id',
    rxNo: 'rx-no',
    pharmacyManagementSystemPatientId: 'prime-rx-id',
    refillNo: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    generateBearerTokenMock.mockReturnValue('token');
  });

  it('returns expected error code if api return error', async () => {
    const mockError = {
      title: 'One or more validation errors occurred.',
      status: 500,
    };
    getDataFromUrlMock.mockResolvedValue({
      json: () => mockError,
      ok: false,
      status: 500,
    });
    const actual = await updatePrescriptionWithMemberId(
      updatePrescriptionParamsMock,
      configurationMock
    );
    expect(actual).toEqual({ success: false });
  });

  it('makes expected api request and return response if success', async () => {
    getDataFromUrlMock.mockResolvedValue({
      json: () => true,
      ok: true,
    });

    const actual = await updatePrescriptionWithMemberId(
      updatePrescriptionParamsMock,
      configurationMock
    );
    expect(getDataFromUrlMock).toHaveBeenLastCalledWith(
      'platform-gears-url/prescription/1.0/prescription',
      updatePrescriptionParamsMock,
      'PATCH',
      {
        Authorization: 'Bearer token',
        ['Ocp-Apim-Subscription-Key']:
          configurationMock.gearsApiSubscriptionKey,
      },
      true,
      undefined,
      defaultRetryPolicy
    );

    expect(actual).toEqual({ success: true });
  });
});
