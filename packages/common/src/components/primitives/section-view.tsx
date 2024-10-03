// Copyright 2019 Prescryptive Health, Inc.

import React from 'react';
import { DefaultView, IDefaultViewProps } from './default-view';

export const SectionView = (
  props: Omit<IDefaultViewProps, 'accessibilityRole'>
) => <DefaultView accessibilityRole='region' {...props} />;
