// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import { Spacing } from '../../../../theming/spacing';
import {
  IPrescriptionPersonScreenStyles,
  prescriptionPersonScreenStyles as styles,
} from './prescription-person.screen.styles';

describe('prescriptionPersonScreenStyles', () => {
  it('has expected styles', () => {
    const buttonViewStyle: ViewStyle = {
      backgroundColor: GrayScaleColor.white,
      borderColor: PrimaryColor.darkPurple,
      borderWidth: 2,
      marginTop: Spacing.base,
    };

    const buttonTextStyle: TextStyle = {
      color: PrimaryColor.darkPurple,
    };

    const expectedStyles: IPrescriptionPersonScreenStyles = {
      buttonViewStyle,
      buttonTextStyle,
    };

    expect(styles).toEqual(expectedStyles);
  });
});
