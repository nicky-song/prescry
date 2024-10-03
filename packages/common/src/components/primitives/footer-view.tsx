// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { DefaultView, IDefaultViewProps } from './default-view';

export const FooterView = (
  props: Omit<IDefaultViewProps, 'accessibilityRole'>
) => <DefaultView accessibilityRole='contentinfo' {...props} />;
