// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../../testing/test.helper';
import { MoneyFormatter } from '../../../../utils/formatters/money-formatter';
import { BaseText } from '../../../text/base-text/base-text';
import { ValueText } from '../../../text/value/value.text';
import { AccumulatorProgressLabel } from './accumulator.progress-label';
import { accumulatorProgressLabelStyles } from './accumulator.progress-label.styles';

jest.mock('../../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

describe('AcccumulatorProgressLabel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [undefined, 'accumulatorProgressLabel'],
    ['test-id', 'test-id'],
  ])(
    'renders in View container with testID %p',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const viewStyleMock: ViewStyle = { width: 1 };

      const testRenderer = renderer.create(
        <AccumulatorProgressLabel
          viewStyle={viewStyleMock}
          testID={testIdMock}
          value={0}
          label=''
        />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;

      expect(container.type).toEqual(View);
      expect(container.props.style).toEqual(viewStyleMock);
      expect(container.props.testID).toEqual(expectedTestId);
      expect(getChildren(container).length).toEqual(2);
    }
  );

  it('renders label text', () => {
    const labelMock = 'label';
    const isSkeletonMock = true;

    const testRenderer = renderer.create(
      <AccumulatorProgressLabel
        value={0}
        label={labelMock}
        isSkeleton={isSkeletonMock}
      />
    );

    const container = testRenderer.root.findByProps({
      testID: 'accumulatorProgressLabel',
    });
    const label = getChildren(container)[0];

    expect(label.type).toEqual(BaseText);
    expect(label.props.style).toEqual(
      accumulatorProgressLabelStyles.labelTextStyle
    );
    expect(label.props.children).toEqual(labelMock);
  });

  it('renders label value', () => {
    const valueMock = 100;

    const testRenderer = renderer.create(
      <AccumulatorProgressLabel value={valueMock} label='' />
    );

    const container = testRenderer.root.findByProps({
      testID: 'accumulatorProgressLabel',
    });
    const value = getChildren(container)[1];

    expect(value.type).toEqual(ValueText);
    expect(value.props.children).toEqual(MoneyFormatter.format(valueMock));
  });
});
