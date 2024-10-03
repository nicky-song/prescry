// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseText } from '../base-text/base-text';
import { FieldErrorText } from './field-error.text';
import { fieldErrorTextStyle } from './field-error.text.style';

describe('FieldErrorText', () => {
  it('renders as BaseText', () => {
    const customStyle: TextStyle = { width: 1 };
    const contentMock = 'content';

    const testRenderer = renderer.create(
      <FieldErrorText style={customStyle}>{contentMock}</FieldErrorText>
    );

    const baseText = testRenderer.root.children[0] as ReactTestInstance;

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.weight).toEqual('medium');
    expect(baseText.props.size).toEqual('small');
    expect(baseText.props.style).toEqual([
      fieldErrorTextStyle.textStyle,
      customStyle,
    ]);
    expect(baseText.props.children).toEqual(contentMock);
  });
});
