// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View, TextStyle, ViewStyle } from 'react-native';
import { GreyScale } from '../../../theming/theme';
import { BaseText } from '../../text/base-text/base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

export interface IContactInfoRowProps {
  name: string;
  value?: string;
}

export const ContactInfoRow: React.SFC<IContactInfoRowProps> = (props) => {
  return (
    <View style={styles.contactInfoRowViewStyle}>
      <BaseText children={props.name} style={styles.keyTextStyle} />
      <ProtectedBaseText
        children={props.value ? props.value : ''}
        style={styles.valueTextStyle}
      />
    </View>
  );
};

export interface IContactInfoRowStyles {
  keyTextStyle: TextStyle;
  valueTextStyle: TextStyle;
  contactInfoRowViewStyle: ViewStyle;
}

const keyTextStyle: TextStyle = {
  width: '33%',
  lineHeight: 36,
  color: GreyScale.regular,
  display: 'flex',
};

const valueTextStyle: TextStyle = {
  flexGrow: 1,
  lineHeight: 36,
};

const contactInfoRowViewStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
};

export const contactInfoRowStyles: IContactInfoRowStyles = {
  keyTextStyle,
  valueTextStyle,
  contactInfoRowViewStyle,
};

const styles = contactInfoRowStyles;
