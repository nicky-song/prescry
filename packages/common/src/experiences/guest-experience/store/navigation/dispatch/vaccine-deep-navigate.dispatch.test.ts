// Copyright 2022 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { dispatchResetStackToFatalErrorScreen } from '../navigation-reducer.actions';
import { vaccineDeepNavigateDispatch } from './vaccine-deep-navigate.dispatch';
import { navigateVaccinationRecordScreenDispatch } from './navigate-vaccination-record-screen-dispatch';

jest.mock('./navigate-vaccination-record-screen-dispatch');
const navigateVaccinationRecordScreenDispatchMock = navigateVaccinationRecordScreenDispatch as jest.Mock;

jest.mock('../../member-list-info/dispatch/load-member-data.dispatch');
const loadMemberDataDispatchMock = loadMemberDataDispatch as jest.Mock;

jest.mock('../../root-navigation.actions');
const handleKnownAuthenticationErrorActionMock =
  handleKnownAuthenticationErrorAction as jest.Mock;

jest.mock('../navigation-reducer.actions');
const dispatchResetStackToFatalErrorScreenMock =
  dispatchResetStackToFatalErrorScreen as jest.Mock;

const orderNumberMock = '1234';

describe('vaccineDeepNavigateDispatch', () => {
  it('dispatches member data load', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    await vaccineDeepNavigateDispatch(
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

  it('does not dispatch navigateVaccinationRecordScreen if redirected for login', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    loadMemberDataDispatchMock.mockResolvedValue(true);

    await vaccineDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      orderNumberMock,
    );

    expect(navigateVaccinationRecordScreenDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      orderNumberMock,
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

    await vaccineDeepNavigateDispatch(
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

    await vaccineDeepNavigateDispatch(
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
