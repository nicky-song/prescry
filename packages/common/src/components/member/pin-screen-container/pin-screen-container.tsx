// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { PrimaryTextBox } from '../../text/primary-text-box/primary-text-box';
import { PinDisplayContainer } from '../pin-display-container/pin-display-container';
import { PinKeypadContainer } from '../pin-keypad-container/pin-keypad-container';
import { pinScreenContainerStyles } from './pin-screen-container.styles';
export interface IPinScreenContainerProps {
  errorMessage?: string;
  enteredPin: string;
  onPinChange: (pin: string) => void;
  testID?: string;
}
export const PinScreenContainer = (
  props: IPinScreenContainerProps
): ReactElement => {
  const setEnteredPin = async (pin: string) => {
    await props.onPinChange(pin);
  };

  const renderAnyErrorText = () => {
    if (props.errorMessage) {
      return (
        <PrimaryTextBox
          caption={props.errorMessage}
          textBoxStyle={pinScreenContainerStyles.errorTextStyle}
          testID={`${props.testID}PrimaryTextBox`}
        />
      );
    }
    return;
  };

  return (
    <View
      style={pinScreenContainerStyles.containerViewStyle}
      testID='pinScreen'
    >
      <PinDisplayContainer pinIndex={props.enteredPin.length} />
      {renderAnyErrorText()}
      <View style={pinScreenContainerStyles.pinKeypadStyle} testID='pinKeypad'>
        <PinKeypadContainer
          setEnteredPin={setEnteredPin}
          enteredPin={props.enteredPin}
          testID={`${props.testID}PinKeyPadContainer`}
        />
      </View>
    </View>
  );
};
