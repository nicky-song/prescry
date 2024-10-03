// Copyright 2022 Prescryptive Health, Inc.

import { Language } from '../../../../../models/language';
import { setCurrentLanguageAction } from '../actions/set-current-language.action';
import { SessionDispatch } from './session.dispatch';

export const setCurrentLanguageDispatch = (
  dispatch: SessionDispatch,
  currentLanguage: Language
): void => {
  dispatch(setCurrentLanguageAction(currentLanguage));
};
