// Copyright 2021 Prescryptive Health, Inc.

export const RegexPhone = /^\+(1|52|91)(\d{10})$/;

export const isPhoneNumberValid = (phoneNumber: string) => {
  return RegexPhone.test((phoneNumber || '').trim());
};
