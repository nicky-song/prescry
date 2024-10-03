// Copyright 2020 Prescryptive Health, Inc.

import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { cancelAppointmentAndDispatch } from '../dispatch/cancel-appointment.dispatch';
import { cancelAppointmentAsyncAction } from './cancel-appointment.async-action';

jest.mock('../dispatch/cancel-appointment.dispatch');
const cancelAppointmentAndNavigateDispatchMock =
  cancelAppointmentAndDispatch as jest.Mock;
const getStateMock = jest.fn();
const dispatchMock = jest.fn();
const orderNumber = '000000';

describe('cancelAppointmentAsyncAction', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    cancelAppointmentAndNavigateDispatchMock.mockReset();
  });

  it('calls cancelAppointmentDispatch with order number', async () => {
    const args = {
      navigation: appointmentsStackNavigationMock,
      orderNumber,
    };
    const asyncAction = cancelAppointmentAsyncAction(args);

    await asyncAction(dispatchMock, getStateMock);
    expect(cancelAppointmentAndDispatch).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      appointmentsStackNavigationMock,
      orderNumber
    );
  });
});
