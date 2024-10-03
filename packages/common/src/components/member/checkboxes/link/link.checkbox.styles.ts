// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { FontSize } from '../../../../theming/fonts';

export interface ILinkCheckboxStyles {
  baseTextStyle: TextStyle;
}

export const linkCheckboxStyles: ILinkCheckboxStyles = {
  baseTextStyle: {
    fontSize: FontSize.small,
  },
};
