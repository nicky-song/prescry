// Copyright 2018 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../models/location-coordinates';
import {
  GuestExperienceSettings,
  InMemoryState,
  ISettings,
} from '../../guest-experience-settings';
import {
  resetSettingsAction,
  SettingsActionKeys,
  updateSettingsAction,
} from './settings-reducer.actions';

jest.mock('../../guest-experience-settings');
const currentMock = GuestExperienceSettings.current as jest.Mock;
const updateMock = GuestExperienceSettings.update as jest.Mock;

const mockReduxDispatchHandler = jest.fn();

const mockSettings: ISettings = {
  isDeviceRestricted: false,
  lastZipCode: 'unknown',
  token: 'unknown',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('updateSettingsAction', () => {
  it('issues updateSettingsAction action', () => {
    const action = updateSettingsAction(mockSettings);
    expect(action).toMatchObject({
      payload: mockSettings,
      type: SettingsActionKeys.UPDATE_SETTINGS,
    });
  });
});

describe('resetSettingsAction', () => {
  it('returns a THUNK dispatcher function', () => {
    const actionDispatcher = resetSettingsAction();
    expect(typeof actionDispatcher === 'function').toBeTruthy();
  });

  it('should call GuestExperienceSettings.update with InMemoryState.setting', async () => {
    const currentSettings: ISettings = {
      isDeviceRestricted: true,
      lastZipCode: '12345',
    };
    currentMock.mockReturnValue(currentSettings);
    const actionDispatcher = resetSettingsAction();
    await actionDispatcher(mockReduxDispatchHandler);
    expect(updateMock).toHaveBeenCalledWith(InMemoryState.settings);
  });

  it('should dispatch updateSettingsAction with default InMemoryState.setting as payload', async () => {
    const currentSettings: ISettings = {
      isDeviceRestricted: true,
      lastZipCode: '12345',
    };
    currentMock.mockReturnValue(currentSettings);
    const actionDispatcher = resetSettingsAction();
    await actionDispatcher(mockReduxDispatchHandler);
    expect(mockReduxDispatchHandler).toHaveBeenCalledTimes(1);
    expect(mockReduxDispatchHandler.mock.calls[0][0].type).toBe(
      'UPDATE_SETTINGS'
    );
    expect(mockReduxDispatchHandler.mock.calls[0][0].payload).toBe(
      InMemoryState.settings
    );
  });
  it('should keep userLocation from current setting if it exists', async () => {
    const mockUserLocation: ILocationCoordinates = {
      city: 'test',
      zipCode: '22222',
      state: 'WA',
      latitude: 12,
      longitude: -122,
    };
    const currentSettings: ISettings = {
      isDeviceRestricted: true,
      lastZipCode: '12345',
      userLocation: mockUserLocation,
    };
    currentMock.mockReturnValue(currentSettings);
    const settingsToUpdate = {
      isDeviceRestricted: false,
      lastZipCode: 'unknown',
      dataRefreshIntervalMilliseconds: 5000,
      userLocation: mockUserLocation,
    };

    const actionDispatcher = resetSettingsAction();
    await actionDispatcher(mockReduxDispatchHandler);

    expect(mockReduxDispatchHandler).toHaveBeenCalledTimes(1);
    expect(mockReduxDispatchHandler.mock.calls[0][0].type).toBe(
      'UPDATE_SETTINGS'
    );
    expect(mockReduxDispatchHandler.mock.calls[0][0].payload).toEqual(
      settingsToUpdate
    );
    expect(updateMock).toHaveBeenCalledWith(settingsToUpdate);
  });
});
