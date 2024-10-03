// Copyright 2022 Prescryptive Health, Inc.

import {
  defaultMembershipState,
  IMembershipState,
} from '../../experiences/guest-experience/state/membership/membership.state';
import { getContentLanguage } from './get-content-language.helper';
import { getCurrentLanguage } from './get-current-device-language.helper';
import { getCurrentUserLanguage } from './get-current-user-language.helper';
import { getQueryLanguage } from './get-query-language.helper';

jest.mock('./get-query-language.helper');
const getQueryLanguageMock = getQueryLanguage as jest.Mock;

jest.mock('./get-content-language.helper');
const getContentLanguageMock = getContentLanguage as jest.Mock;

jest.mock('./get-current-device-language.helper');
const getCurrentLanguageMock = getCurrentLanguage as jest.Mock;

const languageMock = 'language-mock';
const membershipStateMock: IMembershipState = {
  ...defaultMembershipState,
  account: { ...defaultMembershipState.account, languageCode: 'en' },
};

describe('getCurrentUserLanguage', () => {
  beforeEach(() => {
    getQueryLanguageMock.mockReturnValue(undefined);
  });
  it('returns queryLanguage if provided', () => {
    getQueryLanguageMock.mockReset();
    getQueryLanguageMock.mockReturnValue(languageMock);
    const result = getCurrentUserLanguage();
    expect(result).toEqual(languageMock);
  });

  it('returns membershipLanguage if queryLanguage not provided', () => {
    getContentLanguageMock.mockReturnValue(languageMock);
    const result = getCurrentUserLanguage(membershipStateMock);
    expect(result).toEqual(languageMock);
  });

  it('returns getCurrentLanguage result if queryLanguage or membershipLanguage not provided', () => {
    getCurrentLanguageMock.mockReturnValue(languageMock);
    const result = getCurrentUserLanguage(defaultMembershipState);
    expect(result).toEqual(languageMock);
  });
});
