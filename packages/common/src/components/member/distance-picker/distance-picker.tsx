// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { distancePickerStyles as styles } from './distance-picker-style';
import { DistancePickerContent } from './distance-picker.content';
import { BasePicker } from '../pickers/base/base.picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';

export interface IDistancePickerProps {
  optionValues: IDistancePicker[];
  onValueSelected: (value: number) => void;
  defaultOption: number;
}

export interface IDistancePicker {
  text: string;
  value: number;
  default?: boolean;
}

export const DistancePicker = (props: IDistancePickerProps) => {
  const onValueSelected = (value: ItemValue, _valueIndex: number) => {
    props.onValueSelected(value as number);
  };

  const renderPickerItems = () => {
    return props.optionValues.map((item: IDistancePicker) => {
      return (
        <Picker.Item
          label={item.text}
          value={item.value.toString()}
          key={item.value}
        />
      );
    });
  };

  return (
    <View style={styles.distancePickerViewStyle}>
      <View style={styles.distancePickerSelectedValueViewStyle}>
        <Text style={styles.distancePickerSelectedValueTextStyle}>
          {`${props.defaultOption} ${DistancePickerContent.miles}`}
        </Text>
      </View>
      <View style={styles.distancePickerContainerStyle}>
        <BasePicker
          style={styles.distancePickerTextStyle}
          selectedValue={props.defaultOption}
          onValueChange={onValueSelected}
        >
          {renderPickerItems()}
        </BasePicker>
      </View>
    </View>
  );
};
