// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { processInviteCodeAndNavigateDispatch } from '../../invite-code/dispatch/process-invite-code-and-navigate.dispatch';
import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { dispatchResetStackToFatalErrorScreen } from '../navigation-reducer.actions';
import { inviteCodeDeepNavigateDispatch } from './invite-code-deep-navigate-dispatch';

jest.mock('../../member-list-info/dispatch/load-member-data.dispatch');
const loadMemberDataDispatchMock = loadMemberDataDispatch as jest.Mock;

jest.mock(
  '../../invite-code/dispatch/process-invite-code-and-navigate.dispatch'
);
const processInviteCodeAndNavigateDispatchMock =
  processInviteCodeAndNavigateDispatch as jest.Mock;

jest.mock('../../root-navigation.actions');
const handleKnownAuthenticationErrorActionMock =
  handleKnownAuthenticationErrorAction as jest.Mock;

jest.mock('../navigation-reducer.actions');
const dispatchResetStackToFatalErrorScreenMock =
  dispatchResetStackToFatalErrorScreen as jest.Mock;

describe('inviteCodeDeepNavigateDispatch', () => {
  it('dispatches member data load', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    await inviteCodeDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'invite-code-guid'
    );

    expect(loadMemberDataDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
  });

  it('does not dispatch get appointment and navigate if redirected for login', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    loadMemberDataDispatchMock.mockResolvedValue(true);

    await inviteCodeDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'invite-code-guid'
    );

    expect(processInviteCodeAndNavigateDispatchMock).not.toHaveBeenCalledWith();
  });

  it('dispatches get appointment and navigate if not redirected for login', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    loadMemberDataDispatchMock.mockResolvedValue(false);

    await inviteCodeDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'some-invite-code'
    );

    expect(processInviteCodeAndNavigateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'some-invite-code'
    );
  });

  it('handles known authentication errors', async () => {
    const dispatchMock = jest.fn();
    const error = Error('Boom!');

    loadMemberDataDispatchMock.mockImplementation(() => {
      throw error;
    });
    handleKnownAuthenticationErrorActionMock.mockReturnValue(true);

    await inviteCodeDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock,
      'some-invite-code'
    );

    expect(handleKnownAuthenticationErrorActionMock).toHaveBeenCalledWith(
      dispatchMock,
      rootStackNavigationMock,
      error
    );
    expect(dispatchResetStackToFatalErrorScreenMock).not.toHaveBeenCalled();
  });

  it('dispatches reset to fatal error screen', async () => {
    const dispatchMock = jest.fn();

    loadMemberDataDispatchMock.mockImplementation(() => {
      throw Error('Boom!');
    });
    handleKnownAuthenticationErrorActionMock.mockReturnValue(false);

    await inviteCodeDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock,
      'some-invite-code'
    );

    expect(dispatchResetStackToFatalErrorScreenMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });
});
