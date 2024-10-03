// Copyright 2022 Prescryptive Health, Inc.

import { LanguageCode } from '../../../../../models/language';
import { setLanguageCodeAction } from '../actions/set-language-code.action';
import { setLanguageCodeDispatch } from './set-language-code.dispatch';

describe('setLanguageCodeDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();
    const languageCodeMock: LanguageCode = 'es';

    setLanguageCodeDispatch(dispatchMock, languageCodeMock);

    const expectedAction = setLanguageCodeAction(languageCodeMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
