// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { IconSize } from '../../../theming/icons';
import { SecondaryButton } from '../secondary/secondary.button';
import { BaseText } from '../../text/base-text/base-text';
import { SearchButton } from './search.button';
import {
  searchButtonStyles,
  searchButtonStyles as styles,
} from './search.button.styles';
import { getChildren } from '../../../testing/test.helper';
import { PrimaryColor } from '../../../theming/colors';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('SearchButton', () => {
  it('renders as SecondaryButton', () => {
    const mockOnPress = jest.fn();
    const testRenderer = renderer.create(
      <SearchButton onPress={mockOnPress} label='label' />
    );
    const secondaryButton = testRenderer.root.findByType(SecondaryButton);

    expect(secondaryButton.props.viewStyle[0]).toEqual(styles.buttonViewStyle);
    expect(secondaryButton.props.onPress).toEqual(mockOnPress);
    expect(getChildren(secondaryButton).length).toEqual(1);
  });

  it('contains children rendered inside a View', () => {
    const testRenderer = renderer.create(
      <SearchButton onPress={jest.fn()} label='label' />
    );

    const secondaryButton = testRenderer.root.findByType(SecondaryButton);
    const view = getChildren(secondaryButton)[0];

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual(searchButtonStyles.buttonContentViewStyle);
    expect(getChildren(view).length).toEqual(2);
  });

  it('contains an Icon', () => {
    const testRenderer = renderer.create(
      <SearchButton onPress={jest.fn()} label='label' />
    );
    const icon = testRenderer.root.findByType(FontAwesomeIcon);

    expect(icon.props.name).toEqual('search');
    expect(icon.props.color).toEqual(PrimaryColor.darkBlue);
    expect(icon.props.size).toEqual(IconSize.medium);
  });

  it('contains a BaseText', () => {
    const labelMock = 'label';
    const testRenderer = renderer.create(
      <SearchButton onPress={jest.fn()} label={labelMock} />
    );
    const secondaryButton = testRenderer.root.findByType(SecondaryButton);
    const fragment = secondaryButton.props.children;
    const baseText = fragment.props.children[1];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(searchButtonStyles.textStyle);
    expect(baseText.props.children).toEqual(labelMock);
  });
});
