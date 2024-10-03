// Copyright 2020 Prescryptive Health, Inc.

import {
  ITimeSlotPickerContent,
  timeSlotPickerContent,
} from './time-slot-picker.content';

describe('timeSlotPickerContent', () => {
  it('has expected content', () => {
    const expectedContent: ITimeSlotPickerContent = {
      defaultValue: 'Choose a time...',
    };

    expect(timeSlotPickerContent).toEqual(expectedContent);
  });
});
