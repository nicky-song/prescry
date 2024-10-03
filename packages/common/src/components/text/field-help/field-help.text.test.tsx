// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseText } from '../base-text/base-text';
import { FieldHelpText } from './field-help.text';

describe('FieldHelpText', () => {
  it('renders as BaseText', () => {
    const customStyle: TextStyle = { width: 1 };
    const contentMock = 'content';

    const testRenderer = renderer.create(
      <FieldHelpText style={customStyle}>{contentMock}</FieldHelpText>
    );

    const baseText = testRenderer.root.children[0] as ReactTestInstance;

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.size).toEqual('small');
    expect(baseText.props.style).toEqual(customStyle);
    expect(baseText.props.children).toEqual(contentMock);
  });
});
