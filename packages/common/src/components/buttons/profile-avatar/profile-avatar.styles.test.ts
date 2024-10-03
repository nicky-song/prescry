// Copyright 2021 Prescryptive Health, Inc.

import { PrimaryColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import {
  IProfileAvatarStyles,
  profileAvatarStyles,
} from './profile-avatar.styles';

describe('profileAvatarStyles', () => {
  it('has expected styles', () => {
    const constainerSize = 36;

    const expectedStyles: IProfileAvatarStyles = {
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

    expect(profileAvatarStyles).toEqual(expectedStyles);
  });
});
