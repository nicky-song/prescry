// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import {
  IPharmacyHoursContainerStyles,
  pharmacyHoursContainerStyles,
} from './pharmacy-hours-container.styles';

describe('pharmacyHoursContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPharmacyHoursContainerStyles = {
      subContainerViewStyle: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        paddingBottom: Spacing.half,
      },
      hoursTextStyle: {
        textAlign: 'right',
      },
      pharmacyDayViewStyle: {
        flexGrow: 0,
      },
      pharmacyHoursViewStyle: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
      },
    };

    expect(pharmacyHoursContainerStyles).toEqual(expectedStyles);
  });
});
