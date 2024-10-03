// Copyright 2022 Prescryptive Health, Inc.

import { StyleProp, TextStyle } from 'react-native';
import { GrayScaleColor } from '../theming/colors';
import { getSkeletonHighlightColor } from './get-skeleton-highlight-color';

describe('getSkeletonHighlightColor', () => {
  it.each([
    [
      {},
      {
        color: 'green',
      },
      'green',
    ],
    [
      undefined,
      {
        color: 'green',
      },
      'green',
    ],
    [{}, {}, GrayScaleColor.white],
    [undefined, {}, GrayScaleColor.white],
    [
      { color: 'black' },
      {
        color: 'green',
      },
      'black',
    ],
    [
      [{ color: 'black' }, { color: 'blue' }],
      {
        color: 'green',
      },
      'blue',
    ],
  ])(
    'gets highlight color (textStyle: %p, defaultStyle: %p)',
    (
      textColorMock: StyleProp<TextStyle>,
      defaultTextStyleMock: TextStyle,
      expectedColor: string
    ) => {
      expect(
        getSkeletonHighlightColor(textColorMock, defaultTextStyleMock)
      ).toEqual(expectedColor);
    }
  );
});
