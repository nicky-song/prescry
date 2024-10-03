// Copyright 2020 Prescryptive Health, Inc.

import { memberAddOrLoginDispatch } from './member-add-or-login.dispatch';
import { IMemberLoginState } from '../member-login-reducer';
import { dispatchLoginUserResponse } from '../member-login-reducer.actions';
import { addMembershipDispatch } from '../../add-membership/dispatch/add-membership.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../member-login-reducer.actions');
const dispatchLoginUserResponseMock = dispatchLoginUserResponse as jest.Mock;

jest.mock('../../add-membership/dispatch/add-membership.dispatch');
const addMembershipDispatchMock = addMembershipDispatch as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';
const defaultStateMock = {
  config: {
    apis: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
  },
};
const getStateMock = jest.fn();

const memberLoginInfo: IMemberLoginState = {
  firstName: 'Joe',
  lastName: 'Bloggs',
  primaryMemberRxId: 'abc123',
  dateOfBirth: '2000/01/01',
  isTermAccepted: true,
  errorMessage: '',
  claimAlertId: 'mock-id',
};

describe('memberAddOrLoginDispatch', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('dispathes memberLoginAction', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';
    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
      features: {},
    };
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    await memberAddOrLoginDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      memberLoginInfo
    );

    expect(dispatchLoginUserResponseMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      memberLoginInfo
    );
  });

  it('calls addMembershipDispatchMock', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';
    const defaultStateWithTokenMock = {
      config: {
        apis: {},
      },
      settings: {
        deviceToken: deviceTokenMock,
        token: authTokenMock,
      },
    };
    const stateMock = {
      ...defaultStateWithTokenMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    await memberAddOrLoginDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      memberLoginInfo
    );

    expect(addMembershipDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      memberLoginInfo
    );
  });
});
