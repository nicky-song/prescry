// Copyright 2018 Prescryptive Health, Inc.

import { createHash } from 'crypto';
import { generateSHA256Hash, generateSHA512Hash } from './crypto.helper';

const mockHash = 'mock-hash';
const mockText = 'some-text';

jest.mock('crypto', () => ({
  createHash: jest.fn().mockImplementation(() => {
    return {
      digest: jest.fn().mockReturnValue(mockHash),
      update: jest.fn(),
    };
  }),
}));

describe('generateSHA256Hash test', () => {
  it('should call generateSHA256Hash with the text passed', () => {
    const hashVal = generateSHA256Hash(mockText);
    expect(createHash).toHaveBeenCalledWith('sha256');
    expect(hashVal).toEqual(mockHash);
  });
});

describe('generateSHA512Hash test', () => {
  it('should call generateSHA512Hash with the text passed', () => {
    const hashVal = generateSHA512Hash(mockText);
    expect(createHash).toHaveBeenCalledWith('sha512');
    expect(hashVal).toEqual(mockHash);
  });
});
