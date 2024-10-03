// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { IMemberAddress } from '../../../models/api-request-body/create-booking.request-body';
import { PrimaryTextBox } from '../../text/primary-text-box/primary-text-box';
import { AppointmentAddress } from '../appointment-address/appointment-address';
import { createAppointmentFormContent } from './create-appointment-form.content';
import { createAppointmentFormStyles } from './create-appointment-form.styles';

export interface ICreateAppointmentFormAboutYouProps {
  defaultAddress?: IMemberAddress;
  onAddressChange: (address: IMemberAddress | undefined) => void;
}

export const CreateAppointmentFormAboutYou = (
  props: ICreateAppointmentFormAboutYouProps
) => {
  const { defaultAddress, onAddressChange } = props;

  return (
    <View style={createAppointmentFormStyles.aboutYouContainerViewStyle}>
      <PrimaryTextBox
        caption={createAppointmentFormContent.aboutYouCaption}
        textBoxStyle={createAppointmentFormStyles.aboutYouHeaderTextStyle}
      />
      <AppointmentAddress
        defaultAddress={defaultAddress}
        onAddressChange={onAddressChange}
      />
    </View>
  );
};
