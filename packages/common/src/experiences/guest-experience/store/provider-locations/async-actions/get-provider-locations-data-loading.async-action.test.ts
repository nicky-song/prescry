// Copyright 2020 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { getProviderLocationsAsyncAction } from './get-provider-locations.async-action';
import { getProviderLocationsDataLoadingAsyncAction } from './get-provider-locations-data-loading.async-action';
import { IZipcodeParam } from '../../../../../components/member/lists/pharmacy-locations-list/pharmacy-locations-list';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const dataLoadingActionMock = dataLoadingAction as jest.Mock;
const zipcodeParam = { zipcode: '98203', distance: 60 } as IZipcodeParam;
describe('getProviderLocationsDataLoadingAsyncAction', () => {
  it('Should call dataLoadingAction with zipcode parameter and navigation', () => {
    getProviderLocationsDataLoadingAsyncAction(
      appointmentsStackNavigationMock,
      zipcodeParam
    );
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      getProviderLocationsAsyncAction,
      { navigation: appointmentsStackNavigationMock, zipcodeParam }
    );
  });
});
