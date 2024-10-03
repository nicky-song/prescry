// Copyright 2020 Prescryptive Health, Inc.

import {
  ITimeSlotPickerStyles,
  timeSlotPickerStyles,
} from './time-slot-picker.styles';

describe('timeSlotPickerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ITimeSlotPickerStyles = {
      pickerViewStyle: {
        width: '100%',
      },
      pickerItemStyle: {
        flexDirection: 'row',
        flex: 1,
      },
    };

    expect(timeSlotPickerStyles).toEqual(expectedStyles);
  });
});
