// Copyright 2023 Prescryptive Health, Inc.

import { encodeAscii } from './base-64-helper';
import { unlink, access } from 'fs/promises';
import { constants } from 'fs';

export const getLocalStorageName = (
  phoneNumberDialingCode: string,
  phoneNumber: string
) =>
  `storage-state-${encodeAscii(phoneNumberDialingCode + phoneNumber).replace(
    '/',
    '_'
  )}.json`;

export const getAppSettings = (
  origins: Array<{
    origin: string;
    localStorage: Array<{
      name: string;
      value: string;
    }>;
  }>,
  originSearched: string,
  localStorageSettingsKey: string
) => {
  const originLocalStorage = origins.find((o) => o.origin === originSearched);

  if (originLocalStorage === undefined) return;

  const appSettings = originLocalStorage.localStorage.find(
    (l) => l.name === localStorageSettingsKey
  );

  if (appSettings === undefined) return;

  const appSettingValue = JSON.parse(appSettings.value);
  return appSettingValue;
};

export const removeLocalStorage = async (
  phoneNumberDialingCode: string,
  phoneNumber: string
) => {
  const localStorageName = getLocalStorageName(
    phoneNumberDialingCode,
    phoneNumber
  );
  try {
    await access(localStorageName, constants.F_OK);
    await unlink(localStorageName);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw new Error(
        `Failed to remove local storage for ${
          phoneNumberDialingCode + phoneNumber
        }`
      );
    }
  }
};
