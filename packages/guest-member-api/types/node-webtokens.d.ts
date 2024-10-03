// Copyright 2018 Prescryptive Health, Inc.

declare module 'node-webtokens' {
  interface error {
    message: string;
  }

  interface verifyResponse<T> {
    expired?: string;
    error?: error;
    payload: T;
  }

  interface parseResponse<T> {
    error?: error;
    verify: (token: string) => verifyResponse<T>;
  }

  export function generate(
    keyManagementAlgo: string,
    contentEncryptionAlgo: string,
    payload: Object,
    key: string
  ): string;

  export function parse<T>(token: string): parseResponse<T>;
}
