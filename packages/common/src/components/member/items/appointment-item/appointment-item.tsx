// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { IAppointmentListItem } from '../../../../models/api-response/appointment.response';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { appointmentItemStyle } from './appointment-item.styles';
import { AppointmentItemContent } from './appointment-item.content';
import { navigateAppointmentDetailsScreenDispatch } from '../../../../experiences/guest-experience/store/navigation/dispatch/navigate-appointment-details-screen-dispatch';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { AppointmentsStackNavigationProp } from '../../../../experiences/guest-experience/navigation/stack-navigators/appointments/appointments.stack-navigator';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';

export interface IAppointmentItemProps {
  navigation: AppointmentsStackNavigationProp;
  appointment: IAppointmentListItem;
  viewStyle?: StyleProp<ViewStyle>;
  backToHome?: boolean;
}

export const AppointmentItem = (props: IAppointmentItemProps) => {
  const { appointment, navigation, viewStyle, backToHome } = props;

  const onPress = () => {
    navigateAppointmentDetailsScreenDispatch(
      navigation,
      appointment.orderNumber,
      undefined,
      undefined,
      appointment.appointmentLink,
      backToHome
    );
  };

  const imageIcon = 'chevron-right';
  const title = appointment.customerName;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[appointmentItemStyle.cardViewStyle, viewStyle]}
    >
      <View style={appointmentItemStyle.textContainerViewStyle}>
        <ProtectedBaseText style={appointmentItemStyle.titleTextStyle}>
          {title}
        </ProtectedBaseText>
        <View
          key={AppointmentItemContent.serviceFieldLabel}
          style={appointmentItemStyle.labelContentViewStyle}
        >
          <Text style={appointmentItemStyle.labelTextStyle}>
            {AppointmentItemContent.serviceFieldLabel}
          </Text>
          <ProtectedBaseText style={appointmentItemStyle.contentTextStyle}>
            {appointment.serviceDescription}
          </ProtectedBaseText>
        </View>
        <View
          key={AppointmentItemContent.dateFieldLabel}
          style={appointmentItemStyle.labelContentViewStyle}
        >
          <Text style={appointmentItemStyle.labelTextStyle}>
            {AppointmentItemContent.dateFieldLabel}
          </Text>
          <Text style={appointmentItemStyle.contentTextStyle}>
            {`${appointment.date} ${appointment.time}`}
          </Text>
        </View>
        <View
          key={AppointmentItemContent.providerFieldLabel}
          style={appointmentItemStyle.labelContentViewStyle}
        >
          <Text style={appointmentItemStyle.labelTextStyle}>
            {AppointmentItemContent.providerFieldLabel}
          </Text>
          <ProtectedBaseText style={appointmentItemStyle.contentTextStyle}>
            {appointment.locationName}
          </ProtectedBaseText>
        </View>
      </View>
      <View style={appointmentItemStyle.iconContainerViewStyle}>
        <View style={appointmentItemStyle.iconViewStyle}>
          <FontAwesomeIcon
            name={imageIcon}
            style={appointmentItemStyle.iconStyle}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
