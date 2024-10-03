// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ViewStyle } from 'react-native';
import { GoBackButton } from './go-back.button';
import { goBackButtonStyles } from './go-back.button.styles';
import { IconButton, IIconButtonProps } from '../icon/icon.button';

jest.mock('../icon/icon.button', () => ({
  IconButton: () => <div />,
}));

describe('GoBackButton', () => {
  it('renders as IconButton', () => {
    const onPressMock = jest.fn();
    const accessibilityLabelMock = 'accessibility-label';
    const customViewStyle: ViewStyle = { width: 1 };

    const testRenderer = renderer.create(
      <GoBackButton
        onPress={onPressMock}
        accessibilityLabel={accessibilityLabelMock}
        viewStyle={customViewStyle}
        testID='goBackButton'
      />
    );

    const button = testRenderer.root.children[0] as ReactTestInstance;

    expect(button.type).toEqual(IconButton);

    const props = button.props as IIconButtonProps;
    expect(props.iconName).toEqual('chevron-left');
    expect(props.size).toEqual('large');
    expect(props.onPress).toEqual(onPressMock);
    expect(props.viewStyle).toEqual([
      goBackButtonStyles.viewStyle,
      customViewStyle,
    ]);
    expect(props.testID).toEqual('goBackButton');
  });
});
