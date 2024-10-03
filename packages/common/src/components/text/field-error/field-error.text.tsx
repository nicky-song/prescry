// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { BaseText, IBaseTextProps } from '../base-text/base-text';
import { fieldErrorTextStyle } from './field-error.text.style';

export interface IFieldErrorTextProps
  extends Omit<IBaseTextProps, 'weight' | 'size' | 'inheritStyle'> {
  children: ReactNode;
}
export const FieldErrorText = ({
  children,
  style,
  ...props
}: IFieldErrorTextProps): ReactElement => {
  const defaultStyle = fieldErrorTextStyle.textStyle;
  return (
    <BaseText
      weight='medium'
      size='small'
      style={[defaultStyle, style]}
      {...props}
    >
      {children}
    </BaseText>
  );
};
