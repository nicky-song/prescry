// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { DefaultView, IDefaultViewProps } from './default-view';

export const ListItem = (
  props: Omit<IDefaultViewProps, 'accessibilityRole'>
): ReactElement => <DefaultView accessibilityRole='listitem' {...props} />;
