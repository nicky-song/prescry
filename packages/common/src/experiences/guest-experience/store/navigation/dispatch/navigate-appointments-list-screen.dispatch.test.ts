// Copyright 2020 Prescryptive Health, Inc.

import { navigateAppointmentsListScreenDispatch } from './navigate-appointments-list-screen.dispatch';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';

describe('navigateAppointmentsListScreenDispatch', () => {
  it('should call dispatchNavigateToScreen with undefined backToHome params where there is no backToHome in props', async () => {
    await navigateAppointmentsListScreenDispatch(
      appointmentsStackNavigationMock
    );
    expect(appointmentsStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AppointmentsStack',
      { screen: 'AppointmentsList', params: { backToHome: undefined } }
    );
  });
  
  it('should call dispatchNavigateToScreen with true backToHome params where there is true backToHome in props', async () => {
    await navigateAppointmentsListScreenDispatch(
      appointmentsStackNavigationMock,
      true
    );
    expect(appointmentsStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AppointmentsStack',
      { screen: 'AppointmentsList', params: { backToHome: true } }
    );
  });
});
