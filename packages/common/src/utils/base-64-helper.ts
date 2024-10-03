// Copyright 2018 Prescryptive Health, Inc.

export const encodeAscii = (ascii: string) =>
  Buffer.from(ascii).toString('base64');

export const decodeAscii = (ascii: string) =>
  Buffer.from(ascii, 'base64').toString('ascii');
