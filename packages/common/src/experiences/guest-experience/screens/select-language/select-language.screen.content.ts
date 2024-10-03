// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../models/language';

export interface ISelectLanguageScreenContent {
  selectLanguageTitle: string;
}

export const selectLanguageOptions: [Language, string][] = [
  ['English', 'English'],
  ['Spanish', 'Español'],
  ['Vietnamese', 'tiếng Việt'],
];
