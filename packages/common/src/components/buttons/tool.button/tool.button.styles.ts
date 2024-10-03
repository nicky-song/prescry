// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import { IconSize } from '../../../theming/icons';
import {
  FontSize,
  FontWeight,
  getFontDimensions,
  getFontFace,
} from '../../../theming/fonts';

export interface IToolButtonStyles {
  iconTextStyle: TextStyle;
  toolButtonTextStyle: TextStyle;
  rowContainerViewStyle: ViewStyle;
  iconDisabledTextStyle: TextStyle;
  toolButtonDisabledTextStyle: TextStyle;
}

const baseIconTextStyle: TextStyle = {
  fontSize: IconSize.regular,
  flexGrow: 0,
  marginRight: Spacing.threeQuarters,
};

export const toolButtonStyles: IToolButtonStyles = {
  iconTextStyle: {
    ...baseIconTextStyle,
    color: PrimaryColor.darkBlue,
  },
  toolButtonTextStyle: {
    color: PrimaryColor.darkBlue,
    ...getFontFace({ weight: FontWeight.semiBold }),
    ...getFontDimensions(FontSize.large),
  },
  rowContainerViewStyle: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
  },
  iconDisabledTextStyle: {
    ...baseIconTextStyle,
    color: GrayScaleColor.disabledGray,
  },
  toolButtonDisabledTextStyle: {
    color: GrayScaleColor.disabledGray,
  },
};
