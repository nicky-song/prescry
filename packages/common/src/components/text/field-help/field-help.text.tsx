// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { BaseText, IBaseTextProps } from '../base-text/base-text';

export interface IFieldHelpTextProps
  extends Omit<IBaseTextProps, 'weight' | 'size' | 'inheritStyle'> {
  children: ReactNode;
}
export const FieldHelpText = ({
  children,
  style,
  ...props
}: IFieldHelpTextProps): ReactElement => {
  return (
    <BaseText size='small' style={style} {...props}>
      {children}
    </BaseText>
  );
};
