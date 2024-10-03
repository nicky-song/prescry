// Copyright 2022 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { getFontDimensions, FontSize } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';

export interface IContactDoctorContainerStyles {
  descriptionTextStyle: TextStyle;
  doctorNameTextStyle: TextStyle;
  callButtonViewStyle: ViewStyle;
  callIconViewStyle: ViewStyle;
}

export const contactDoctorContainerStyles: IContactDoctorContainerStyles = {
  descriptionTextStyle: {
    marginTop: Spacing.base,
  },
  doctorNameTextStyle: {
    marginTop: Spacing.times1pt5,
    ...getFontDimensions(FontSize.h3),
  },
  callButtonViewStyle: {
    marginTop: Spacing.base,
  },
  callIconViewStyle: {
    marginRight: Spacing.half,
  },
};
