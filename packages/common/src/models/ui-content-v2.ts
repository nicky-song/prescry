// Copyright 2023 Prescryptive Health, Inc.

export interface ILocalization {
  locale: string;
  translation: string;
}

export interface IUIContent {
  key: string;
  localizations: ILocalization[];
}
