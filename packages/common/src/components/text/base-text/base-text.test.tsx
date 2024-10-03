// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Text, TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { FontSize, SkeletonWidth } from '../../../theming/fonts';
import { getSkeletonFontSize } from '../../../utils/get-skeleton-font-size.helper';
import { getSkeletonWidth } from '../../../utils/get-skeleton-width.helper';
import { SkeletonBone } from '../../primitives/skeleton-bone';
import { BaseText, BaseTextSize, BaseTextWeight } from './base-text';
import { baseTextStyle } from './base-text.style';

jest.mock('../../../utils/get-skeleton-font-size.helper');
const getSkeletonFontSizeMock = getSkeletonFontSize as jest.Mock;

jest.mock('../../../utils/get-skeleton-width.helper');
const getSkeletonWidthMock = getSkeletonWidth as jest.Mock;

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

describe('BaseText', () => {
  it('renders as Text', () => {
    const textMock = 'text';
    const testRenderer = renderer.create(<BaseText>{textMock}</BaseText>);

    const text = testRenderer.root.children[0] as ReactTestInstance;

    expect(text.type).toEqual(Text);
    expect(text.props.children).toEqual(textMock);
  });

  it('renders styles when inheritStyle=true', () => {
    const customTextStyle: TextStyle = { width: 1 };
    const testRenderer = renderer.create(
      <BaseText inheritStyle={true} style={customTextStyle}>
        text
      </BaseText>
    );

    const text = testRenderer.root.children[0] as ReactTestInstance;

    expect(text.props.style).toEqual([
      undefined,
      undefined,
      undefined,
      customTextStyle,
    ]);
  });

  const skeletonWidthShortMock: SkeletonWidth = 'short';

  it.each([
    [undefined, baseTextStyle.defaultSizeTextStyle, undefined, undefined],
    ['small', baseTextStyle.smallSizeTextStyle, true, skeletonWidthShortMock],
    ['default', baseTextStyle.defaultSizeTextStyle, undefined, undefined],
    ['large', baseTextStyle.largeSizeTextStyle, undefined, undefined],
    ['extraLarge', baseTextStyle.extraLargeSizeTextStyle, undefined, undefined],
  ])(
    'renders with %p size styles',
    (
      sizeMock: string | undefined,
      expectedSizeStyle: TextStyle,
      isSkeletonMock: boolean | undefined,
      skeletonWidthMock: SkeletonWidth | undefined
    ) => {
      const customTextStyle: TextStyle = { width: 1 };
      const testRenderer = renderer.create(
        <BaseText
          size={sizeMock as BaseTextSize}
          style={customTextStyle}
          isSkeleton={isSkeletonMock}
          skeletonWidth={skeletonWidthMock}
        >
          text
        </BaseText>
      );

      const text = testRenderer.root.children[0] as ReactTestInstance;

      const expectedWidth = 100;

      getSkeletonFontSizeMock.mockReturnValue(FontSize.xLarge);
      getSkeletonWidthMock.mockReturnValue(expectedWidth);

      if (isSkeletonMock) {
        const skeletonBone = testRenderer.root.findByType(SkeletonBone);
        expect(skeletonBone.type).toEqual(SkeletonBone);
        expect(skeletonBone.props.containerViewStyle).toEqual([
          baseTextStyle.commonBaseTextStyle,
          expectedSizeStyle,
          baseTextStyle.regularWeightTextStyle,
          customTextStyle,
        ]);
        expect(skeletonBone.props.layoutViewStyleList).toEqual([
          {
            width: expectedWidth,
            height: FontSize.xLarge,
          },
        ]);

        expect(getSkeletonFontSizeMock).toHaveBeenCalledWith(
          customTextStyle,
          expectedSizeStyle
        );
        expect(getSkeletonWidthMock).toHaveBeenCalledWith('short');
      } else {
        expect(text.props.style).toEqual([
          baseTextStyle.commonBaseTextStyle,
          expectedSizeStyle,
          baseTextStyle.regularWeightTextStyle,
          customTextStyle,
        ]);
      }
    }
  );

  it.each([
    [undefined, baseTextStyle.regularWeightTextStyle],
    ['regular', baseTextStyle.regularWeightTextStyle],
    ['medium', baseTextStyle.mediumWeightTextStyle],
    ['semiBold', baseTextStyle.semiBoldWeightTextStyle],
    ['bold', baseTextStyle.boldWeightTextStyle],
  ])(
    'renders with %p weight styles',
    (weightMock: string | undefined, expectedWeightStyle: TextStyle) => {
      const customTextStyle: TextStyle = { width: 1 };
      const testRenderer = renderer.create(
        <BaseText weight={weightMock as BaseTextWeight} style={customTextStyle}>
          text
        </BaseText>
      );

      const text = testRenderer.root.children[0] as ReactTestInstance;

      expect(text.props.style).toEqual([
        baseTextStyle.commonBaseTextStyle,
        baseTextStyle.defaultSizeTextStyle,
        expectedWeightStyle,
        customTextStyle,
      ]);
    }
  );
});
