// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ColorValue,
  LayoutChangeEvent,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {
  baseProgressBarStyles,
  defaultProgressBarColors,
} from './base.progress-bar.styles';
import { BaseText } from '../../text/base-text/base-text';

export type LabelPosition = 'top' | 'bottom';

export interface IBaseProgressBarProps {
  viewStyle?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  backgroundBarColor?: ColorValue;
  progressBarColors?: ColorValue[];
  minValue?: number;
  maxValue?: number;
  minLabel?: ReactNode;
  maxLabel?: ReactNode;
  labelPosition?: LabelPosition;
  value: number;
  isSkeleton?: boolean;
}

export const BaseProgressBar = ({
  viewStyle,
  accessibilityLabel,
  backgroundBarColor,
  progressBarColors = [],
  minValue = 0,
  maxValue = 1,
  minLabel,
  maxLabel,
  labelPosition = 'bottom',
  value,
  isSkeleton,
}: IBaseProgressBarProps): ReactElement => {
  const styles = baseProgressBarStyles;

  const [barWidth, setBarWidth] = useState(0);

  const labelsViewStyle =
    labelPosition === 'top'
      ? styles.topLabelsViewStyle
      : styles.bottomLabelsViewStyle;

  const labels =
    minLabel || maxLabel ? (
      <View testID='baseProgressBarLabels' style={labelsViewStyle}>
        <BaseText
          style={styles.minLabelTextStyle}
          isSkeleton={isSkeleton}
          skeletonWidth='short'
        >
          {minLabel}
        </BaseText>
        <BaseText
          style={styles.maxLabelTextStyle}
          isSkeleton={isSkeleton}
          skeletonWidth='short'
        >
          {maxLabel}
        </BaseText>
      </View>
    ) : null;

  const topLabels = labelPosition === 'top' ? labels : null;
  const bottomLabels = labelPosition === 'bottom' ? labels : null;

  const progressFraction = (): number => {
    if (minValue >= maxValue) {
      return 0;
    }

    if (value <= minValue) {
      return 0;
    }

    if (value >= maxValue) {
      return 1;
    }

    const range = maxValue - minValue;
    return (value - minValue) / range;
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setBarWidth(width);
  };

  const progressWidthViewStyle: ViewStyle = {
    width: barWidth * progressFraction(),
  };

  const backgroundBarColorViewStyle: ViewStyle | undefined = backgroundBarColor
    ? {
        backgroundColor: backgroundBarColor,
      }
    : undefined;

  const hasCustomColors = progressBarColors.length > 0;
  const useGradient = !hasCustomColors || progressBarColors.length > 1;

  const buildProgressBar = () => {
    if (useGradient) {
      const gradientColors = hasCustomColors
        ? progressBarColors
        : defaultProgressBarColors;
      return (
        <LinearGradient
          colors={gradientColors as string[]}
          style={[styles.progressBarViewStyle, progressWidthViewStyle]}
        />
      );
    }

    const progressBarColorViewStyle: ViewStyle = {
      backgroundColor: progressBarColors[0],
    };
    return (
      <View
        style={[
          styles.progressBarViewStyle,
          progressWidthViewStyle,
          progressBarColorViewStyle,
        ]}
      />
    );
  };
  const progressBar = buildProgressBar();

  return (
    <View
      style={viewStyle}
      testID='baseProgressBar'
      accessibilityRole='progressbar'
      accessibilityLabel={accessibilityLabel}
    >
      {topLabels}
      <View testID='baseProgressBarProgressContainer'>
        <View
          style={[styles.backgroundBarViewStyle, backgroundBarColorViewStyle]}
          onLayout={onLayout}
        />
        {progressBar}
      </View>
      {bottomLabels}
    </View>
  );
};
