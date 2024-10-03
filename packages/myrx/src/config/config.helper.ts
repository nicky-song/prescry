// Copyright 2022 Prescryptive Health, Inc.

import Constants from 'expo-constants';

export type IConfigObject<K extends string> = Record<K, string>;

export const loadConfig = <TKeys extends { [key: string]: string }>(
  config: { [key in keyof TKeys]: string },
  map: Map<string, string>,
  document?: Document,
  manifestExtra?: Record<string, string>
): void => {
  Object.keys(config).forEach((key) => {
    const envKey = map.get(key);
    if (envKey) {
      const value = getMetaEnvironmentVariable(
        envKey,
        config[key],
        document,
        manifestExtra
      );
      config[key as keyof TKeys] = value;
    }
  });
};

export const getMetaEnvironmentVariable = (
  name: string,
  fallback: string,
  document: Document = window.document,
  manifestExtra: Record<string, string> = Constants.manifest?.extra as Record<
    string,
    string
  >
): string => {
  const selector = document.querySelector(`meta[property="env:${name}"]`);
  if (selector) {
    const val = selector.getAttribute('content');
    if (val && val !== `$\{${name}}`) {
      return val;
    }
  }

  const envValue = manifestExtra[`REACT_APP_CONFIG_${name}`];
  return neitherNullNorEmpty(envValue, fallback);
};

export const neitherNullNorEmpty = (
  text: string | undefined,
  defaultText: string
): string => {
  return text && text.trim().length > 0 ? text : defaultText;
};
