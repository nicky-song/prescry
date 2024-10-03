// Copyright 2021 Prescryptive Health, Inc.

import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import { IconSize } from '../../../theming/icons';
import { toolButtonStyles, IToolButtonStyles } from './tool.button.styles';
import { TextStyle } from 'react-native';
import {
  getFontFace,
  FontWeight,
  getFontDimensions,
  FontSize,
} from '../../../theming/fonts';

describe('toolButtonStyles', () => {
  it('has expected styles', () => {
    const baseIconTextStyle: TextStyle = {
      fontSize: IconSize.regular,
      flexGrow: 0,
      marginRight: Spacing.threeQuarters,
    };

    const expectedStyles: IToolButtonStyles = {
      iconTextStyle: {
        ...baseIconTextStyle,
        color: PrimaryColor.darkBlue,
      },
      toolButtonTextStyle: {
        color: PrimaryColor.darkBlue,
        ...getFontFace({ weight: FontWeight.semiBold }),
        ...getFontDimensions(FontSize.large),
      },
      rowContainerViewStyle: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingTop: Spacing.base,
        paddingBottom: Spacing.base,
        paddingLeft: Spacing.base,
        paddingRight: Spacing.base,
      },
      iconDisabledTextStyle: {
        ...baseIconTextStyle,
        color: GrayScaleColor.disabledGray,
      },
      toolButtonDisabledTextStyle: {
        color: GrayScaleColor.disabledGray,
      },
    };

    expect(toolButtonStyles).toEqual(expectedStyles);
  });
});
