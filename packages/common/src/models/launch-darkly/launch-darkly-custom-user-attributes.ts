// Copyright 2022 Prescryptive Health, Inc.

type fieldKeys =
  | 'rxGroup'
  | 'rxSubGroup'
  | 'rxGroupType'
  | 'brokerAssociation'
  | 'state';

export type ILaunchDarklyCustomUserAttributes = Record<fieldKeys, string>;
