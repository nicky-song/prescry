// Copyright 2021 Prescryptive Health, Inc.

import { TextProps, Platform } from 'react-native';
import React, { ReactElement, ReactNode } from 'react';
import { HeadingText } from '../../primitives/heading-text';
import {
  headingGradientStyles,
  headingWebLargeTextStyle,
  headingWebSmallTextStyle,
} from './heading.gradient.styles';
import { useMediaQueryContext } from '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook';

export type BaseTextSize = 'extraLarge' | 'extraExtraLarge';

export interface IHeadingGradientProps extends TextProps {
  children: ReactNode;
}

export const HeadingGradient = ({
  children,
  ...props
}: IHeadingGradientProps): ReactElement => {
  const { mediaSize } = useMediaQueryContext();

  const headingWebTextStyle =
    mediaSize === 'small' ? headingWebSmallTextStyle : headingWebLargeTextStyle;

  const headingRender =
    Platform.OS === 'web' ? (
      <h1 style={headingWebTextStyle}>{children}</h1>
    ) : (
      <HeadingText style={headingGradientStyles.headingTextStyle} {...props}>
        {children}
      </HeadingText>
    );

  return headingRender;
};
