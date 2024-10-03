// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  TimeSlotPicker,
  IAvailableSlotPickerProps,
  IAvailableSlotPickerActionProps,
} from './time-slot-picker';
import { timeSlotPickerContent } from './time-slot-picker.content';
import { timeSlotPickerStyles } from './time-slot-picker.styles';
import { BasePicker } from '../pickers/base/base.picker';
import { ITestContainer } from '../../../testing/test.container';
import { getChildren } from '../../../testing/test.helper';
import { IAvailableSlot } from '../../../models/api-response/available-slots-response';
import { Picker } from '@react-native-picker/picker';

jest.mock('../pickers/base/base.picker', () => ({
  BasePicker: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('@react-native-picker/picker', () => ({
  Picker: {
    Item: () => <div />,
  },
}));

const onSlotSelectedMock = jest.fn();

const timeSlotPickerProps: IAvailableSlotPickerProps &
  IAvailableSlotPickerActionProps = {
  slots: [
    {
      start: '2020-06-15T08:00:00-07:00',
      day: '2020-06-15',
      slotName: '08:00 am',
    },
    {
      start: '2020-06-15T08:15:00-07:00',
      day: '2020-06-15',
      slotName: '08:15 am',
    },
    {
      start: '2020-06-15T08:30:00-07:00',
      day: '2020-06-15',
      slotName: '08:30 am',
    },
    {
      start: '2020-06-15T08:45:00-07:00',
      day: '2020-06-15',
      slotName: '08:45 am',
    },
    {
      start: '2020-06-15T09:00:00-07:00',
      day: '2020-06-15',
      slotName: '09:00 am',
    },
    {
      start: '2020-06-15T09:15:00-07:00',
      day: '2020-06-15',
      slotName: '09:15 am',
    },
    {
      start: '2020-06-15T09:30:00-07:00',
      day: '2020-06-15',
      slotName: '09:30 am',
    },
    {
      start: '2020-06-15T09:45:00-07:00',
      day: '2020-06-15',
      slotName: '09:45 am',
    },
    {
      start: '2020-06-15T10:00:00-07:00',
      day: '2020-06-15',
      slotName: '10:00 am',
    },
    {
      start: '2020-06-15T10:15:00-07:00',
      day: '2020-06-15',
      slotName: '10:15 am',
    },
  ],
  onSlotSelected: onSlotSelectedMock,
  enabled: true,
};

describe('TimeSlotPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it.each([[true], [false]])(
    'renders BasePicker with expected props',
    (isEnabled: boolean) => {
      const timeSlotPicker = renderer.create(
        <TimeSlotPicker {...timeSlotPickerProps} enabled={isEnabled} />
      );

      const pickerView = timeSlotPicker.root.children[0] as ReactTestInstance;

      expect(pickerView.type).toEqual(View);
      expect(pickerView.props.style).toEqual(
        timeSlotPickerStyles.pickerViewStyle
      );
      expect(pickerView.props.testID).toEqual('timeSlotPicker');

      const picker = getChildren(pickerView)[0];

      expect(picker.type).toEqual(BasePicker);
      expect(picker.props.enabled).toEqual(isEnabled);
      expect(picker.props.testID).toEqual('picker');
      expect(picker.props.itemStyle).toEqual(
        timeSlotPickerStyles.pickerItemStyle
      );
    }
  );

  it('renders expected Picker.Items with expected props', () => {
    const timeSlotPicker = renderer.create(
      <TimeSlotPicker {...timeSlotPickerProps} />
    );

    const pickerView = timeSlotPicker.root.children[0] as ReactTestInstance;

    const picker = getChildren(pickerView)[0];

    const pickerItems = getChildren(picker);

    expect(pickerItems.length).toBe(timeSlotPickerProps.slots.length + 1);

    expect(pickerItems[0].props).toMatchObject({
      label: timeSlotPickerContent.defaultValue,
      value: timeSlotPickerContent.defaultValue,
    });

    pickerItems.forEach((pickerItem: ReactTestInstance, index: number) => {
      expect(pickerItem.type).toEqual(Picker.Item);
      if (index === 0) {
        expect(pickerItem.props).toMatchObject({
          label: timeSlotPickerContent.defaultValue,
          value: timeSlotPickerContent.defaultValue,
        });
      } else if (index >= 1) {
        expect(pickerItem.props).toMatchObject({
          label: timeSlotPickerProps.slots[index - 1].slotName,
          value: timeSlotPickerProps.slots[index - 1].slotName,
        });
      }
    });
  });

  it.each([
    [timeSlotPickerProps.slots[0].slotName],
    [timeSlotPickerProps.slots[1].slotName],
    [timeSlotPickerProps.slots[2].slotName],
  ])(
    'should call onSlotSelected with expected slotName when slot is changed (slotName: %s)',
    (timeSlotName: string) => {
      onSlotSelectedMock.mockReset();

      const timeSlotPicker = renderer.create(
        <TimeSlotPicker {...timeSlotPickerProps} />
      );

      const pickerView = timeSlotPicker.root.children[0] as ReactTestInstance;

      const picker = getChildren(pickerView)[0];

      picker.props.onValueChange(timeSlotName);

      const expectedTimeSlot = timeSlotPickerProps.slots.find(
        (availableSlot: IAvailableSlot) => {
          return availableSlot.slotName === timeSlotName;
        }
      );

      expect(onSlotSelectedMock).toHaveBeenCalledWith(expectedTimeSlot);
    }
  );
});
