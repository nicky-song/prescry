// Copyright 2018 Prescryptive Health, Inc.

import {
  GuestExperienceSettings,
  InMemoryState,
  ISettings,
} from './guest-experience-settings';

describe('GuestExperienceSettings', () => {
  const mockInMemoryState: ISettings = {
    isDeviceRestricted: false,
    lastZipCode: 'test zip',
    token: 'test token',
    dataRefreshIntervalMilliseconds: 5000,
  };

  it('should match with default predefined settings ', () => {
    expect(InMemoryState.settings.lastZipCode).toBe('unknown');
    expect(Object.keys(InMemoryState.settings).length).toBe(3);
  });

  it('current should return InMemoryState settings by default', () => {
    InMemoryState.settings = mockInMemoryState;
    const result = GuestExperienceSettings.current();
    expect(result).toBe(InMemoryState.settings);
  });

  it('should update default InMemoryState settings', () => {
    InMemoryState.settings = mockInMemoryState;
    const updatedSettings = {
      isDeviceRestricted: true,
      lastZipCode: 'changed zip',
      token: 'changed token',
      dataRefreshIntervalMilliseconds: 5000,
    };
    GuestExperienceSettings.update(updatedSettings);
    expect(InMemoryState.settings).toBe(updatedSettings);
  });

  it('should update individual InMemoryState setting', () => {
    InMemoryState.settings = mockInMemoryState;
    const lastZipCode = '55555';
    GuestExperienceSettings.updateItem('lastZipCode', lastZipCode);
    expect(InMemoryState.settings.lastZipCode).toBe(lastZipCode);
  });
});
