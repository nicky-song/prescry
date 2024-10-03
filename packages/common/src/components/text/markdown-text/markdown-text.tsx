// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactNode } from 'react';
import { ColorValue, TextStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { SkeletonWidth } from '../../../theming/fonts';
import { BaseText } from '../base-text/base-text';
import {
  IMarkdownTextStyles,
  markdownTextStyles,
} from './markdown-text.styles';

export interface IMarkdownTextProps {
  children: ReactNode;
  textStyle?: TextStyle;
  markdownTextStyle?: IMarkdownTextStyles;
  color?: ColorValue;
  onLinkPress?: (url: string) => boolean;
  isSkeleton?: boolean;
  skeletonWidth?: SkeletonWidth;
  testID?: string;
}

export const MarkdownText = ({
  textStyle,
  markdownTextStyle,
  color,
  onLinkPress,
  isSkeleton,
  skeletonWidth = 'long',
  testID,
  ...props
}: IMarkdownTextProps) => {
  const styles = { ...markdownTextStyles };
  if (color) {
    (styles as IMarkdownTextStyles).paragraph = { ...styles.paragraph, color };
  }

  return (
    <BaseText
      style={textStyle}
      isSkeleton={isSkeleton}
      skeletonWidth={skeletonWidth}
      testID={testID}
    >
      <Markdown
        onLinkPress={onLinkPress}
        style={markdownTextStyle ?? styles}
        {...props}
      />
    </BaseText>
  );
};
