// Copyright 2022 Prescryptive Health, Inc.

import { setCurrentLanguageAction } from '../actions/set-current-language.action';
import { setCurrentLanguageDispatch } from './set-current-language.dispatch';

describe('setCurrentLanguageDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    const currentLanguageMock = 'English';
    setCurrentLanguageDispatch(dispatchMock, currentLanguageMock);

    const expectedAction = setCurrentLanguageAction(currentLanguageMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
