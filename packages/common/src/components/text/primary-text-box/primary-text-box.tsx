// Copyright 2018 Prescryptive Health, Inc.

import React, { RefObject } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { FontSize, FontStyles, GreyScale } from '../../../theming/theme';
export interface IPrimaryTextBoxProps {
  caption: string | React.ReactNode;
  textBoxStyle?: TextStyle;
  textRef?: RefObject<Text>;
  testID?: string;
}

/**
 * @deprecated Use `BaseText` (or specialization) instead
 */
export const PrimaryTextBox: React.SFC<IPrimaryTextBoxProps> = (props) => {
  return (
    <Text
      style={[styles.basicText, props.textBoxStyle]}
      ref={props.textRef}
      testID={props.testID}
    >
      {props.caption}
    </Text>
  );
};
const basicText: TextStyle = {
  color: GreyScale.lightest,
  flexGrow: 0,
  fontFamily: FontStyles.DefaultDarkFont.fontFamily,
  fontSize: FontSize.regular,
  textAlign: 'center',
};
const styles = StyleSheet.create({
  basicText,
});
