// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { Heading } from '../member/heading/heading';
import { SurveyItem } from '../member/survey/survey-item/survey-item';
import { insuranceInformationContent } from './insurance-information.content';
import { insuranceInformationStyles } from './insusrance-information.style';

export interface IInsuranceInformationProps {
  insuranceInformationChanged: (
    id: string,
    value?: string | string[] | Date | undefined
  ) => void;
  answer: string | string[] | Date;
}

export const InsuranceInformation = (
  props: IInsuranceInformationProps
): React.ReactElement => {
  const { insuranceInformationChanged, answer } = props;

  const renderHeading = (
    <Heading level={2}>{insuranceInformationContent.headingTitle}</Heading>
  );

  const renderQuestion = (
    <SurveyItem
      id={insuranceInformationContent.id}
      question={insuranceInformationContent.question}
      placeholder={insuranceInformationContent.placeHolder}
      type='single-select'
      selectOptions={insuranceInformationContent.options}
      isRequired={true}
      onAnswerChange={insuranceInformationChanged}
      answer={answer}
      useCode={true}
    />
  );
  return (
    <View style={insuranceInformationStyles.insuranceViewStyle}>
      {renderHeading}
      {renderQuestion}
    </View>
  );
};
