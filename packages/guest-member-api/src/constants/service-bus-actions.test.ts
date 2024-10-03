// Copyright 2018 Prescryptive Health, Inc.

import {
  ACTION_FINISH_PHONE_NUMBER_VERIFICATION,
  ACTION_UPDATE_ACCOUNT,
  ACTION_UPDATE_PERSON,
  ACTION_UPDATE_PERSON_CONTACT_INFORMATION,
} from './service-bus-actions';

describe('ACTION_FINISH_PHONE_NUMBER_VERIFICATION', () => {
  it('should be FinishPhoneNumberVerification', () => {
    expect(ACTION_FINISH_PHONE_NUMBER_VERIFICATION).toBe(
      'FinishPhoneNumberVerification'
    );
  });
});

describe('ACTION_UPDATE_PERSON_CONTACT_INFORMATION', () => {
  it('should be UpdatePersonContactInformation', () => {
    expect(ACTION_UPDATE_PERSON_CONTACT_INFORMATION).toBe(
      'UpdatePersonContactInformation'
    );
  });
});

describe('ACTION_UPDATE_PERSON', () => {
  it('should be PersonUpdate', () => {
    expect(ACTION_UPDATE_PERSON).toBe('PersonUpdate');
  });
});

describe('ACTION_UPDATE_ACCOUNT', () => {
  it('should be UpdateAccountPin', () => {
    expect(ACTION_UPDATE_ACCOUNT).toBe('UpdateAccount');
  });
});
