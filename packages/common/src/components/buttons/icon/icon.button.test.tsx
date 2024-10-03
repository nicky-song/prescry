// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { IconButton, IIconButtonProps } from './icon.button';
import { BaseButton } from '../base/base.button';
import { iconButtonStyle } from './icon.button.styles';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('IconButton', () => {
  it('renders as BaseButton', () => {
    const onPressMock = jest.fn();
    const iconName = 'info-circle';
    const iconTextStyle = iconButtonStyle.iconTextStyle;
    const viewStyle = iconButtonStyle.iconButtonViewStyle;
    const accessibilityLabel = 'Open information price modal';
    const iconButtonDisabled = false;
    const viewStyleUndefined = undefined;
    const testRenderer = renderer.create(
      <IconButton
        onPress={onPressMock}
        iconName={iconName}
        iconTextStyle={iconTextStyle}
        accessibilityLabel={accessibilityLabel}
        disabled={iconButtonDisabled}
      />
    );

    const baseButton = testRenderer.root.findByType(BaseButton)
      .props as IIconButtonProps;
    expect(baseButton.onPress).toEqual(onPressMock);
    expect(baseButton.viewStyle).toEqual([viewStyle, viewStyleUndefined]);
    expect(baseButton.accessibilityLabel).toEqual(accessibilityLabel);
    expect(baseButton.disabled).toEqual(iconButtonDisabled);
  });

  it('renders with expected Icon (default)', () => {
    const onPressMock = jest.fn();
    const iconName = 'info-circle';
    const iconTextStyle = iconButtonStyle.iconTextStyle;
    const viewStyle = iconButtonStyle.iconButtonViewStyle;
    const accessibilityLabel = 'Open information price modal';
    const iconButtonDisabled = false;
    const mockTextStyle = undefined;
    const iconSolidMock = true;
    const testRenderer = renderer.create(
      <IconButton
        onPress={onPressMock}
        iconName={iconName}
        viewStyle={viewStyle}
        accessibilityLabel={accessibilityLabel}
        disabled={iconButtonDisabled}
        iconSolid={iconSolidMock}
      />
    );
    const icon = testRenderer.root.findByType(FontAwesomeIcon);
    expect(icon.props.name).toEqual(iconName);
    expect(icon.props.style).toEqual([iconTextStyle, mockTextStyle]);
    expect(icon.props.solid).toEqual(iconSolidMock);
  });

  it('renders as BaseButton disabled', () => {
    const onPressMock = jest.fn();
    const iconName = 'info-circle';
    const iconTextStyle = iconButtonStyle.iconDisabledTextStyle;
    const viewStyle = iconButtonStyle.iconButtonDisabledViewStyle;
    const accessibilityLabel = 'Open information price modal';
    const iconButtonDisabled = true;
    const viewStyleUndefined = undefined;
    const testRenderer = renderer.create(
      <IconButton
        onPress={onPressMock}
        iconName={iconName}
        iconTextStyle={iconTextStyle}
        accessibilityLabel={accessibilityLabel}
        disabled={iconButtonDisabled}
      />
    );

    const baseButton = testRenderer.root.findByType(BaseButton)
      .props as IIconButtonProps;
    expect(baseButton.onPress).toEqual(onPressMock);
    expect(baseButton.viewStyle).toEqual([viewStyle, viewStyleUndefined]);
    expect(baseButton.accessibilityLabel).toEqual(accessibilityLabel);
    expect(baseButton.disabled).toEqual(iconButtonDisabled);
  });

  it('renders with expected Icon disabled (default)', () => {
    const onPressMock = jest.fn();
    const iconName = 'info-circle';
    const iconTextStyle = iconButtonStyle.iconDisabledTextStyle;
    const viewStyle = iconButtonStyle.iconButtonDisabledViewStyle;
    const accessibilityLabel = 'Open information price modal';
    const iconButtonDisabled = true;
    const textStyleUndefined = undefined;
    const testRenderer = renderer.create(
      <IconButton
        onPress={onPressMock}
        iconName={iconName}
        viewStyle={viewStyle}
        accessibilityLabel={accessibilityLabel}
        disabled={iconButtonDisabled}
      />
    );
    const icon = testRenderer.root.findByType(FontAwesomeIcon);
    expect(icon.props.name).toEqual(iconName);
    expect(icon.props.style).toEqual([iconTextStyle, textStyleUndefined]);
  });

  it('renders with expected Icon and another icon style (default)', () => {
    const onPressMock = jest.fn();
    const iconName = 'info-circle';
    const viewStyle = iconButtonStyle.iconButtonViewStyle;
    const accessibilityLabel = 'Open information price modal';
    const iconButtonDisabled = false;
    const mockTextStyle = { fontSize: IconSize.big };
    const testRenderer = renderer.create(
      <IconButton
        onPress={onPressMock}
        iconName={iconName}
        iconTextStyle={mockTextStyle}
        viewStyle={viewStyle}
        accessibilityLabel={accessibilityLabel}
        disabled={iconButtonDisabled}
      />
    );
    const icon = testRenderer.root.findByType(FontAwesomeIcon);
    expect(icon.props.name).toEqual(iconName);
    expect(icon.props.style).toEqual([
      iconButtonStyle.iconTextStyle,
      mockTextStyle,
    ]);
  });
});
