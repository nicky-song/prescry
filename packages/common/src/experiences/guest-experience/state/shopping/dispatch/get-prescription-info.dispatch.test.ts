// Copyright 2021 Prescryptive Health, Inc.

import { getDrugInformation } from '../../../api/api-v1.get-drug-information';
import { getPrescriptionInfo } from '../../../api/shopping/api-v1.get-prescription-info';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ISettings } from '../../../guest-experience-settings';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { prescriptionInfoMock } from '../../../__mocks__/prescription-info.mock';
import { IGetPrescriptionInfoAsyncActionArgs } from '../async-actions/get-prescription-info.async-action';
import { getPrescriptionInfoDispatch } from './get-prescription-info.dispatch';
import { setPrescriptionInfoDispatch } from './set-prescription-info.dispatch';

jest.mock('../../../api/shopping/api-v1.get-prescription-info');
const getPrescriptionInfoMock = getPrescriptionInfo as jest.Mock;

jest.mock('../../../api/api-v1.get-drug-information');
const getDrugInfoMock = getDrugInformation as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('./set-prescription-info.dispatch');
const setPrescriptionInfoDispatchMock =
  setPrescriptionInfoDispatch as jest.Mock;

describe('getPrescriptionInfoDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPrescriptionInfoMock.mockResolvedValue({});
    getDrugInfoMock.mockResolvedValue({});
    tokenUpdateDispatchMock.mockResolvedValue(true);
  });

  it('makes API request', async () => {
    const prescriptionIdMock = 'prescription-id';

    const tokenMock = 'token';
    const deviceTokenMock = 'device-token';
    const settingsMock: Partial<ISettings> = {
      token: tokenMock,
      deviceToken: deviceTokenMock,
    };

    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: configMock,
      settings: settingsMock,
    });
    getPrescriptionInfoMock.mockReturnValueOnce({ data: { ndc: '123' } });
    const argsMock: IGetPrescriptionInfoAsyncActionArgs = {
      prescriptionId: prescriptionIdMock,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPrescriptionInfoDispatch(argsMock);

    expect(getPrescriptionInfoMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      prescriptionIdMock,
      tokenMock,
      deviceTokenMock,
      undefined,
      undefined
    );
  });

  it('makes content API request', async () => {
    const prescriptionIdMock = 'prescription-id';
    const tokenMock = 'token';
    const deviceTokenMock = 'device-token';
    const settingsMock: Partial<ISettings> = {
      token: tokenMock,
      deviceToken: deviceTokenMock,
    };

    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: configMock,
      settings: settingsMock,
    });
    getPrescriptionInfoMock.mockReturnValueOnce({ data: { ndc: '123' } });
    const argsMock: IGetPrescriptionInfoAsyncActionArgs = {
      prescriptionId: prescriptionIdMock,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPrescriptionInfoDispatch(argsMock);

    expect(getDrugInfoMock).toHaveBeenCalledWith(
      configMock.apis.contentManagementApi,
      '123'
    );
  });

  it('updates account token', async () => {
    const refreshTokenMock = 'refresh-token';
    getPrescriptionInfoMock.mockResolvedValue({
      data: { ndc: '123' },
      refreshToken: refreshTokenMock,
    });

    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
    });

    const reduxDispatchMock = jest.fn();

    const argsMock: IGetPrescriptionInfoAsyncActionArgs = {
      prescriptionId: 'prescription-id',
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getPrescriptionInfoDispatch(argsMock);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      reduxDispatchMock,
      refreshTokenMock
    );
  });

  it('dispatches set prescription info', async () => {
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
    });

    const shoppingDispatchMock = jest.fn();

    getPrescriptionInfoMock.mockResolvedValue({ data: prescriptionInfoMock });
    const getDrugInfoMockResponse = { ndc: '123' };
    getDrugInfoMock.mockResolvedValueOnce(getDrugInfoMockResponse);
    const argsMock: IGetPrescriptionInfoAsyncActionArgs = {
      prescriptionId: 'prescription-id',
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: shoppingDispatchMock,
      navigation: rootStackNavigationMock,
    };

    await getPrescriptionInfoDispatch(argsMock);

    expect(setPrescriptionInfoDispatchMock).toHaveBeenCalledWith(
      shoppingDispatchMock,
      prescriptionInfoMock,
      getDrugInfoMockResponse
    );
  });
});
