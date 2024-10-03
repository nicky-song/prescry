// Copyright 2021 Prescryptive Health, Inc.

import {
  toggleButtonGroupStyles,
  IToggleButtonGroupStyles,
} from './toggle.button-group.style';
import { TextStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import { BorderRadius } from '../../../theming/borders';
import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { FontSize, getFontDimensions } from '../../../theming/fonts';

describe('toggleButtonGroupStyles', () => {
  it('has expected styles', () => {
    const commonButtonViewStyle: TextStyle = {
      width: 'auto',
      minWidth: 100,
      marginHorizontal: Spacing.half,
      marginBottom: Spacing.base,
      height: 40,
      borderRadius: BorderRadius.rounded,
      borderWidth: 1,
      paddingLeft: Spacing.base,
      paddingRight: Spacing.base,
    };

    const expectedStyle: IToggleButtonGroupStyles = {
      buttonViewStyle: commonButtonViewStyle,
      buttonTextStyle: {
        color: GrayScaleColor.white,
        ...getFontDimensions(FontSize.body),
      },
      optionsContainerViewStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: -Spacing.half,
      },
      unSelectedButtonViewStyle: {
        ...commonButtonViewStyle,
        backgroundColor: GrayScaleColor.white,
        borderColor: PrimaryColor.darkBlue,
        borderWidth: 1,
      },
      unSelectedButtonTextStyle: {
        color: GrayScaleColor.primaryText,
        ...getFontDimensions(FontSize.body),
      },
    };

    expect(toggleButtonGroupStyles).toEqual(expectedStyle);
  });
});
