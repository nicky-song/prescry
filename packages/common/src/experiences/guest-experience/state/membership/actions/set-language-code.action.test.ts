// Copyright 2022 Prescryptive Health, Inc.

import { LanguageCode } from '../../../../../models/language';
import { setLanguageCodeAction } from './set-language-code.action';

describe('setLanguageCodeAction', () => {
  it('returns action', () => {
    const languageCodeMock: LanguageCode = 'es';

    const action = setLanguageCodeAction(languageCodeMock);
    expect(action.type).toEqual('SET_LANGUAGE_CODE');
    expect(action.payload).toEqual(languageCodeMock);
  });
});
