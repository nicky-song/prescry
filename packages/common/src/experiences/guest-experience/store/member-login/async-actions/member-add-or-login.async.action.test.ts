// Copyright 2020 Prescryptive Health, Inc.

import { IMemberLoginState } from '../member-login-reducer';
import {
  IMemberAddOrLoginAsyncActionArgs,
  memberAddOrLoginAsyncAction,
} from './member-add-or-login.async.action';
import { memberAddOrLoginDispatch } from '../dispatch/member-add-or-login.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../dispatch/member-add-or-login.dispatch');
const memberAddOrLoginDispatchMock = memberAddOrLoginDispatch as jest.Mock;

const claimAlertIdentifierMock = 'mock-id';

describe('memberAddOrLoginAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls memberAddOrLoginDispatch', async () => {
    const getStateMock = jest.fn();
    const dispatchMock = jest.fn();

    const memberLoginInfoMock: IMemberLoginState = {
      firstName: 'Joe',
      lastName: 'Bloggs',
      primaryMemberRxId: 'abc123',
      dateOfBirth: '2000/01/01',
      isTermAccepted: true,
      errorMessage: '',
      claimAlertId: claimAlertIdentifierMock,
    };

    const args: IMemberAddOrLoginAsyncActionArgs = {
      memberLoginInfo: memberLoginInfoMock,
      navigation: rootStackNavigationMock,
    };
    const asyncAction = memberAddOrLoginAsyncAction(args);
    await asyncAction(dispatchMock, getStateMock);

    expect(memberAddOrLoginDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      memberLoginInfoMock
    );
  });
});
