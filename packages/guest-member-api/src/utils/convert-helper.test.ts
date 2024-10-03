// Copyright 2018 Prescryptive Health, Inc.

import { convertBase64ToBinary } from './convert-helper';

describe('convertBase64ToBinary()', () => {
  it('expect regular buffer.from to fail to produce expected string when base64 string has literal slash n', () => {
    const desired =
      'This is a really long line that will cause base64 echo to create a line break in it';
    const expectedBad =
      'This is a really long line that will cause base64 echo to���ɕ�є���������ɕ��������';
    const actualBase64VersionWithLiteralLineBreak =
      'VGhpcyBpcyBhIHJlYWxseSBsb25nIGxpbmUgdGhhdCB3aWxsIGNhdXNlIGJhc2U2NCBlY2hvIHRv\\nIGNyZWF0ZSBhIGxpbmUgYnJlYWsgaW4gaXQK';
    const buffer = Buffer.from(
      actualBase64VersionWithLiteralLineBreak,
      'base64'
    );
    const backToString = buffer.toString().trim();
    expect(backToString).not.toBe(desired);
    expect(backToString).toBe(expectedBad);
  });

  it('expect can convert base64 string with literal line breaks into buffer', () => {
    const expected =
      'This is a really long line that will cause base64 echo to create a line break in it';
    const base64StringWithLiteralLineBreaks =
      'VGhpcyBpcyBhIHJlYWxseSBsb25nIGxpbmUgdGhhdCB3aWxsIGNhdXNlIGJhc2U2NCBlY2hvIHRv\\nIGNyZWF0ZSBhIGxpbmUgYnJlYWsgaW4gaXQK';

    expect(base64StringWithLiteralLineBreaks.length).toBe(114);
    const buffer = convertBase64ToBinary(base64StringWithLiteralLineBreaks);

    expect(buffer.length).toBe(84);
    expect(buffer.toString().trim()).toBe(expected);
  });

  it('expect can convert base64 string with normal line break into buffer', () => {
    const expected =
      'This is a really long line that will cause base64 echo to create a line break in it';
    const base64StringWithNormalLineBreak = `VGhpcyBpcyBhIHJlYWxseSBsb25nIGxpbmUgdGhhdCB3aWxsIGNhdXNlIGJhc2U2NCBlY2hvIHRv
      IGNyZWF0ZSBhIGxpbmUgYnJlYWsgaW4gaXQK`;

    expect(base64StringWithNormalLineBreak.length).toBe(119);
    const buffer = convertBase64ToBinary(base64StringWithNormalLineBreak);
    expect(buffer.length).toBe(84);
    expect(buffer.toString().trim()).toBe(expected);
  });
});
