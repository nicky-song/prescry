// Copyright 2019 Prescryptive Health, Inc.

import React from 'react';
import { DefaultText, IDefaultTextProps } from './default-text';
import { ProtectedDefaultText } from './protected-default-text';
import { TranslatableDefaultText } from './translatable-default-text';

export interface IHeadingTextProps
  extends Omit<IDefaultTextProps, 'accessibilityRole'> {
  level?: number;
  translateContent?: boolean;
}

export const HeadingText = ({ level = 1, ...props }: IHeadingTextProps) => {
  return props.translateContent === undefined ? (
    <DefaultText accessibilityRole='heading' aria-level={level} {...props} />
  ) : props.translateContent ? (
    <TranslatableDefaultText
      accessibilityRole='heading'
      aria-level={level}
      {...props}
    />
  ) : (
    <ProtectedDefaultText
      accessibilityRole='heading'
      aria-level={level}
      {...props}
    />
  );
};
