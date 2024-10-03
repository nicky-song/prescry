// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IRxIdBackContentStyles {
  headerViewStyle: ViewStyle;
  memberSinceTextStyle: TextStyle;
  myrxURLTextStyle: TextStyle;
  lineSeparatorViewStyle: ViewStyle;
  membersTitleTextStyle: TextStyle;
  membersDescriptionTextStyle: TextStyle;
  claimsTitleTextStyle: TextStyle;
  claimsDescriptionTextStyle: TextStyle;
  sendPrescriptionsInstructionTextStyle: TextStyle;
  prescryptiveAddressTextStyle: TextStyle;
}

const headerTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.semiBold }),
  fontSize: 10,
  lineHeight: 15,
};

const descriptionTextStyle: TextStyle = {
  fontSize: 9,
  lineHeight: 12,
};

const descriptionMarginTextStyle: TextStyle = {
  ...descriptionTextStyle,
  marginTop: Spacing.eighth,
};

const titleTextStyle: TextStyle = {
  ...getFontFace({ weight: FontWeight.semiBold }),
  fontSize: 10,
  lineHeight: 12,
};

export const rxIdBackContentStyles: IRxIdBackContentStyles = {
  headerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberSinceTextStyle: {
    ...headerTextStyle,
  },
  myrxURLTextStyle: {
    ...headerTextStyle,
  },
  lineSeparatorViewStyle: {
    marginTop: Spacing.threeQuarters,
  },
  membersTitleTextStyle: {
    ...titleTextStyle,
    marginTop: Spacing.threeQuarters,
  },
  membersDescriptionTextStyle: {
    ...descriptionMarginTextStyle,
  },
  claimsTitleTextStyle: {
    ...titleTextStyle,
    marginTop: Spacing.threeQuarters,
  },
  claimsDescriptionTextStyle: {
    ...descriptionMarginTextStyle,
  },
  sendPrescriptionsInstructionTextStyle: {
    ...descriptionTextStyle,
    marginTop: Spacing.half,
  },
  prescryptiveAddressTextStyle: {
    ...descriptionMarginTextStyle,
  },
};
