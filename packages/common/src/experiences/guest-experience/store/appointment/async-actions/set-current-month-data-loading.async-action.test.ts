// Copyright 2020 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { setCurrentMonthDataLoadingAsyncAction } from './set-current-month-data-loading.async-action';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { setCurrentMonthAsyncAction } from './set-current-month.async-action';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const dataLoadingActionMock = dataLoadingAction as jest.Mock;

describe('setCurrentMonthDataLoadingAsyncAction', () => {
  it('Should dataLoadingAction with async action', () => {
    const currentMonth = '01-01-2000';
    setCurrentMonthDataLoadingAsyncAction(
      appointmentsStackNavigationMock,
      currentMonth
    );
    expect(dataLoadingActionMock).toHaveBeenCalled();
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      setCurrentMonthAsyncAction,
      { navigation: appointmentsStackNavigationMock, date: currentMonth }
    );
  });
});
