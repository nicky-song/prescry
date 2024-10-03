// Copyright 2020 Prescryptive Health, Inc.

import { DependentPickerContent } from './dependent-picker.content';

describe('DependentPickerContent', () => {
  it('has expected content', () => {
    expect(DependentPickerContent.defaultValue()).toEqual('Select a person...');
    expect(DependentPickerContent.newValue()).toEqual('New person');
  });
});
