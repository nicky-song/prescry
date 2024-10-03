// Copyright 2022 Prescryptive Health, Inc.

import { StyleProp, TextStyle } from 'react-native';
import { FontSize } from '../theming/fonts';
import { getSkeletonFontSize } from './get-skeleton-font-size.helper';

describe('getSkeletonFontSize', () => {
  const styleWithFontSizeMock: StyleProp<TextStyle> = {
    fontSize: FontSize.large,
  };

  const defaultStyleWithFontSize: StyleProp<TextStyle> = {
    fontSize: FontSize.body,
  };

  const styleWithoutFontSizeMock: StyleProp<TextStyle> = {
    fontSize: FontSize.body,
  };

  const defaultStyleWithoutFontSize: StyleProp<TextStyle> = {
    fontSize: FontSize.body,
  };

  it.each([
    [styleWithFontSizeMock, defaultStyleWithFontSize, FontSize.large],
    [styleWithFontSizeMock, defaultStyleWithoutFontSize, FontSize.large],
    [styleWithoutFontSizeMock, defaultStyleWithFontSize, FontSize.body],
    [styleWithoutFontSizeMock, defaultStyleWithoutFontSize, FontSize.body],
    [undefined, undefined, FontSize.body],
  ])(
    'should return the correct skeleton font size for %p',
    (
      styleMock: StyleProp<TextStyle> | undefined,
      defaultStyleMock: StyleProp<TextStyle> | undefined,
      expectedHeight: number
    ) => {
      const result = getSkeletonFontSize(styleMock, defaultStyleMock);

      expect(result).toEqual(expectedHeight);
    }
  );
});
