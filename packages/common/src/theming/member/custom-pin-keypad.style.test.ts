// Copyright 2020 Prescryptive Health, Inc.

import { TextStyle, ViewStyle } from 'react-native';
import { getFontFace } from '../fonts';
import { FontSize, getDimension, GreyScale, PurpleScale } from '../theme';
import { customPinKeypadStyle, getMargin } from './custom-pin-keypad.style';

jest.mock('../theme', () => ({
  ...(jest.requireActual('../theme') as object),
  LocalDimensions: { width: 600 },
  getDimension: jest.fn().mockReturnValue(90),
}));

const mockgetCircleSize = jest.fn().mockReturnValue(90);

const commonCircleStyles: ViewStyle = {
  borderRadius: mockgetCircleSize() / 2,
  height: mockgetCircleSize(),
  width: mockgetCircleSize(),
};

describe('customPinKeypadStyle', () => {
  it('has expected styles', () => {
    const commonFontStyles: TextStyle = {
      fontSize: FontSize.ultraLarge,
      ...getFontFace(),
      margin: 'auto',
      textAlign: 'center',
    };

    const pinKeypadPurpleCircle: ViewStyle = {
      ...commonCircleStyles,
      backgroundColor: PurpleScale.darkest,
    };

    const pinKeypadPurpleBorderCircle: ViewStyle = {
      ...commonCircleStyles,
      borderColor: PurpleScale.darkest,
      borderWidth: 1,
    };

    const pinKeypadGreyCircle: ViewStyle = {
      ...commonCircleStyles,
      borderColor: GreyScale.light,
      borderWidth: 1,
    };

    const pinKeypadPurpleFont: TextStyle = {
      ...commonFontStyles,
      color: PurpleScale.darkest,
    };

    const pinKeypadWhiteFont: TextStyle = {
      ...commonFontStyles,
      color: GreyScale.lightest,
    };

    const pinKeypadGreyFont: TextStyle = {
      ...commonFontStyles,
      color: GreyScale.light,
    };

    const pinKeypadRowStyle: ViewStyle = {
      flexDirection: 'row',
    };

    const pinKeypadRowItemStyle: ViewStyle = {
      flex: 1,
      margin: getMargin(),
    };

    const expectedStyles = {
      pinKeypadGreyCircle,
      pinKeypadGreyFont,
      pinKeypadPurpleBorderCircle,
      pinKeypadPurpleCircle,
      pinKeypadPurpleFont,
      pinKeypadRowItemStyle,
      pinKeypadRowStyle,
      pinKeypadWhiteFont,
    };

    expect(customPinKeypadStyle).toEqual(expectedStyles);
  });

  it('should get size for circle', () => {
    expect(getDimension(600, 'width', 0.15)).toBe(90);
  });

  it('should get margin between circle', () => {
    expect(customPinKeypadStyle.pinKeypadRowItemStyle.margin).toEqual(8);
  });
});
