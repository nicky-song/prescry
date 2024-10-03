// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { Animated, Text } from 'react-native';
import renderer from 'react-test-renderer';
import { ImageInstanceNames } from '../../../theming/assets';
import { animateOpacity } from '../../../utils/animation.helper';
import {
  CloseButton,
  ICloseButtonProps,
} from '../../buttons/close-button/close-button';

import { BaseModal, IBaseModalProps } from './base-modal';

jest.mock('../../../utils/animation.helper', () => ({
  animateOpacity: jest.fn(),
}));
const animateOpacityMock = animateOpacity as jest.Mock;
jest.mock('../../image-asset/image-asset');

const targetMock = jest.fn();
const buttonName: ImageInstanceNames = 'closeGreyButton';
const baseModalProps: IBaseModalProps = {
  children: <Text>Test children</Text>,
  closeModal: jest.fn(),
  showCloseButton: true,
};

beforeEach(() => {
  animateOpacityMock.mockReset();
});

afterEach(() => {
  targetMock.mockClear();
});

describe('BaseModal', () => {
  it('should have closeModal as prop to CloseButton', () => {
    const baseModal = renderer.create(<BaseModal {...baseModalProps} />);
    const button = baseModal.root.findByType(CloseButton)
      .props as ICloseButtonProps;
    expect(button).not.toBeUndefined();
  });
  it('should have imageName as prop to CloseButton', () => {
    const baseModal = renderer.create(<BaseModal {...baseModalProps} />);
    const button = baseModal.root.findByType(CloseButton)
      .props as ICloseButtonProps;
    expect(button.imageName).toBe(buttonName);
    expect(button.onPress).toBe(baseModal.root.instance.closeModal);
  });

  it('should not null Animate.View', () => {
    const baseModal = renderer.create(<BaseModal {...baseModalProps} />);
    const modalView = baseModal.root.findByType(Animated.View);
    expect(modalView).not.toBeNull();
  });

  it('should modal get opened by calling animateOpacity() init inside componentDidMount()', () => {
    const baseModal = renderer.create(<BaseModal {...baseModalProps} />);
    baseModal.root.instance.componentDidMount();
    expect(animateOpacityMock).toBeCalledWith(
      baseModal.root.instance.state.opacity,
      500,
      1
    );
    expect(animateOpacityMock.mock.calls[0][0]).toBe(
      baseModal.root.instance.state.opacity
    );
    expect(animateOpacityMock.mock.calls[0][1]).toBe(500);
    expect(animateOpacityMock.mock.calls[0][2]).toBe(1);
  });

  it('should modal get closed when calling closeModal() by animateOpacity()', () => {
    const baseModal = renderer.create(<BaseModal {...baseModalProps} />);
    baseModal.root.instance.closeModal();
    expect(animateOpacityMock).toBeCalledWith(
      baseModal.root.instance.state.opacity,
      0,
      0,
      baseModalProps.closeModal
    );
    expect(animateOpacityMock.mock.calls[1][0]).toBe(
      baseModal.root.instance.state.opacity
    );
    expect(animateOpacityMock.mock.calls[1][1]).toBe(0);
    expect(animateOpacityMock.mock.calls[1][2]).toBe(0);
    expect(animateOpacityMock.mock.calls[1][3]).toBe(baseModalProps.closeModal);
  });

  it('should render renderBaseModal()', () => {
    const baseModal = renderer.create(<BaseModal {...baseModalProps} />);
    baseModal.root.instance.renderBaseModal();
    const mockHeight = (baseModal.root.instance.getHeight = jest.fn());
    const mockWidth = (baseModal.root.instance.gerWidth = jest.fn());
    mockHeight();
    expect(mockHeight).toHaveBeenCalled();
    expect(mockHeight.mock.calls.length).toBe(1);
    mockWidth();
    expect(mockWidth).toHaveBeenCalled();
    expect(mockWidth.mock.calls.length).toBe(1);
  });

  it('should have close button when showCloseButton prop is true', () => {
    const baseModal = renderer.create(<BaseModal {...baseModalProps} />);
    const closeButton = baseModal.root.findByType(CloseButton);
    expect(closeButton).not.toBeNull();
  });

  it('should not have close button when showCloseButton prop is false', () => {
    const baseModal = renderer.create(
      <BaseModal {...baseModalProps} {...{ showCloseButton: false }} />
    );
    expect(baseModal.root.findAllByType(CloseButton)).toEqual([]);
  });
});
