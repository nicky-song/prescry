// Copyright 2022 Prescryptive Health, Inc.

import { LanguageCode } from '../../../../../models/language';
import { setLanguageCodeAction } from '../actions/set-language-code.action';
import { MembershipDispatch } from './membership.dispatch';

export const setLanguageCodeDispatch = (
  dispatch: MembershipDispatch,
  languageCode: LanguageCode
): void => dispatch(setLanguageCodeAction(languageCode));
