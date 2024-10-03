// Copyright 2020 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const navigateAppointmentDetailsScreenDispatch = (
  navigation: RootStackNavigationProp,
  appointmentId: string,
  showButton?: boolean,
  appointmentStatus?: string,
  appointmentLink?: string,
  backToHome?: boolean,
) => {
  navigation.navigate('AppointmentsStack', {
    screen: 'AppointmentConfirmation',
    params: {
      appointmentId,
      showBackButton: showButton ?? true,
      appointmentStatus,
      appointmentLink,
      backToHome,
    },
  });
};
