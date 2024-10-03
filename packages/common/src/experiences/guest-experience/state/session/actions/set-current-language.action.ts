// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../../models/language';
import { ISessionAction } from './session.action';

export type ISetCurrentLanguageAction = ISessionAction<'SET_CURRENT_LANGUAGE'>;

export const setCurrentLanguageAction = (
  currentLanguage: Language
): ISetCurrentLanguageAction => ({
  type: 'SET_CURRENT_LANGUAGE',
  payload: {
    currentLanguage,
  },
});
