// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface ISupportErrorContainerStyles {
  headingTextStyle: TextStyle;
  reloadLinkViewStyle: ViewStyle;
}

export const supportErrorContainerStyles: ISupportErrorContainerStyles = {
  headingTextStyle: { marginBottom: Spacing.base },
  reloadLinkViewStyle: {
    width: 'fit-content',
    marginTop: Spacing.base,
    marginLeft: -Spacing.base,
  },
};
