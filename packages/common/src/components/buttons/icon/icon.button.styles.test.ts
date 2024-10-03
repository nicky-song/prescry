// Copyright 2021 Prescryptive Health, Inc.

import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import { IconSize } from '../../../theming/icons';
import { iconButtonStyle, IIconButtonStyle } from './icon.button.styles';

describe('iconButtonStyles', () => {
  it('has expected styles (default)', () => {
    const expected: IIconButtonStyle = {
      iconTextStyle: {
        fontSize: IconSize.big,
        color: PrimaryColor.darkBlue,
      },
      iconButtonViewStyle: {
        backgroundColor: 'transparent',
        width: 'auto',
        paddingTop: Spacing.base,
        paddingBottom: Spacing.base,
        paddingLeft: Spacing.base,
        paddingRight: Spacing.base,
        borderRadius: 0,
      },
      iconDisabledTextStyle: {
        fontSize: IconSize.regular,
        color: GrayScaleColor.disabledGray,
      },
      iconButtonDisabledViewStyle: {
        backgroundColor: 'transparent',
        width: 'auto',
      },
    };
    expect(iconButtonStyle).toEqual(expected);
  });
});
