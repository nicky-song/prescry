// Copyright 2020 Prescryptive Health, Inc.

import React, { FC } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { timeSlotPickerStyles } from './time-slot-picker.styles';
import { timeSlotPickerContent } from './time-slot-picker.content';
import { IAvailableSlot } from '../../../models/api-response/available-slots-response';
import { BasePicker } from '../pickers/base/base.picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';

export interface IAvailableSlotPickerProps {
  slots: IAvailableSlot[];
  enabled?: boolean;
}

export interface IAvailableSlotPickerActionProps {
  onSlotSelected?: (timeSlot?: IAvailableSlot) => void;
}

type TimeSlotPickerProps = IAvailableSlotPickerProps &
  IAvailableSlotPickerActionProps;

export const TimeSlotPicker: FC<TimeSlotPickerProps> = (
  props: TimeSlotPickerProps
) => {
  const onTimeSlotChangeHandler = (
    selectedTimeSlotName: ItemValue,
    _selectedTimeSlotIndex: number
  ) => {
    const selectedTimeSlot = props.slots.find(
      (slot: IAvailableSlot) => slot.slotName === selectedTimeSlotName
    );
    if (props.onSlotSelected) {
      props.onSlotSelected(selectedTimeSlot);
    }
  };

  const populateTimeSlotsDropDownList = () => {
    const timeSlots: React.ReactNode[] = [];
    timeSlots.push(
      <Picker.Item
        key={timeSlotPickerContent.defaultValue}
        label={timeSlotPickerContent.defaultValue}
        value={timeSlotPickerContent.defaultValue}
      />
    );

    props.slots.forEach((slot: IAvailableSlot) => {
      timeSlots.push(
        <Picker.Item
          key={slot.start}
          label={slot.slotName}
          value={slot.slotName}
        />
      );
    });

    return timeSlots;
  };

  return (
    <View style={timeSlotPickerStyles.pickerViewStyle} testID='timeSlotPicker'>
      <BasePicker
        onValueChange={onTimeSlotChangeHandler}
        enabled={props.enabled}
        itemStyle={timeSlotPickerStyles.pickerItemStyle}
        testID='picker'
      >
        {populateTimeSlotsDropDownList()}
      </BasePicker>
    </View>
  );
};
