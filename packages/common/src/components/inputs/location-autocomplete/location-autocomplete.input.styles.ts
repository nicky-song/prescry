// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { Spacing } from '../../../theming/spacing';
import { NotificationColor, GrayScaleColor } from '../../../theming/colors';

export interface ILocationAutocompleteInputStyles {
  suggestionListStyle: ViewStyle;
  spinnerViewStyle: ViewStyle;
  suggestionItemStyle: TextStyle;
  suggestionItemNoBorderStyle: TextStyle;
  errorTextStyle: TextStyle;
}

export const locationAutocompleteInputStyles: ILocationAutocompleteInputStyles =
  {
    suggestionListStyle: {
      backgroundColor: GrayScaleColor.white,
      display: 'flex',
      flexDirection: 'column',
      borderWidth: 1,
      borderColor: GrayScaleColor.borderLines,
      borderRadius: BorderRadius.half,
    },
    spinnerViewStyle: {
      paddingVertical: Spacing.times1pt5,
    },
    suggestionItemStyle: {
      padding: Spacing.threeQuarters,
      borderBottomWidth: 1,
      borderBottomColor: GrayScaleColor.borderLines,
    },
    suggestionItemNoBorderStyle: {
      borderBottomWidth: 0,
    },
    errorTextStyle: {
      color: NotificationColor.red,
      marginTop: Spacing.base,
    },
  };
