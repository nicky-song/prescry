// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewProps } from 'react-native';
import { AccessibilityRoleV2 } from './accessibility-role-v2';

export type IDefaultViewProps = {
  accessibilityRole?: AccessibilityRoleV2;
  children: React.ReactNode;
} & Omit<ViewProps, 'accessibilityRole'>;

export const DefaultView = (props: IDefaultViewProps) => (
  <View {...(props as ViewProps)}>{props.children}</View>
);
