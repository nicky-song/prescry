// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { locationCoordinatesMock } from '../../../experiences/guest-experience/__mocks__/location-coordinate.mock';
import { BaseText } from '../../text/base-text/base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { LocationTextInput } from '../location-text/location-text.input';
import {
  ILocationAutocompleteInputProps,
  LocationAutocompleteInput,
} from './location-autocomplete.input';
import { locationAutocompleteInputStyles } from './location-autocomplete.input.styles';

jest.mock('react-native', () => ({
  View: () => <div />,
  TouchableOpacity: () => <div />,
  ActivityIndicator: () => <div />,
  ViewStyle: {},
  Platform: {
    select: jest.fn().mockReturnValue(333),
  },
  Dimensions: {
    get: jest.fn().mockReturnValue(333),
  },
}));

jest.mock('../location-text/location-text.input', () => ({
  LocationTextInput: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

describe('LocationAutocompleteInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders expected components', () => {
    const onChangeTextMock = jest.fn();
    const onLocationPressMock = jest.fn();
    const onRemovePressMock = jest.fn();
    const onSelectLocationMock = jest.fn();
    const valueMock = 'zip';
    const placeholderMock = 'user location';
    const testIDMock = 'locationAutocompleteInput-undefined';
    const mockProps: ILocationAutocompleteInputProps = {
      query: valueMock,
      placeholder: placeholderMock,
      showSuggestions: true,
      suggestions: [locationCoordinatesMock],
      isLoading: false,
      onChangeText: onChangeTextMock,
      onLocationPress: onLocationPressMock,
      onRemovePress: onRemovePressMock,
      onSelectLocation: onSelectLocationMock,
    };

    const testRenderer = renderer.create(
      <LocationAutocompleteInput {...mockProps} testID={testIDMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    expect(view.type).toEqual(View);

    const locationTextInput = view.props.children[0];
    expect(locationTextInput.type).toEqual(LocationTextInput);
    expect(locationTextInput.props.keyboardType).toEqual('default');
    expect(locationTextInput.props.placeholder).toEqual(placeholderMock);
    expect(locationTextInput.props.value).toEqual(valueMock);
    expect(locationTextInput.props.onChangeText).toEqual(onChangeTextMock);
    expect(locationTextInput.props.onRemovePress).toEqual(onRemovePressMock);
    expect(locationTextInput.props.disabledLocation).toEqual(false);
    expect(locationTextInput.props.testID).toEqual('locationTextInput');

    const suggestions = view.props.children[3];
    expect(suggestions.type).toEqual(View);
    expect(suggestions.props.style).toEqual(
      locationAutocompleteInputStyles.suggestionListStyle
    );

    const firstSuggestion = suggestions.props.children[0];
    expect(firstSuggestion.type).toEqual(TouchableOpacity);
    const protectedBaseText = firstSuggestion.props.children;
    expect(protectedBaseText.type).toEqual(ProtectedBaseText);
    const pressFirstSuggestion = firstSuggestion.props.onPress;
    pressFirstSuggestion();
    expect(onSelectLocationMock).toHaveBeenCalledWith(locationCoordinatesMock);
    const baseText = firstSuggestion.props.children;
    expect(baseText.props.testID).toEqual(testIDMock);
  });

  it('renders spinner when loading', () => {
    const onChangeTextMock = jest.fn();
    const onLocationPressMock = jest.fn();
    const onRemovePressMock = jest.fn();
    const valueMock = 'zip';
    const placeholderMock = 'user location';
    const mockProps: ILocationAutocompleteInputProps = {
      query: valueMock,
      placeholder: placeholderMock,
      showSuggestions: true,
      suggestions: [],
      isLoading: true,
      onChangeText: onChangeTextMock,
      onLocationPress: onLocationPressMock,
      onRemovePress: onRemovePressMock,
    };

    const testRenderer = renderer.create(
      <LocationAutocompleteInput {...mockProps} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    expect(view.type).toEqual(View);

    const spinner = view.props.children[1];
    expect(spinner.type).toEqual(View);
    expect(spinner.props.style).toEqual(
      locationAutocompleteInputStyles.spinnerViewStyle
    );

    expect(view.props.children[2]).toEqual(null);
    expect(view.props.children[3]).toEqual(null);
  });

  it('renders errorMessage', () => {
    const onChangeTextMock = jest.fn();
    const onLocationPressMock = jest.fn();
    const onRemovePressMock = jest.fn();
    const valueMock = 'zip';
    const placeholderMock = 'user location';
    const errorMessageMock = 'Error Found';
    const mockProps: ILocationAutocompleteInputProps = {
      query: valueMock,
      placeholder: placeholderMock,
      showSuggestions: true,
      suggestions: [],
      isLoading: false,
      errorMessage: errorMessageMock,
      onChangeText: onChangeTextMock,
      onLocationPress: onLocationPressMock,
      onRemovePress: onRemovePressMock,
    };

    const testRenderer = renderer.create(
      <LocationAutocompleteInput {...mockProps} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    expect(view.type).toEqual(View);

    expect(view.props.children[1]).toEqual(null);

    const errorContainer = view.props.children[2];
    expect(errorContainer.type).toEqual(BaseText);
    expect(errorContainer.props.style).toEqual(
      locationAutocompleteInputStyles.errorTextStyle
    );
    expect(errorContainer.props.children).toEqual(errorMessageMock);

    expect(view.props.children[3]).toEqual(null);
  });
});
