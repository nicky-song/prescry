// Copyright 2021 Prescryptive Health, Inc.

import {
  pinKeypadCircleStyles,
  IPinKeypadCircleStyles,
  getCircleSize,
} from './pin-keypad-circle.styles';
import { TextStyle, ViewStyle } from 'react-native';
import {
  FontSize,
  GreyScale,
  PurpleScale,
  getDimension,
  LocalDimensions,
} from '../../../theming/theme';
import { getFontFace } from '../../../theming/fonts';

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockImplementation(() => {
      return { fontScale: 1, height: 888, scale: 1, width: 444 };
    }),
  },
  Platform: {
    select: jest.fn().mockImplementation((platform) => {
      return platform.web;
    }),
  },
  ViewStyle: {},
  TextStyle: {},
}));

describe('pinKeypadCircleStyles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it.each([[222], [444], [888]])('has expected styles (width: %d)', (width) => {
    jest.mock('react-native', () => ({
      Dimensions: {
        get: jest.fn().mockImplementation(() => {
          return { fontScale: 1, height: 777, scale: 1, width };
        }),
      },
      Platform: {
        select: jest.fn().mockImplementation((platform) => {
          return platform.web;
        }),
      },
      ViewStyle: {},
      TextStyle: {},
    }));

    const dimension = getDimension(LocalDimensions.width, 'width', 0.15);

    const expectedCircleSize = () => {
      if (dimension < 48) {
        return 48;
      } else if (dimension > 128) {
        return 128;
      } else {
        return dimension;
      }
    };

    const commonCircleStyles: ViewStyle = {
      borderRadius: expectedCircleSize() / 2,
      height: expectedCircleSize(),
      width: expectedCircleSize(),
    };

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

    const expectedStyles: IPinKeypadCircleStyles = {
      pinKeypadGreyCircle,
      pinKeypadGreyFont,
      pinKeypadPurpleBorderCircle,
      pinKeypadPurpleCircle,
      pinKeypadPurpleFont,
      pinKeypadWhiteFont,
    };

    expect(pinKeypadCircleStyles).toEqual(expectedStyles);
  });

  it.each([[222], [444], [888]])(
    'calculates circle size as expected (width: %d)',
    (width) => {
      jest.mock('react-native', () => ({
        Dimensions: {
          get: jest.fn().mockImplementation(() => {
            return { fontScale: 1, height: 777, scale: 1, width };
          }),
        },
        Platform: {
          select: jest.fn().mockImplementation((platform) => {
            return platform.web;
          }),
        },
        ViewStyle: {},
        TextStyle: {},
      }));

      const dimension = getDimension(LocalDimensions.width, 'width', 0.15);

      const circleSize = getCircleSize();

      if (dimension < 48) {
        expect(circleSize).toEqual(48);
      } else if (dimension > 128) {
        expect(circleSize).toEqual(128);
      } else {
        expect(circleSize).toEqual(dimension);
      }
    }
  );
});
