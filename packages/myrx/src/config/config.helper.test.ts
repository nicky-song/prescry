// Copyright 2022 Prescryptive Health, Inc.

import {
  getMetaEnvironmentVariable,
  loadConfig,
  neitherNullNorEmpty,
} from './config.helper';

const getAttribute = jest.fn();
const querySelectorMock = jest.fn();
const elementMock = {
  getAttribute,
};

const documentMock = {
  querySelector: querySelectorMock,
} as unknown as Document;

describe('getMetaEnvironmentVariable', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    querySelectorMock.mockRejectedValue(elementMock);
  });

  it.each([
    ['defaultValue', {}, 'defaultValue'],
    ['defaultValue', { TEST: 'test' }, 'defaultValue'],
    ['defaultValue', { REACT_APP_CONFIG_TEST: 'test' }, 'test'],
  ])(
    'returns default value if name is not found (default: %p; manifestExtra: %p)',
    (
      defaultValue: string,
      manifestExtra: Record<string, string>,
      expectedValue: string
    ) => {
      querySelectorMock.mockReturnValue(null);
      const result = getMetaEnvironmentVariable(
        'TEST',
        defaultValue,
        documentMock,
        manifestExtra
      );
      expect(result).toEqual(expectedValue);
      expect(querySelectorMock).toHaveBeenNthCalledWith(
        1,
        'meta[property="env:TEST"]'
      );
    }
  );

  it.each([
    ['defaultValue', {}, 'defaultValue'],
    ['defaultValue', { TEST: 'test' }, 'defaultValue'],
    ['defaultValue', { REACT_APP_CONFIG_TEST: 'test' }, 'test'],
  ])(
    'returns default value if Template has not been replaced (default: %p; manifestExtra: %p)',
    (
      defaultValue: string,
      manifestExtra: Record<string, string>,
      expectedValue: string
    ) => {
      querySelectorMock.mockReturnValue(elementMock);
      elementMock.getAttribute.mockReturnValue('${TEST}');
      const result = getMetaEnvironmentVariable(
        'TEST',
        defaultValue,
        documentMock,
        manifestExtra
      );
      expect(result).toEqual(expectedValue);
      expect(querySelectorMock).toHaveBeenNthCalledWith(
        1,
        'meta[property="env:TEST"]'
      );
      expect(elementMock.getAttribute).toHaveBeenNthCalledWith(1, 'content');
    }
  );

  it('returns the value if the key is found and the env has been inserted into the template', () => {
    querySelectorMock.mockReturnValue(elementMock);
    elementMock.getAttribute.mockReturnValue('VALUE!!!');
    const result = getMetaEnvironmentVariable(
      'TEST',
      'defaultValue',
      documentMock,
      {}
    );
    expect(result).toEqual('VALUE!!!');
    expect(querySelectorMock).toHaveBeenNthCalledWith(
      1,
      'meta[property="env:TEST"]'
    );
    expect(elementMock.getAttribute).toHaveBeenNthCalledWith(1, 'content');
  });
});

describe('loadConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    querySelectorMock.mockRejectedValue(elementMock);
  });

  it('updates config values', () => {
    const config = {
      key1: 'expected-key1-default-value',
      key2: 'should be value from process.env.REACT_APP_CONFIG_key2',
      key3: 'should be value from querySelector(key3).getAttribute(content)',
    };
    const configExpected = {
      key1: config.key1,
      key2: 'expected-key2-from-PROCESS.ENV',
      key3: 'expected-key3-from-META-TAG',
    };

    querySelectorMock.mockImplementation((key) => {
      if (key === 'meta[property="env:ENV_key3"]') {
        getAttribute.mockReturnValueOnce(configExpected.key3);
        return { getAttribute };
      }
      return null;
    });
    const map = new Map<string, string>([
      ['key1', 'ENV_key1'],
      ['key2', 'ENV_key2'],
      ['key3', 'ENV_key3'],
    ]);
    const manifestExtra = {
      REACT_APP_CONFIG_ENV_key2: configExpected.key2,
    };

    loadConfig(config, map, documentMock, manifestExtra);

    expect(config).toMatchObject(configExpected);
    expect(querySelectorMock).toHaveBeenNthCalledWith(
      1,
      'meta[property="env:ENV_key1"]'
    );
    expect(querySelectorMock).toHaveBeenNthCalledWith(
      2,
      'meta[property="env:ENV_key2"]'
    );
    expect(querySelectorMock).toHaveBeenNthCalledWith(
      3,
      'meta[property="env:ENV_key3"]'
    );

    expect(getAttribute).toHaveBeenNthCalledWith(1, 'content');
  });
});

describe('neitherNullNorEmpty', () => {
  it('should default when null or empty', () => {
    expect(neitherNullNorEmpty('', 'defaulted')).toEqual('defaulted');
    expect(neitherNullNorEmpty(' ', 'defaulted')).toEqual('defaulted');
    expect(neitherNullNorEmpty(undefined, 'defaulted')).toEqual('defaulted');
    expect(neitherNullNorEmpty('\n', 'defaulted')).toEqual('defaulted');
    expect(neitherNullNorEmpty('\t', 'defaulted')).toEqual('defaulted');
    expect(neitherNullNorEmpty(null as unknown as string, 'defaulted')).toEqual(
      'defaulted'
    );
  });

  it('should return value when not null and not empty', () => {
    expect(neitherNullNorEmpty('x', 'defaulted')).toEqual('x');
    expect(neitherNullNorEmpty('xx', 'defaulted')).toEqual('xx');
    expect(neitherNullNorEmpty('_', 'defaulted')).toEqual('_');
    expect(neitherNullNorEmpty('  _  ', 'defaulted')).toEqual('  _  ');
  });
});
