// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { ViewStyle, StyleProp, View } from 'react-native';
import { BaseButton } from '../base/base.button';
import { Label } from '../../text/label/label';
import { toggleButtonGroupStyles } from './toggle.button-group.style';

export interface IToggleButtonOption {
  value: string;
  label: string;
  key?: string;
}

export interface IToggleButtonGroupProps {
  headerText: string;
  onSelect: (selectedOption: string) => void;
  isRequired?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  options: IToggleButtonOption[];
  selected?: string;
}

export const ToggleButtonGroup = ({
  onSelect,
  selected,
  headerText,
  isRequired,
  options,
  viewStyle,
}: IToggleButtonGroupProps) => {
  const [selectedOption, setSelectedOption] = useState(selected);

  useEffect(() => {
    if (selected !== undefined) {
      setSelectedOption(selected);
    }
  }, [selected]);

  const renderOptions = () => {
    return options.map((obj) => {
      const onPress = () => {
        onSelect(obj.value);
        setSelectedOption(obj.value);
      };

      const buttonViewStyle =
        selectedOption === obj.value
          ? toggleButtonGroupStyles.buttonViewStyle
          : toggleButtonGroupStyles.unSelectedButtonViewStyle;

      const textStyle =
        selectedOption === obj.value
          ? toggleButtonGroupStyles.buttonTextStyle
          : toggleButtonGroupStyles.unSelectedButtonTextStyle;

      return (
        <BaseButton
          size='medium'
          accessibilityRole='radio'
          onPress={onPress}
          key={obj.key || `radioButton${obj.label}`}
          viewStyle={buttonViewStyle}
          textStyle={textStyle}
          testID={`toggleButtonGroupBaseButton-${obj.key || obj.label}`}
        >
          {obj.label}
        </BaseButton>
      );
    });
  };

  return (
    <View testID='buttonGroup' accessibilityRole='radiogroup' style={viewStyle}>
      <Label label={headerText} isRequired={isRequired}>
        <View style={toggleButtonGroupStyles.optionsContainerViewStyle}>
          {renderOptions()}
        </View>
      </Label>
    </View>
  );
};
