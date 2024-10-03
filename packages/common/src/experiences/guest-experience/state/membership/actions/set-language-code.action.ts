// Copyright 2022 Prescryptive Health, Inc.

import { LanguageCode } from '../../../../../models/language';
import { IMembershipAction } from './membership.action';

export type ISetLanguageCodeAction =
  IMembershipAction<'SET_LANGUAGE_CODE', LanguageCode>;

export const setLanguageCodeAction = (
  languageCode: LanguageCode
): ISetLanguageCodeAction => ({
  payload: languageCode,
  type: 'SET_LANGUAGE_CODE',
});
