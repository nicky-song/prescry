// Copyright 2020 Prescryptive Health, Inc.

import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { dispatchResetStackToFatalErrorScreen } from '../navigation-reducer.actions';
import { navigateAppointmentDetailsScreenDispatch } from './navigate-appointment-details-screen-dispatch';
import { appointmentDeepNavigateDispatch } from './appointment-deep-navigate.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { popToTop } from '../../../navigation/navigation.helper';

jest.mock('../../member-list-info/dispatch/load-member-data.dispatch');
const loadMemberDataDispatchMock = loadMemberDataDispatch as jest.Mock;

jest.mock('./navigate-appointment-details-screen-dispatch');
const navigateAppointmentDetailsScreenDispatchMock =
  navigateAppointmentDetailsScreenDispatch as jest.Mock;

jest.mock('../../root-navigation.actions');
const handleKnownAuthenticationErrorActionMock =
  handleKnownAuthenticationErrorAction as jest.Mock;

jest.mock('../navigation-reducer.actions');
const dispatchResetStackToFatalErrorScreenMock =
  dispatchResetStackToFatalErrorScreen as jest.Mock;

jest.mock('../../../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

describe('appointmentDeepNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches member data load', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    await appointmentDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      '12345'
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

    await appointmentDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      '12345'
    );

    expect(
      navigateAppointmentDetailsScreenDispatchMock
    ).not.toHaveBeenCalledWith();
  });

  it('dispatches get appointment and navigate if not redirected for login', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    loadMemberDataDispatchMock.mockResolvedValue(false);

    await appointmentDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      '12345'
    );

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(navigateAppointmentDetailsScreenDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      '12345',
      false
    );
  });

  it('handles known authentication errors', async () => {
    const dispatchMock = jest.fn();
    const error = Error('Boom!');

    loadMemberDataDispatchMock.mockImplementation(() => {
      throw error;
    });
    handleKnownAuthenticationErrorActionMock.mockReturnValue(true);

    await appointmentDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock,
      '12345'
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

    await appointmentDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock,
      '12345'
    );

    expect(dispatchResetStackToFatalErrorScreenMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });
});
