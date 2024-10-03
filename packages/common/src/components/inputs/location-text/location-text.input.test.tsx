// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { TextInput, View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { GrayScaleColor } from '../../../theming/colors';
import { IconButton } from '../../buttons/icon/icon.button';
import { BaseText } from '../../text/base-text/base-text';
import {
  ILocationTextInputProps,
  LocationTextInput,
} from './location-text.input';
import { locationTextInputStyles } from './location-text.input.styles';

jest.mock('react-native', () => ({
  View: () => <div />,
  ViewStyle: {},
  TextInput: () => <div />,
  Platform: {
    select: jest.fn().mockReturnValue(333),
  },
  Dimensions: {
    get: jest.fn().mockReturnValue(333),
  },
}));

jest.mock('../../buttons/icon/icon.button', () => ({
  IconButton: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

describe('LocationTextInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders expected components', () => {
    const onChangeTextMock = jest.fn();
    const onLocationPressMock = jest.fn();
    const onRemovePressMock = jest.fn();
    const valueMock = 'zip';
    const mockProps: ILocationTextInputProps = {
      onChangeText: onChangeTextMock,
      onLocationPress: onLocationPressMock,
      onRemovePress: onRemovePressMock,
      value: valueMock,
      disabledLocation: true,
    };

    const testRenderer = renderer.create(<LocationTextInput {...mockProps} />);

    const view = testRenderer.root.children[0] as ReactTestInstance;
    expect(view.type).toEqual(View);

    const errorMessageText = view.props.children[0];
    expect(errorMessageText).toEqual(null);

    const outerView = view.props.children[1];
    expect(outerView.type).toEqual(View);
    expect(outerView.props.style).toEqual([
      locationTextInputStyles.outerViewStyle,
      undefined,
    ]);

    const textInput = outerView.props.children[0];
    expect(textInput.type).toEqual(TextInput);
    expect(textInput.props.keyboardType).toEqual('numeric');
    expect(textInput.props.style).toEqual(
      locationTextInputStyles.inputTextStyle
    );
    expect(textInput.props.placeholderTextColor).toEqual(
      GrayScaleColor.secondaryGray
    );
    expect(textInput.props.onChangeText).toEqual(onChangeTextMock);
    expect(textInput.props.value).toEqual(valueMock);

    const removeIconButton = outerView.props.children[1];
    expect(removeIconButton.type).toEqual(IconButton);
    expect(removeIconButton.props.onPress).toEqual(onRemovePressMock);
    expect(removeIconButton.props.iconName).toEqual('times');
    expect(removeIconButton.props.iconTextStyle).toEqual(
      locationTextInputStyles.closeIconStyle
    );
    expect(removeIconButton.props.accessibilityLabel).toEqual('times');

    const borderView = outerView.props.children[2];
    expect(borderView.type).toEqual(View);
    expect(borderView.props.style).toEqual(
      locationTextInputStyles.crossBorderStyle
    );

    const locationIconButton = outerView.props.children[3];
    expect(locationIconButton.type).toEqual(IconButton);
    expect(locationIconButton.props.onPress).toEqual(onLocationPressMock);
    expect(locationIconButton.props.iconName).toEqual('location-arrow');
    expect(locationIconButton.props.viewStyle).toEqual(
      locationTextInputStyles.locationIconStyle
    );
    expect(locationIconButton.props.iconTextStyle).toEqual(
      locationTextInputStyles.locationIconTextStyle
    );
    expect(locationIconButton.props.accessibilityLabel).toEqual(
      'location-arrow'
    );
    expect(locationIconButton.props.disabled).toEqual(true);
  });

  it('renders errorMessageText with expected message', () => {
    const onChangeTextMock = jest.fn();
    const onLocationPressMock = jest.fn();
    const onRemovePressMock = jest.fn();
    const valueMock = 'zip';
    const errorMessageMock = 'error-message-mock';
    const mockProps: ILocationTextInputProps = {
      onChangeText: onChangeTextMock,
      onLocationPress: onLocationPressMock,
      errorMessage: errorMessageMock,
      onRemovePress: onRemovePressMock,
      value: valueMock,
    };

    const testRenderer = renderer.create(<LocationTextInput {...mockProps} />);

    const view = testRenderer.root.children[0] as ReactTestInstance;
    expect(view.type).toEqual(View);

    const errorMessageText = view.props.children[0];
    expect(errorMessageText.type).toEqual(BaseText);
    expect(errorMessageText.props.style).toEqual(
      locationTextInputStyles.errorTextStyle
    );
    expect(errorMessageText.props.children).toEqual(errorMessageMock);

    const outerView = view.props.children[1];
    expect(outerView.type).toEqual(View);
    expect(outerView.props.style).toEqual([
      locationTextInputStyles.outerViewStyle,
      undefined,
    ]);

    const textInput = outerView.props.children[0];
    expect(textInput.type).toEqual(TextInput);
    expect(textInput.props.keyboardType).toEqual('numeric');
    expect(textInput.props.style).toEqual(
      locationTextInputStyles.inputTextStyle
    );
    expect(textInput.props.placeholderTextColor).toEqual(
      GrayScaleColor.secondaryGray
    );
    expect(textInput.props.onChangeText).toEqual(onChangeTextMock);
    expect(textInput.props.value).toEqual(valueMock);

    const removeIconButton = outerView.props.children[1];
    expect(removeIconButton.type).toEqual(IconButton);
    expect(removeIconButton.props.onPress).toEqual(onRemovePressMock);
    expect(removeIconButton.props.iconName).toEqual('times');
    expect(removeIconButton.props.iconTextStyle).toEqual(
      locationTextInputStyles.closeIconStyle
    );
    expect(removeIconButton.props.accessibilityLabel).toEqual('times');

    const borderView = outerView.props.children[2];
    expect(borderView.type).toEqual(View);
    expect(borderView.props.style).toEqual(
      locationTextInputStyles.crossBorderStyle
    );

    const locationIconButton = outerView.props.children[3];
    expect(locationIconButton.type).toEqual(IconButton);
    expect(locationIconButton.props.onPress).toEqual(onLocationPressMock);
    expect(locationIconButton.props.iconName).toEqual('location-arrow');
    expect(locationIconButton.props.viewStyle).toEqual(
      locationTextInputStyles.locationIconStyle
    );
    expect(locationIconButton.props.iconTextStyle).toEqual(
      locationTextInputStyles.locationIconTextStyle
    );
    expect(locationIconButton.props.accessibilityLabel).toEqual(
      'location-arrow'
    );
    expect(locationIconButton.props.disabled).toEqual(undefined);
  });
});
