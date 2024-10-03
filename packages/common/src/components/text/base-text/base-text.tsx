// Copyright 2021 Prescryptive Health, Inc.

import { Text, TextProps, TextStyle } from 'react-native';
import React, { ReactElement, ReactNode, RefObject } from 'react';
import { baseTextStyle, IBaseTextStyle } from './base-text.style';
import { SkeletonBone } from '../../primitives/skeleton-bone';
import { getSkeletonFontSize } from '../../../utils/get-skeleton-font-size.helper';
import { SkeletonWidth } from '../../../theming/fonts';
import { getSkeletonWidth } from '../../../utils/get-skeleton-width.helper';

export type BaseTextSize = 'small' | 'default' | 'large' | 'extraLarge';
export type BaseTextWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

export interface IBaseTextProps extends TextProps {
  inheritStyle?: boolean;
  weight?: BaseTextWeight;
  size?: BaseTextSize;
  children: ReactNode;
  isSkeleton?: boolean;
  skeletonWidth?: SkeletonWidth;
  textRef?: RefObject<Text>;
}

export const BaseText = ({
  children,
  size = 'default',
  weight = 'regular',
  inheritStyle,
  style,
  isSkeleton,
  skeletonWidth,
  textRef,
  ...props
}: IBaseTextProps): ReactElement => {
  const styles = baseTextStyle;

  const commonBaseTextStyle = inheritStyle
    ? undefined
    : styles.commonBaseTextStyle;

  const sizeTextStyle = inheritStyle
    ? undefined
    : getSizeTextStyle(styles, size);

  const weightTextStyle = inheritStyle
    ? undefined
    : getWeightTextStyle(styles, weight);

  const skeletonHeight = isSkeleton
    ? getSkeletonFontSize(style, sizeTextStyle)
    : undefined;

  const layoutStyleList = isSkeleton
    ? [{ width: getSkeletonWidth(skeletonWidth), height: skeletonHeight }]
    : [];

  const skeleton = (
    <SkeletonBone
      containerViewStyle={[
        commonBaseTextStyle,
        sizeTextStyle,
        weightTextStyle,
        style,
      ]}
      layoutViewStyleList={layoutStyleList}
    />
  );

  return isSkeleton ? (
    skeleton
  ) : (
    <Text
      {...props}
      ref={textRef}
      style={[commonBaseTextStyle, sizeTextStyle, weightTextStyle, style]}
    >
      {children}
    </Text>
  );
};

const getSizeTextStyle = (
  styles: IBaseTextStyle,
  size: BaseTextSize
): TextStyle => {
  const fontSizeMap = new Map<BaseTextSize, TextStyle>([
    ['small', styles.smallSizeTextStyle],
    ['default', styles.defaultSizeTextStyle],
    ['large', styles.largeSizeTextStyle],
    ['extraLarge', styles.extraLargeSizeTextStyle],
  ]);

  return fontSizeMap.get(size) ?? styles.defaultSizeTextStyle;
};

const getWeightTextStyle = (
  styles: IBaseTextStyle,
  weight: BaseTextWeight
): TextStyle => {
  const fontWeightMap = new Map<BaseTextWeight, TextStyle>([
    ['regular', styles.regularWeightTextStyle],
    ['medium', styles.mediumWeightTextStyle],
    ['semiBold', styles.semiBoldWeightTextStyle],
    ['bold', styles.boldWeightTextStyle],
  ]);

  return fontWeightMap.get(weight) ?? styles.regularWeightTextStyle;
};
