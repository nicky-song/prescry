// Copyright 2021 Prescryptive Health, Inc.

import { TextStyle } from 'react-native';
import { getFontDimensions, FontSize, FontWeight, getFontFace } from './fonts';

describe('fontDimensions', () => {
  it.each([
    [undefined, 1.5],
    [1.5, 1.5],
    [2, 2],
  ])(
    'gets font size and line height (lineHeight: %p)',
    (lineHeightMock: number | undefined, expectedLineHeight: number) => {
      const fontSize = FontSize.large;
      const expectedTextStyle: TextStyle = {
        fontSize,
        lineHeight: fontSize * expectedLineHeight,
      };

      expect(getFontDimensions(fontSize, lineHeightMock)).toEqual(
        expectedTextStyle
      );
    }
  );
});

describe('getFontFace', () => {
  it.each([
    [
      undefined,
      {
        fontFamily: 'OpenSans_400Regular,sans-serif',
        fontWeight: '400',
      },
    ],
    [
      {},
      {
        fontFamily: 'OpenSans_400Regular,sans-serif',
        fontWeight: '400',
      },
    ],
    [
      { weight: FontWeight.light },
      {
        fontFamily: 'OpenSans_300Light,OpenSans_400Regular,sans-serif',
        fontWeight: '300',
      },
    ],
    [
      { weight: FontWeight.regular },
      {
        fontFamily: 'OpenSans_400Regular,sans-serif',
        fontWeight: '400',
      },
    ],
    [
      { weight: FontWeight.medium },
      {
        fontFamily: 'OpenSans_500Medium,OpenSans_400Regular,sans-serif',
        fontWeight: '500',
      },
    ],
    [
      { weight: FontWeight.semiBold },
      {
        fontFamily: 'OpenSans_600SemiBold,OpenSans_400Regular,sans-serif',
        fontWeight: '600',
      },
    ],
    [
      { weight: FontWeight.bold },
      {
        fontFamily: 'OpenSans_700Bold,OpenSans_400Regular,sans-serif',
        fontWeight: '700',
      },
    ],
    [
      { weight: FontWeight.bold, style: 'italic' },
      {
        fontFamily: 'OpenSans_700Bold_Italic,OpenSans_400Regular,sans-serif',
        fontWeight: '700',
        fontStyle: 'italic',
      },
    ],
    [
      { family: 'Poppins', weight: FontWeight.semiBold },
      {
        fontFamily: 'Poppins_600SemiBold,Poppins_400Regular,sans-serif',
        fontWeight: '600',
      },
    ],
  ])(
    'gets font face (attributes: %p)',
    (attributes: object | undefined, expected: object) => {
      expect(getFontFace(attributes)).toEqual(expected);
    }
  );
});
