// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactNode } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { SkeletonWidth } from '../../../theming/fonts';
import { getSkeletonFontSize } from '../../../utils/get-skeleton-font-size.helper';
import { getSkeletonWidth } from '../../../utils/get-skeleton-width.helper';
import { HeadingText } from '../../primitives/heading-text';
import { SkeletonBone } from '../../primitives/skeleton-bone';
import { headingStyles } from './heading.styles';

export interface IHeadingProps {
  children: ReactNode;
  level?: number;
  textStyle?: StyleProp<TextStyle>;
  isSkeleton?: boolean;
  skeletonWidth?: SkeletonWidth;
  translateContent?: boolean;
  testID?: string;
}

export const Heading = ({
  children,
  level: propsLevel = 1,
  textStyle,
  isSkeleton,
  skeletonWidth,
  translateContent,
  testID,
}: IHeadingProps) => {
  const { headingTextStyle } = headingStyles;

  const level = getLevelOrDefault(propsLevel, headingTextStyle.length);

  const skeletonHeight = isSkeleton
    ? getSkeletonFontSize(textStyle, headingTextStyle[level - 1])
    : undefined;

  const containerStyle = isSkeleton
    ? [headingTextStyle[level - 1], textStyle]
    : [];

  const layoutStyleList = isSkeleton
    ? [{ width: getSkeletonWidth(skeletonWidth), height: skeletonHeight }]
    : [];

  const skeleton = (
    <SkeletonBone
      containerViewStyle={containerStyle}
      layoutViewStyleList={layoutStyleList}
    />
  );

  return isSkeleton ? (
    skeleton
  ) : (
    <HeadingText
      level={level}
      translateContent={translateContent}
      style={[headingTextStyle[level - 1], textStyle]}
      testID={testID}
    >
      {children}
    </HeadingText>
  );
};

function getLevelOrDefault(level = 0, maxLevel: number): number {
  if (level < 1) {
    return 1;
  }

  return level > maxLevel ? maxLevel : level;
}
