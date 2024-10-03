// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseButton, ButtonSize } from '../base/base.button';
import { SecondaryButton } from './secondary.button';
import { secondaryButtonStyles } from './secondary.button.styles';

describe('SecondaryButton', () => {
  it.each([
    [
      undefined,
      undefined,
      secondaryButtonStyles.enabledLargeViewStyle,
      secondaryButtonStyles.enabledLargeTextStyle,
    ],
    [
      'large',
      false,
      secondaryButtonStyles.enabledLargeViewStyle,
      secondaryButtonStyles.enabledLargeTextStyle,
    ],
    [
      'large',
      true,
      secondaryButtonStyles.disabledLargeViewStyle,
      secondaryButtonStyles.disabledLargeTextStyle,
    ],
    [
      'medium',
      false,
      secondaryButtonStyles.enabledMediumViewStyle,
      secondaryButtonStyles.enabledMediumTextStyle,
    ],
    [
      'medium',
      true,
      secondaryButtonStyles.disabledMediumViewStyle,
      secondaryButtonStyles.disabledMediumTextStyle,
    ],
  ])(
    'renders as BaseButton (size: %p; disabled: %p)',
    (
      sizeMock: undefined | string,
      disabledMock: undefined | boolean,
      expectedViewStyle: ViewStyle,
      expectedTextStyle: TextStyle
    ) => {
      const childrenMock = 'content';
      const customViewStyle: ViewStyle = { width: 1 };

      const testRenderer = renderer.create(
        <SecondaryButton
          size={sizeMock as ButtonSize}
          disabled={disabledMock}
          viewStyle={customViewStyle}
        >
          {childrenMock}
        </SecondaryButton>
      );

      const baseButton = testRenderer.root.children[0] as ReactTestInstance;

      expect(baseButton.type).toEqual(BaseButton);
      expect(baseButton.props.size).toEqual(sizeMock ?? 'large');
      expect(baseButton.props.disabled).toEqual(!!disabledMock);
      expect(baseButton.props.viewStyle).toEqual([
        expectedViewStyle,
        customViewStyle,
      ]);
      expect(baseButton.props.textStyle).toEqual(expectedTextStyle);
    }
  );
});
