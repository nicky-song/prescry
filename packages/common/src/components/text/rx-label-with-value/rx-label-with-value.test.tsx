// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import { rxLabelWithValueStyles } from './rx-label-with-value.styles';
import { getChildren } from '../../../testing/test.helper';
import { BaseText } from '../base-text/base-text';
import { RxLabelWithValue } from './rx-label-with-value';
import { ProtectedBaseText } from '../protected-base-text/protected-base-text';
import { RxCardType } from '../../../models/rx-id-card';

jest.mock('../protected-base-text/protected-base-text', () => ({
  ProtectedBaseText: () => <div />,
}));

jest.mock('../base-text/base-text', () => ({
  BaseText: () => <div />,
}));

const labelMock = 'label-mock';
const valueMock = 'value-mock';
const isSkeletonMock = false;

describe('RxLabelWithValue', () => {
  it('renders as View with expected style', () => {
    const testRenderer = renderer.create(
      <RxLabelWithValue
        label={labelMock}
        value={valueMock}
        isSkeleton={isSkeletonMock}
        rxType='pbm'
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(
      rxLabelWithValueStyles.rxLabelWithValueViewStyle
    );
    expect(getChildren(view).length).toEqual(2);
  });

  it.each([['smartPrice'], ['pbm']])(
    'renders label and value as BaseText with expected style and isSkeleton for %p card',
    (cardType: string) => {
      const rxCardType = cardType as RxCardType;
      const testRenderer = renderer.create(
        <RxLabelWithValue
          label={labelMock}
          value={valueMock}
          isSkeleton={isSkeletonMock}
          rxType={rxCardType}
        />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      const label = getChildren(view)[0];
      const protectedBaseText = getChildren(view)[1];
      const value = getChildren(protectedBaseText)[0];

      expect(label.type).toEqual(BaseText);
      if (cardType === 'pbm')
        expect(label.props.style).toEqual([
          rxLabelWithValueStyles.rxLabelTextStyle,
          rxLabelWithValueStyles.rxBenefitLabelTextStyle,
        ]);
      else
        expect(label.props.style).toEqual([
          rxLabelWithValueStyles.rxLabelTextStyle,
          rxLabelWithValueStyles.rxSavingsLabelTextStyle,
        ]);
      expect(label.props.isSkeleton).toEqual(isSkeletonMock);
      expect(label.props.skeletonWidth).toEqual('short');
      expect(label.props.children).toEqual(labelMock);

      expect(protectedBaseText.type).toEqual(ProtectedBaseText);
      expect(getChildren(protectedBaseText).length).toEqual(1);

      expect(value.type).toEqual(BaseText);
      if (cardType === 'pbm')
        expect(value.props.style).toEqual([
          rxLabelWithValueStyles.rxValueTextStyle,
          rxLabelWithValueStyles.rxBenefitValueTextStyle,
        ]);
      else
        expect(value.props.style).toEqual([
          rxLabelWithValueStyles.rxValueTextStyle,
          rxLabelWithValueStyles.rxSavingsValueTextStyle,
        ]);
      expect(value.props.isSkeleton).toEqual(isSkeletonMock);
      expect(value.props.children).toEqual(valueMock);
    }
  );
});
