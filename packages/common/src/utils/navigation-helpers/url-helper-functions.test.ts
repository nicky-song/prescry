// Copyright 2021 Prescryptive Health, Inc.

import { goToUrl } from '../link.helper';
import {
  goToPrivacyPolicyUrl,
  goToTermsAndConditionsUrl,
} from './url-helper-functions';

jest.mock('../link.helper');
const goToUrlMock = goToUrl as jest.Mock;

describe('goToTermsAndConditionsUrl', () => {
  beforeEach(() => {
    goToUrlMock.mockReset();
  });
  it('calls goToUrl', async () => {
    await goToTermsAndConditionsUrl();
    const expectedUrl = 'https://prescryptive.com/terms-of-use/';
    expect(goToUrlMock).toHaveBeenCalledWith(expectedUrl);
  });
});

describe('goToPrivacyPolicyUrl', () => {
  beforeEach(() => {
    goToUrlMock.mockReset();
  });
  it('calls GuestExperienceNavigation.openWebView', async () => {
    await goToPrivacyPolicyUrl();
    const expectedUrl = 'https://prescryptive.com/privacy-policy/';
    expect(goToUrlMock).toHaveBeenCalledWith(expectedUrl);
  });
});
