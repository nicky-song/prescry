// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import { PrimaryTextBox } from '../../../components/text/primary-text-box/primary-text-box';
import { pinKeypadCircleStyles as styles } from './pin-keypad-circle.styles';
import { IPinKeypadCircleProps, PinKeypadCircle } from './pin-keypad-circle';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

const mockOnKeyPress = jest.fn();
const mockPinKeyPadCircleTestID = 'mockedTestID';

const pinKeypadCircleProps: IPinKeypadCircleProps = {
  digitValue: '1',
  disable: false,
  onKeyPress: mockOnKeyPress,
  testID: mockPinKeyPadCircleTestID,
};

beforeEach(() => {
  mockOnKeyPress.mockReset();
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce([false, jest.fn()]);
});

describe('PinKeypadCircle component', () => {
  it('should render TouchableOpacity with props and default style', () => {
    const pinKeypadCircle = renderer.create(
      <PinKeypadCircle {...pinKeypadCircleProps} />
    );
    const touchableOpacity =
      pinKeypadCircle.root.findByType(TouchableOpacity).props;
    expect(touchableOpacity.disabled).toBeFalsy();
    expect(touchableOpacity.style).toEqual(styles.pinKeypadPurpleBorderCircle);
    expect(touchableOpacity.activeOpacity).toBe(1);
    expect(touchableOpacity.testID).toEqual(mockPinKeyPadCircleTestID);
  });

  it('should have a Text and default font style', () => {
    const pinKeypadCircle = renderer.create(
      <PinKeypadCircle {...pinKeypadCircleProps} />
    );
    const primaryTextBox =
      pinKeypadCircle.root.findByType(PrimaryTextBox).props;
    expect(primaryTextBox.caption).toBe('1');
    expect(primaryTextBox.textBoxStyle).toEqual(styles.pinKeypadPurpleFont);
  });

  it('onPress should call onKeyPress', () => {
    const testRenderer = renderer.create(
      <PinKeypadCircle {...pinKeypadCircleProps} />
    );
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    touchableOpacity.props.onPress();
    expect(pinKeypadCircleProps.onKeyPress).toHaveBeenCalled();
  });

  it('onPressIn should change state and styles', () => {
    const mockSetIsSolidPurple = jest.fn();
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([false, mockSetIsSolidPurple]);
    const testRenderer = renderer.create(
      <PinKeypadCircle {...pinKeypadCircleProps} />
    );
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    touchableOpacity.props.onPressIn();

    expect(mockSetIsSolidPurple).toHaveBeenCalledWith(true);
  });

  it('onPressOut should change state and styles', () => {
    const mockSetIsSolidPurple = jest.fn();
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([false, mockSetIsSolidPurple]);
    const testRenderer = renderer.create(
      <PinKeypadCircle {...pinKeypadCircleProps} />
    );
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    touchableOpacity.props.onPressOut();

    expect(mockSetIsSolidPurple).toHaveBeenCalledWith(false);
  });

  it('should be disabled when disable is true', () => {
    const pinKeypadCircle = renderer.create(
      <PinKeypadCircle {...{ ...pinKeypadCircleProps, disable: true }} />
    );
    expect(
      pinKeypadCircle.root.findByType(TouchableOpacity).props.disabled
    ).toBeTruthy();
    expect(
      pinKeypadCircle.root.findByType(TouchableOpacity).props.style
    ).toEqual(styles.pinKeypadGreyCircle);
    expect(
      pinKeypadCircle.root.findByType(PrimaryTextBox).props.textBoxStyle
    ).toEqual(styles.pinKeypadGreyFont);
  });

  it('getCircleStyle should return style when disable is true', () => {
    const testRenderer = renderer.create(
      <PinKeypadCircle {...{ ...pinKeypadCircleProps, disable: true }} />
    );
    const pinKeypadCircle = testRenderer.root.findByType(TouchableOpacity);
    expect(pinKeypadCircle.props.style).toEqual(styles.pinKeypadGreyCircle);
  });

  it('getCircleStyle should return style when isSolidPurple is true', () => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([true, jest.fn()]);
    const testRenderer = renderer.create(
      <PinKeypadCircle {...pinKeypadCircleProps} />
    );
    const pinKeypadCircle = testRenderer.root.findByType(TouchableOpacity);
    expect(pinKeypadCircle.props.style).toEqual(styles.pinKeypadPurpleCircle);
  });

  it('getCircleStyle should return style when isSolidPurple is false', () => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    const testRenderer = renderer.create(
      <PinKeypadCircle {...pinKeypadCircleProps} />
    );
    const pinKeypadCircle = testRenderer.root.findByType(TouchableOpacity);
    expect(pinKeypadCircle.props.style).toEqual(
      styles.pinKeypadPurpleBorderCircle
    );
  });

  it('getFontStyles should return style when disable is true', () => {
    const testRenderer = renderer.create(
      <PinKeypadCircle {...{ ...pinKeypadCircleProps, disable: true }} />
    );
    const textBox = testRenderer.root.findByType(PrimaryTextBox);
    expect(textBox.props.textBoxStyle).toEqual(styles.pinKeypadGreyFont);
  });

  it('getFontStyles should return style when isSolidPurple is true', () => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([true, jest.fn()]);
    const testRenderer = renderer.create(
      <PinKeypadCircle {...pinKeypadCircleProps} />
    );
    const textBox = testRenderer.root.findByType(PrimaryTextBox);
    expect(textBox.props.textBoxStyle).toEqual(styles.pinKeypadWhiteFont);
  });

  it('getFontStyles should return style when isSolidPurple is false', () => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    const testRenderer = renderer.create(
      <PinKeypadCircle {...pinKeypadCircleProps} />
    );
    const textBox = testRenderer.root.findByType(PrimaryTextBox);
    expect(textBox.props.textBoxStyle).toEqual(styles.pinKeypadPurpleFont);
  });
});
