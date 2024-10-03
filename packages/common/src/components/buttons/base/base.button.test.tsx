// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import {
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { FontSize, SkeletonWidth } from '../../../theming/fonts';
import { getSkeletonFontSize } from '../../../utils/get-skeleton-font-size.helper';
import { getSkeletonHighlightColor } from '../../../utils/get-skeleton-highlight-color';
import { getSkeletonWidth } from '../../../utils/get-skeleton-width.helper';
import { SkeletonBone } from '../../primitives/skeleton-bone';
import { BaseText } from '../../text/base-text/base-text';
import { BaseButton, ButtonSize } from './base.button';
import { baseButtonStyles } from './base.button.styles';

jest.mock('../../../utils/get-skeleton-font-size.helper');
const getSkeletonFontSizeMock = getSkeletonFontSize as jest.Mock;

jest.mock('../../../utils/get-skeleton-width.helper');
const getSkeletonWidthMock = getSkeletonWidth as jest.Mock;

jest.mock('../../../utils/get-skeleton-highlight-color');
const getSkeletonHighlightColorMock = getSkeletonHighlightColor as jest.Mock;

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const customViewStyle: ViewStyle = { width: 1 };
const customTextStyle: TextStyle = { width: 2 };

describe('BaseButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [
      undefined,
      undefined,
      [baseButtonStyles.enabledLargeViewStyle, customViewStyle],
      'mockTestID',
    ],
    [
      'large',
      false,
      [baseButtonStyles.enabledLargeViewStyle, customViewStyle],
      'mockTestID',
    ],
    [
      'large',
      true,
      [baseButtonStyles.disabledLargeViewStyle, customViewStyle],
      'mockTestID',
    ],
    [
      'medium',
      undefined,
      [baseButtonStyles.enabledMediumViewStyle, customViewStyle],
      'mockTestID',
    ],
    [
      'medium',
      false,
      [baseButtonStyles.enabledMediumViewStyle, customViewStyle],
      'mockTestID',
    ],
    [
      'medium',
      true,
      [baseButtonStyles.disabledMediumViewStyle, customViewStyle],
      'mockTestID',
    ],
  ])(
    'renders as TouchableOpacity (size: %p, disabled: %p)',
    (
      sizeMock: string | undefined,
      disabledMock: boolean | undefined,
      expectedStyle: StyleProp<ViewStyle>,
      testID: string
    ) => {
      const onPressMock = jest.fn();

      const testRenderer = renderer.create(
        <BaseButton
          disabled={disabledMock}
          size={sizeMock as ButtonSize}
          onPress={onPressMock}
          viewStyle={customViewStyle}
          testID={testID}
        >
          content
        </BaseButton>
      );

      const touchableOpacity = testRenderer.root
        .children[0] as ReactTestInstance;

      expect(touchableOpacity.type).toEqual(TouchableOpacity);
      expect(touchableOpacity.props.disabled).toEqual(!!disabledMock);
      expect(touchableOpacity.props.onPress).toEqual(expect.any(Function));
      expect(touchableOpacity.props.style).toEqual(expectedStyle);
      expect(touchableOpacity.props.activeOpacity).toEqual(0.8);
      expect(touchableOpacity.props.accessibilityRole).toEqual('button');
      expect(touchableOpacity.props.testID).toBeTruthy();
      expect(touchableOpacity.props.testID).toBe('mockTestID');

      touchableOpacity.props.onPress({});
      expect(onPressMock).toHaveBeenCalledWith(); // ensure event object not passed onwards
    }
  );

  it.each([
    [
      'large' as ButtonSize,
      false,
      [baseButtonStyles.enabledLargeTextStyle, customTextStyle],
    ],
    [
      'large' as ButtonSize,
      true,
      [baseButtonStyles.disabledLargeTextStyle, customTextStyle],
    ],
    [
      'medium' as ButtonSize,
      false,
      [baseButtonStyles.enabledMediumTextStyle, customTextStyle],
    ],
    [
      'medium' as ButtonSize,
      true,
      [baseButtonStyles.disabledMediumTextStyle, customTextStyle],
    ],
  ])(
    'renders button content (size: %p, disabled: %p, isSkeleton: %p, skeletonWidth: %p)',
    (
      sizeMock: ButtonSize | undefined,
      disabledMock: boolean | undefined,
      expectedTextStyle: StyleProp<TextStyle>
    ) => {
      const contentMock = 'content';
      const expectedWidth = 100;

      getSkeletonFontSizeMock.mockReturnValue(FontSize.xLarge);
      getSkeletonWidthMock.mockReturnValue(expectedWidth);

      const testRenderer = renderer.create(
        <BaseButton
          disabled={disabledMock}
          size={sizeMock}
          onPress={jest.fn()}
          textStyle={customTextStyle}
          isSkeleton={false}
        >
          {contentMock}
        </BaseButton>
      );

      const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
      const text = touchableOpacity.props.children;
      expect(text.type).toEqual(BaseText);
      expect(text.props.style).toEqual(expectedTextStyle);
      expect(text.props.children).toEqual(contentMock);
    }
  );

  it.each([
    [
      undefined,
      undefined,
      undefined,
      baseButtonStyles.enabledLargeTextStyle,
      baseButtonStyles.enabledLargeViewStyle,
      'long' as SkeletonWidth,
    ],
    [
      undefined,
      undefined,
      'medium' as SkeletonWidth,
      baseButtonStyles.enabledLargeTextStyle,
      baseButtonStyles.enabledLargeViewStyle,
      'medium' as SkeletonWidth,
    ],
    [
      'medium' as ButtonSize,
      undefined,
      undefined,
      baseButtonStyles.enabledMediumTextStyle,
      baseButtonStyles.enabledMediumViewStyle,
      'short' as SkeletonWidth,
    ],
    [
      'large' as ButtonSize,
      undefined,
      undefined,
      baseButtonStyles.enabledLargeTextStyle,
      baseButtonStyles.enabledLargeViewStyle,
      'long' as SkeletonWidth,
    ],
    [
      'large' as ButtonSize,
      true,
      undefined,
      baseButtonStyles.disabledLargeTextStyle,
      baseButtonStyles.disabledLargeViewStyle,
      'long' as SkeletonWidth,
    ],
    [
      'medium' as ButtonSize,
      true,
      undefined,
      baseButtonStyles.disabledMediumTextStyle,
      baseButtonStyles.disabledMediumViewStyle,
      'short' as SkeletonWidth,
    ],
  ])(
    'renders button skeleton (size: %p, disabled: %p, skeletonWidth: %p)',
    (
      sizeMock: ButtonSize | undefined,
      disabledMock: boolean | undefined,
      skeletonWidthMock: SkeletonWidth | undefined,
      expectedSkeletonTextStyle: TextStyle,
      expectedSkeletonViewStyle: ViewStyle,
      expectedSkeletonWidth: SkeletonWidth
    ) => {
      const expectedWidth = 100;

      getSkeletonFontSizeMock.mockReturnValue(FontSize.xLarge);
      getSkeletonWidthMock.mockReturnValue(expectedWidth);

      const viewStyleMock: ViewStyle = { width: 1 };
      const textStyleMock: TextStyle = { width: 2 };

      const testRenderer = renderer.create(
        <BaseButton
          disabled={disabledMock}
          size={sizeMock}
          onPress={jest.fn()}
          isSkeleton={true}
          skeletonWidth={skeletonWidthMock}
          viewStyle={viewStyleMock}
          textStyle={textStyleMock}
        >
          'content'
        </BaseButton>
      );

      const skeletonBone = testRenderer.root.findByType(SkeletonBone);
      expect(skeletonBone.type).toEqual(SkeletonBone);
      expect(skeletonBone.props.containerViewStyle).toEqual([
        expectedSkeletonViewStyle,
        viewStyleMock,
      ]);
      expect(skeletonBone.props.layoutViewStyleList).toEqual([
        {
          width: expectedWidth,
          height: FontSize.xLarge,
        },
      ]);

      expect(getSkeletonFontSizeMock).toHaveBeenCalledWith(
        textStyleMock,
        expectedSkeletonTextStyle
      );
      expect(getSkeletonWidthMock).toHaveBeenCalledWith(expectedSkeletonWidth);
    }
  );

  it.each([
    [undefined, undefined, baseButtonStyles.enabledLargeTextStyle],
    [false, undefined, baseButtonStyles.enabledLargeTextStyle],
    [true, undefined, baseButtonStyles.disabledLargeTextStyle],
    [false, 'large' as ButtonSize, baseButtonStyles.enabledLargeTextStyle],
    [true, 'large' as ButtonSize, baseButtonStyles.disabledLargeTextStyle],
    [false, 'medium' as ButtonSize, baseButtonStyles.enabledMediumTextStyle],
    [true, 'medium' as ButtonSize, baseButtonStyles.disabledMediumTextStyle],
  ])(
    'renders skeleton highlight color (disabled: %p, size: %p)',
    (
      disabledMock: boolean | undefined,
      sizeMock: ButtonSize | undefined,
      expectedDefaultTextStyle: TextStyle
    ) => {
      const highlightColorMock = 'blue';
      getSkeletonHighlightColorMock.mockReturnValue(highlightColorMock);

      const textStyleMock: TextStyle = { width: 2 };

      const testRenderer = renderer.create(
        <BaseButton
          disabled={disabledMock}
          size={sizeMock}
          onPress={jest.fn()}
          isSkeleton={true}
          textStyle={textStyleMock}
        >
          'content'
        </BaseButton>
      );

      const skeletonBone = testRenderer.root.findByType(SkeletonBone);
      expect(skeletonBone.props.highlightColor).toEqual(highlightColorMock);

      expect(getSkeletonHighlightColorMock).toHaveBeenCalledTimes(1);
      expect(getSkeletonHighlightColorMock).toHaveBeenCalledWith(
        textStyleMock,
        expectedDefaultTextStyle
      );
    }
  );
});
