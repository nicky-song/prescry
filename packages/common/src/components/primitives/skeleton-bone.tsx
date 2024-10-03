// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content';
import { GrayScaleColor } from '../../theming/colors';

export interface ISkeletonProps {
  skeletonViewStyle: ViewStyle;
  isSkeleton?: boolean;
}

export interface ISkeletonBoneProps {
  containerViewStyle: StyleProp<ViewStyle>;
  layoutViewStyleList: ViewStyle[];
  boneColor?: string;
  highlightColor?: string;
}
export const SkeletonBone = ({
  containerViewStyle,
  layoutViewStyleList,
  boneColor,
  highlightColor,
}: ISkeletonBoneProps) => {
  return (
    <SkeletonContent
      containerStyle={containerViewStyle}
      boneColor={boneColor ?? GrayScaleColor.lightGray}
      highlightColor={highlightColor ?? GrayScaleColor.white}
      animationType='shiver'
      isLoading={true}
      layout={layoutViewStyleList}
    />
  );
};
