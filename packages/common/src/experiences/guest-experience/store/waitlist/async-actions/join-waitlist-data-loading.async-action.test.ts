// Copyright 2021 Prescryptive Health, Inc.

import { ICreateWaitlistRequestBody } from '../../../../../models/api-request-body/create-waitlist.request-body';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { joinWaitlistAsyncAction } from './join-waitlist.async-action';
import { joinWaitlistDataLoadingAsyncAction } from './join-waitlist-data-loading.async-action';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';

jest.mock('../../modal-popup/modal-popup.reducer.actions', () => ({
  dataLoadingAction: jest.fn(),
}));

const dataLoadingActionMock = dataLoadingAction as jest.Mock;

const mockData = {
  serviceType: 'service-type',
  zipCode: '12345',
  maxMilesAway: 10,
  myself: true,
} as ICreateWaitlistRequestBody;

describe('joinWaitlistDataLoadingAsyncAction', () => {
  it('Should call dataLoadingAction', () => {
    joinWaitlistDataLoadingAsyncAction(
      appointmentsStackNavigationMock,
      mockData
    );
    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      joinWaitlistAsyncAction,
      { data: mockData, navigation: appointmentsStackNavigationMock }
    );
  });
});
