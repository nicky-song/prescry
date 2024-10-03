// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ListItemButton } from './list-item.button';
import { BaseButton } from '../base/base.button';
import { listItemButtonStyles } from './list-item.button.styles';

describe('ListItemButton', () => {
  it('renders as BaseButton', () => {
    const onPressMock = jest.fn();
    const childMock = 'Sample text';
    const testRenderer = renderer.create(
      <ListItemButton onPress={onPressMock}>{childMock}</ListItemButton>
    );

    const baseButton = testRenderer.root.children[0] as ReactTestInstance;

    expect(baseButton.type).toEqual(BaseButton);
    expect(baseButton.props.onPress).toEqual(onPressMock);
    expect(baseButton.props.viewStyle).toEqual(listItemButtonStyles.viewStyle);
    expect(baseButton.props.children).toEqual(childMock);
  });
});
