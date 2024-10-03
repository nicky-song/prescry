// Copyright 2022 Prescryptive Health, Inc.

import { NotificationColor, PrimaryColor } from '../../../theming/colors';
import {
  IPrescriptionTagListStyles,
  prescriptionTagListStyles,
} from './prescription-tag-list.styles';

describe('prescriptionTagListStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPrescriptionTagListStyles = {
      memberSavesTagViewStyle: {
        backgroundColor: NotificationColor.lightGreen,
      },
      memberSavesTagTextStyle: {
        color: NotificationColor.green,
      },
      planSavesTagViewStyle: {
        backgroundColor: PrimaryColor.lightPurple,
      },
      planSavesTagTextStyle: {
        color: PrimaryColor.prescryptivePurple,
      },
    };

    expect(prescriptionTagListStyles).toEqual(expectedStyles);
  });
});
