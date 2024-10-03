// Copyright 2021 Prescryptive Health, Inc.

import { joinWaitlistLocationPreferencesAction } from '../actions/join-waitlist-location-preferences.action';
import { joinWaitlistLocationPreferencesDispatch } from './join-waitlist-location-preferences.dispatch';

jest.mock('../actions/join-waitlist-location-preferences.action');
const joinWaitlistLocationPreferencesActionMock =
  joinWaitlistLocationPreferencesAction as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';

const defaultStateMock = {
  config: {
    apis: {},
  },
  features: {},
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
    dataRefreshIntervalMilliseconds: 10,
  },
};
const getStateMock = jest.fn();

describe('joinWaitlistLocationPreferencesDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('dispatches joinWaitlistLocationPreferencesAction', async () => {
    const zipCode = '12345';
    const distance = 10;
    const dispatchMock = jest.fn();

    await joinWaitlistLocationPreferencesDispatch(
      dispatchMock,
      zipCode,
      distance
    );
    expect(dispatchMock).toBeCalled();
    expect(joinWaitlistLocationPreferencesActionMock).toHaveBeenCalledWith(
      zipCode,
      distance
    );
  });
});
