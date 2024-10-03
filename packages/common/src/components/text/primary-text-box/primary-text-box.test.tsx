// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import { IPrimaryTextBoxProps, PrimaryTextBox } from './primary-text-box';

const primaryTextProps: IPrimaryTextBoxProps = {
  caption: 'Apply',
  testID: 'mockTestID',
};

describe('PrimaryTextBox', () => {
  it('should render with default props', () => {
    const primaryTextBox = renderer.create(
      <PrimaryTextBox {...primaryTextProps} />
    );
    expect(primaryTextBox.root.findByType(Text).props.children).toBe(
      primaryTextProps.caption
    );
    expect(primaryTextBox.root.findByType(Text).props.testID).toEqual(
      'mockTestID'
    );
  });
});
