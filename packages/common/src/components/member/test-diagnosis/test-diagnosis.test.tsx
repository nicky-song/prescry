// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { testDiagnosisStyle as styles } from './test-diagnosis.style';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { PrimaryTextBox } from '../../text/primary-text-box/primary-text-box';
import { TestDiagnosis } from './test-diagnosis';
import { testDiagnosisContent } from './test-diagnosis.content';
import { GreyScale } from '../../../theming/theme';
import { ITestContainer } from '../../../testing/test.container';

jest.mock('../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

const testDate = 'appointment-date';
const testTime = 'appointment-time';
describe('TestDiagnosis', () => {
  it('renders in View with expected properties when both colorMyRx and textColorMyRx is provided', () => {
    const colorMyRx = 'blue';
    const textColorMyRx = 'yellow';
    const customViewStyle: ViewStyle = {
      ...styles.baseTestDiagnosisContainer,
      backgroundColor: colorMyRx,
    };
    const customTextStyle: TextStyle = {
      ...styles.baseHeaderTextStyle,
      color: textColorMyRx,
    };
    const customDateStyle = {
      ...styles.baseTestDateTextStyle,
      color: textColorMyRx,
    };

    const customDiagnosisValueTextStyle: TextStyle = {
      ...styles.baseTestDiagnosisValueTextStyle,
      color: textColorMyRx,
    };
    const header = 'header';
    const diagnosis = 'diagnosis';

    const testRenderer = renderer.create(
      <TestDiagnosis
        colorMyRx={colorMyRx}
        textColorMyRx={textColorMyRx}
        diagnosisHeader={header}
        diagnosisValue={diagnosis}
        testDateHeader={header}
        testResultDate={testDate}
        testResultTime={testTime}
      />
    );

    const diagnosisContainerView = testRenderer.root.findByType(View);
    expect(diagnosisContainerView.props.style).toEqual(customViewStyle);

    const diagnosisTextContainer = diagnosisContainerView.props.children;
    expect(diagnosisTextContainer.type).toEqual(View);
    expect(diagnosisTextContainer.props.style).toEqual(
      styles.testDiagnosisTextContainer
    );

    const diagnosisLeftContainer =
      diagnosisContainerView.props.children.props.children[0];
    expect(diagnosisLeftContainer.type).toEqual(View);

    const diagnosisHeader = diagnosisLeftContainer.props.children[0];
    expect(diagnosisHeader.type).toEqual(PrimaryTextBox);
    expect(diagnosisHeader.props.caption).toEqual(header);
    expect(diagnosisHeader.props.textBoxStyle).toEqual(customTextStyle);

    const diagnosisText = diagnosisLeftContainer.props.children[1];
    expect(diagnosisText.type).toEqual(MarkdownText);
    expect(diagnosisText.props.textStyle).toEqual(
      customDiagnosisValueTextStyle
    );
    expect(diagnosisText.props.children).toEqual(diagnosis);

    const diagnosisRightContainer =
      diagnosisContainerView.props.children.props.children[1];
    expect(diagnosisRightContainer.type).toEqual(View);

    const dateHeader = diagnosisRightContainer.props.children[0];
    expect(dateHeader.type).toEqual(PrimaryTextBox);
    expect(dateHeader.props.caption).toEqual(header);
    expect(dateHeader.props.textBoxStyle).toEqual({
      ...customTextStyle,
      textAlign: 'right',
      marginBottom: 18,
    });

    const dateText = diagnosisRightContainer.props.children[1];
    expect(dateText.type).toEqual(PrimaryTextBox);
    expect(dateText.props.caption).toEqual(testDate);
    expect(dateText.props.textBoxStyle).toEqual({
      ...customDateStyle,
      marginBottom: 6,
    });

    const timeText = diagnosisRightContainer.props.children[2];
    expect(timeText.type).toEqual(PrimaryTextBox);
    expect(timeText.props.caption).toEqual(
      testDiagnosisContent.testPerformedAt() + testTime
    );
    expect(timeText.props.textBoxStyle).toEqual(customDateStyle);
  });

  it('renders in View with expected properties when both colorMyRx and textColorMyRx are not provided', () => {
    const customViewStyle: ViewStyle = styles.testDiagnosisContainerNoColor;

    const customTextStyle: TextStyle = {
      ...styles.baseHeaderTextStyle,
      color: GreyScale.darkest,
    };
    const customDateStyle = {
      ...styles.baseTestDateTextStyle,
      color: GreyScale.darkest,
    };

    const customDiagnosisValueTextStyle: TextStyle = {
      ...styles.baseTestDiagnosisValueTextStyle,
      color: GreyScale.darkest,
    };
    const header = 'header';
    const diagnosis = 'diagnosis';

    const testRenderer = renderer.create(
      <TestDiagnosis
        diagnosisHeader={header}
        diagnosisValue={diagnosis}
        testDateHeader={header}
        testResultDate={testDate}
        testResultTime={testTime}
      />
    );

    const diagnosisContainerView = testRenderer.root.findByType(View);
    expect(diagnosisContainerView.props.style).toEqual(customViewStyle);

    const diagnosisTextContainer = diagnosisContainerView.props.children;
    expect(diagnosisTextContainer.type).toEqual(View);
    expect(diagnosisTextContainer.props.style).toEqual(
      styles.testDiagnosisTextContainer
    );

    const diagnosisLeftContainer =
      diagnosisContainerView.props.children.props.children[0];
    expect(diagnosisLeftContainer.type).toEqual(View);

    const diagnosisHeader = diagnosisLeftContainer.props.children[0];
    expect(diagnosisHeader.props.textBoxStyle).toEqual(customTextStyle);

    const diagnosisText = diagnosisLeftContainer.props.children[1];
    expect(diagnosisText.props.textStyle).toEqual(
      customDiagnosisValueTextStyle
    );

    const diagnosisRightContainer =
      diagnosisContainerView.props.children.props.children[1];

    const dateHeader = diagnosisRightContainer.props.children[0];
    expect(dateHeader.props.textBoxStyle).toEqual({
      ...customTextStyle,
      textAlign: 'right',
      marginBottom: 18,
    });

    const dateText = diagnosisRightContainer.props.children[1];
    expect(dateText.props.textBoxStyle).toEqual({
      ...customDateStyle,
      marginBottom: 6,
    });

    const timeText = diagnosisRightContainer.props.children[2];
    expect(timeText.props.textBoxStyle).toEqual(customDateStyle);
  });

  it('renders in View with expected properties when only colorMyRx (defauly to white for text color) is provided', () => {
    const colorMyRx = 'blue';
    const customViewStyle: ViewStyle = {
      ...styles.baseTestDiagnosisContainer,
      backgroundColor: colorMyRx,
    };
    const customTextStyle: TextStyle = {
      ...styles.baseHeaderTextStyle,
      color: GreyScale.lightest,
    };
    const customDateStyle = {
      ...styles.baseTestDateTextStyle,
      color: GreyScale.lightest,
    };

    const customDiagnosisValueTextStyle: TextStyle = {
      ...styles.baseTestDiagnosisValueTextStyle,
      color: GreyScale.lightest,
    };
    const header = 'header';
    const diagnosis = 'diagnosis';

    const testRenderer = renderer.create(
      <TestDiagnosis
        colorMyRx={colorMyRx}
        diagnosisHeader={header}
        diagnosisValue={diagnosis}
        testDateHeader={header}
        testResultDate={testDate}
        testResultTime={testTime}
      />
    );

    const diagnosisContainerView = testRenderer.root.findByType(View);
    expect(diagnosisContainerView.props.style).toEqual(customViewStyle);

    const diagnosisTextContainer = diagnosisContainerView.props.children;
    expect(diagnosisTextContainer.type).toEqual(View);
    expect(diagnosisTextContainer.props.style).toEqual(
      styles.testDiagnosisTextContainer
    );

    const diagnosisLeftContainer =
      diagnosisContainerView.props.children.props.children[0];
    expect(diagnosisLeftContainer.type).toEqual(View);

    const diagnosisHeader = diagnosisLeftContainer.props.children[0];
    expect(diagnosisHeader.props.textBoxStyle).toEqual(customTextStyle);

    const diagnosisText = diagnosisLeftContainer.props.children[1];
    expect(diagnosisText.props.textStyle).toEqual(
      customDiagnosisValueTextStyle
    );

    const diagnosisRightContainer =
      diagnosisContainerView.props.children.props.children[1];

    const dateHeader = diagnosisRightContainer.props.children[0];
    expect(dateHeader.props.textBoxStyle).toEqual({
      ...customTextStyle,
      textAlign: 'right',
      marginBottom: 18,
    });

    const dateText = diagnosisRightContainer.props.children[1];
    expect(dateText.props.textBoxStyle).toEqual({
      ...customDateStyle,
      marginBottom: 6,
    });

    const timeText = diagnosisRightContainer.props.children[2];
    expect(timeText.props.textBoxStyle).toEqual(customDateStyle);
  });
  it('renders in View with expected properties when only textColorMyRx provided (default both) is provided', () => {
    const textColorMyRx = 'blue';
    const customViewStyle: ViewStyle = styles.testDiagnosisContainerNoColor;

    const customTextStyle: TextStyle = {
      ...styles.baseHeaderTextStyle,
      color: GreyScale.darkest,
    };
    const customDateStyle = {
      ...styles.baseTestDateTextStyle,
      color: GreyScale.darkest,
    };

    const customDiagnosisValueTextStyle: TextStyle = {
      ...styles.baseTestDiagnosisValueTextStyle,
      color: GreyScale.darkest,
    };
    const header = 'header';
    const diagnosis = 'diagnosis';

    const testRenderer = renderer.create(
      <TestDiagnosis
        textColorMyRx={textColorMyRx}
        diagnosisHeader={header}
        diagnosisValue={diagnosis}
        testDateHeader={header}
        testResultDate={testDate}
        testResultTime={testTime}
      />
    );

    const diagnosisContainerView = testRenderer.root.findByType(View);
    expect(diagnosisContainerView.props.style).toEqual(customViewStyle);

    const diagnosisTextContainer = diagnosisContainerView.props.children;
    expect(diagnosisTextContainer.type).toEqual(View);
    expect(diagnosisTextContainer.props.style).toEqual(
      styles.testDiagnosisTextContainer
    );

    const diagnosisLeftContainer =
      diagnosisContainerView.props.children.props.children[0];
    expect(diagnosisLeftContainer.type).toEqual(View);

    const diagnosisHeader = diagnosisLeftContainer.props.children[0];
    expect(diagnosisHeader.props.textBoxStyle).toEqual(customTextStyle);

    const diagnosisText = diagnosisLeftContainer.props.children[1];
    expect(diagnosisText.props.textStyle).toEqual(
      customDiagnosisValueTextStyle
    );

    const diagnosisRightContainer =
      diagnosisContainerView.props.children.props.children[1];

    const dateHeader = diagnosisRightContainer.props.children[0];
    expect(dateHeader.props.textBoxStyle).toEqual({
      ...customTextStyle,
      textAlign: 'right',
      marginBottom: 18,
    });

    const dateText = diagnosisRightContainer.props.children[1];
    expect(dateText.props.textBoxStyle).toEqual({
      ...customDateStyle,
      marginBottom: 6,
    });

    const timeText = diagnosisRightContainer.props.children[2];
    expect(timeText.props.textBoxStyle).toEqual(customDateStyle);
  });
});
