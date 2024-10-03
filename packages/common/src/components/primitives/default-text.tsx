// Copyright 2019 Prescryptive Health, Inc.

import React, { RefObject } from 'react';
import { Text, TextProps } from 'react-native';
import { AccessibilityRoleV2 } from './accessibility-role-v2';

export type IDefaultTextProps = {
  accessibilityRole?: AccessibilityRoleV2;
  children: React.ReactNode;
  textRef?: RefObject<Text>;
} & Omit<TextProps, 'accessibilityRole'>;

export const DefaultText = (props: IDefaultTextProps) => (
  <Text {...(props as TextProps)} ref={props.textRef}>
    {props.children}
  </Text>
);
