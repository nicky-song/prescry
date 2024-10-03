// Copyright 2022 Prescryptive Health, Inc.

export type Language = 'English' | 'Spanish' | 'Vietnamese';
export type LanguageSelection = Language | 'current' | 'default';
export type LanguageCode = 'en' | 'es' | 'es-us' | 'vi';

export const defaultLanguageCode: LanguageCode = 'en';
export const defaultLanguage: Language = 'English';

export const LanguageCodeMap: Map<Language, LanguageCode> = new Map([
  ['English', 'en'],
  ['Spanish', 'es'],
  ['Vietnamese', 'vi'],
]);
