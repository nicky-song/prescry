// Copyright 2021 Prescryptive Health, Inc.

export interface IUIContent {
  fieldKey: string;
  language: string;
  value: string;
  type: string;
}

export interface IUIContentGroup {
  content: IUIContent[];
  lastUpdated: number;
  isContentLoading: boolean;
}
