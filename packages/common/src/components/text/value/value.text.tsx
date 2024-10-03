// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import {
  BaseText,
  BaseTextWeight,
  IBaseTextProps,
} from '../base-text/base-text';
import { ProtectedBaseText } from '../protected-base-text/protected-base-text';
import { TranslatableBaseText } from '../translated-base-text/translatable-base-text';

export interface IValueTextProps
  extends Omit<IBaseTextProps, 'weight' | 'size' | 'inheritStyle'> {
  children: ReactNode;
  translateContent?: boolean;
}
export const ValueText = ({
  translateContent,
  ...props
}: IValueTextProps): ReactElement => {
  const weight: BaseTextWeight = 'semiBold';

  if (translateContent === undefined) {
    return <BaseText weight={weight} {...props} />;
  }

  return translateContent ? (
    <TranslatableBaseText weight={weight} {...props} />
  ) : (
    <ProtectedBaseText weight={weight} {...props} />
  );
};
