// Copyright 2021 Prescryptive Health, Inc.

import {
  guestExperienceCustomEventLogger,
  CustomAppInsightEvents,
} from '../../../guest-experience-logger.middleware';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { navigateJoinWaitlistAsyncAction } from './navigate-join-waitlist.async-action';

jest.mock('../../navigation/navigation-reducer.actions', () => ({
  dispatchNavigateToScreen: jest.fn(),
}));

jest.mock('../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

beforeEach(() => {
  jest.resetAllMocks();
  guestExperienceCustomEventLoggerMock.mockReset();
});

describe('navigateJoinWaitlistAsyncAction', () => {
  it('should navigate to join waitlist screen', async () => {
    await navigateJoinWaitlistAsyncAction(
      appointmentsStackNavigationMock,
      '12345'
    );
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.ADDING_ANOTHER_PERSON_TO_WAITLIST,
      {}
    );
    expect(appointmentsStackNavigationMock.navigate).toHaveBeenCalledWith(
      'JoinWaitlist',
      { zipCode: '12345' }
    );
  });
});
