// Copyright 2021 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';

export interface IProfileAvatarStyles {
  containerMyPrescryptingBrandingViewStyle: ViewStyle;
  profileNameMyPrescryptingBrandingTextStyle: TextStyle;
}

const constainerSize = 36;

export const profileAvatarStyles: IProfileAvatarStyles = {
  containerMyPrescryptingBrandingViewStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PrimaryColor.lightPurple,
    borderRadius: constainerSize * 0.5,
    height: constainerSize,
    width: constainerSize,
  },
  profileNameMyPrescryptingBrandingTextStyle: {
    color: PrimaryColor.prescryptivePurple,
    ...getFontFace({ weight: FontWeight.semiBold }),
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    letterSpacing: 0,
  },
};
