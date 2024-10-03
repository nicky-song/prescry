// Copyright 2022 Prescryptive Health, Inc.

import { updateUserLocationSettingsDispatch } from './update-user-location-settings.dispatch';
import {
  GuestExperienceSettings,
  ISettings,
} from '../../../guest-experience-settings';
import { updateSettingsAction } from '../settings-reducer.actions';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';

jest.mock('../../../guest-experience-settings', () => ({
  GuestExperienceSettings: {
    current: jest.fn(),
    update: jest.fn(),
  },
}));
const currentMock = GuestExperienceSettings.current as jest.Mock;
const updateMock = GuestExperienceSettings.update as jest.Mock;

const userLocationMock: ILocationCoordinates = {
  zipCode: '98335',
  latitude: 99,
  longitude: 99,
  city: 'Redmond',
  state: 'WA',
};

describe('updateUserLocationSettingsDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentMock.mockReset();
    currentMock.mockReturnValue({});

    updateMock.mockReset();
  });

  it('calls GuestExperienceSettings.current', async () => {
    await updateUserLocationSettingsDispatch(jest.fn(), userLocationMock);

    expect(GuestExperienceSettings.current).toHaveBeenCalled();
  });

  it('calls GuestExperienceSettings.update with expected arguments given userLocation', async () => {
    const currentSettings: ISettings = {
      isDeviceRestricted: true,
      lastZipCode: '12345',
      userLocation: {},
    };
    currentMock.mockResolvedValue(currentSettings);

    await updateUserLocationSettingsDispatch(jest.fn(), userLocationMock);

    const updatedSettings: ISettings = {
      ...currentSettings,
      userLocation: userLocationMock,
      lastZipCode: userLocationMock.zipCode ?? '',
    };
    expect(GuestExperienceSettings.update).toHaveBeenCalledWith(
      updatedSettings
    );
  });

  it('dispatches expected updateSettingsAction', async () => {
    const currentSettings: ISettings = {
      isDeviceRestricted: true,
      lastZipCode: '12345',
      userLocation: {},
    };
    currentMock.mockResolvedValue(currentSettings);

    const dispatchMock = jest.fn();
    await updateUserLocationSettingsDispatch(dispatchMock, userLocationMock);

    const updatedSettings: ISettings = {
      ...currentSettings,
      userLocation: userLocationMock,
      lastZipCode: userLocationMock.zipCode ?? '',
    };

    const expectedAction = updateSettingsAction(updatedSettings);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
