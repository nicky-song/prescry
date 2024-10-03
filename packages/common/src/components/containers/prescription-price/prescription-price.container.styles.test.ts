// Copyright 2022 Prescryptive Health, Inc.

import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  IPrescriptionPriceContainerStyles,
  prescriptionPriceContainerStyles,
} from './prescription-price.container.styles';

describe('prescriptionPriceContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IPrescriptionPriceContainerStyles = {
      viewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Spacing.threeQuarters,
        paddingBottom: Spacing.threeQuarters,
        paddingLeft: Spacing.base,
        paddingRight: Spacing.base,
        backgroundColor: GrayScaleColor.lightGray,
      },
      plainViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: Spacing.base,
        paddingBottom: Spacing.half,
      },
    };

    expect(prescriptionPriceContainerStyles).toEqual(expectedStyles);
  });
});
