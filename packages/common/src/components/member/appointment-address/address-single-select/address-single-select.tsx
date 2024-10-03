// Copyright 2020 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import { Text, View, TextStyle, StyleProp } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AddressFieldName } from '../../../../models/address-fields';
import { addressSingleSelectStyles } from './address-single-select.styles';
import { MarkdownText } from '../../../text/markdown-text/markdown-text';
import { mandatoryIconUsingStrikeThroughStyle } from '../../../../theming/constants';
import { BasePicker } from '../../pickers/base/base.picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';

export interface IAddressSingleSelectProps {
  markdownLabel: string;
  options: [string, string][];
  required?: boolean;
  name: AddressFieldName;
  errorMessage: string[];
  style?: StyleProp<TextStyle>;
  onAddressChange: (newValue: string, fieldName: string) => void;
  defaultValue?: string;
  editable?: boolean;
  testID?: string;
}

export const fieldValidator = (value: string): boolean => {
  if (!value) {
    return false;
  }
  return true;
};

export const AddressSingleSelect = (props: IAddressSingleSelectProps) => {
  const [isValid, setIsValid] = useState(true);
  const [value, setValue] = useState(
    props.defaultValue ? props.defaultValue : ''
  );

  useEffect(() => {
    props.onAddressChange(isValid ? value : '', props.name);
  }, [value]);

  const onSelect = (newValue: ItemValue, _newValueIndex: number) => {
    setIsValid(fieldValidator(newValue as string));
    setValue(newValue as string);
  };

  const renderErrorMessage = (): React.ReactNode =>
    isValid ? null : (
      <Text style={errorTextStyle}>{props.errorMessage[0]}</Text>
    );

  const renderFieldCaption = (): React.ReactNode => {
    return (
      <MarkdownText
        textStyle={markdownlabelTextStyle}
        markdownTextStyle={mandatoryIconTextStyle}
      >
        {props.required
          ? `${props.markdownLabel} ${mandatoryIconUsingStrikeThroughStyle}`
          : props.markdownLabel}
      </MarkdownText>
    );
  };

  const {
    errorTextStyle,
    markdownlabelTextStyle,
    statePickerContainerViewStyle,
    addressSingleSelectViewStyle,
    mandatoryIconTextStyle,
  } = addressSingleSelectStyles;

  return (
    <View style={addressSingleSelectViewStyle}>
      {renderFieldCaption()}
      <View style={statePickerContainerViewStyle}>
        <BasePicker
          onValueChange={onSelect}
          enabled={props.editable}
          style={props.style}
          selectedValue={props.defaultValue}
          {...(props.testID && { testID: props.testID + 'BasePicker' })}
        >
          {renderFieldOptions(props.options)}
        </BasePicker>
      </View>
      {renderErrorMessage()}
    </View>
  );
};

const renderFieldOptions = (options: [string, string][]): React.ReactNode[] => {
  return options.map(([code, label]) => (
    <Picker.Item key={`${code}-${label}`} label={label} value={code} />
  ));
};
