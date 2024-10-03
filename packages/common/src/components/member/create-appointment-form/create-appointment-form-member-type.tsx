// Copyright 2020 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import { RadioButton } from '../../buttons/radio-button/radio-button';
import { BaseText } from '../../text/base-text/base-text';
import { createAppointmentFormContent } from './create-appointment-form.content';
import { createAppointmentFormStyles } from './create-appointment-form.styles';

export interface ICreateAppointmentFormMemberTypeProps {
  onMemberTypeSelected: (value: number) => void;
  selectedMemberType?: number;
}

export const CreateAppointmentFormMemberType = (
  props: ICreateAppointmentFormMemberTypeProps
) => {
  const { onMemberTypeSelected, selectedMemberType } = props;

  const [selectedOption, setSelectedOption] = useState(
    selectedMemberType ?? undefined
  );

  return (
    <View
      style={createAppointmentFormStyles.aboutYouContainerViewStyle}
      testID='selectedMemberType'
    >
      <BaseText weight='semiBold'>
        {createAppointmentFormContent.requestingForCaption}
      </BaseText>
      <View
        style={
          createAppointmentFormStyles.requestingForCheckboxContainerViewStyle
        }
      >
        {renderRadioButtonOptions()}
      </View>
    </View>
  );

  function renderRadioButtonOptions() {
    const radioProps = [
      {
        label: createAppointmentFormContent.forMyselfLabel,
        value: 0,
      },
      {
        label: createAppointmentFormContent.forAnotherPersonLabel,
        value: 1,
      },
    ];

    return radioProps.map((obj, i) => (
      <View key={i} style={createAppointmentFormStyles.radioButtonViewStyle}>
        <RadioButton
          buttonLabel={obj.label}
          buttonValue={obj.value}
          isSelected={selectedOption === obj.value}
          onPress={onPress}
          testID={`appointmentRadio-${obj.label}`}
        />
      </View>
    ));
  }

  function onPress(value: number) {
    setSelectedOption(value);
    onMemberTypeSelected(value);
  }
};
