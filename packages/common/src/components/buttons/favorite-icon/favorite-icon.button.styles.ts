// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { NotificationColor } from '../../../theming/colors';

export interface IFavoriteIconButtonStyles {
  viewStyle: ViewStyle;
}

export const favoriteIconButtonStyles: IFavoriteIconButtonStyles = {
  viewStyle: {
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NotificationColor.lightRatings,
    borderRadius: BorderRadius.times2,
  },
};
