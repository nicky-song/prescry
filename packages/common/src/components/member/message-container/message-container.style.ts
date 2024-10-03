// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { FontSize, GreyScale, YellowScale } from '../../../theming/theme';

export interface IMessageContainerStyles {
  messageContainerViewStyle: ViewStyle;
  messageContainerHeaderTextStyle: TextStyle;
  messageContainerTextStyle: TextStyle;
  messageContainerSubTextStyle: TextStyle;
}

const messageContainerViewStyle: ViewStyle = {
  backgroundColor: YellowScale.lighter,
  padding: 24,
  paddingTop: 20,
  paddingBottom: 20,
};

const messageContainerTextStyle: TextStyle = {
  ...getFontFace(),
  fontSize: FontSize.small,
  color: GreyScale.darkest,
  flexDirection: 'column',
};

const messageContainerHeaderTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.bold }),
  padding: 0,
};

const messageContainerSubTextStyle: TextStyle = {
  padding: 0,
  margin: 0,
};
export const messageContainerStyles: IMessageContainerStyles = {
  messageContainerViewStyle,
  messageContainerTextStyle,
  messageContainerHeaderTextStyle,
  messageContainerSubTextStyle,
};
