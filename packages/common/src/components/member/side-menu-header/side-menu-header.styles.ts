// Copyright 2021 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';

const avatarSize = 48;
export interface ISideMenuHeaderStyles {
  iconTextStyle: TextStyle;
  memberRxContainerView: ViewStyle;
  sideMenuAvatarContainerView: ViewStyle;
  sideMenuAvatarView: ViewStyle;
  sideMenuHeaderContainerView: ViewStyle;
  sideMenuAvatarImageStyle: ImageStyle;
}

const iconTextStyle: TextStyle = { fontSize: 22 };

const sideMenuHeaderContainerView: ViewStyle = {
  backgroundColor: GrayScaleColor.white,
  flexDirection: 'row',
  flexGrow: 0,
  minHeight: 80,
  maxHeight: 80,
  borderBottomWidth: 1,
  borderBottomColor: GrayScaleColor.borderLines,
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: Spacing.threeQuarters,
  marginBottom: Spacing.base,
};

const sideMenuAvatarContainerView: ViewStyle = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  marginVertical: 'auto',
  maxWidth: 'fit-content',
  paddingLeft: Spacing.times1pt5,
};

const sideMenuAvatarView: ViewStyle = {
  flexGrow: 0,
  height: avatarSize,
  width: avatarSize,
};

const memberRxContainerView: ViewStyle = {
  flexGrow: 0,
  paddingLeft: Spacing.times1pt5,
};

const sideMenuAvatarImageStyle: ImageStyle = {
  height: avatarSize,
  width: avatarSize,
};

export const sideMenuHeaderStyles: ISideMenuHeaderStyles = {
  iconTextStyle,
  memberRxContainerView,
  sideMenuAvatarContainerView,
  sideMenuAvatarView,
  sideMenuHeaderContainerView,
  sideMenuAvatarImageStyle,
};
