// Copyright 2020 Prescryptive Health, Inc.

import {
  IAppointmentAddressStyles,
  appointmentAddressStyles,
} from './appointment-address.styles';
import { Spacing } from '../../../theming/spacing';

describe('appointmentAddressStyles', () => {
  it('has expected default styles', () => {
    const expectedStyles: IAppointmentAddressStyles = {
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

    expect(appointmentAddressStyles).toEqual(expectedStyles);
  });
});
