// Copyright 2022 Prescryptive Health, Inc.

import { StyleProp, ViewStyle } from 'react-native';
import { GrayScaleColor } from '../theming/colors';
import { getSkeletonCustomColor } from './get-skeleton-custom-color.helper';

describe('getSkeletonCustomColor', () => {
  it.each([
    [
      {
        backgroundColor: 'black',
      },
      {
        backgroundColor: 'green',
      },
      'black',
    ],
    [{}, {}, GrayScaleColor.white],
    [
      {
        backgroundColor: 'black',
      },
      {
        backgroundColor: undefined,
      },
      'black',
    ],
    [
      [
        {
          backgroundColor: 'black',
        },
        {
          backgroundColor: 'blue',
        },
      ],
      {
        backgroundColor: undefined,
      },
      'blue',
    ],
    [
      {},
      {
        backgroundColor: 'green',
      },
      'green',
    ],
    [undefined, {}, GrayScaleColor.white],
  ])(
    'returns correct skeleton custom color for style %p and default style %p',
    (
      styleMock: StyleProp<ViewStyle> | undefined,
      defaultStyleMock: ViewStyle,
      expectedColor: string | undefined
    ) => {
      const result = getSkeletonCustomColor(styleMock, defaultStyleMock);

      expect(result).toEqual(expectedColor);
    }
  );
});
