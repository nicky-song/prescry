// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { TextStyle, ViewStyle } from 'react-native';
import { Label, LabelPosition } from './label';
import { labelStyle } from './label.style';
import { LabelText } from '../../primitives/label-text';
import { BaseText } from '../base-text/base-text';

jest.mock('../base-text/base-text', () => ({
  BaseText: () => <div />,
}));

describe('Label', () => {
  it.each([
    [undefined, labelStyle.aboveViewStyle],
    ['above', labelStyle.aboveViewStyle],
    ['left', labelStyle.leftViewStyle],
    ['right', labelStyle.rightViewStyle],
  ])(
    'renders as label (position: %p)',
    (positionMock: string | undefined, expectedViewStyle: ViewStyle) => {
      const customViewStyle: ViewStyle = { width: 1 };
      const testRenderer = renderer.create(
        <Label
          label='label'
          position={positionMock as LabelPosition}
          viewStyle={customViewStyle}
        >
          <div />
        </Label>
      );

      const labelText = testRenderer.root.children[0] as ReactTestInstance;

      expect(labelText.type).toEqual(LabelText);
      expect(labelText.props.style).toEqual([
        expectedViewStyle,
        customViewStyle,
      ]);
      expect(labelText.props.children.length).toEqual(2);
    }
  );

  it.each([
    [labelStyle.aboveTextStyle, undefined, undefined],
    [labelStyle.aboveTextStyle, 'above', true],
    [labelStyle.leftTextStyle, 'left', false],
    [labelStyle.rightTextStyle, 'right', true],
  ])(
    'renders label content (position: %p)',
    (
      expectedTextStyle: TextStyle,
      positionMock?: string,
      isSkeleton?: boolean
    ) => {
      const labelMock = 'label';
      const customTextStyle: TextStyle = { width: 1 };
      const testRenderer = renderer.create(
        <Label
          label={labelMock}
          position={positionMock as LabelPosition}
          textStyle={customTextStyle}
          isSkeleton={isSkeleton}
        >
          <div />
        </Label>
      );

      const labelText = testRenderer.root.findByType(LabelText);
      const labelContent = labelText.props.children[0];

      expect(labelContent.type).toEqual(BaseText);
      expect(labelContent.props.weight).toEqual('semiBold');
      expect(labelContent.props.style).toEqual([
        expectedTextStyle,
        customTextStyle,
      ]);
      expect(labelContent.props.isSkeleton).toEqual(isSkeleton);
      expect(labelContent.props.children[0]).toEqual(labelMock);

      const requiredMark = labelContent.props.children[1];
      expect(requiredMark).toBeNull();
    }
  );

  it.each([[undefined], [false], [true]])(
    'renders required mark (isRequired: %p)',
    (isRequiredMock: boolean | undefined) => {
      const testRenderer = renderer.create(
        <Label label='label' isRequired={isRequiredMock}>
          <div />
        </Label>
      );

      const labelText = testRenderer.root.findByType(LabelText);
      const labelContent = labelText.props.children[0];
      const requiredMark = labelContent.props.children[1];

      if (!isRequiredMock) {
        expect(requiredMark).toBeNull();
      } else {
        expect(requiredMark.type).toEqual(BaseText);
        expect(requiredMark.props.weight).toEqual('bold');
        expect(requiredMark.props.style).toEqual(labelStyle.requiredTextStyle);
        expect(requiredMark.props.children).toEqual('*');
      }
    }
  );

  it('renders children', () => {
    const ChildMock = () => <div />;
    const testRenderer = renderer.create(
      <Label label='label'>
        <ChildMock />
      </Label>
    );

    const labelText = testRenderer.root.findByType(LabelText);
    const children = labelText.props.children[1];

    expect(children).toEqual(<ChildMock />);
  });
});
