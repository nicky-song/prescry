// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement, useEffect, useRef } from 'react';
import {
  KeyboardType,
  TextInput,
  TextStyle,
  ViewStyle,
  StyleProp,
  TextInputProps,
  View,
  Keyboard,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { FieldErrorText } from '../../text/field-error/field-error.text';
import { FieldHelpText } from '../../text/field-help/field-help.text';
import { Label } from '../../text/label/label';
import { primaryTextInputStyles } from './primary-text.input.styles';

export type PrimaryTextContentType =
  | 'emailAddress'
  | 'password'
  | 'name'
  | 'telephoneNumber'
  | 'oneTimeCode';

export interface IPrimaryTextInputProps
  extends Omit<TextInputProps, 'keyboardType' | 'style'> {
  textContentType?: PrimaryTextContentType;
  onChangeText: (inputValue: string) => void;
  viewStyle?: StyleProp<ViewStyle>;
  keyboardType?: KeyboardType;
  label?: string;
  helpMessage?: string;
  errorMessage?: string;
  isRequired?: boolean;
  testID?: string;
  isSkeleton?: boolean;
}

export const PrimaryTextInput = ({
  viewStyle,
  helpMessage,
  errorMessage,
  secureTextEntry,
  textContentType,
  label,
  isRequired,
  editable = true,
  isSkeleton = false,
  ...props
}: IPrimaryTextInputProps): ReactElement => {
  const isSecureTextEntry = secureTextEntry || textContentType === 'password';

  const inputErrorTextStyle = errorMessage
    ? primaryTextInputStyles.inputErrorTextStyle
    : undefined;
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (props.autoFocus) {
      textInputRef.current?.focus();
    }
  });

  const onTextInputBlur = (
    event: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    Keyboard.dismiss();
    if (props.onBlur) props.onBlur(event);
  };

  const inputTextStyle: TextStyle = editable
    ? primaryTextInputStyles.inputTextStyle
    : primaryTextInputStyles.readOnlyTextStyle;

  const input = (
    <TextInput
      secureTextEntry={isSecureTextEntry}
      textContentType={textContentType}
      style={[inputTextStyle, inputErrorTextStyle]}
      ref={textInputRef}
      onBlur={onTextInputBlur}
      editable={editable}
      {...props}
      {...(props.testID && { testID: props.testID + 'TextInput' })}
    />
  );

  const fieldError = errorMessage ? (
    <FieldErrorText style={primaryTextInputStyles.errorMessageTextStyle}>
      {errorMessage}
    </FieldErrorText>
  ) : null;

  const fieldHelp =
    helpMessage && !fieldError ? (
      <FieldHelpText style={primaryTextInputStyles.helpMessageTextStyle}>
        {helpMessage}
      </FieldHelpText>
    ) : null;

  return label ? (
    <View
      style={[primaryTextInputStyles.viewStyle, viewStyle]}
      testID={props.testID}
    >
      <Label label={label} isRequired={isRequired} isSkeleton={isSkeleton}>
        {input}
      </Label>
      {fieldError}
      {fieldHelp}
    </View>
  ) : (
    <View
      style={[primaryTextInputStyles.viewStyle, viewStyle]}
      testID={props.testID}
    >
      {input}
      {fieldError}
      {fieldHelp}
    </View>
  );
};
