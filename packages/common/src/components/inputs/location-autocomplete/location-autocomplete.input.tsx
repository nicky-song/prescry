// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextInputProps,
  ActivityIndicator,
} from 'react-native';
import { ILocationCoordinates } from '../../../models/location-coordinates';
import { PrimaryColor } from '../../../theming/colors';
import { formatUserLocation } from '../../../utils/format-address.helper';
import { BaseText } from '../../text/base-text/base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { LocationTextInput } from '../location-text/location-text.input';
import { locationAutocompleteInputStyles as styles } from './location-autocomplete.input.styles';

export interface ILocationAutocompleteInputProps
  extends Omit<TextInputProps, 'keyboardType' | 'style' | 'textContentType'> {
  query: string;
  showSuggestions: boolean;
  onChangeText: (text: string) => void;
  suggestions: ILocationCoordinates[];
  viewStyle?: StyleProp<ViewStyle>;
  errorMessage?: string | null;
  isLoading?: boolean;
  onRemovePress?: () => void;
  onSelectLocation?: (location: ILocationCoordinates) => void;
  onLocationPress?: () => void;
}

export const LocationAutocompleteInput = ({
  viewStyle,
  query,
  placeholder,
  suggestions,
  showSuggestions,
  isLoading,
  errorMessage,
  onChangeText,
  onRemovePress,
  onSelectLocation,
  onLocationPress,
}: ILocationAutocompleteInputProps): ReactElement => {
  const handleLocationPress = () => {
    if (onLocationPress) {
      onLocationPress();
    }
  };
  const handleSelectLocation = (suggestion: ILocationCoordinates) => {
    if (onSelectLocation) {
      onSelectLocation(suggestion);
    }
  };

  const loadingSpinner = isLoading ? (
    <View style={styles.spinnerViewStyle}>
      <ActivityIndicator size='large' color={PrimaryColor.prescryptivePurple} />
    </View>
  ) : null;
  const errorMessageText =
    !isLoading && errorMessage ? (
      <BaseText size='small' weight='semiBold' style={styles.errorTextStyle}>
        {errorMessage}
      </BaseText>
    ) : null;
  const locationList =
    !isLoading && showSuggestions && suggestions.length > 0 ? (
      <View style={styles.suggestionListStyle}>
        {suggestions.map((suggestion, index) => {
          const handleSuggestionPress = () => handleSelectLocation(suggestion);
          const suggestionItemNoBorderStyle =
            index === suggestions.length - 1
              ? styles.suggestionItemNoBorderStyle
              : null;
          return (
            <TouchableOpacity onPress={handleSuggestionPress} key={index}>
              <ProtectedBaseText
                style={[
                  styles.suggestionItemStyle,
                  suggestionItemNoBorderStyle,
                ]}
                numberOfLines={1}
                testID={`locationAutocompleteInput-${suggestion.fullAddress}`}
              >
                {formatUserLocation(suggestion)}
              </ProtectedBaseText>
            </TouchableOpacity>
          );
        })}
      </View>
    ) : null;

  return (
    <View style={[viewStyle]}>
      <LocationTextInput
        keyboardType='default'
        placeholder={placeholder}
        onChangeText={onChangeText}
        onRemovePress={onRemovePress}
        value={query}
        disabledLocation={isLoading}
        onLocationPress={handleLocationPress}
        testID='locationTextInput'
      />
      {loadingSpinner}
      {errorMessageText}
      {locationList}
    </View>
  );
};
