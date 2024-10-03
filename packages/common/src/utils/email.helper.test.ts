// Copyright 2018 Prescryptive Health, Inc.

import { isEmailValid } from './email.helper';

describe('isEmailValid()', () => {
  it('validates email address', () => {
    expect(isEmailValid('')).toEqual(false);
    expect(isEmailValid('user')).toEqual(false);
    expect(isEmailValid('user@')).toEqual(false);
    expect(isEmailValid('user@test')).toEqual(false);
    expect(isEmailValid('user@test.')).toEqual(false);
    expect(isEmailValid('@test.com')).toEqual(false);
    expect(isEmailValid('.com')).toEqual(false);
    expect(isEmailValid('usertest.com')).toEqual(false);
    expect(isEmailValid('user@test.com')).toEqual(true);
    expect(isEmailValid('"My Name"@is.valid.email.com')).toEqual(false);
    expect(isEmailValid('MyName@is.valid.email.com')).toEqual(true);
    expect(isEmailValid('sdfdsfd#$sf@test.com')).toEqual(false);
    expect(isEmailValid('firstname+lastname@example.com')).toEqual(true);
    expect(isEmailValid('contact@email.io')).toEqual(true);
  });
});
