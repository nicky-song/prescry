// Copyright 2018 Prescryptive Health, Inc.

import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BackSpaceButton } from '../../../components/pin/backspace-button/backspace-button';
import { PinKeypadCircle } from '../../../components/pin/pin-keypad-circle/pin-keypad-circle';
import {
  Digit2DArray,
  IPinKeypadContainerProps,
  PinKeypadContainer,
} from './pin-keypad-container';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
  useRef: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;
const useRefMock = useRef as jest.Mock;

jest.mock(
  '../../../components/pin/pin-keypad-circle/pin-keypad-circle',
  () => ({
    PinKeypadCircle: () => <div />,
  })
);

jest.mock('../../../components/pin/backspace-button/backspace-button', () => ({
  BackSpaceButton: () => <div />,
}));

const mockSetEnteredPin = jest.fn();
const mockPinKeyPadContainerTestID = 'testIDContainer';

const pinKeypadContainerProps: IPinKeypadContainerProps = {
  enteredPin: '1234',
  setEnteredPin: mockSetEnteredPin,
  testID: mockPinKeyPadContainerTestID,
};

beforeEach(() => {
  jest.clearAllMocks();
  useStateMock.mockReturnValueOnce([false, jest.fn()]);
  useRefMock.mockReturnValue({
    current: {},
  });
});

describe('PinKeypadContainer component', () => {
  it('renders container with expected style', () => {
    const mockViewStyle = { flex: 1 };
    const testRenderer = renderer.create(
      <PinKeypadContainer
        {...pinKeypadContainerProps}
        viewStyle={mockViewStyle}
      />
    );
    const mainContainer = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];
    expect(mainContainer.props.style).toBe(mockViewStyle);
  });

  it('should render PinKeypadCircle list of length 10', () => {
    const pinKeypadContainer = renderer.create(
      <PinKeypadContainer {...pinKeypadContainerProps} />
    );

    const pinKeypadCircleList =
      pinKeypadContainer.root.findAllByType(PinKeypadCircle);
    expect(pinKeypadCircleList.length).toBe(10);
    expect(pinKeypadCircleList[0].props.digitValue).toBe('1');
    expect(pinKeypadCircleList[0].props.testID).toEqual(
      `${mockPinKeyPadContainerTestID}-pinKeypadCircle1`
    );
    expect(pinKeypadCircleList[1].props.digitValue).toBe('2');
    expect(pinKeypadCircleList[1].props.testID).toEqual(
      `${mockPinKeyPadContainerTestID}-pinKeypadCircle2`
    );
    expect(pinKeypadCircleList[2].props.digitValue).toBe('3');
    expect(pinKeypadCircleList[2].props.testID).toEqual(
      `${mockPinKeyPadContainerTestID}-pinKeypadCircle3`
    );
    expect(pinKeypadCircleList[3].props.digitValue).toBe('4');
    expect(pinKeypadCircleList[3].props.testID).toEqual(
      `${mockPinKeyPadContainerTestID}-pinKeypadCircle4`
    );
    expect(pinKeypadCircleList[4].props.digitValue).toBe('5');
    expect(pinKeypadCircleList[4].props.testID).toEqual(
      `${mockPinKeyPadContainerTestID}-pinKeypadCircle5`
    );
    expect(pinKeypadCircleList[5].props.digitValue).toBe('6');
    expect(pinKeypadCircleList[5].props.testID).toEqual(
      `${mockPinKeyPadContainerTestID}-pinKeypadCircle6`
    );
    expect(pinKeypadCircleList[6].props.digitValue).toBe('7');
    expect(pinKeypadCircleList[6].props.testID).toEqual(
      `${mockPinKeyPadContainerTestID}-pinKeypadCircle7`
    );
    expect(pinKeypadCircleList[7].props.digitValue).toBe('8');
    expect(pinKeypadCircleList[7].props.testID).toEqual(
      `${mockPinKeyPadContainerTestID}-pinKeypadCircle8`
    );
    expect(pinKeypadCircleList[8].props.digitValue).toBe('9');
    expect(pinKeypadCircleList[8].props.testID).toEqual(
      `${mockPinKeyPadContainerTestID}-pinKeypadCircle9`
    );
    expect(pinKeypadCircleList[9].props.digitValue).toBe('0');
    expect(pinKeypadCircleList[9].props.testID).toEqual(
      `${mockPinKeyPadContainerTestID}-pinKeypadCircle0`
    );

    expect(pinKeypadCircleList[0].props.disable).toBeFalsy();
    expect(pinKeypadCircleList[1].props.disable).toBeFalsy();
    expect(pinKeypadCircleList[2].props.disable).toBeFalsy();
    expect(pinKeypadCircleList[3].props.disable).toBeFalsy();
    expect(pinKeypadCircleList[4].props.disable).toBeFalsy();
    expect(pinKeypadCircleList[5].props.disable).toBeFalsy();
    expect(pinKeypadCircleList[6].props.disable).toBeFalsy();
    expect(pinKeypadCircleList[7].props.disable).toBeFalsy();
    expect(pinKeypadCircleList[8].props.disable).toBeFalsy();
    expect(pinKeypadCircleList[9].props.disable).toBeFalsy();
  });

  it('should render BackSpaceButton', () => {
    const testRenderer = renderer.create(
      <PinKeypadContainer {...pinKeypadContainerProps} />
    );
    const backSpaceButton = testRenderer.root.findByType(BackSpaceButton);
    expect(backSpaceButton).toBeDefined();
    expect(backSpaceButton.props.onPress).toEqual(expect.any(Function));
    expect(backSpaceButton.props.testID).toEqual(
      `${mockPinKeyPadContainerTestID}BackSpaceButton`
    );
  });

  it('onKeyPress should update the pin in state only if the pin in state is less than 4 and should also call setEnteredPin', async () => {
    useEffectMock.mockReset();
    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    const testRenderer = renderer.create(
      <PinKeypadContainer {...pinKeypadContainerProps} enteredPin='123' />
    );
    const pinKeypadCircleList =
      testRenderer.root.findAllByType(PinKeypadCircle);

    await pinKeypadCircleList[3].props.onKeyPress('4');
    expect(pinKeypadContainerProps.setEnteredPin).toHaveBeenCalledTimes(1);
    expect(pinKeypadContainerProps.setEnteredPin).toHaveBeenCalledWith('1234');
  });

  it('onKeyPress should set isEnteredPinComplete true in state only if the pin in state is equal to 4', () => {
    const mockSetIsEnteredPinComplete = jest.fn();
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([false, mockSetIsEnteredPinComplete]);

    const testRenderer = renderer.create(
      <PinKeypadContainer {...pinKeypadContainerProps} enteredPin='123' />
    );

    const pinKeypadCircleList =
      testRenderer.root.findAllByType(PinKeypadCircle);

    pinKeypadCircleList[3].props.onKeyPress('4');

    expect(mockSetIsEnteredPinComplete).toHaveBeenCalledWith(true);
  });

  it('should disable keypad when 4 digit pin is entered ', () => {
    const mockSetIsEnteredPinComplete = jest.fn();
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([false, mockSetIsEnteredPinComplete]);

    const testRenderer = renderer.create(
      <PinKeypadContainer {...pinKeypadContainerProps} enteredPin='123' />
    );

    const pinKeypadCircleList =
      testRenderer.root.findAllByType(PinKeypadCircle);

    pinKeypadCircleList[3].props.onKeyPress('4');

    expect(mockSetEnteredPin).toHaveBeenCalledWith('1234');
    expect(mockSetIsEnteredPinComplete).toHaveBeenCalledWith(true);
  });

  it('onBackspace should call setEnteredPin', () => {
    const testRenderer = renderer.create(
      <PinKeypadContainer {...pinKeypadContainerProps} />
    );
    const pinKeypadCircle = testRenderer.root.findAllByType(PinKeypadCircle);
    const backSpaceButton = testRenderer.root.findByType(BackSpaceButton);

    pinKeypadCircle[0].props.onKeyPress('1234');
    backSpaceButton.props.onPress();

    expect(mockSetEnteredPin).toHaveBeenCalledWith('123');
  });

  it('should set data-heap-redact-text to true on mount', () => {
    useRefMock.mockReset();

    const ignoreHeapRefObjectMock = {
      current: { setNativeProps: jest.fn() },
    };

    useRefMock.mockReturnValueOnce(ignoreHeapRefObjectMock);

    const testRenderer = renderer.create(
      <PinKeypadContainer {...pinKeypadContainerProps} />
    );

    const parentView = testRenderer.root.children[0] as ReactTestInstance;

    expect(parentView.type).toEqual(View);

    const ignoreHeapRefCallback = useEffectMock.mock.calls[1][0];
    const ignoreHeapRefDependency = useEffectMock.mock.calls[1][1];

    expect(ignoreHeapRefCallback).toEqual(expect.any(Function));
    expect(ignoreHeapRefDependency).toEqual([]);

    ignoreHeapRefCallback();

    expect(ignoreHeapRefObjectMock.current.setNativeProps).toHaveBeenCalledWith(
      {
        'data-heap-redact-text': 'true',
      }
    );
  });
});

describe('Digit2DArray', () => {
  it('should have [1, 2, 3] at 0th index', () => {
    expect(Digit2DArray[0]).toEqual(['1', '2', '3']);
  });

  it('should have [4, 5, 6] at 1st index', () => {
    expect(Digit2DArray[1]).toEqual(['4', '5', '6']);
  });

  it('should have [7, 8, 9] at 2nd index', () => {
    expect(Digit2DArray[2]).toEqual(['7', '8', '9']);
  });
});
