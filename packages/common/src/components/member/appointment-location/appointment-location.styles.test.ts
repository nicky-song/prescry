// Copyright 2020 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  appointmentLocationStyles,
  IAppointmentLocationStyles,
} from './appointment-location.styles';

describe('appointmentLocationStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAppointmentLocationStyles = {
      titleTextStyle: {
        marginBottom: Spacing.half,
        marginTop: Spacing.half,
      },
      viewStyle: {
        alignItems: 'flex-start',
      },
      linkViewStyle: {
        marginTop: Spacing.quarter,
        marginBottom: Spacing.quarter,
      },
    };

    expect(appointmentLocationStyles).toEqual(expectedStyles);
  });
});
