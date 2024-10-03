// Copyright 2021 Prescryptive Health, Inc.

import { GrayScaleColor } from '../../../theming/colors';
import {
  drawerHamburgerStyles,
  IDrawerHamburgerStyles,
  containerWidth,
  iconSize,
} from './drawer-hamburger.button.styles';

describe('drawerHamburgerStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IDrawerHamburgerStyles = {
      drawerHamburgerIconTextStyle: {
        maxHeight: iconSize,
        fontSize: iconSize,
        paddingLeft: 1,
      },

      drawerHamburgerViewStyle: {
        backgroundColor: GrayScaleColor.lightGray,
        borderRadius: containerWidth * 0.5,
        width: containerWidth,
        height: containerWidth,
        alignItems: 'center',
        justifyContent: 'center',
      },
    };

    expect(drawerHamburgerStyles).toEqual(expectedStyles);
  });
});
