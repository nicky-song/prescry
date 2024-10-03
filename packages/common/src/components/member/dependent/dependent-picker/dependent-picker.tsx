// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DependentPickerContent } from './dependent-picker.content';
import { dependentPickerStyle } from './dependent-picker.style';
import { BasePicker } from '../../pickers/base/base.picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import { IDependentProfile } from '../../../../models/member-profile/member-profile-info';
import { ProtectedView } from '../../../containers/protected-view/protected-view';

export interface IDependentPickerProps {
  availableDependents: IDependentProfile[];
  onDependentSelected: (dependent: string) => void;
  selectedValue: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const DependentPicker = (props: IDependentPickerProps) => {
  const onDependentSelected = (
    dependent: ItemValue,
    _dependentIndex: number
  ) => {
    props.onDependentSelected(dependent as string);
  };

  const renderPickerItems = () => {
    const items: React.ReactNode[] = [];
    items.push(
      <Picker.Item
        key={DependentPickerContent.defaultValue()}
        label={DependentPickerContent.defaultValue()}
        value={'default'}
        testID={`pickerItemDefaultValue`}
      />
    );
    items.push(
      <Picker.Item
        key={DependentPickerContent.newValue()}
        label={DependentPickerContent.newValue()}
        value={'newDependent'}
        testID={`pickerItemNewDependent`}
      />
    );

    props.availableDependents.forEach((dependent) => {
      if (dependent.firstName && dependent.lastName) {
        items.push(
          <Picker.Item
            key={dependent.identifier}
            label={`${dependent.firstName} ${dependent.lastName}`}
            value={dependent.identifier}
            testID={`pickerItem-${dependent.identifier}`}
          />
        );
      }
    });

    return items;
  };

  return (
    <ProtectedView
      style={[
        dependentPickerStyle.dependentPickerContainerStyle,
        props.containerStyle,
      ]}
    >
      <BasePicker
        style={[dependentPickerStyle.basePickerStyle, props.textStyle]}
        onValueChange={onDependentSelected}
        selectedValue={props.selectedValue || ''}
        testID='dependentPicker'
      >
        {renderPickerItems()}
      </BasePicker>
    </ProtectedView>
  );
};
