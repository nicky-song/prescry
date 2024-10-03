// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { IconButton } from '../icon/icon.button';
import { InformationButton } from './information.button';

jest.mock('../icon/icon.button', () => ({
  IconButton: () => <div />,
}));

describe('InformationButton', () => {
  it('has the expected props', () => {
    const mockOnPress = jest.fn();
    const accessibilityLabel = 'Open information price modal';
    const testRenderer = renderer.create(
      <InformationButton
        onPress={mockOnPress}
        accessibilityLabel={accessibilityLabel}
      />
    );
    const container = testRenderer.root.findByType(IconButton);
    expect(container.props.iconName).toEqual('info-circle');
    expect(container.props.accessibilityLabel).toEqual(
      'Open information price modal'
    );
  });

  it('should call onPress on click', () => {
    const mockOnPress = jest.fn();
    const accessibilityLabel = 'Open information price modal';
    const testRenderer = renderer.create(
      <InformationButton
        onPress={mockOnPress}
        accessibilityLabel={accessibilityLabel}
      />
    );
    testRenderer.root.findByProps({ onPress: mockOnPress }).props.onPress();
    expect(mockOnPress).toHaveBeenCalled();
  });
});
