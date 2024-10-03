// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseText } from '../base-text/base-text';
import { ConfirmedAmountText } from './confirmed-amount.text';
import { confirmedAmountTextStyle } from './confirmed-amount.text.style';

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

describe('ConfirmedAmountText', () => {
  it('renders as BaseText', () => {
    const customStyle: TextStyle = { width: 1 };
    const contentMock = 'content';

    const testRenderer = renderer.create(
      <ConfirmedAmountText style={customStyle}>
        {contentMock}
      </ConfirmedAmountText>
    );

    const baseText = testRenderer.root.children[0] as ReactTestInstance;

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual([
      confirmedAmountTextStyle.textStyle,
      customStyle,
    ]);
  });

  it('renders skeletons when isSkeleton is true', () => {
    const customStyle: TextStyle = { width: 1 };
    const contentMock = 'content';

    const testRenderer = renderer.create(
      <ConfirmedAmountText style={customStyle} isSkeleton={true}>
        {contentMock}
      </ConfirmedAmountText>
    );

    const baseText = testRenderer.root.children[0] as ReactTestInstance;

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.isSkeleton).toEqual(true);
    expect(baseText.props.skeletonWidth).toEqual('short');
  });
});
