// Copyright 2020 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { dispatchResetStackToFatalErrorScreen } from '../navigation-reducer.actions';
import { testResultDeepNavigateDispatch } from './test-result-deep-navigate.dispatch';
import { navigateTestResultScreenDispatch } from './navigate-test-result-screen-dispatch';

jest.mock('./navigate-test-result-screen-dispatch');
const navigateTestResultScreenDispatchMock = navigateTestResultScreenDispatch as jest.Mock;

jest.mock('../../member-list-info/dispatch/load-member-data.dispatch');
const loadMemberDataDispatchMock = loadMemberDataDispatch as jest.Mock;

jest.mock('../../root-navigation.actions');
const handleKnownAuthenticationErrorActionMock =
  handleKnownAuthenticationErrorAction as jest.Mock;

jest.mock('../navigation-reducer.actions');
const dispatchResetStackToFatalErrorScreenMock =
  dispatchResetStackToFatalErrorScreen as jest.Mock;

const orderNumberMock = '1234';

describe('testResultDeepNavigateDispatch', () => {
  it('dispatches member data load', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    await testResultDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      orderNumberMock,
    );

    expect(loadMemberDataDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
  });

  it('does not dispatch navigateTestResultScreen if redirected for login', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    loadMemberDataDispatchMock.mockResolvedValue(true);

    await testResultDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      orderNumberMock,
    );

    expect(navigateTestResultScreenDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      orderNumberMock,
      true
    );
  });

  it('handles known authentication errors', async () => {
    const dispatchMock = jest.fn();
    const error = Error('Boom!');

    loadMemberDataDispatchMock.mockImplementation(() => {
      throw error;
    });
    handleKnownAuthenticationErrorActionMock.mockReturnValue(true);

    await testResultDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock,
      orderNumberMock,
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

    await testResultDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock,
      orderNumberMock,
    );

    expect(dispatchResetStackToFatalErrorScreenMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });
});
