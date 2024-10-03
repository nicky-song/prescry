// Copyright 2021 Prescryptive Health, Inc.

import { AccessibilityRole } from 'react-native';

export type AccessibilityRoleV2 =
  | AccessibilityRole
  | 'banner'
  | 'contentinfo'
  | 'heading'
  | 'label'
  | 'list'
  | 'listitem'
  | 'main'
  | 'navigation'
  | 'region';
