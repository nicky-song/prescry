// Copyright 2021 Prescryptive Health, Inc.

import { DistancePicker, IDistancePicker } from './distance-picker';
import { shallow } from 'enzyme';
import React from 'react';
import { View, Text } from 'react-native';
import { distancePickerStyles } from './distance-picker-style';
import { BasePicker } from '../pickers/base/base.picker';

jest.mock('../pickers/base/base.picker', () => ({
  BasePicker: () => <div />,
}));

const optionValues: IDistancePicker[] = [
  { text: '5 mi.', value: 5 },
  { text: '10 mi.', value: 10 },
  { text: '25 mi.', value: 25 },
  { text: '50 mi.', value: 50 },
  { text: '100 mi.', value: 100, default: true },
  { text: '500 mi.', value: 500 },
];
describe('DistancePicker', () => {
  it('should have a hidden basePicker component', () => {
    const onValueChange = jest.fn();
    const wrapper = shallow(
      <DistancePicker
        optionValues={optionValues}
        onValueSelected={onValueChange}
        defaultOption={100}
      />
    );
    const basePicker = wrapper.find(BasePicker).get(0);
    expect(basePicker).toBeDefined();
  });
  it('renders basePicker with expected properties', () => {
    const onValueChange = jest.fn();
    const wrapper = shallow(
      <DistancePicker
        optionValues={optionValues}
        onValueSelected={onValueChange}
        defaultOption={100}
      />
    );
    const picker = wrapper.find(BasePicker).get(0);
    expect(picker.props.style).toEqual(
      distancePickerStyles.distancePickerTextStyle
    );
    expect(picker.props.selectedValue).toEqual(100);
  });

  it('displays picker component as clickable text instead of a dropdown', () => {
    const onValueChange = jest.fn();
    const wrapper = shallow(
      <DistancePicker
        optionValues={optionValues}
        onValueSelected={onValueChange}
        defaultOption={100}
      />
    );
    const views = wrapper.find(View);
    const distancePickerView = views.get(0);
    expect(distancePickerView.props.style).toEqual(
      distancePickerStyles.distancePickerViewStyle
    );

    const textView = distancePickerView.props.children[0];
    expect(textView.props.style).toEqual(
      distancePickerStyles.distancePickerSelectedValueViewStyle
    );

    const distanceText = textView.props.children;
    expect(distanceText.type).toEqual(Text);
    expect(distanceText.props.children).toEqual('100 mi.');
  });
});
