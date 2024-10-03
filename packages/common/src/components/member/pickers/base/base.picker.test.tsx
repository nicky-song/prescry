// Copyright 2022 Prescryptive Health, Inc.

import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { TextStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../../testing/test.helper';
import { BasePicker } from './base.picker';
import { basePickerStyles } from './base.picker.styles';

const childrenMock = [
  <Picker.Item
    label={'picker-one-label'}
    key={'picker-one-key'}
    value={'picker-one-value'}
  />,
  <Picker.Item
    label={'picker-two-label'}
    key={'picker-two-key'}
    value={'picker-two-value'}
  />,
  <Picker.Item
    label={'picker-three-label'}
    key={'picker-three-key'}
    value={'picker-three-value'}
  />,
];

describe('basePicker', () => {
  it('has expected default styles', () => {
    const { pickerTextStyle } = basePickerStyles;
    const styleMock: TextStyle = { backgroundColor: 'purple' };

    const testRenderer = renderer.create(
      <BasePicker style={styleMock}>{childrenMock}</BasePicker>
    );

    const picker: ReactTestInstance = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(picker.type).toEqual(Picker);
    expect(picker.props.style).toEqual([pickerTextStyle, styleMock]);

    const pickerItems = getChildren(picker);

    expect(pickerItems.length).toEqual(3);
  });

  it('has expected children picker items', () => {
    const textStyleMock: TextStyle = {
      color: 'blue',
    };

    const testRenderer = renderer.create(
      <BasePicker style={textStyleMock}>{childrenMock}</BasePicker>
    );

    const picker = testRenderer.root.findByType(Picker);

    expect(picker.props.children).toEqual(childrenMock);
  });
});
