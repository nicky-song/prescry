// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';

export interface IChevronCardStyles {
  chevronCardViewStyle: ViewStyle;
}

export const chevronCardStyles: IChevronCardStyles = {
  chevronCardViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};
