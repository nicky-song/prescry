// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { radioButtonStyles as styles } from './radio-button.styles';

export interface IRadioButtonProps {
  onPress: (value: number) => void;
  isSelected: boolean;
  buttonLabel: string;
  buttonValue: number;
  buttonTextStyle?: TextStyle;
  viewStyle?: ViewStyle;
  buttonSubLabel?: string;
  buttonTopTextStyle?: TextStyle;
  buttonBottomTextStyle?: TextStyle;
  buttonLabelGroupStyle?: ViewStyle;
  testID?: string;
}

export const RadioButton = (props: IRadioButtonProps) => {
  const {
    onPress,
    isSelected,
    buttonLabel,
    buttonValue,
    viewStyle,
    buttonSubLabel,
    buttonLabelGroupStyle,
    testID,
  } = props;

  const onTouchablePress = () => {
    onPress(buttonValue);
  };

  const renderInnerCircle = () => {
    if (isSelected) {
      return <View style={styles.innerCircle} />;
    }
    return null;
  };

  const singleLabel = (
    <BaseText style={props.buttonTextStyle ?? styles.buttonText}>
      {buttonLabel}
    </BaseText>
  );

  const doubleLabel = (
    <View style={buttonLabelGroupStyle}>
      <BaseText style={[styles.buttonTopText, props.buttonTopTextStyle]}>
        {buttonLabel}
      </BaseText>
      <BaseText style={[styles.buttonText, props.buttonBottomTextStyle]}>
        {buttonSubLabel}
      </BaseText>
    </View>
  );

  return (
    <TouchableOpacity
      style={viewStyle ?? styles.buttonContainer}
      onPress={onTouchablePress}
      {...(testID && { testID: `${testID}Touchable` })}
    >
      <View style={styles.outerCircle} testID={`radioButton-${buttonLabel}`}>
        {renderInnerCircle()}
      </View>
      {buttonSubLabel ? doubleLabel : singleLabel}
    </TouchableOpacity>
  );
};
