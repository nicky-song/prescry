// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { NotificationColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface IBaseNotificationStyles {
  iconTextStyle: TextStyle;
  messageTextStyle: TextStyle;
  closeButtonViewStyle: ViewStyle;
  viewStyle: ViewStyle;
}

export const baseNotificationStyles: IBaseNotificationStyles = {
  iconTextStyle: {
    marginLeft: Spacing.threeQuarters,
    marginRight: Spacing.base,
    flex: 0,
  },
  messageTextStyle: {
    marginRight: Spacing.threeQuarters,
    flex: 1,
  },
  closeButtonViewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewStyle: {
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
    borderRadius: BorderRadius.half,
    backgroundColor: NotificationColor.lightRatings,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
};
