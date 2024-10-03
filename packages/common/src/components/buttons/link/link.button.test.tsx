// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseButton } from '../base/base.button';
import { LinkButton } from './link.button';
import { linkButtonStyles } from './link.button.styles';

describe('LinkButton', () => {
  it.each([
    [undefined, linkButtonStyles.enabledTextStyle],
    [false, linkButtonStyles.enabledTextStyle],
    [true, linkButtonStyles.disabledTextStyle],
  ])(
    'renders as BaseButton (disabled: %p)',
    (disabledMock: undefined | boolean, expectedStatusTextStyle: TextStyle) => {
      const childrenMock = 'content';
      const customViewStyle: ViewStyle = { width: 1 };
      const customTextStyle: TextStyle = { width: 2 };

      const testRenderer = renderer.create(
        <LinkButton
          linkText={childrenMock}
          onPress={jest.fn()}
          viewStyle={customViewStyle}
          textStyle={customTextStyle}
          disabled={disabledMock}
        />
      );

      const baseButton = testRenderer.root.children[0] as ReactTestInstance;

      expect(baseButton.type).toEqual(BaseButton);
      expect(baseButton.props.viewStyle).toEqual([
        linkButtonStyles.baseViewStyle,
        customViewStyle,
      ]);
      expect(baseButton.props.textStyle).toEqual([
        linkButtonStyles.baseTextStyle,
        expectedStatusTextStyle,
        customTextStyle,
      ]);
      expect(baseButton.props.children).toEqual(childrenMock);
    }
  );
});
