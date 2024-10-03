// Copyright 2019 Prescryptive Health, Inc.

import React from 'react';
import { DefaultView, IDefaultViewProps } from './default-view';

export const HeaderView = (
  props: Omit<IDefaultViewProps, 'accessibilityRole'>
) => <DefaultView accessibilityRole='banner' {...props} />;
