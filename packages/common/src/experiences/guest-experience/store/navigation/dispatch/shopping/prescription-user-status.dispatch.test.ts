// Copyright 2021 Prescryptive Health, Inc.

import { IApiConfig } from '../../../../../../utils/api.helper';
import { getEndpointRetryPolicy } from '../../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getPrescriptionUserStatus } from '../../../../api/shopping/api-v1.get-prescription-user-status';
import { GuestExperienceConfig } from '../../../../guest-experience-config';
import { getPrescriptionUserStatusDispatch } from './prescription-user-status.dispatch';

jest.mock(
  '../../../../api/shopping/api-v1.get-prescription-user-status',
  () => ({
    getPrescriptionUserStatus: jest
      .fn()
      .mockResolvedValue({ data: { personExists: true } }),
  })
);

const getPrescriptionUserStatusMock = getPrescriptionUserStatus as jest.Mock;

const defaultStateMock = {
  config: {
    apis: {},
  },
  features: {},
  settings: {},
};

const getStateMock = jest.fn();
const prescriptionIdMock = 'prescription-id';
describe('getPrescriptionUserStatusDispatch', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls getPrescriptionUserStatus API with expected arguments', async () => {
    const configMock = GuestExperienceConfig;

    const stateMock = {
      ...defaultStateMock,
      config: configMock,
    };
    getStateMock.mockReturnValue(stateMock);

    const userExists = await getPrescriptionUserStatusDispatch(
      getStateMock,
      prescriptionIdMock,
      false
    );

    expect(getPrescriptionUserStatusMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      prescriptionIdMock,
      getEndpointRetryPolicy,
      false
    );
    expect(userExists).toEqual(true);
  });

  it('calls getPrescriptionUserStatus V2 API with expected arguments', async () => {
    const configMock = GuestExperienceConfig;

    const expectedApiConfig: IApiConfig = {
      ...configMock.apis.guestExperienceApi,
      env: {
        ...configMock.apis.guestExperienceApi.env,
        version: 'v2',
      },
    };

    const stateMock = {
      ...defaultStateMock,
      config: {
        ...configMock,
        apis: { ...configMock.apis, guestExperienceApi: expectedApiConfig },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const userExists = await getPrescriptionUserStatusDispatch(
      getStateMock,
      prescriptionIdMock,
      true
    );

    expect(getPrescriptionUserStatusMock).toHaveBeenCalledWith(
      expectedApiConfig,
      prescriptionIdMock,
      getEndpointRetryPolicy,
      true
    );
    expect(userExists).toEqual(true);
  });
});
