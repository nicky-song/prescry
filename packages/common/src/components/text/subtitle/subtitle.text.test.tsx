// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseText } from '../base-text/base-text';
import { SubtitleText } from './subtitle.text';

describe('SubtitleText', () => {
  it('renders as BaseText', () => {
    const customStyle: TextStyle = { width: 1 };
    const contentMock = 'content';

    const testRenderer = renderer.create(
      <SubtitleText style={customStyle}>{contentMock}</SubtitleText>
    );

    const baseText = testRenderer.root.children[0] as ReactTestInstance;

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.size).toEqual('small');
    expect(baseText.props.style).toEqual(customStyle);
  });
});
