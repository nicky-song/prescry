// Copyright 2018 Prescryptive Health, Inc.

export const RegexEmail =
  /^[a-zA-Z0-9._+-]+@(([a-z0-9]+\.)*[a-zA-Z0-9.-])+\.[a-zA-Z]{2,4}$/;
export function isEmailValid(email: string): boolean {
  return RegexEmail.test(email);
}
