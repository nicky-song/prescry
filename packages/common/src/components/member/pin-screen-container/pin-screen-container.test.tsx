// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { PrimaryTextBox } from '../../text/primary-text-box/primary-text-box';
import { PinDisplayContainer } from '../pin-display-container/pin-display-container';
import { PinKeypadContainer } from '../pin-keypad-container/pin-keypad-container';
import {
  IPinScreenContainerProps,
  PinScreenContainer,
} from './pin-screen-container';
import { pinScreenContainerStyles } from './pin-screen-container.styles';

jest.mock('../pin-keypad-container/pin-keypad-container', () => ({
  PinKeypadContainer: () => <div />,
}));

const mockSetEnteredPin = jest.fn();
const mockContainerTestID = 'containerTestID';

const pinScreenContainerProps: IPinScreenContainerProps = {
  enteredPin: '',
  errorMessage: 'mock error message',
  onPinChange: mockSetEnteredPin,
  testID: mockContainerTestID,
};

beforeEach(() => mockSetEnteredPin.mockReset());

describe('PinScreenContainer component', () => {
  it('should render containers with expected styles', () => {
    const testRenderer = renderer.create(
      <PinScreenContainer {...pinScreenContainerProps} />
    );
    const mainContainer = testRenderer.root.findByType(View);
    expect(mainContainer.props.style).toEqual(
      pinScreenContainerStyles.containerViewStyle
    );
    expect(mainContainer.props.children[2].type).toEqual(View);
    expect(mainContainer.props.children[2].props.style).toEqual(
      pinScreenContainerStyles.pinKeypadStyle
    );
  });

  it('should render pinDisplayContainer', () => {
    const testRenderer = renderer.create(
      <PinScreenContainer {...pinScreenContainerProps} />
    );
    const pinDisplayContainer =
      testRenderer.root.findByType(PinDisplayContainer);
    expect(pinDisplayContainer).toBeDefined();
    expect(pinDisplayContainer.props.pinIndex).toEqual(
      pinScreenContainerProps.enteredPin.length
    );
  });

  it('should render errormessage PrimaryTextbox', () => {
    const testRenderer = renderer.create(
      <PinScreenContainer {...pinScreenContainerProps} />
    );
    const primaryTextBox = testRenderer.root.findAllByType(PrimaryTextBox);
    expect(primaryTextBox[0]).toBeDefined();
    expect(primaryTextBox[0].props.caption).toBe(
      pinScreenContainerProps.errorMessage
    );
    expect(primaryTextBox[0].props.textBoxStyle).toEqual(
      pinScreenContainerStyles.errorTextStyle
    );
    expect(primaryTextBox[0].props.testID).toEqual(
      `${mockContainerTestID}PrimaryTextBox`
    );
  });

  it('should render pin keypad container', () => {
    const testRenderer = renderer.create(
      <PinScreenContainer {...pinScreenContainerProps} />
    );
    const pinKeypadContainer = testRenderer.root.findByType(PinKeypadContainer);

    expect(pinKeypadContainer).toBeDefined();
    expect(pinKeypadContainer.props.enteredPin).toBe('');
    expect(pinKeypadContainer.props.setEnteredPin).toEqual(
      expect.any(Function)
    );
    expect(pinKeypadContainer.props.testID).toEqual(
      `${mockContainerTestID}PinKeyPadContainer`
    );
  });

  it('setEnteredPin should call onPinChange props', () => {
    const testRenderer = renderer.create(
      <PinScreenContainer {...pinScreenContainerProps} />
    );

    const pinKeypadContainer = testRenderer.root.findByType(PinKeypadContainer);
    pinKeypadContainer.props.setEnteredPin('1234');
    expect(pinScreenContainerProps.onPinChange).toHaveBeenCalledTimes(1);
    expect(pinScreenContainerProps.onPinChange).toHaveBeenCalledWith('1234');
  });

  it('renderAnyErrorText method displays the errorMessage if Error message present', () => {
    const testRenderer = renderer.create(
      <PinScreenContainer {...pinScreenContainerProps} />
    );
    const primaryTextBox = testRenderer.root.findAllByType(PrimaryTextBox);
    expect(primaryTextBox[0]).toBeDefined();
    expect(primaryTextBox[0].props.caption).toBe(
      pinScreenContainerProps.errorMessage
    );
  });
});
