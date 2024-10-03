// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../base-text/base-text';
import { DosageInstructionText } from './dosage-instruction.text';
import { dosageInstructionTextStyles } from './dosage-instruction.text.styles';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../base-text/base-text', () => ({
  BaseText: () => <div />,
}));

describe('DosageInstructionText', () => {
  it('renders in View container', () => {
    const viewStyleMock: ViewStyle = { width: 1 };

    const testRenderer = renderer.create(
      <DosageInstructionText viewStyle={viewStyleMock} instruction='' />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.style).toEqual([
      dosageInstructionTextStyles.viewStyle,
      viewStyleMock,
    ]);
    expect(container.props.testID).toEqual('dosageInstructionText');
    expect(getChildren(container).length).toEqual(2);
  });

  it('renders icon', () => {
    const testRenderer = renderer.create(
      <DosageInstructionText instruction='' />
    );

    const container = testRenderer.root.findByProps({
      testID: 'dosageInstructionText',
    });
    const icon = getChildren(container)[0];

    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual('prescription-bottle');
    expect(icon.props.style).toEqual(dosageInstructionTextStyles.iconTextStyle);
  });

  it('renders instruction', () => {
    const instructionMock = 'instruction';
    const isSkeletonMock = true;

    const testRenderer = renderer.create(
      <DosageInstructionText
        instruction={instructionMock}
        isSkeleton={isSkeletonMock}
      />
    );

    const container = testRenderer.root.findByProps({
      testID: 'dosageInstructionText',
    });
    const instruction = getChildren(container)[1];

    expect(instruction.type).toEqual(BaseText);
    expect(instruction.props.style).toEqual(
      dosageInstructionTextStyles.instructionTextStyle
    );
    expect(instruction.props.isSkeleton).toEqual(isSkeletonMock);
    expect(instruction.props.skeletonWidth).toEqual('long');
    expect(instruction.props.children).toEqual(instructionMock);
  });
});
