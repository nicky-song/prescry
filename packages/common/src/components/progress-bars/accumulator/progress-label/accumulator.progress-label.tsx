// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { MoneyFormatter } from '../../../../utils/formatters/money-formatter';
import { BaseText } from '../../../text/base-text/base-text';
import { ValueText } from '../../../text/value/value.text';
import { accumulatorProgressLabelStyles } from './accumulator.progress-label.styles';

export interface IAccumulatorProgressLabelProps {
  viewStyle?: StyleProp<ViewStyle>;
  label: string;
  value: number;
  testID?: string;
  isSkeleton?: boolean;
}

export const AccumulatorProgressLabel = ({
  viewStyle,
  label,
  value,
  testID = 'accumulatorProgressLabel',
  isSkeleton,
}: IAccumulatorProgressLabelProps): ReactElement => {
  const styles = accumulatorProgressLabelStyles;

  const formattedValue = MoneyFormatter.format(value);

  return (
    <View style={viewStyle} testID={testID}>
      <BaseText isSkeleton={isSkeleton} style={styles.labelTextStyle}>
        {label}
      </BaseText>
      <ValueText>{formattedValue}</ValueText>
    </View>
  );
};
