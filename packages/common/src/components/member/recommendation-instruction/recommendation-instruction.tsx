// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { LineSeparator } from '../line-separator/line-separator';
import { PrescriberDetails } from '../prescriber-details/prescriber-details';
import { recommendationInstructionStyles } from './recommendation-instruction.style';

export interface IRecommendationInstructionProps {
  explanationText: string;
  callToActionText: string;
  callToDoctor?: (phoneNumber: string) => void;
  doctorContactNumber?: string;
  doctorName?: string;
}

export const RecommendationInstruction = (
  props: IRecommendationInstructionProps
) => {
  function renderDoctorContact() {
    if (props.doctorContactNumber && props.doctorName && props.callToDoctor) {
      return (
        <PrescriberDetails
          doctorContactNumber={props.doctorContactNumber}
          doctorName={props.doctorName}
          callToDoctor={props.callToDoctor}
        />
      );
    }
    return;
  }

  return (
    <View
      style={recommendationInstructionStyles.offerDetailsInstructionContainer}
    >
      <View style={recommendationInstructionStyles.offerDetailsInstructionView}>
        <View style={recommendationInstructionStyles.explanationContainer}>
          <BaseText
            children={props.explanationText}
            style={recommendationInstructionStyles.explanationText}
          />
        </View>
        <View style={recommendationInstructionStyles.callToActionContainer}>
          <BaseText
            children={props.callToActionText}
            style={recommendationInstructionStyles.callToActionText}
          />
        </View>
        {renderDoctorContact()}
      </View>
      <LineSeparator
        viewStyle={recommendationInstructionStyles.lineSeparatorViewStyle}
      />
    </View>
  );
};
