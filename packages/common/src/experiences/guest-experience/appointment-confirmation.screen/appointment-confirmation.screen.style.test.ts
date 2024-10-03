// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import {
  appointmentConfirmationScreenStyle,
  IAppointmentConfirmationScreenStyle,
} from './appointment-confirmation.screen.style';

const headerTextStyle: TextStyle = {
  marginBottom: 24,
};

const headerViewStyle: ViewStyle = {
  paddingBottom: 0,
};

const bodyViewStyle: ViewStyle = {
  flexDirection: 'column',
  margin: 24,
};

const secondaryButtonViewStyle: ViewStyle = {
  marginTop: Spacing.times1pt25,
};

describe('appointmentConfirmationScreenStyle', () => {
  it('has expected default styles', () => {
    const expectedStyles: IAppointmentConfirmationScreenStyle = {
      bodyViewStyle,
      headerViewStyle,
      headerTextStyle,
      titleTextStyle: {
        marginBottom: Spacing.base,
      },
      secondaryButtonViewStyle,
    };

    expect(appointmentConfirmationScreenStyle).toEqual(expectedStyles);
  });
});
