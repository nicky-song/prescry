// Copyright 2021 Prescryptive Health, Inc.

import React, { ElementType } from 'react';
import { TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseText } from '../base-text/base-text';
import { ProtectedBaseText } from '../protected-base-text/protected-base-text';
import { TranslatableBaseText } from '../translated-base-text/translatable-base-text';
import { ValueText } from './value.text';

describe('ValueText', () => {
  it.each([
    [undefined, BaseText],
    [false, ProtectedBaseText],
    [true, TranslatableBaseText],
  ])(
    'renders expected component when translateContent=%p',
    (
      translateContentMock: boolean | undefined,
      expectedElementType: ElementType
    ) => {
      const customStyle: TextStyle = { width: 1 };
      const contentMock = 'content';

      const testRenderer = renderer.create(
        <ValueText style={customStyle} translateContent={translateContentMock}>
          {contentMock}
        </ValueText>
      );

      const baseText = testRenderer.root.children[0] as ReactTestInstance;

      expect(baseText.type).toEqual(expectedElementType);
      expect(baseText.props.weight).toEqual('semiBold');
      expect(baseText.props.style).toEqual(customStyle);
      expect(baseText.props.children).toEqual(contentMock);
    }
  );
});
