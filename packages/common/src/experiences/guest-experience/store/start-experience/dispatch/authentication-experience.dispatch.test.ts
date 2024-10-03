// Copyright 2018 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import {
  dispatchErrorIfDeviceRestricted,
  dispatchLoginIfNoDeviceToken,
} from '../../root-navigation.actions';
import { verifySessionDispatch } from '../dispatch/verify-session.dispatch';
import { authenticationExperienceDispatch } from './authentication-experience.dispatch';

jest.mock('../../root-navigation.actions', () => ({
  dispatchErrorIfDeviceRestricted: jest.fn(),
  dispatchLoginIfNoDeviceToken: jest.fn(),
}));

jest.mock('../dispatch/verify-session.dispatch');

const dispatchErrorIfDeviceRestrictedMock =
  dispatchErrorIfDeviceRestricted as jest.Mock;
const dispatchLoginIfNoDeviceTokenMock =
  dispatchLoginIfNoDeviceToken as jest.Mock;
const verifySessionDispatchMock = verifySessionDispatch as jest.Mock;

beforeEach(() => {
  dispatchErrorIfDeviceRestrictedMock.mockReset();

  dispatchLoginIfNoDeviceTokenMock.mockReset();
  verifySessionDispatchMock.mockReset();
});

describe('authenticationExperienceDispatch: pre-login', () => {
  it('stops if dispatches for device restriction', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      settings: {},
    });
    dispatchErrorIfDeviceRestrictedMock.mockReturnValue(true);

    const result = await authenticationExperienceDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(result).toEqual(true);

    expect(dispatchErrorIfDeviceRestricted).toHaveBeenNthCalledWith(
      1,
      getState,
      rootStackNavigationMock
    );
    expect(dispatchLoginIfNoDeviceToken).not.toHaveBeenCalled();
    expect(verifySessionDispatch).not.toHaveBeenCalled();
  });
});

describe('authenticationExperienceDispatch: login', () => {
  it('dispatches to login for no device token', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      features: {},
      settings: {},
    });
    dispatchErrorIfDeviceRestrictedMock.mockReturnValue(false);
    dispatchLoginIfNoDeviceTokenMock.mockReturnValue(true);

    const result = await authenticationExperienceDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(result).toEqual(true);

    expect(dispatchLoginIfNoDeviceToken).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(verifySessionDispatch).not.toHaveBeenCalled();
  });

  it('dispatches to login for no account token', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      features: {},
      settings: {},
    });
    dispatchErrorIfDeviceRestrictedMock.mockReturnValue(false);
    dispatchLoginIfNoDeviceTokenMock.mockReturnValue(false);
    verifySessionDispatchMock.mockReturnValue(true);

    const result = await authenticationExperienceDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(result).toEqual(true);

    expect(dispatchLoginIfNoDeviceToken).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(verifySessionDispatch).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock
    );
  });

  it('returns false if not redirected for authentication', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      features: {},
      settings: {},
    });
    dispatchErrorIfDeviceRestrictedMock.mockReturnValue(false);
    dispatchLoginIfNoDeviceTokenMock.mockReturnValue(false);
    verifySessionDispatchMock.mockReturnValue(false);

    const result = await authenticationExperienceDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(result).toEqual(false);

    expect(dispatchLoginIfNoDeviceToken).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(verifySessionDispatch).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock
    );
  });
});
