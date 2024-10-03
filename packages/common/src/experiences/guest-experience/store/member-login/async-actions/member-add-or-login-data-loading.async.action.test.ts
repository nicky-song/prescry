// Copyright 2020 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { memberAddOrLoginDataLoadingAsyncAction } from './member-add-or-login-data-loading.async.action';
import { IMemberLoginState } from '../member-login-reducer';
import {
  IMemberAddOrLoginAsyncActionArgs,
  memberAddOrLoginAsyncAction,
} from './member-add-or-login.async.action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const dataLoadingActionMock = dataLoadingAction as jest.Mock;

const claimAlertIdentifierMock = 'mock-id';

describe('memberAddOrLoginDataLoadingAsyncAction', () => {
  it('Should call dataLoadingAction with async action', async () => {
    const memberLoginInfoMock: IMemberLoginState = {
      firstName: 'Joe',
      lastName: 'Bloggs',
      primaryMemberRxId: 'abc123',
      dateOfBirth: '2000/01/01',
      isTermAccepted: true,
      errorMessage: '',
      claimAlertId: claimAlertIdentifierMock,
    };

    await memberAddOrLoginDataLoadingAsyncAction(
      rootStackNavigationMock,
      memberLoginInfoMock
    );

    const expectedArgs: IMemberAddOrLoginAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      memberLoginInfo: memberLoginInfoMock,
    };
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      memberAddOrLoginAsyncAction,
      expectedArgs
    );
  });
});
