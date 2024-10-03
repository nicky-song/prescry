// Copyright 2022 Prescryptive Health, Inc.

import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { dispatchResetStackToFatalErrorScreen } from '../navigation-reducer.actions';
import { navigatePastProceduresListDispatch } from './navigate-past-procedures-list.dispatch';
import { testResultsDeepNavigateDispatch } from './test-results-deep-navigate.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { popToTop } from '../../../navigation/navigation.helper';

jest.mock('../../member-list-info/dispatch/load-member-data.dispatch');
const loadMemberDataDispatchMock = loadMemberDataDispatch as jest.Mock;

jest.mock('./navigate-past-procedures-list.dispatch');
const navigatePastProceduresListDispatchMock =
  navigatePastProceduresListDispatch as jest.Mock;

jest.mock('../../root-navigation.actions');
const handleKnownAuthenticationErrorActionMock =
  handleKnownAuthenticationErrorAction as jest.Mock;

jest.mock('../navigation-reducer.actions');
const dispatchResetStackToFatalErrorScreenMock =
  dispatchResetStackToFatalErrorScreen as jest.Mock;

jest.mock('../../../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

describe('testResultsDeepNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches member data load', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    await testResultsDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(loadMemberDataDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
  });

  it('does not dispatch get test results and navigate if redirected for login', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    loadMemberDataDispatchMock.mockResolvedValue(true);

    await testResultsDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(navigatePastProceduresListDispatchMock).not.toHaveBeenCalled();
  });

  it('dispatches get test results and navigate if not redirected for login', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    loadMemberDataDispatchMock.mockResolvedValue(false);

    await testResultsDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(navigatePastProceduresListDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      true
    );
    expect(dispatchResetStackToFatalErrorScreenMock).not.toHaveBeenCalled();
  });

  it('handles known authentication errors', async () => {
    const dispatchMock = jest.fn();
    const error = Error('Boom!');

    loadMemberDataDispatchMock.mockImplementation(() => {
      throw error;
    });
    handleKnownAuthenticationErrorActionMock.mockReturnValue(true);

    await testResultsDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock
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

    await testResultsDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock
    );

    expect(dispatchResetStackToFatalErrorScreenMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });
});
