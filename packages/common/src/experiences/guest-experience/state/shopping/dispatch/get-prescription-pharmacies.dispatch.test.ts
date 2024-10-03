// Copyright 2021 Prescryptive Health, Inc.

import { getPrescriptionPharmacies } from '../../../api/shopping/api-v1.get-prescription-pharmacies';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { ISettings } from '../../../guest-experience-settings';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../../../__mocks__/pharmacy-drug-price.mock';
import { IGetPrescriptionPharmaciesAsyncActionArgs } from '../async-actions/get-prescription-pharmacies.async-action';
import { getPrescriptionPharmaciesDispatch } from './get-prescription-pharmacies.dispatch';
import { setPrescriptionPharmaciesDispatch } from './set-prescription-pharmacies.dispatch';

jest.mock('../../../api/shopping/api-v1.get-prescription-pharmacies');
const getPrescriptionPharmaciesMock = getPrescriptionPharmacies as jest.Mock;

jest.mock('../../../store/settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('./set-prescription-pharmacies.dispatch');
const setPrescriptionPharmaciesDispatchMock =
  setPrescriptionPharmaciesDispatch as jest.Mock;

const locationMock = { zipCode: 'zip-code' };
const prescriptionIdMock = 'prescription-id';
const sortByMock = 'youpay';
const distanceMock = 25;

describe('getPrescriptionPharmaciesDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getPrescriptionPharmaciesMock.mockResolvedValue({});
    tokenUpdateDispatchMock.mockResolvedValue(true);
  });

  it('makes API request', async () => {
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

    const argsMock: IGetPrescriptionPharmaciesAsyncActionArgs = {
      location: locationMock,
      prescriptionId: prescriptionIdMock,
      sortBy: sortByMock,
      distance: distanceMock,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getPrescriptionPharmaciesDispatch(argsMock);

    expect(getPrescriptionPharmaciesMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      locationMock,
      sortByMock,
      prescriptionIdMock,
      distanceMock,
      tokenMock,
      deviceTokenMock,
      undefined,
      undefined
    );
  });

  it('makes V3 API request when blockchain parameter is true', async () => {
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

    const argsMock: IGetPrescriptionPharmaciesAsyncActionArgs = {
      location: locationMock,
      prescriptionId: prescriptionIdMock,
      sortBy: sortByMock,
      distance: distanceMock,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
      blockchain: true,
    };

    await getPrescriptionPharmaciesDispatch(argsMock);

    expect(getPrescriptionPharmaciesMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      locationMock,
      sortByMock,
      prescriptionIdMock,
      distanceMock,
      tokenMock,
      deviceTokenMock,
      undefined,
      true
    );
  });

  it('updates account token', async () => {
    const refreshTokenMock = 'refresh-token';
    getPrescriptionPharmaciesMock.mockResolvedValue({
      refreshToken: refreshTokenMock,
    });

    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
    });

    const reduxDispatchMock = jest.fn();

    const argsMock: IGetPrescriptionPharmaciesAsyncActionArgs = {
      location: locationMock,
      prescriptionId: prescriptionIdMock,
      sortBy: sortByMock,
      distance: distanceMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    await getPrescriptionPharmaciesDispatch(argsMock);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      reduxDispatchMock,
      refreshTokenMock
    );
  });

  it('dispatches set prescription pharmacies', async () => {
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
    });

    const shoppingDispatchMock = jest.fn();

    const pharmaciesMock = [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock];
    getPrescriptionPharmaciesMock.mockResolvedValue({ data: pharmaciesMock });

    const argsMock: IGetPrescriptionPharmaciesAsyncActionArgs = {
      location: locationMock,
      prescriptionId: prescriptionIdMock,
      sortBy: sortByMock,
      distance: distanceMock,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: shoppingDispatchMock,
      navigation: rootStackNavigationMock,
    };

    await getPrescriptionPharmaciesDispatch(argsMock);

    expect(setPrescriptionPharmaciesDispatchMock).toHaveBeenCalledWith(
      shoppingDispatchMock,
      pharmaciesMock,
      prescriptionIdMock
    );
  });

  it('dispatches set prescription pharmacies', async () => {
    const reduxGetStateMock = jest.fn().mockReturnValue({
      config: GuestExperienceConfig,
      settings: {},
    });

    const shoppingDispatchMock = jest.fn();

    const pharmaciesMock = [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock];
    getPrescriptionPharmaciesMock.mockResolvedValue({ data: pharmaciesMock });

    const locationWithCoordinatesMock = {
      ...locationMock,
      latitude: 1,
      longitude: 0,
    };

    const argsMock: IGetPrescriptionPharmaciesAsyncActionArgs = {
      location: locationWithCoordinatesMock,
      prescriptionId: prescriptionIdMock,
      sortBy: sortByMock,
      distance: distanceMock,
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: shoppingDispatchMock,
      navigation: rootStackNavigationMock,
    };

    await getPrescriptionPharmaciesDispatch(argsMock);

    expect(setPrescriptionPharmaciesDispatchMock).toHaveBeenCalledWith(
      shoppingDispatchMock,
      pharmaciesMock,
      prescriptionIdMock
    );
  });
});
