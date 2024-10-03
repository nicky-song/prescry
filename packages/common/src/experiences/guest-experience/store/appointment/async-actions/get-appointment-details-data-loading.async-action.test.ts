// Copyright 2020 Prescryptive Health, Inc.

import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { getAppointmentDetailsDataLoadingAsyncAction } from './get-appointment-details-data-loading.async-action';
import { getAppointmentDetailsAsyncAction } from './get-appointment-details.async-action';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const dataLoadingActionMock = dataLoadingAction as jest.Mock;
const data = '1234';
describe('ConfirmationScreenDataLoadingAsyncAction', () => {
  it('Should call dataLoadingAction', async () => {
    await getAppointmentDetailsDataLoadingAsyncAction(
      appointmentsStackNavigationMock,
      data
    );
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      getAppointmentDetailsAsyncAction,
      { navigation: appointmentsStackNavigationMock, appointmentId: data }
    );
  });
});
