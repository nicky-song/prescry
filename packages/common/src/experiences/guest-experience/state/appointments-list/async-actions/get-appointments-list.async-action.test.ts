// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { getAppointmentsListDispatch } from '../dispatch/get-appointments-list.dispatch';
import { mockAppointmentListDetails } from '../../../__mocks__/appointment-list-details.mock';
import {
  getAppointmentsListAsyncAction,
  IGetAppointmentsListAsyncActionArgs,
} from './get-appointments-list.async-action';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/get-appointments-list.dispatch');
const getAppointmentsListDispatchMock =
  getAppointmentsListDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

describe('getAppointmentsListAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('calls data loading', async () => {
    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);

    const argsMock: IGetAppointmentsListAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      navigation: appointmentsStackNavigationMock,
      appointmentsListDispatch: jest.fn(),
      appointmentListDetails: mockAppointmentListDetails,
    };
    await getAppointmentsListAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock
    );
    expect(dataLoadingAsyncMock).toHaveBeenCalledWith(
      argsMock.reduxDispatch,
      argsMock.reduxGetState
    );
  });

  it('dispatches get past procedures list', async () => {
    const argsMock: IGetAppointmentsListAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      navigation: appointmentsStackNavigationMock,
      appointmentsListDispatch: jest.fn(),
      appointmentListDetails: mockAppointmentListDetails,
    };
    await getAppointmentsListAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(jest.fn(), jest.fn());

    expect(getAppointmentsListDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('handles errors', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new Error('Error');
    getAppointmentsListDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetAppointmentsListAsyncActionArgs = {
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: appointmentsStackNavigationMock,
      appointmentsListDispatch: jest.fn(),
      appointmentListDetails: mockAppointmentListDetails,
    };
    await getAppointmentsListAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      reduxDispatchMock,
      appointmentsStackNavigationMock
    );
  });
});
