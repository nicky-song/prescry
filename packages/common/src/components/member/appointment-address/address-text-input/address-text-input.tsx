// Copyright 2020 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { AddressFieldName } from '../../../../models/address-fields';
import { fieldValidator } from '../address-validator/field-validator';
import { PrimaryTextInput } from '../../../inputs/primary-text/primary-text.input';
import { validateMaxCharacters } from '../../../../utils/validators/address.validator';
export interface IAddressTextInputProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  name: AddressFieldName;
  errorMessage: string[];
  style?: StyleProp<ViewStyle>;
  onAddressChange: (newValue: string, fieldName: string) => void;
  defaultValue?: string;
  editable?: boolean;
  testID?: string;
}

export const AddressTextInput = (props: IAddressTextInputProps) => {
  const [isValid, setIsValid] = useState(true);
  const [isValidMaxCharacters, setIsValidMaxCharacters] = useState(false);
  const onChangeText = (newValue: string) => {
    const isNewValueValid = fieldValidator(props.name, newValue);
    setIsValid(isNewValueValid);
    setIsValidMaxCharacters(validateMaxCharacters(newValue, props.name));
    props.onAddressChange(isNewValueValid ? newValue : '', props.name);
  };

  const errorMessage = isValid
    ? undefined
    : isValidMaxCharacters
    ? props.errorMessage[0]
    : props.errorMessage[1];

  return (
    <PrimaryTextInput
      label={props.label}
      key={props.placeholder}
      isRequired={props.required}
      placeholder={props.placeholder}
      onChangeText={onChangeText}
      viewStyle={props.style}
      defaultValue={props.defaultValue}
      editable={props.editable}
      errorMessage={errorMessage}
      {...(props.testID && { testID: props.testID + 'PrimaryTextInput' })}
    />
  );
};
