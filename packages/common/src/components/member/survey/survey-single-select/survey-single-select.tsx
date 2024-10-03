// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { surveySingleSelectStyles } from './survey-single-select.styles';
import { SurveySelectOptions } from '../../../../models/survey-questions';
import { BasePicker } from '../../pickers/base/base.picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';

export interface ISurveySingleSelectProps {
  onSelect: (value: ItemValue, valueIndex: number) => void;
  options: SurveySelectOptions;
  placeholder?: string;
  selectedValue?: string;
  useCode?: boolean;
  testID?: string;
}

export const SurveySingleSelect = (props: ISurveySingleSelectProps) => {
  const { pickerContainerTextStyle } = surveySingleSelectStyles;
  const { onSelect, selectedValue, useCode } = props;

  return (
    <View style={pickerContainerTextStyle}>
      <BasePicker
        {...(props.testID && { testID: `${props.testID}BasePicker` })}
        onValueChange={onSelect}
        enabled={true}
        selectedValue={selectedValue}
      >
        {renderOptions()}
      </BasePicker>
    </View>
  );

  function renderOptions(): ReactNode[] {
    const { options, placeholder } = props;

    const items: ReactNode[] = [];

    if (placeholder) {
      items.push(<Picker.Item key='' label={placeholder} value='' />);
    }

    for (const [code, label] of options) {
      items.push(
        <Picker.Item
          key={`${code}-${label}`}
          label={label}
          value={useCode ? code : label}
        />
      );
    }

    return items;
  }
};
