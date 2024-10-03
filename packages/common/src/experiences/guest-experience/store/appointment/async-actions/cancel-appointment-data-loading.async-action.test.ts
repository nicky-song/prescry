// Copyright 2021 Prescryptive Health, Inc.

import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { cancelAppointmentDataLoadingAsyncAction } from './cancel-appointment-data-loading.async-action';
import { cancelAppointmentAsyncAction } from './cancel-appointment.async-action';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const dataLoadingActionMock = dataLoadingAction as jest.Mock;

const orderNumber = '000000';

describe('cancelAppointmentDataLoadingAsyncAction', () => {
  it('Should call dataLoadingAction with orderNumber', () => {
    cancelAppointmentDataLoadingAsyncAction(
      appointmentsStackNavigationMock,
      orderNumber
    );
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      cancelAppointmentAsyncAction,
      { navigation: appointmentsStackNavigationMock, orderNumber },
      true
    );
  });
});
