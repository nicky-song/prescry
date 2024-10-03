// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { BaseText, IBaseTextProps } from '../base-text/base-text';

export interface ISubtitleTextProps
  extends Omit<IBaseTextProps, 'weight' | 'size' | 'inheritStyle'> {
  children: ReactNode;
}

export const SubtitleText = ({
  children,
  ...props
}: ISubtitleTextProps): ReactElement => {
  return (
    <BaseText size='small' {...props}>
      {children}
    </BaseText>
  );
};
