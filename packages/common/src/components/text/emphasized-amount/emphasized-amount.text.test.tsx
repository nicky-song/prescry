// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseText } from '../base-text/base-text';
import { EmphasizedAmountText } from './emphasized-amount.text';

describe('EmphasizedAmountText', () => {
  it('renders as BaseText', () => {
    const customStyle: TextStyle = { width: 1 };
    const contentMock = 'content';
    const testIDMock = 'test-id';

    const testRenderer = renderer.create(
      <EmphasizedAmountText style={customStyle} testID={testIDMock}>
        {contentMock}
      </EmphasizedAmountText>
    );

    const baseText = testRenderer.root.children[0] as ReactTestInstance;

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.weight).toEqual('bold');
    expect(baseText.props.size).toEqual('large');
    expect(baseText.props.testID).toEqual(testIDMock);
    expect(baseText.props.style).toEqual(customStyle);
  });
});
