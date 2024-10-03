// Copyright 2023 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { Spacing } from '../../../../../../theming/spacing';

export interface ISmartPriceSectionStyles {
  containerTextStyle: TextStyle;
}

export const smartPriceSectionStyles: ISmartPriceSectionStyles = {
  containerTextStyle: { marginTop: Spacing.base },
};
