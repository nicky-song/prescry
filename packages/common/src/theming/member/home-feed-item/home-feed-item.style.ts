// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../../colors';
import { FontWeight, getFontFace } from '../../fonts';
import { FontSize, GreyScale } from '../../theme';

export interface IHomeFeedItemStyle {
  homeFeedItemCaptionTextStyle: TextStyle;
  homeFeedItemDescriptionTextStyle: TextStyle;
  homeFeedItemViewStyle: ViewStyle;
  homeFeedStaticItemTextStyle: TextStyle;
  homeFeedStaticItemCaptionTextStyle: TextStyle;
  homeFeedStaticItemDescriptionTextStyle: TextStyle;
  homeFeedStaticItemViewStyle: ViewStyle;
  homeFeedStaticItemWithoutDescriptionViewStyle: ViewStyle;
}

const fontColor = GrayScaleColor.primaryText;

const homeFeedItemCaptionTextStyle: TextStyle = {
  color: fontColor,
  fontSize: FontSize.larger,
  ...getFontFace({ weight: FontWeight.medium }),
  marginBottom: 6,
  textAlign: 'center',
};

const homeFeedStaticItemCaptionTextStyle: TextStyle = {
  ...homeFeedItemCaptionTextStyle,
  ...getFontFace({ weight: FontWeight.bold }),
  fontSize: FontSize.ultra,
};

const baseItemDescriptionTextStyle: TextStyle = {
  color: fontColor,
  ...getFontFace(),
  textAlign: 'center',
};

const homeFeedStaticItemTextStyle: TextStyle = {
  ...baseItemDescriptionTextStyle,
};

const homeFeedItemDescriptionTextStyle: TextStyle = {
  ...baseItemDescriptionTextStyle,
  fontSize: FontSize.smaller,
};

const homeFeedStaticItemDescriptionTextStyle: TextStyle = {
  ...baseItemDescriptionTextStyle,
  fontSize: FontSize.small,
};

const baseItemViewStyle: ViewStyle = {
  alignItems: 'center',
  height: 58,
  padding: 12,
};

const homeFeedItemViewStyle: ViewStyle = {
  ...baseItemViewStyle,
  borderColor: GreyScale.lightDark,
  borderStyle: 'solid',
  borderWidth: 1,
  flex: 1,
  overflow: 'hidden',
  alignSelf: 'flex-start',
};

const homeFeedStaticItemViewStyle: ViewStyle = {
  ...baseItemViewStyle,
  alignItems: 'flex-start',
  paddingLeft: 0,
};

const homeFeedStaticItemWithoutDescriptionViewStyle: ViewStyle = {
  ...homeFeedStaticItemViewStyle,
  height: 'auto',
  alignItems: 'flex-start',
  paddingLeft: 0,
  paddingTop: 32,
};

export const homeFeedItemStyle: IHomeFeedItemStyle = {
  homeFeedItemCaptionTextStyle,
  homeFeedItemDescriptionTextStyle,
  homeFeedItemViewStyle,
  homeFeedStaticItemTextStyle,
  homeFeedStaticItemCaptionTextStyle,
  homeFeedStaticItemDescriptionTextStyle,
  homeFeedStaticItemViewStyle,
  homeFeedStaticItemWithoutDescriptionViewStyle,
};
