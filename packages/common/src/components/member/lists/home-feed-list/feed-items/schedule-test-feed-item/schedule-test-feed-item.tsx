// Copyright 2020 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { AppointmentsStackNavigationProp } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/appointments/appointments.stack-navigator';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';

export interface IScheduleTestFeedItemDataProps {
  viewStyle?: StyleProp<ViewStyle>;
  serviceType?: string;
  code?: string;
  title?: string;
  description?: string;
  testID?: string;
}

export interface IScheduleTestFeedItemDispatchProps {
  navigateAction: (
    navigation: AppointmentsStackNavigationProp,
    serviceType: string
  ) => void;
}

export const ScheduleTestFeedItem = ({
  navigateAction,
  serviceType,
  code,
  title,
  description,
  ...props
}: IScheduleTestFeedItemDataProps & IScheduleTestFeedItemDispatchProps) => {
  const navigation = useNavigation<AppointmentsStackNavigationProp>();
  const onScheduleTestPress = () =>
    serviceType ? navigateAction(navigation, serviceType) : undefined;

  return (
    <TitleDescriptionCardItem
      code={code}
      title={title}
      description={description}
      onPress={onScheduleTestPress}
      serviceType={serviceType}
      {...props}
    />
  );
};
