// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { NotificationColor } from '../../../theming/colors';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  appointmentScreenStyles,
  IAppointmentScreenStyles,
} from './appointment.screen.styles';

describe('appointmentScreenStyles', () => {
  it('has expected styles', () => {
    const timeSlotExpirationTextStyle: TextStyle = {
      paddingLeft: 1,
      marginBottom: Spacing.base,
      fontSize: FontSize.small,
    };

    const expectedStyles: IAppointmentScreenStyles = {
      bookButtonEnabledViewStyle: {
        marginBottom: 40,
        marginTop: 40,
      },
      bookButtonDisabledViewStyle: {
        marginBottom: 40,
        marginTop: 44,
      },
      errorTextStyle: {
        color: NotificationColor.red,
        fontSize: FontSize.small,
      },
      unfinishedQuestionsTextStyle: {
        color: NotificationColor.red,
        fontSize: FontSize.small,
        marginTop: 18,
      },
      expirationWarningTextStyle: {
        ...timeSlotExpirationTextStyle,
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      aboutDependentHeaderTextStyle: {
        marginBottom: Spacing.threeQuarters,
      },
      questionsSubHeaderTextStyle: {
        fontSize: FontSize.small,
        marginBottom: 2,
      },
      questionsHeaderContainer: {
        marginTop: Spacing.times2,
      },
      consentViewStyle: {
        marginTop: Spacing.times2,
      },
      questionViewStyle: {
        marginTop: Spacing.threeQuarters,
      },
    };

    expect(appointmentScreenStyles).toEqual(expectedStyles);
  });
});
