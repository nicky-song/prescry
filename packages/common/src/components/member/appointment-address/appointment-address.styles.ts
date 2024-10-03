// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IAppointmentAddressStyles {
  appointmentAddressContainerViewStyle: ViewStyle;
  twoColumnTextStyle: TextStyle;
  columnLeftItemTextStyle: TextStyle;
  columnRightItemTextStyle: TextStyle;
  lastRowItemViewStyle: ViewStyle;
  rowItemViewStyle: ViewStyle;
  appointmentAddressFieldViewStyle: TextStyle;
}

export const appointmentAddressStyles: IAppointmentAddressStyles = {
  appointmentAddressContainerViewStyle: {
    marginTop: Spacing.base,
    width: '100%',
  },
  appointmentAddressFieldViewStyle: {
    marginLeft: 0,
    marginRight: 0,
  },
  columnLeftItemTextStyle: {
    marginRight: Spacing.base,
    flex: 1,
  },
  columnRightItemTextStyle: {
    flex: 1,
  },
  lastRowItemViewStyle: {
    marginBottom: 0,
  },
  rowItemViewStyle: {
    marginBottom: Spacing.base,
  },
  twoColumnTextStyle: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
};
