// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { BaseText, IBaseTextProps } from '../base-text/base-text';
import { confirmedAmountTextStyle } from './confirmed-amount.text.style';

export interface IConfirmedAmountTextProps
  extends Omit<IBaseTextProps, 'weight' | 'size' | 'inheritStyle'> {
  children: ReactNode;
  isSkeleton?: boolean;
}

export const ConfirmedAmountText = ({
  children,
  style,
  isSkeleton,
  ...props
}: IConfirmedAmountTextProps): ReactElement => {
  const defaultStyle = confirmedAmountTextStyle.textStyle;

  return (
    <BaseText
      style={[defaultStyle, style]}
      {...props}
      isSkeleton={isSkeleton}
      skeletonWidth='short'
    >
      {children}
    </BaseText>
  );
};
