// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';

export interface ISupportContactContainerStyles {
  iconTextStyle: TextStyle;
  linkTextStyle: TextStyle;
  memberPortalViewStyle: ViewStyle;
  rowViewStyle: ViewStyle;
}

export const supportContactContainerStyles: ISupportContactContainerStyles = {
  iconTextStyle: {
    alignSelf: 'center',
    color: PrimaryColor.darkBlue,
    flex: 0,
    marginRight: Spacing.half,
  },
  linkTextStyle: {
    borderBottomWidth: 0,
    color: PrimaryColor.darkBlue,
  },
  memberPortalViewStyle: { marginTop: Spacing.base },
  rowViewStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: Spacing.threeQuarters,
    marginBottom: Spacing.base,
  },
};
