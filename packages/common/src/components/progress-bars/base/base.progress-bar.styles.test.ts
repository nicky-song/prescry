// Copyright 2022 Prescryptive Health, Inc.

import { ColorValue, TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  IBaseProgressBarStyles,
  baseProgressBarStyles,
  defaultProgressBarColors,
} from './base.progress-bar.styles';

describe('baseProgressBarStyles', () => {
  it('has expected default progress bar colors', () => {
    const expectedColors: ColorValue[] = [
      GrayScaleColor.primaryText,
      PrimaryColor.prescryptivePurple,
    ];
    expect(defaultProgressBarColors).toEqual(expectedColors);
  });

  it('has expected styles', () => {
    const barHeight = 10;
    const baseBarViewStyle: ViewStyle = {
      height: barHeight,
      borderRadius: barHeight * 0.5,
    };

    const labelTextStyle: TextStyle = {
      maxWidth: '50%',
    };

    const commonLabelsViewStyle: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'space-between',
    };

    const expectedStyles: IBaseProgressBarStyles = {
      backgroundBarViewStyle: {
        ...baseBarViewStyle,
        backgroundColor: GrayScaleColor.lightGray,
      },
      progressBarViewStyle: {
        ...baseBarViewStyle,
        position: 'absolute',
      },
      minLabelTextStyle: {
        ...labelTextStyle,
        marginRight: Spacing.half,
      },
      maxLabelTextStyle: {
        ...labelTextStyle,
        textAlign: 'right',
        marginLeft: Spacing.half,
      },
      bottomLabelsViewStyle: {
        ...commonLabelsViewStyle,
        marginTop: Spacing.half,
      },
      topLabelsViewStyle: {
        ...commonLabelsViewStyle,
        marginBottom: Spacing.half,
      },
    };

    expect(baseProgressBarStyles).toEqual(expectedStyles);
  });
});
