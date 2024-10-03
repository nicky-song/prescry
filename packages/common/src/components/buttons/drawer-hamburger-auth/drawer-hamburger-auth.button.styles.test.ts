// Copyright 2022 Prescryptive Health, Inc.

import { GrayScaleColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  drawerHamburgerAuthStyles,
  IDrawerHamburgerAuthStyles,
  containerWidth,
  iconSize,
} from './drawer-hamburger-auth.button.styles';

describe('drawerHamburgerStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IDrawerHamburgerAuthStyles = {
      touchableOpacityContainerViewStyle: {
        alignItems: 'center',
        flexDirection: 'row-reverse',
      },

      profileAvatarViewStyle: {
        marginRight: -Spacing.quarter,
      },

      iconContainerViewStyle: {
        backgroundColor: GrayScaleColor.white,
        borderRadius: containerWidth * 0.5,
        width: containerWidth,
        height: containerWidth,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.times2pt5,
        marginRight: -Spacing.base,
      },

      iconTextStyle: {
        maxHeight: iconSize,
        fontSize: iconSize,
      },
    };

    expect(drawerHamburgerAuthStyles).toEqual(expectedStyles);
  });
});
