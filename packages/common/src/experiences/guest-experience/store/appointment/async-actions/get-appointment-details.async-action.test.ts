// Copyright 2020 Prescryptive Health, Inc.

import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { getAppointmentDetailsDispatch } from '../dispatch/get-appointment-details.dispatch';
import { getAppointmentDetailsAsyncAction } from './get-appointment-details.async-action';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
jest.mock('../dispatch/get-appointment-details.dispatch');
const getAppointmentDetailsDispatchMock =
  getAppointmentDetailsDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const getStateMock = jest.fn();

describe('getAppointmentDetailsAsyncAction', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getAppointmentDetailsDispatchMock.mockReset();
  });

  it('calls getAppointmentDetailsDispatch', async () => {
    const dispatchMock = jest.fn();
    const orderNumberMock = '1234';
    const args = {
      navigation: appointmentsStackNavigationMock,
      appointmentId: orderNumberMock,
    };
    const asyncAction = getAppointmentDetailsAsyncAction(args);
    await asyncAction(dispatchMock, getStateMock);
    expect(getAppointmentDetailsDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      '1234'
    );
  });
  it('dispathes error action on failure', async () => {
    const errorMock = Error('Boom!');
    getAppointmentDetailsDispatchMock.mockImplementation(() => {
      throw errorMock;
    });
    const orderNumberMock = '1234';
    const args = {
      navigation: appointmentsStackNavigationMock,
      appointmentId: orderNumberMock,
    };
    const dispatchMock = jest.fn();
    const asyncAction = getAppointmentDetailsAsyncAction(args);
    await asyncAction(dispatchMock, getStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      appointmentsStackNavigationMock
    );
  });
});
