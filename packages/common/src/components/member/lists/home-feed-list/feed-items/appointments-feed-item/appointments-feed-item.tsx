// Copyright 2020 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { AppointmentsStackNavigationProp } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/appointments/appointments.stack-navigator';
import { navigateAppointmentsListScreenDispatch } from '../../../../../../experiences/guest-experience/store/navigation/dispatch/navigate-appointments-list-screen.dispatch';
import { IFeedContext } from '../../../../../../models/api-response/feed-response';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';

export interface IAppointmentsFeedItemDataProps {
  viewStyle?: StyleProp<ViewStyle>;
  context?: IFeedContext;
  code?: string;
  title?: string;
  description?: string;
  testID?: string;
}

export const AppointmentsFeedItem = ({
  code,
  title,
  description,
  context: _context,
  ...props
}: IAppointmentsFeedItemDataProps) => {
  const navigation = useNavigation<AppointmentsStackNavigationProp>();
  const onAppointmentsPress = () =>
    navigateAppointmentsListScreenDispatch(navigation);

  return (
    <TitleDescriptionCardItem
      code={code}
      title={title}
      description={description}
      onPress={onAppointmentsPress}
      {...props}
    />
  );
};
