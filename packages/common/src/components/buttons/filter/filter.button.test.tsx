// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { IconSize } from '../../../theming/icons';
import { ToolButton } from '../tool.button/tool.button';
import { FilterButton } from './filter.button';
import { filterButtonStyles } from './filter.button.styles';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('FilterButton', () => {
  it('has the expected props', () => {
    const mockOnPress = jest.fn();
    const testRenderer = renderer.create(
      <FilterButton onPress={mockOnPress} />
    );
    const container = testRenderer.root.findByType(ToolButton);

    expect(container.props.testID).toEqual('toolButton');
    expect(container.props.onPress).toEqual(expect.any(Function));
    expect(container.props.iconName).toEqual('sliders-h');
    expect(container.props.iconSize).toEqual(IconSize.regular);
    expect(container.props.viewStyle).toEqual(
      filterButtonStyles.toolButtonViewStyle
    );
  });

  it('should call onPress on press', () => {
    const mockOnPress = jest.fn();
    const testRenderer = renderer.create(
      <FilterButton onPress={mockOnPress} />
    );
    testRenderer.root.findByProps({ onPress: mockOnPress }).props.onPress();
    expect(mockOnPress).toHaveBeenCalled();
  });
});
