// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { lineSeparatorStyles } from './line-separator.styles';

export interface ILineSeparatorProps {
  viewStyle?: StyleProp<ViewStyle>;
  label?: string;
  isSkeleton?: boolean;
}

export const LineSeparator = ({
  viewStyle,
  label,
  isSkeleton,
}: ILineSeparatorProps): ReactElement => {
  const hasLabel = !!label;

  const singleLine = (
    <View
      style={[
        lineSeparatorStyles.lineViewStyle,
        hasLabel ? lineSeparatorStyles.surroundingLineViewStyle : viewStyle,
      ]}
    />
  );

  const lineWithLabel = (
    <View style={[lineSeparatorStyles.linesWithLabelViewStyle, viewStyle]}>
      {singleLine}
      <BaseText
        style={lineSeparatorStyles.labelTextStyle}
        isSkeleton={isSkeleton}
      >
        {label}
      </BaseText>
      {singleLine}
    </View>
  );

  const lineSeparator = hasLabel ? lineWithLabel : singleLine;

  return lineSeparator;
};
