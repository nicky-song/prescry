// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { ToolButton } from '../tool.button/tool.button';
import { LocationButton } from './location.button';
import { locationButtonStyles } from './location.button.styles';

jest.mock('../tool.button/tool.button', () => ({
  ToolButton: () => <div />,
}));

describe('LocationButton', () => {
  it('has the expected props', () => {
    const mockOnPress = jest.fn();
    const viewStyleMock = { width: 'auto' };
    const locationMock = 'location-mock';
    const testRenderer = renderer.create(
      <LocationButton
        onPress={mockOnPress}
        location={locationMock}
        viewStyle={viewStyleMock}
      />
    );
    const container = testRenderer.root.findByType(ToolButton);
    expect(container.props.children).toEqual(locationMock);
    expect(container.props.iconName).toEqual('location-arrow');
    expect(container.props.iconTextStyle).toEqual(
      locationButtonStyles.locationButtonTextStyle
    );
    expect(container.props.testID).toEqual('locationButton');
    expect(container.props.translateContent).toEqual(false);
  });

  it('should call onPress on click', () => {
    const mockOnPress = jest.fn();
    const locationMock = 'location-mock';
    const testRenderer = renderer.create(
      <LocationButton onPress={mockOnPress} location={locationMock} />
    );
    testRenderer.root.findByProps({ onPress: mockOnPress }).props.onPress();
    expect(mockOnPress).toHaveBeenCalled();
  });
});
