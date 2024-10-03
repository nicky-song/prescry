// Copyright 2020 Prescryptive Health, Inc.

import { Spacing } from '../../theming/spacing';
import {
  IAppointmentConfirmationMessageStyles,
  appointmentConfirmationMessageStyles,
} from './appointment-confirmation-message.styles';

describe('appointentConfirmationMessageStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAppointmentConfirmationMessageStyles = {
      additionalContentTextStyle: {
        marginBottom: Spacing.times2,
      },
      bodyViewStyle: {
        alignItems: 'flex-start',
        flex: 1,
      },
      refundContentTextStyle: { marginTop: Spacing.base },
      heading2TextStyle: {
        marginTop: Spacing.base,
        marginBottom: Spacing.base,
      },
      formattedDetailsViewStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      baseTextFormattedDetailsLocationNameStyle: {
        paddingLeft: Spacing.quarter,
        paddingRight: Spacing.quarter,
      },
    };

    const stylesheet = appointmentConfirmationMessageStyles;
    expect(stylesheet).toEqual(expectedStyles);
  });
});
