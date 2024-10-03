// Copyright 2021 Prescryptive Health, Inc.

import React, { useImperativeHandle, useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { mandatoryIconUsingStrikeThroughStyle } from '../../../theming/constants';
import { RadioButton } from '../../buttons/radio-button/radio-button';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { radioButtonToggleStyles } from './radio-button-toggle.styles';

export interface IRadioButtonOption {
  label: string;
  value: number;
  subLabel?: string;
}
export interface IRadioButtonToggleProps {
  onOptionSelected: (value: number) => void;
  optionAText?: string;
  optionBText?: string;
  headerText?: string;
  defaultSelectedOption?: number;
  viewStyle?: ViewStyle;
  checkBoxContainerViewStyle?: ViewStyle;
  headerTextStyle?: TextStyle;
  buttonViewStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  buttonTopTextStyle?: TextStyle;
  buttonBottomTextStyle?: TextStyle;
  isMandatory?: boolean;
  options?: IRadioButtonOption[];
}

export type RadioButtonToggleHandle = {
  selectOption: (value: number) => void;
};

export const RadioButtonToggle = React.forwardRef<
  RadioButtonToggleHandle,
  IRadioButtonToggleProps
>((props: IRadioButtonToggleProps, ref) => {
  const {
    onOptionSelected,
    defaultSelectedOption,
    optionAText,
    optionBText,
    headerText,
    viewStyle,
    checkBoxContainerViewStyle,
    headerTextStyle,
    buttonViewStyle,
    buttonTextStyle,
    buttonTopTextStyle,
    buttonBottomTextStyle,
    isMandatory = true,
    options,
  } = props;

  const [selectedOption, setSelectedOption] = useState(
    defaultSelectedOption ?? undefined
  );

  useImperativeHandle(ref, () => ({
    selectOption(value: number) {
      setSelectedOption(value);
    },
  }));

  const mandatoryString = isMandatory
    ? mandatoryIconUsingStrikeThroughStyle
    : '';

  const renderHeader = () => {
    if (headerText) {
      return (
        <MarkdownText
          textStyle={headerTextStyle ?? radioButtonToggleStyles.headerTextStyle}
          markdownTextStyle={radioButtonToggleStyles.mandatoryIconTextStyle}
        >
          {`${headerText} ${mandatoryString}`}
        </MarkdownText>
      );
    }
    return null;
  };

  return (
    <View
      style={viewStyle ?? radioButtonToggleStyles.containerViewStyle}
      testID='radioButtonToggle'
    >
      {renderHeader()}
      <View
        style={
          checkBoxContainerViewStyle ??
          radioButtonToggleStyles.checkBoxContainerViewStyle
        }
      >
        {renderRadioButtonOptions()}
      </View>
    </View>
  );

  function renderRadioButtonOptions() {
    const radioProps = options ?? [
      {
        label: optionAText,
        subLabel: undefined,
        value: 0,
      },
      {
        label: optionBText,
        subLabel: undefined,
        value: 1,
      },
    ];

    return radioProps.map((obj, i) => (
      <RadioButton
        key={i}
        buttonLabel={obj.label ?? ''}
        buttonSubLabel={obj.subLabel}
        buttonValue={obj.value}
        isSelected={selectedOption === obj.value}
        onPress={onPress}
        viewStyle={buttonViewStyle}
        buttonTextStyle={{
          ...radioButtonToggleStyles.buttonTextStyle,
          ...buttonTextStyle,
        }}
        buttonTopTextStyle={{
          ...radioButtonToggleStyles.buttonTextStyle,
          ...buttonTopTextStyle,
        }}
        buttonBottomTextStyle={{
          ...radioButtonToggleStyles.buttonTextStyle,
          ...buttonBottomTextStyle,
        }}
        testID={`radioButtonToggleRadioButton-${obj.label ?? i}`}
      />
    ));
  }

  function onPress(value: number) {
    setSelectedOption(value);
    onOptionSelected(value);
  }
});
