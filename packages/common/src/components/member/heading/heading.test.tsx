// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { TextStyle } from 'react-native';
import { Heading } from './heading';
import { HeadingText } from '../../primitives/heading-text';
import { headingStyles } from './heading.styles';
import { SkeletonBone } from '../../primitives/skeleton-bone';
import { FontSize, SkeletonWidth } from '../../../theming/fonts';
import { getSkeletonWidth } from '../../../utils/get-skeleton-width.helper';
import { getSkeletonFontSize } from '../../../utils/get-skeleton-font-size.helper';

jest.mock('../../../utils/get-skeleton-font-size.helper');
const getSkeletonFontSizeMock = getSkeletonFontSize as jest.Mock;

jest.mock('../../../utils/get-skeleton-width.helper');
const getSkeletonWidthMock = getSkeletonWidth as jest.Mock;

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const ChildMock = () => <div />;

describe('Heading', () => {
  const skeletonWidthShortMock: SkeletonWidth = 'short';
  it.each([
    [
      undefined,
      1,
      headingStyles.headingTextStyle[0],
      undefined,
      undefined,
      false,
    ],
    [
      -1,
      1,
      headingStyles.headingTextStyle[0],
      true,
      skeletonWidthShortMock,
      false,
    ],
    [1, 1, headingStyles.headingTextStyle[0], undefined, undefined, false],
    [2, 2, headingStyles.headingTextStyle[1], undefined, undefined, false],
    [3, 3, headingStyles.headingTextStyle[2], undefined, undefined, false],
    [4, 3, headingStyles.headingTextStyle[2], undefined, undefined, false],
    [
      undefined,
      1,
      headingStyles.headingTextStyle[0],
      undefined,
      undefined,
      true,
    ],
    [
      -1,
      1,
      headingStyles.headingTextStyle[0],
      true,
      skeletonWidthShortMock,
      true,
    ],
    [1, 1, headingStyles.headingTextStyle[0], undefined, undefined, true],
    [2, 2, headingStyles.headingTextStyle[1], undefined, undefined, true],
    [3, 3, headingStyles.headingTextStyle[2], undefined, undefined, true],
    [4, 3, headingStyles.headingTextStyle[2], undefined, undefined, true],
    [
      -1,
      1,
      headingStyles.headingTextStyle[0],
      true,
      skeletonWidthShortMock,
      undefined,
    ],
    [1, 1, headingStyles.headingTextStyle[0], undefined, undefined, undefined],
    [2, 2, headingStyles.headingTextStyle[1], undefined, undefined, undefined],
    [3, 3, headingStyles.headingTextStyle[2], undefined, undefined, undefined],
    [4, 3, headingStyles.headingTextStyle[2], undefined, undefined, undefined],
  ])(
    'renders in HeadingText with expected properties (level: %p)',
    (
      level: number | undefined,
      expectedLevel: number,
      expectedTextStyle: TextStyle,
      isSkeletonMock: boolean | undefined,
      skeletonWidthMock: SkeletonWidth | undefined,
      translateContentMock: boolean | undefined
    ) => {
      const customTextStyle: TextStyle = { color: 'green' };
      const testIDMock = 'testID';
      const testRenderer = renderer.create(
        <Heading
          level={level}
          textStyle={customTextStyle}
          isSkeleton={isSkeletonMock}
          skeletonWidth={skeletonWidthMock}
          translateContent={translateContentMock}
          testID={testIDMock}
        >
          <ChildMock />
        </Heading>
      );

      const expectedWidth = 100;

      getSkeletonFontSizeMock.mockReturnValue(FontSize.xLarge);
      getSkeletonWidthMock.mockReturnValue(expectedWidth);

      if (isSkeletonMock) {
        const skeletonBone = testRenderer.root.findByType(SkeletonBone);
        expect(skeletonBone.type).toEqual(SkeletonBone);
        expect(skeletonBone.props.containerViewStyle).toEqual([
          expectedTextStyle,
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
          expectedTextStyle
        );
        expect(getSkeletonWidthMock).toHaveBeenCalledWith('short');
      } else {
        const headingText = testRenderer.root.findByType(HeadingText);

        expect(headingText.props.level).toEqual(expectedLevel);
        expect(headingText.props.style).toEqual([
          expectedTextStyle,
          customTextStyle,
        ]);
        expect(headingText.props.testID).toEqual(testIDMock);
        expect(headingText.props.children).toEqual(<ChildMock />);
      }
    }
  );
});
