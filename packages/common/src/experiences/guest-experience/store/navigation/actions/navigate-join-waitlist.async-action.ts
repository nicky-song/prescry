// Copyright 2021 Prescryptive Health, Inc.

import {
  guestExperienceCustomEventLogger,
  CustomAppInsightEvents,
} from '../../../guest-experience-logger.middleware';
import { AppointmentsStackNavigationProp } from '../../../navigation/stack-navigators/appointments/appointments.stack-navigator';

export const navigateJoinWaitlistAsyncAction = (
  navigation: AppointmentsStackNavigationProp,
  zipCode?: string
) => {
  guestExperienceCustomEventLogger(
    CustomAppInsightEvents.ADDING_ANOTHER_PERSON_TO_WAITLIST,
    {}
  );
  navigation.navigate('JoinWaitlist', { zipCode });
};
