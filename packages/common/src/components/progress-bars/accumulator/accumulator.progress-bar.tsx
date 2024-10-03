// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { InformationButton } from '../../buttons/information/information.button';
import { BaseText } from '../../text/base-text/base-text';
import { BaseProgressBar } from '../base/base.progress-bar';
import { IAccumulatorProgressBarContent } from './accumulator.progress-bar.content';
import { accumulatorProgressBarStyles as styles } from './accumulator.progress-bar.styles';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { AccumulatorProgressLabel } from './progress-label/accumulator.progress-label';

export interface IAccumulatorProgressBarProps {
  viewStyle?: StyleProp<ViewStyle>;
  title: string;
  maxValue: number;
  value: number;
  onInfoPress?: () => void;
  isSkeleton?: boolean;
}

export const AccumulatorProgressBar = ({
  viewStyle,
  title,
  maxValue,
  value,
  onInfoPress,
  isSkeleton,
}: IAccumulatorProgressBarProps): ReactElement => {
  const { content, isContentLoading } =
    useContent<IAccumulatorProgressBarContent>(
      CmsGroupKey.accumulatorProgressBar,
      2
    );

  const getAdjustedValue = (value: number): number => {
    if (value < 0) {
      return 0;
    }

    return value > maxValue ? maxValue : value;
  };

  const adjustedValue = getAdjustedValue(value);
  const minProgressLabel = (
    <AccumulatorProgressLabel
      isSkeleton={isContentLoading}
      label={content.minProgressLabel}
      value={adjustedValue}
      testID='accumulatorProgressBarMinProgressLabel'
    />
  );

  const maxProgressValue = maxValue - adjustedValue;
  const maxProgressLabel = (
    <AccumulatorProgressLabel
      isSkeleton={isContentLoading}
      label={content.maxProgressLabel}
      value={maxProgressValue}
      testID='accumulatorProgressBarMaxProgressLabel'
    />
  );

  const infoButtonLabel = StringFormatter.format(
    content.infoButtonLabel,
    new Map([['term', title]])
  );

  const formattedMaxValue = MoneyFormatter.format(maxValue);

  const infoButton = onInfoPress ? (
    <InformationButton
      onPress={onInfoPress}
      accessibilityLabel={infoButtonLabel}
    />
  ) : null;

  return (
    <View style={viewStyle} testID='accumulatorProgressBar'>
      <View
        testID='accumulatorProgressBarTitleContainer'
        style={styles.titleContainerViewStyle}
      >
        <BaseText isSkeleton={isSkeleton}>{title}</BaseText>
        {infoButton}
      </View>
      <View
        testID='accumulatorProgressBarMaxValueContainer'
        style={styles.maxValueContainerViewStyle}
      >
        <BaseText style={styles.maxValueTextStyle}>
          {formattedMaxValue}
        </BaseText>
        <BaseText
          style={styles.maxLabelTextStyle}
          isSkeleton={isContentLoading}
        >
          {content.maxValueLabel}
        </BaseText>
      </View>
      <BaseProgressBar
        accessibilityLabel={title}
        minValue={0}
        maxValue={maxValue}
        value={value}
        minLabel={minProgressLabel}
        maxLabel={maxProgressLabel}
        labelPosition='top'
      />
    </View>
  );
};
