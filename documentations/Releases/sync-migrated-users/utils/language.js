// Copyright 2023 Prescryptive Health, Inc.

const language = {
  en: 'English', es: 'Spanish', vi: 'Vietnamese'
}

export const LANGUAGE_SYSTEM = 'urn:ietf:bcp:47';

export const languageMap = (langCode) => {
  return langCode ? language[langCode] : '';
}