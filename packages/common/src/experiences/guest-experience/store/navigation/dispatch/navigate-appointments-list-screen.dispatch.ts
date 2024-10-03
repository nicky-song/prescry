// Copyright 2020 Prescryptive Health, Inc.

import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const navigateAppointmentsListScreenDispatch = (
  navigation: RootStackNavigationProp,
  backToHome?: boolean,
) => {
  navigation.navigate('AppointmentsStack',
    {
      screen: 'AppointmentsList',
      params: {
        backToHome,
      }
    }
  );
};
