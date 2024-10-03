// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { GrayScaleColor } from '../../../theming/colors';
import { IconButton } from '../../buttons/icon/icon.button';
import { BaseText } from '../../text/base-text/base-text';
import { locationTextInputStyles as styles } from './location-text.input.styles';

export interface ILocationTextInputProps
  extends Omit<TextInputProps, 'style' | 'textContentType'> {
  onChangeText: (inputValue: string) => void;
  onLocationPress: () => void;
  onRemovePress?: () => void;
  viewStyle?: StyleProp<ViewStyle>;
  errorMessage?: string;
  disabledLocation?: boolean;
}

export const LocationTextInput = ({
  onChangeText,
  onLocationPress,
  onRemovePress,
  viewStyle,
  errorMessage,
  keyboardType,
  disabledLocation,
  ...props
}: ILocationTextInputProps): ReactElement => {
  const errorMessageText = errorMessage ? (
    <BaseText style={styles.errorTextStyle} weight='semiBold'>
      {errorMessage}
    </BaseText>
  ) : null;
  const removeIconButton =
    onRemovePress && props.value ? (
      <IconButton
        onPress={onRemovePress}
        iconName='times'
        iconTextStyle={styles.closeIconStyle}
        accessibilityLabel='times'
      />
    ) : null;
  return (
    <View>
      {errorMessageText}
      <View style={[styles.outerViewStyle, viewStyle]}>
        <TextInput
          keyboardType={keyboardType || 'numeric'}
          style={styles.inputTextStyle}
          placeholderTextColor={GrayScaleColor.secondaryGray}
          onChangeText={onChangeText}
          value={props.value}
          {...props}
        />
        {removeIconButton}
        <View style={styles.crossBorderStyle} />
        <IconButton
          disabled={disabledLocation}
          viewStyle={styles.locationIconStyle}
          onPress={onLocationPress}
          iconName='location-arrow'
          iconTextStyle={styles.locationIconTextStyle}
          accessibilityLabel='location-arrow'
        />
      </View>
    </View>
  );
};
