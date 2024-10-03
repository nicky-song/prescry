// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../../theming/spacing';

export interface IServicesListStyles {
  bookTestCardViewStyle: ViewStyle;
}

export const servicesListStyles: IServicesListStyles = {
  bookTestCardViewStyle: { marginBottom: Spacing.base },
};
