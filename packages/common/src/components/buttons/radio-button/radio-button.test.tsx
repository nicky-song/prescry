// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import renderer from 'react-test-renderer';
import { BaseText } from '../../text/base-text/base-text';
import { IRadioButtonProps, RadioButton } from './radio-button';
import { radioButtonStyles } from './radio-button.styles';

const mockRadioButtonCallBack = jest.fn();
const radioButtonProps: IRadioButtonProps = {
  onPress: mockRadioButtonCallBack,
  isSelected: false,
  buttonLabel: 'Label',
  buttonValue: 0,
  testID: 'mockedTestID',
};

afterEach(() => {
  mockRadioButtonCallBack.mockClear();
});

describe('RadioButton component', () => {
  it('should render with props', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { testID, ...radioButtonPropsWithoutTestID } = radioButtonProps;
    const radioButton = renderer.create(
      <RadioButton {...radioButtonPropsWithoutTestID} />
    );

    expect(
      radioButton.root.findByProps({
        buttonLabel: radioButtonProps.buttonLabel,
      }).props.buttonLabel
    ).toBe(radioButtonProps.buttonLabel);
    const radioButtonTouchable = radioButton.root.findByType(TouchableOpacity);
    expect(radioButtonTouchable.props.testID).toBeUndefined();
  });

  it('should enable subview accordingly', () => {
    const radioButton = renderer.create(
      <RadioButton {...radioButtonProps} isSelected={true} />
    );

    expect(
      radioButton.root.findByProps({ isSelected: true }).props.isSelected
    ).toBe(true);
  });

  it('should render extra view with sub label if in props', () => {
    const mockButtonLabelGroupStyle = { backgroundColor: 'red' };
    const mockButtonTextStyle = { backgroundColor: 'blue' };
    const mockButtonTopTextStyle = { backgroundColor: 'green' };
    const mockButtonBottomTextStyle = { backgroundColor: 'purple' };
    const mockButtonSubLabel = 'mock-sub-label';

    const radioButtonContainer = renderer.create(
      <RadioButton
        {...radioButtonProps}
        buttonLabelGroupStyle={mockButtonLabelGroupStyle}
        buttonTextStyle={mockButtonTextStyle}
        buttonTopTextStyle={mockButtonTopTextStyle}
        buttonBottomTextStyle={mockButtonBottomTextStyle}
        buttonSubLabel={mockButtonSubLabel}
      />
    );

    const radioButton = radioButtonContainer.root.findByType(TouchableOpacity);
    expect(radioButton.props.style).toEqual(radioButtonStyles.buttonContainer);
    expect(radioButton.props.testID).toBeTruthy();
    expect(radioButton.props.testID).toBe('mockedTestIDTouchable');

    const mockCallback = radioButton.props.onPress;
    mockCallback();

    expect(mockRadioButtonCallBack).toHaveBeenCalled();
    const radioButtonView = radioButton.props.children[0];
    expect(radioButtonView.props.testID).toEqual('radioButton-Label');
    const buttonLabelContainer = radioButton.props.children[1];
    expect(buttonLabelContainer.type).toEqual(View);
    expect(buttonLabelContainer.props.style).toEqual(mockButtonLabelGroupStyle);

    const topText = buttonLabelContainer.props.children[0];
    expect(topText.type).toEqual(BaseText);
    expect(topText.props.style).toEqual([
      radioButtonStyles.buttonTopText,
      mockButtonTopTextStyle,
    ]);
    expect(topText.props.children).toEqual(radioButtonProps.buttonLabel);

    const bottomText = buttonLabelContainer.props.children[1];
    expect(bottomText.type).toEqual(BaseText);
    expect(bottomText.props.style).toEqual([
      radioButtonStyles.buttonText,
      mockButtonBottomTextStyle,
    ]);
    expect(bottomText.props.children).toEqual(mockButtonSubLabel);
  });
});
