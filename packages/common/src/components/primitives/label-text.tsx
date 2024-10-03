// Copyright 2019 Prescryptive Health, Inc.

import React from 'react';
import { DefaultText, IDefaultTextProps } from './default-text';

export const LabelText = (
  props: Omit<IDefaultTextProps, 'accessibilityRole'>
) => <DefaultText accessibilityRole='label' {...props} />;
