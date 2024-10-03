// Copyright 2018 Prescryptive Health, Inc.

import { compare, genSalt, hash } from 'bcryptjs';
import {
  compareHashValue,
  generateHash,
  generateSalt,
} from './bcryptjs-helper';

jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockReturnValue(Promise.resolve(true)),
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

const genSaltMock = genSalt as jest.Mock;

const mockKey = 'mock-key';
const mockHash = 'mock-hash';

describe('generateSalt', () => {
  it('should call genSaltSync with saltRound', async () => {
    await generateSalt();
    expect(genSaltMock).toHaveBeenCalledWith(10);
  });
});

describe('generateHash', () => {
  it('should call generateHash with ', async () => {
    await generateHash(mockKey);
    expect(hash).toHaveBeenCalledWith(mockKey, 10);
  });
});

describe('compareHashValue', () => {
  it('should call compareHashValue', async () => {
    expect(await compareHashValue(mockKey, mockHash)).toBeTruthy();
    expect(compare).toHaveBeenCalledWith(mockKey, mockHash);
  });
});
