// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import { ImageInstanceNames } from '../../../theming/assets';
import { ImageAsset } from '../../image-asset/image-asset';
import { CloseButton, ICloseButtonProps } from './close-button';

jest.mock('../../image-asset/image-asset');

const targetMock = jest.fn();
const buttonName: ImageInstanceNames = 'closeWhiteButton';
const closeButtonProps: ICloseButtonProps = {
  imageName: buttonName,
  onPress: targetMock,
};

afterEach(() => {
  targetMock.mockClear();
});

describe('CloseButton', () => {
  it('should navigate to previous page on CloseButton click', () => {
    const closeButton = renderer.create(<CloseButton {...closeButtonProps} />);
    closeButton.root.findByType(TouchableOpacity).props.onPress();
    expect(closeButtonProps.onPress).toHaveBeenCalled();
  });

  it('should have closeWhiteButton button name', () => {
    const closeButton = renderer.create(<CloseButton {...closeButtonProps} />);
    expect(closeButton.root.findByType(ImageAsset).props.name).toBe(buttonName);
  });
});
