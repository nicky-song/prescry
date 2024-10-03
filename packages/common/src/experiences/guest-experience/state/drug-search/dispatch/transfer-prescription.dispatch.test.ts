// Copyright 2021 Prescryptive Health, Inc.

import { transferPrescription } from '../../../api/api-v1.transfer-prescription';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ISettings } from '../../../guest-experience-settings';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { ITransferPrescriptionAsyncActionArgs } from '../async-actions/transfer-prescription.async-action';
import { transferPrescriptionDispatch } from './transfer-prescription.dispatch';

jest.mock('../../../api/api-v1.transfer-prescription');
const transferPrescriptionMock = transferPrescription as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

describe('transferPrescriptionDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    transferPrescriptionMock.mockResolvedValue({});
    tokenUpdateDispatchMock.mockResolvedValue(true);
  });

  it('makes API request', async () => {
    const transferPrescriptionRequestBody = {
      sourceNcpdp: 'source-mock-ncpdp',
      destinationNcpdp: 'dest-mock-ncpdp',
      ndc: 'mock-ndc',
      daysSupply: 30,
      quantity: 5,
    };

    const tokenMock = 'token';
    const deviceTokenMock = 'device-token';
    const settingsMock: Partial<ISettings> = {
      token: tokenMock,
      deviceToken: deviceTokenMock,
    };

    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: configMock, settings: settingsMock });
    transferPrescriptionMock.mockReturnValueOnce({});
    const argsMock: ITransferPrescriptionAsyncActionArgs = {
      transferPrescriptionRequestBody,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };
    await transferPrescriptionDispatch(argsMock);

    expect(transferPrescriptionMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      transferPrescriptionRequestBody,
      tokenMock,
      deviceTokenMock
    );
  });

  it('updates account token', async () => {
    const refreshTokenMock = 'refresh-token';
    transferPrescriptionMock.mockResolvedValue({
      refreshToken: refreshTokenMock,
    });
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig, settings: {} });

    const reduxDispatchMock = jest.fn();

    const argsMock: ITransferPrescriptionAsyncActionArgs = {
      transferPrescriptionRequestBody: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };

    await transferPrescriptionDispatch(argsMock);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      reduxDispatchMock,
      refreshTokenMock
    );
  });
});
