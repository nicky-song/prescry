// Copyright 2023 Prescryptive Health, Inc.

export class UnableToUseLocalStorageForLogin extends Error {
  constructor() {
    super(`Login can't be done using dedicated local storage for the Phone`);

    Object.setPrototypeOf(this, UnableToUseLocalStorageForLogin.prototype);
  }
}
