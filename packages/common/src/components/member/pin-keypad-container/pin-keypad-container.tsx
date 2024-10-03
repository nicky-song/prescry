// Copyright 2018 Prescryptive Health, Inc.

import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { BackSpaceButton } from '../../../components/pin/backspace-button/backspace-button';
import { PinKeypadCircle } from '../../../components/pin/pin-keypad-circle/pin-keypad-circle';
import { PinScreenConstants } from '../../../theming/constants';
import { pinKeypadContainerStyles } from './pin-keypad-container.styles';

export interface IPinKeypadContainerProps {
  setEnteredPin: (pin: string) => void;
  enteredPin: string;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const Digit2DArray = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

export const PinKeypadContainer: FunctionComponent<IPinKeypadContainerProps> =
  ({ enteredPin, setEnteredPin, viewStyle, testID }): ReactElement => {
    const [isEnteredPinComplete, setIsEnteredPinComplete] =
      useState<boolean>(false);

    useEffect(() => {
      if (enteredPin === '') {
        setIsEnteredPinComplete(false);
      }
    }, [enteredPin]);

    const ignoreHeapRef = useRef<View>(null);

    useEffect(() => {
      ignoreHeapRef.current?.setNativeProps({
        'data-heap-redact-text': 'true',
      });
    }, []);

    const onKeyPress = (pin: string) => {
      if (enteredPin.length < PinScreenConstants.pinLength) {
        enteredPin += pin;
        if (enteredPin.length === PinScreenConstants.pinLength) {
          setIsEnteredPinComplete(true);
        }
        setEnteredPin(enteredPin);
      }
    };

    const onBackspace = () => {
      if (enteredPin.length > 0) {
        enteredPin = enteredPin.substr(0, enteredPin.length - 1);
        setIsEnteredPinComplete(false);
        setEnteredPin(enteredPin);
      }
    };

    const renderRows = (digit2DArr: string[][], disableKeyPad = false) => {
      return digit2DArr.map((digitRow: string[]) => {
        return (
          <View
            key={digitRow[0]}
            style={pinKeypadContainerStyles.pinKeypadRowStyle}
          >
            {digitRow.map((digit) => {
              return (
                <View
                  key={digit}
                  style={pinKeypadContainerStyles.pinKeypadRowItemStyle}
                  testID='digit'
                >
                  <PinKeypadCircle
                    digitValue={digit}
                    onKeyPress={onKeyPress}
                    disable={disableKeyPad}
                    testID={`${testID}-pinKeypadCircle${digit}`}
                  />
                </View>
              );
            })}
          </View>
        );
      });
    };

    const renderLastRow = (disableKeyPad = false) => {
      return (
        <View style={pinKeypadContainerStyles.pinKeypadRowStyle}>
          <View style={pinKeypadContainerStyles.pinKeypadRowItemStyle} />
          <View style={pinKeypadContainerStyles.pinKeypadRowItemStyle}>
            <PinKeypadCircle
              digitValue={'0'}
              onKeyPress={onKeyPress}
              disable={disableKeyPad}
              testID={`${testID}-pinKeypadCircle0`}
            />
          </View>
          <View style={pinKeypadContainerStyles.pinKeypadRowItemStyle}>
            <BackSpaceButton
              onPress={onBackspace}
              testID={`${testID}BackSpaceButton`}
            />
          </View>
        </View>
      );
    };

    return (
      <View style={viewStyle} ref={ignoreHeapRef}>
        {renderRows(Digit2DArray, isEnteredPinComplete)}
        {renderLastRow(isEnteredPinComplete)}
      </View>
    );
  };
