// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { LabelText } from '../../primitives/label-text';
import { BaseText } from '../base-text/base-text';
import { ILabelStyle, labelStyle } from './label.style';
export type LabelPosition = 'above' | 'left' | 'right';

export interface ILabelProps {
  label: ReactNode;
  position?: LabelPosition;
  textStyle?: StyleProp<TextStyle>;
  viewStyle?: StyleProp<ViewStyle>;
  isRequired?: boolean;
  children: ReactNode;
  isSkeleton?: boolean;
}

export const Label = ({
  label,
  position = 'above',
  children,
  textStyle,
  viewStyle,
  isRequired,
  isSkeleton,
}: ILabelProps): ReactElement => {
  const styles = labelStyle;

  const defaultViewStyle = getDefaultViewStyle(position, styles);
  const defaultTextStyle = getDefaultTextStyle(position, styles);

  const requiredMark = isRequired ? (
    <BaseText weight='bold' style={labelStyle.requiredTextStyle}>
      *
    </BaseText>
  ) : null;

  return (
    <LabelText style={[defaultViewStyle, viewStyle]}>
      <BaseText
        weight='semiBold'
        style={[defaultTextStyle, textStyle]}
        isSkeleton={isSkeleton}
      >
        {label}
        {requiredMark}
      </BaseText>
      {children}
    </LabelText>
  );
};

const getDefaultViewStyle = (
  labelPosition: LabelPosition,
  styles: ILabelStyle
): ViewStyle => {
  switch (labelPosition) {
    case 'left':
      return styles.leftViewStyle;

    case 'right':
      return styles.rightViewStyle;

    default:
      return styles.aboveViewStyle;
  }
};

const getDefaultTextStyle = (
  labelPostion: LabelPosition,
  styles: ILabelStyle
): TextStyle => {
  switch (labelPostion) {
    case 'right':
      return styles.rightTextStyle;

    case 'left':
      return styles.leftTextStyle;

    default:
      return styles.aboveTextStyle;
  }
};
