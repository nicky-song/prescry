// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactNode } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { GreyScale } from '../../../theming/theme';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { PrimaryTextBox } from '../../text/primary-text-box/primary-text-box';
import { testDiagnosisContent } from './test-diagnosis.content';
import { testDiagnosisStyle as styles } from './test-diagnosis.style';

export interface ITestResultDiagnosisProps {
  diagnosisHeader: string;
  diagnosisValue: string;
  testDateHeader: string;
  testResultDate?: string;
  testResultTime?: string;
  colorMyRx?: string;
  textColorMyRx?: string;
}

export const TestDiagnosis = (props: ITestResultDiagnosisProps) => {
  const {
    colorMyRx,
    diagnosisHeader,
    diagnosisValue,
    testDateHeader,
    testResultDate,
    testResultTime,
    textColorMyRx,
  } = props;

  const textColor = getTextColor(colorMyRx, textColorMyRx);
  const diagnosisHeaderStyle = getDiagnosisHeaderStyle(textColor);
  const diagnosisValueTextStyle = getDiagnosisValueTextStyle(textColor);
  const diagnosisDateStyle = getDiagnosisDateStyle(textColor);

  return (
    <View style={getDiagnosisContainerStyle(colorMyRx)}>
      <View style={styles.testDiagnosisTextContainer}>
        {renderDiagnosis(
          diagnosisHeaderStyle,
          diagnosisHeader,
          diagnosisValueTextStyle,
          diagnosisValue
        )}
        {renderDate(
          diagnosisHeaderStyle,
          diagnosisDateStyle,
          testDateHeader,
          testResultDate,
          testResultTime
        )}
      </View>
    </View>
  );
};

function getDiagnosisContainerStyle(colorMyRx?: string): ViewStyle {
  const style = colorMyRx
    ? {
        ...styles.baseTestDiagnosisContainer,
        backgroundColor: colorMyRx,
      }
    : styles.testDiagnosisContainerNoColor;
  return style;
}

function getDiagnosisHeaderStyle(textColor: string): TextStyle {
  return {
    ...styles.baseHeaderTextStyle,
    color: textColor,
  };
}

function getDiagnosisValueTextStyle(textColor: string): TextStyle {
  return {
    ...styles.baseTestDiagnosisValueTextStyle,
    color: textColor,
  };
}

function getDiagnosisDateStyle(textColor: string): TextStyle {
  return {
    ...styles.baseTestDateTextStyle,
    color: textColor,
  };
}

function getTextColor(colorMyRx?: string, textColorMyRx?: string) {
  if (textColorMyRx && colorMyRx) {
    return textColorMyRx;
  }
  if (colorMyRx) {
    return GreyScale.lightest;
  }
  return GreyScale.darkest;
}
function renderDiagnosis(
  diagnosisHeaderStyle: ViewStyle,
  diagnosisHeader: string,
  diagnosisTextStyle: TextStyle,
  diagnosis: string
): ReactNode {
  return (
    <View style={styles.testDiagnosisColumnContainer}>
      <PrimaryTextBox
        caption={diagnosisHeader}
        textBoxStyle={diagnosisHeaderStyle}
      />
      <MarkdownText textStyle={diagnosisTextStyle}>{diagnosis}</MarkdownText>
    </View>
  );
}

function renderDate(
  diagnosisHeaderStyle: ViewStyle,
  diagnosisDateStyle: ViewStyle,
  testDateHeader: string,
  testResultDate?: string,
  testResultTime?: string
): ReactNode {
  if (testResultDate) {
    return (
      <View style={styles.testDiagnosisColumnContainer}>
        <PrimaryTextBox
          caption={testDateHeader}
          textBoxStyle={{
            ...diagnosisHeaderStyle,
            textAlign: 'right',
            marginBottom: 18,
          }}
        />
        <PrimaryTextBox
          caption={testResultDate}
          textBoxStyle={{ ...diagnosisDateStyle, marginBottom: 6 }}
        />
        <PrimaryTextBox
          caption={
            testResultTime
              ? testDiagnosisContent.testPerformedAt() + testResultTime
              : undefined
          }
          textBoxStyle={diagnosisDateStyle}
        />
      </View>
    );
  }
  return null;
}
