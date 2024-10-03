// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { SkeletonWidth } from '../../../theming/fonts';
import { BaseButton } from '../base/base.button';
import { ButtonRank, SquareButton } from './square.button';
import { squareButtonStyles } from './square.button.styles';

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const skeletonWidthShortMock: SkeletonWidth = 'short';

describe('SquareButton', () => {
  it.each([
    [
      undefined,
      undefined,
      squareButtonStyles.enabledPrimaryViewStyle,
      squareButtonStyles.enabledPrimaryTextStyle,
      true,
      skeletonWidthShortMock,
    ],
    [
      'primary',
      false,
      squareButtonStyles.enabledPrimaryViewStyle,
      squareButtonStyles.enabledPrimaryTextStyle,
      undefined,
      undefined,
    ],
    [
      'primary',
      true,
      squareButtonStyles.disabledPrimaryViewStyle,
      squareButtonStyles.disabledPrimaryTextStyle,
      undefined,
      undefined,
    ],
    [
      'secondary',
      false,
      squareButtonStyles.enabledSecondaryViewStyle,
      squareButtonStyles.enabledSecondaryTextStyle,
      undefined,
      undefined,
    ],
    [
      'secondary',
      true,
      squareButtonStyles.disabledSecondaryViewStyle,
      squareButtonStyles.disabledSecondaryTextStyle,
      undefined,
      undefined,
    ],
  ])(
    'renders as BaseButton (rank: %p; disabled: %p)',
    (
      buttonRankMock: undefined | string,
      disabledMock: undefined | boolean,
      expectedViewStyle: ViewStyle,
      expectedTextStyle: TextStyle,
      isSkeletonMock: boolean | undefined,
      skeletonWidthMock: SkeletonWidth | undefined
    ) => {
      const childrenMock = 'content';
      const customViewStyle: ViewStyle = { width: 1 };

      const testRenderer = renderer.create(
        <SquareButton
          rank={buttonRankMock as ButtonRank}
          disabled={disabledMock}
          viewStyle={customViewStyle}
          isSkeleton={isSkeletonMock}
          skeletonWidth={skeletonWidthMock}
        >
          {childrenMock}
        </SquareButton>
      );

      const baseButton = testRenderer.root.children[0] as ReactTestInstance;

      if (isSkeletonMock) {
        expect(baseButton.type).toEqual(BaseButton);
        expect(baseButton.props.isSkeleton).toEqual(true);
        expect(baseButton.props.skeletonWidth).toEqual('short');
      } else {
        expect(baseButton.type).toEqual(BaseButton);
        expect(baseButton.props.disabled).toEqual(!!disabledMock);
        expect(baseButton.props.viewStyle).toEqual([
          expectedViewStyle,
          customViewStyle,
        ]);
        expect(baseButton.props.textStyle).toEqual(expectedTextStyle);
      }
    }
  );
});
