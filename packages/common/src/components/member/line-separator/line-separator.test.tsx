// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { LineSeparator } from './line-separator';
import { getChildren } from '../../../testing/test.helper';
import { lineSeparatorStyles } from './line-separator.styles';
import { BaseText } from '../../text/base-text/base-text';

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

describe('LineSeparator', () => {
  const viewStyleMock: ViewStyle = {};

  const expectedLineViewStyle = [
    lineSeparatorStyles.lineViewStyle,
    viewStyleMock,
  ];

  const expectedLineViewStyleWhenHasLabel = [
    lineSeparatorStyles.lineViewStyle,
    lineSeparatorStyles.surroundingLineViewStyle,
  ];

  const expectedLineWithLabelViewStyle = [
    lineSeparatorStyles.linesWithLabelViewStyle,
    viewStyleMock,
  ];

  it('renders as View with expected style', () => {
    const testRenderer = renderer.create(
      <LineSeparator viewStyle={viewStyleMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);

    expect(view.props.style).toEqual(expectedLineViewStyle);

    expect(view.props.children).toBeUndefined();
  });

  it('renders as View with expected style and 3 children when given label', () => {
    const labelMock = 'label-mock';
    const viewStyleMock: ViewStyle = {};

    const testRenderer = renderer.create(
      <LineSeparator viewStyle={viewStyleMock} label={labelMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);

    expect(view.props.style).toEqual(expectedLineWithLabelViewStyle);

    expect(getChildren(view).length).toEqual(3);
  });

  it('renders lines as first and third children when given label', () => {
    const labelMock = 'label-mock';
    const viewStyleMock: ViewStyle = {};

    const testRenderer = renderer.create(
      <LineSeparator viewStyle={viewStyleMock} label={labelMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const lineOne = getChildren(view)[0];
    const lineTwo = getChildren(view)[2];

    expect(lineOne.type).toEqual(View);
    expect(lineTwo.type).toEqual(View);

    expect(lineOne.props.style).toEqual(expectedLineViewStyleWhenHasLabel);
    expect(lineTwo.props.style).toEqual(expectedLineViewStyleWhenHasLabel);
  });

  it('renders BaseText as second child when given label', () => {
    const labelMock = 'label-mock';
    const viewStyleMock: ViewStyle = {};
    const isSkeletonMock = false;

    const testRenderer = renderer.create(
      <LineSeparator
        viewStyle={viewStyleMock}
        label={labelMock}
        isSkeleton={isSkeletonMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const baseText = getChildren(view)[1];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(lineSeparatorStyles.labelTextStyle);
    expect(baseText.props.children).toEqual(labelMock);
    expect(baseText.props.isSkeleton).toEqual(isSkeletonMock);
  });
});
