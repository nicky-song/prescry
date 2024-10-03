// Copyright 2022 Prescryptive Health, Inc.

import { ISessionState } from '../session.state';
import { setCurrentLanguageAction } from './set-current-language.action';

describe('setCurrentLanguageAction', () => {
  it('returns action', () => {
    const currentLanguageMock = 'English';

    const action = setCurrentLanguageAction(currentLanguageMock);

    expect(action.type).toEqual('SET_CURRENT_LANGUAGE');

    const expectedPayload: Partial<ISessionState> = {
      currentLanguage: currentLanguageMock,
    };
    expect(action.payload).toEqual(expectedPayload);
  });
});
