// Copyright 2021 Prescryptive Health, Inc.

import { sendPrescription } from '../../../api/shopping/api-v1.send-prescription';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ISettings } from '../../../guest-experience-settings';
import { shoppingStackNavigationMock } from '../../../navigation/stack-navigators/shopping/__mocks__/shopping.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { ISendPrescriptionAsyncActionArgs } from '../async-actions/send-prescription.async-action';
import { sendPrescriptionDispatch } from './send-prescription.dispatch';
import { setOrderDateDispatch } from './set-order-date.dispatch';

jest.mock('../../../api/shopping/api-v1.send-prescription');
const sendPrescriptionMock = sendPrescription as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('./set-order-date.dispatch');
const setPrescriptionDateDispatchMock = setOrderDateDispatch as jest.Mock;

describe('sendPrescriptionDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sendPrescriptionMock.mockResolvedValue({});
    tokenUpdateDispatchMock.mockResolvedValue(true);
  });

  it('makes API request', async () => {
    const ncpdpMock = 'ncpdp';
    const prescriptionIdMock = 'prescription-id';

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
    sendPrescriptionMock.mockReturnValueOnce({});
    const argsMock: ISendPrescriptionAsyncActionArgs = {
      ncpdp: ncpdpMock,
      prescriptionId: prescriptionIdMock,
      orderDate: new Date(),
      shoppingDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: shoppingStackNavigationMock,
      blockchain: false,
    };
    await sendPrescriptionDispatch(argsMock);

    expect(sendPrescriptionMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      ncpdpMock,
      prescriptionIdMock,
      tokenMock,
      deviceTokenMock,
      undefined,
      false
    );
  });

  it('updates account token', async () => {
    const refreshTokenMock = 'refresh-token';
    sendPrescriptionMock.mockResolvedValue({
      refreshToken: refreshTokenMock,
    });
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig, settings: {} });

    const reduxDispatchMock = jest.fn();

    const argsMock: ISendPrescriptionAsyncActionArgs = {
      ncpdp: 'ncpdp',
      prescriptionId: 'prescription-id',
      orderDate: new Date(),
      shoppingDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: shoppingStackNavigationMock,
    };

    await sendPrescriptionDispatch(argsMock);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      reduxDispatchMock,
      refreshTokenMock
    );
  });

  it('dispatches order date on success', async () => {
    const orderDateMock = new Date();
    const shoppingDispatchMock = jest.fn();
    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig, settings: {} });
    const argsMock: ISendPrescriptionAsyncActionArgs = {
      ncpdp: 'ncpdp',
      prescriptionId: 'prescription-id',
      orderDate: orderDateMock,
      shoppingDispatch: shoppingDispatchMock,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      navigation: shoppingStackNavigationMock,
    };

    await sendPrescriptionDispatch(argsMock);

    expect(setPrescriptionDateDispatchMock).toHaveBeenCalledWith(
      shoppingDispatchMock,
      orderDateMock
    );
  });
});
