// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { TestDiagnosis } from '../test-diagnosis/test-diagnosis';
import { formatAddress } from '../../../utils/formatters/address.formatter';
import { ITestResultState } from '../../../experiences/guest-experience/store/test-result/test-result.reducer';
import { testResultContent } from './test-result.content';
import { testResultStyles } from './test-result.styles';
import { BaseText } from '../../text/base-text/base-text';
import { LineSeparator } from '../line-separator/line-separator';
import { ToolButton } from '../../buttons/tool.button/tool.button';
import { PrimaryColor } from '../../../theming/colors';
import { base64StringToBlob } from '../../../utils/test-results/test-results.helper';
import { goToUrl } from '../../../utils/link.helper';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { TranslatableBaseText } from '../../text/translated-base-text/translatable-base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

export interface ITestResultDataProps {
  isTestFeatureFlag?: boolean;
  testResult?: ITestResultState;
  viewStyle?: StyleProp<ViewStyle>;
}

export const TestResult = (props: ITestResultDataProps) => {
  const {
    date,
    time,
    providerName,
    providerAddress,
    descriptionMyRx,
    factSheetLinks,
    textColorMyRx,
    colorMyRx,
    valueMyRx,
    resultPdf,
  } = props.testResult || {};

  const [showSpinner, setShowSpinner] = useState(false);

  const testResultDate = date;

  const testResultTime = time;

  const onPressViewPdf = async () => {
    setShowSpinner(true);
    if (resultPdf) {
      const blob = base64StringToBlob(resultPdf);

      const url = URL.createObjectURL(blob).toString();

      if (url) {
        await goToUrl(url);
      }
      setShowSpinner(false);
    }
  };

  const providerInformation =
    providerAddress && providerName ? (
      <ProtectedView testID='renderProviderInformationView'>
        <LineSeparator viewStyle={testResultStyles.separatorViewStyle} />
        <TranslatableBaseText style={testResultStyles.providerNameTextStyle}>
          {testResultContent.providerLabel + ' '}
          <ProtectedBaseText style={testResultStyles.providerNameTextStyle}>
            {providerName}
          </ProtectedBaseText>
        </TranslatableBaseText>
        <BaseText>{formatAddress(providerAddress)}</BaseText>
        <LineSeparator viewStyle={testResultStyles.separatorViewStyle} />
      </ProtectedView>
    ) : null;

  function renderMoreInfoItem(moreInfoItem: string, index: number): ReactNode {
    const textStyle: TextStyle =
      index === 0
        ? testResultStyles.firstMoreInfoTextStyle
        : testResultStyles.moreInfoTextStyle;

    return (
      <MarkdownText textStyle={textStyle} key={index}>
        {moreInfoItem}
      </MarkdownText>
    );
  }

  const moreInfo = !factSheetLinks ? null : (
    <View>{factSheetLinks.map(renderMoreInfoItem)}</View>
  );

  const spinner = showSpinner ? (
    <ActivityIndicator
      size='large'
      color={PrimaryColor.prescryptivePurple}
      style={testResultStyles.spinnerViewStyle}
    />
  ) : null;

  const viewPdf = showSpinner ? (
    spinner
  ) : (
    <>
      <ToolButton
        iconTextStyle={testResultStyles.toolButtonIconTextStyle}
        iconName='file-export'
        onPress={onPressViewPdf}
        style={testResultStyles.toolButtonViewStyle}
      >
        View PDF
      </ToolButton>
    </>
  );

  if (!props.testResult || !props.testResult.date) {
    return null;
  }

  return (
    <View style={props.viewStyle}>
      <TestDiagnosis
        colorMyRx={colorMyRx}
        textColorMyRx={textColorMyRx}
        diagnosisHeader={testResultContent.diagnosisHeader}
        diagnosisValue={`**${valueMyRx}**`}
        testDateHeader={testResultContent.testDateHeader}
        testResultDate={testResultDate}
        testResultTime={testResultTime}
      />
      <MarkdownText textStyle={testResultStyles.instructionsTextStyle}>
        {descriptionMyRx}
      </MarkdownText>
      {providerInformation}
      {viewPdf}
      {moreInfo}
    </View>
  );
};
