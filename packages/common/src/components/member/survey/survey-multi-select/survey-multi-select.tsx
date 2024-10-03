// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { FlatList } from 'react-native';
import { PrimaryCheckBox } from '../../../checkbox/primary-checkbox/primary-checkbox';
import { surveyMultiSelectStyles } from './survey-multi-select.styles';
import { SurveySelectOptions } from '../../../../models/survey-questions';

export interface ISurveyMultiSelectProps {
  onSelect: (values: string[]) => void;
  options: SurveySelectOptions;
  selectedValues?: string[];
  testID?: string;
}

type ItemType = [string, string];

export const SurveyMultiSelect = ({
  onSelect,
  options,
  selectedValues = [],
  testID,
}: ISurveyMultiSelectProps) => {
  const keyExtractor = (item: ItemType) => {
    const [value, label] = item;
    return `${label}-${value}`;
  };

  return (
    <FlatList<ItemType>
      data={Array.from(options)}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );

  function renderItem({ item }: { item: ItemType; index: number }) {
    const [, label] = item;
    const { checkboxTextStyle, checkboxViewStyle } = surveyMultiSelectStyles;
    const isChecked = selectedValues.includes(label);

    return (
      <PrimaryCheckBox
        {...(testID && {
          testID: `${testID}-${label}Check`,
        })}
        checkBoxChecked={isChecked}
        checkBoxLabel={label}
        checkBoxValue={label}
        checkBoxTextStyle={checkboxTextStyle}
        checkBoxViewStyle={checkboxViewStyle}
        onPress={onPress}
      />
    );
  }

  function onPress(isChecked: boolean, value: string) {
    const filterItem = (item: string) => item !== value;

    if (isChecked) {
      selectedValues.push(value);
      onSelect(selectedValues);
    } else {
      const updatedValues = selectedValues.filter(filterItem);
      onSelect(updatedValues);
    }
  }
};
