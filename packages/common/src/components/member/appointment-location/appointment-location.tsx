// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { appointmentLocationContent } from './appointment-location.content';
import { formatAddress } from '../../../utils/formatters/address.formatter';
import { ILocation } from '../../../models/api-response/provider-location-details-response';
import { Heading } from '../heading/heading';
import { appointmentLocationStyles } from './appointment-location.styles';
import { AddressLink } from '../links/address/address.link';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

export interface IAppointmentLocationProps {
  selectedLocation: ILocation;
  viewStyle?: StyleProp<ViewStyle>;
}

export const AppointmentLocation = ({
  selectedLocation,
  viewStyle,
}: IAppointmentLocationProps) => {
  const formattedAddress = formatAddress(selectedLocation);
  const styles = appointmentLocationStyles;

  return (
    <View style={[styles.viewStyle, viewStyle]} testID='appointmentLocation'>
      <Heading level={2} textStyle={styles.titleTextStyle}>
        {appointmentLocationContent.title}
      </Heading>
      <ProtectedBaseText>{selectedLocation?.providerName}</ProtectedBaseText>
      <AddressLink
        viewStyle={styles.linkViewStyle}
        formattedAddress={formattedAddress}
      />
    </View>
  );
};
