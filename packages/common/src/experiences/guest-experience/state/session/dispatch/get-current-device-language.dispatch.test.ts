// Copyright 2022 Prescryptive Health, Inc.

import { getCurrentUserLanguage } from '../../../../../utils/translation/get-current-user-language.helper';
import { defaultMembershipState } from '../../membership/membership.state';
import { setCurrentLanguageAction } from '../actions/set-current-language.action';
import { getCurrentDeviceLanguageDispatch } from './get-current-device-language.dispatch';

jest.mock('../../../../../utils/translation/get-current-user-language.helper');
const getCurrentUserLanguageMock = getCurrentUserLanguage as jest.Mock;

jest.mock('../actions/set-current-language.action');

describe('getCurrentDeviceLanguageDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getCurrentUserLanguageMock.mockResolvedValue('English');
  });

  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    const currentLanguageMock = 'English';
    getCurrentDeviceLanguageDispatch(dispatchMock, defaultMembershipState);

    const expectedAction = setCurrentLanguageAction(currentLanguageMock);
    expect(getCurrentUserLanguageMock).toHaveBeenCalledWith(
      defaultMembershipState
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
