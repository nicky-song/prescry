// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { PrimaryTextBox } from '../../../components/text/primary-text-box/primary-text-box';
import { pinKeypadCircleStyles as styles } from './pin-keypad-circle.styles';
export interface IPinKeypadCircleProps {
  digitValue: string;
  onKeyPress: (value: string) => void;
  disable?: boolean;
  testID?: string;
}

export const PinKeypadCircle = ({
  digitValue,
  onKeyPress,
  disable,
  testID,
}: IPinKeypadCircleProps): ReactElement => {
  const [isSolidPurple, setIsSolidPurple] = useState<boolean>(false);

  const onPressIn = () => {
    setIsSolidPurple(true);
  };
  const onPressOut = () => {
    setIsSolidPurple(false);
  };
  const onPress = () => {
    onKeyPress(digitValue);
  };
  const getCircleStyle = () => {
    if (disable) {
      return styles.pinKeypadGreyCircle;
    }
    return isSolidPurple
      ? styles.pinKeypadPurpleCircle
      : styles.pinKeypadPurpleBorderCircle;
  };
  const getFontStyles = () => {
    if (disable) {
      return styles.pinKeypadGreyFont;
    }
    return isSolidPurple
      ? styles.pinKeypadWhiteFont
      : styles.pinKeypadPurpleFont;
  };

  const circleStyles = getCircleStyle();
  const fontStyles = getFontStyles();
  return (
    <TouchableOpacity
      disabled={disable}
      activeOpacity={1}
      style={circleStyles}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      {...(testID && { testID })}
    >
      <PrimaryTextBox textBoxStyle={fontStyles} caption={digitValue} />
    </TouchableOpacity>
  );
};
