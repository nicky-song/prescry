// Copyright 2020 Prescryptive Health, Inc.

import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { scheduleTestNavigateAsyncAction } from './schedule-test-navigate.async-action';

describe('scheduleTestNavigateAsyncAction', () => {
  it('navigates to expected screen', () => {
    const dispatchMock = jest.fn();
    const thunk = scheduleTestNavigateAsyncAction(
      appointmentsStackNavigationMock,
      'service-type'
    );
    thunk(dispatchMock);

    expect(appointmentsStackNavigationMock.navigate).toHaveBeenCalledWith(
      'AppointmentsStack',
      { screen: 'PharmacyLocations' }
    );
  });
});
