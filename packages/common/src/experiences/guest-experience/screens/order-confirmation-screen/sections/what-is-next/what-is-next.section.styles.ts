// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { FontSize, getFontDimensions } from '../../../../../../theming/fonts';
import { Spacing } from '../../../../../../theming/spacing';

export interface IWhatIsNextSectionStyle {
  heading2TextStyle: TextStyle;
  separatorViewStyle: ViewStyle;
}

export const whatIsNextSectionStyle: IWhatIsNextSectionStyle = {
  heading2TextStyle: {
    marginBottom: Spacing.half,
    ...getFontDimensions(FontSize.large), 
  },
  separatorViewStyle: {
    marginTop: Spacing.times2,
  },
};
