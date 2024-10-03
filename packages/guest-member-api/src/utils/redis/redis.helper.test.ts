// Copyright 2018 Prescryptive Health, Inc.

import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import redis, { RetryStrategyOptions } from 'redis';
import { promisify } from 'util';
import { HealthController } from '../../controllers/health/health.controller';
import { logRedisEventInAppInsight } from '../custom-event-helper';
import {
  addKeyInRedis,
  deleteKeysInRedis,
  deviceTokenKeyExpiryIn,
  generateKey,
  getValueFromRedis,
  initializeRedisClient,
  logEvent,
  pinKeyExpiryIn,
  pinVerificationKeyExpiryIn,
  redisHostName,
  RedisKeys,
  redisPort,
  redisRetryStrategy,
  scanKeysInRedis,
  trackRedisEvents,
} from './redis.helper';
import { logger } from '../server-helper';

const getMock = jest.fn((_key: string, callBack) => callBack('data'));
const setExMock = jest.fn(
  (_key: string, _seconds: number, _value: string, callBack) => callBack('OK')
);
const scanMock = jest.fn((_pattern: string) => ['test1', 'test2', 'test3']);
const delMock = jest.fn((_key: string, callBack) => callBack());

const onMock = jest.fn().mockReturnThis();
jest.mock('redis', () => ({
  createClient: jest.fn().mockImplementation(() => {
    return {
      GET: getMock,
      SETEX: setExMock,
      on: onMock,
      SCAN: scanMock,
      DEL: delMock,
    };
  }),
}));

const promisifyMock = promisify as unknown as jest.Mock;

jest.mock('util', () => ({
  promisify: jest.fn().mockImplementation(() => {
    return {
      bind: jest.fn(),
    };
  }),
  deprecate: jest.fn(),
  inherits: jest.fn(),
}));

jest.mock('../server-helper', () => {
  return {
    logger: {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    },
  };
});

jest.mock('../custom-event-helper', () => ({
  logRedisEventInAppInsight: jest.fn(),
}));

const mockPort = 999;
const mockHostName = 'redis-host';
const mockAuthPass = 'redis-auth-pass';
const mockdeviceKeyExpiry = 10;
const mockPinKeyExpiry = 5;
const mockPinVerificationKeyExpiry = 30;
const mockData = {
  deviceToken: 'device-token',
  pinVerificationAttempt: 0,
};
const mockKey = 'key';
const mockRedisScanCountNumber = '1000';

const redisHelper = jest.requireActual('./redis.helper.ts');
redisHelper.redisHostName = mockHostName;
redisHelper.redisPort = mockPort;

const createClientMock = redis.createClient as jest.Mock;
const logRedisEventInAppInsightsMock = logRedisEventInAppInsight as jest.Mock;
const logWarn = logger.warn as jest.Mock;
const logInfo = logger.info as jest.Mock;
const logError = logger.error as jest.Mock;

beforeEach(() => {
  setExMock.mockReset();
  logRedisEventInAppInsightsMock.mockReset();
  logWarn.mockReset();
  logInfo.mockReset();
  logError.mockReset();
});

describe('redisRetryStrategy', () => {
  it('should return 1000 if error code is not `ECONNREFUSED` and attempt is less than 5', () => {
    const mockOptions = { attempt: 5 } as RetryStrategyOptions;
    expect(redisRetryStrategy(mockOptions)).toBe(1000);
  });

  it('should return MAX_ATTEMPTS_EXHAUSTED error and update HealthController if attempt > 5 ', () => {
    const mockOptions = { attempt: 6 } as RetryStrategyOptions;

    expect(redisRetryStrategy(mockOptions)).toEqual(
      new Error('REDIS_MAX_ATTEMPTS_EXHAUSTED')
    );
    expect(HealthController.failureReason).toEqual(
      ErrorConstants.REDIS_MAX_ATTEMPTS_EXHAUSTED
    );
    expect(HealthController.state).toEqual('failed');
  });

  it('should return CONNECTION_REFUSED error if error code is `ECONNREFUSED`', () => {
    const mockOptions = {
      attempt: 3,
      error: { code: 'ECONNREFUSED' },
    } as RetryStrategyOptions;

    const response = redisRetryStrategy(mockOptions);

    expect(response).toEqual(1000);
    expect(logger.warn).toHaveBeenCalledWith(
      'REDIS_CONNECTION_REFUSED, hostname: redis-host, port: 999, errorMessage : undefined'
    );
  });
});

describe('initializeRedisClient', () => {
  it('should set expiry time and calls createClient', () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisRetryStrategy = jest.fn();
    helper.trackRedisEvents = jest.fn();
    initializeRedisClient(
      mockPort,
      mockHostName,
      mockAuthPass,
      mockdeviceKeyExpiry,
      mockPinKeyExpiry,
      mockPinVerificationKeyExpiry,
      mockRedisScanCountNumber
    );
    expect(deviceTokenKeyExpiryIn).toBe(mockdeviceKeyExpiry);
    expect(pinKeyExpiryIn).toBe(mockPinKeyExpiry);
    expect(redisHostName).toBe(mockHostName);
    expect(redisPort).toBe(mockPort);
    expect(pinVerificationKeyExpiryIn).toBe(mockPinVerificationKeyExpiry);
    expect(createClientMock).toHaveBeenCalledWith(mockPort, mockHostName, {
      auth_pass: mockAuthPass,
      no_ready_check: true,
      prefix: 'myrx:',
      retry_strategy: redisRetryStrategy,
      tls: { servername: mockHostName },
    });
    expect(promisifyMock).toHaveBeenCalledTimes(4);
    expect(trackRedisEvents).toBeCalledTimes(1);
  });
});

describe('addKeyInRedis', () => {
  it('should call SETEX with device:key, expiry time and value if key type is DEVICE_KEY', async () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisSet = jest.fn();
    await addKeyInRedis(
      mockKey,
      mockData,
      mockdeviceKeyExpiry,
      RedisKeys.DEVICE_KEY
    );
    expect(helper.redisSet).toHaveBeenCalledWith(
      `device:${mockKey}`,
      mockdeviceKeyExpiry,
      '{"deviceToken":"device-token","pinVerificationAttempt":0}'
    );
  });

  it('should call SETEX with pin:key, expiry time and value if key type is PIN_KEY', async () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisSet = jest.fn();
    await addKeyInRedis(
      mockKey,
      mockData,
      mockdeviceKeyExpiry,
      RedisKeys.PIN_KEY
    );
    expect(helper.redisSet).toHaveBeenCalledWith(
      `pin:${mockKey}`,
      mockdeviceKeyExpiry,
      '{"deviceToken":"device-token","pinVerificationAttempt":0}'
    );
  });

  it('should return true if redisSet response is ok', async () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisSet = jest.fn().mockReturnValue('OK');
    const response = await addKeyInRedis(
      mockKey,
      mockData,
      mockdeviceKeyExpiry,
      RedisKeys.DEVICE_KEY
    );
    expect(response).toBeTruthy();
  });

  it('should return false if redisSet fails', async () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisSet = jest.fn();
    const response = await addKeyInRedis(
      mockKey,
      mockData,
      mockdeviceKeyExpiry,
      RedisKeys.DEVICE_KEY
    );
    expect(response).toBeFalsy();
  });
});

describe('scanKeysInRedis', () => {
  it('should return array of keys when redisScan is called with a pattern', async () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisScan = jest
      .fn()
      .mockReturnValueOnce(['0', ['test1', 'test2', 'test3']]);
    const response = await scanKeysInRedis('*:fake-number');

    expect(response).toEqual(['test1', 'test2', 'test3']);
  });

  it('should return paginated collection of keys when redisScan is called with a pattern', async () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisScan = jest
      .fn()
      .mockReturnValueOnce(['1', ['test1', 'test2', 'test3']])
      .mockReturnValue(['0', ['test4', 'test5', 'test6']]);
    const response = await scanKeysInRedis('*:fake-number');

    expect(response).toEqual([
      'test1',
      'test2',
      'test3',
      'test4',
      'test5',
      'test6',
    ]);
  });

  it('should return empty collection when redisScan fails', async () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisScan = jest.fn().mockReturnValueOnce(undefined);
    const response = await scanKeysInRedis('*:fake-number');

    expect(response).toEqual([]);
  });
});
describe('deleteKeysInRedis', () => {
  it('should call redisDel method when redisScan return keys', async () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisDel = jest.fn();
    helper.scanKeysInRedis = jest
      .fn()
      .mockReturnValueOnce(['test1', 'test2', 'test3']);
    await deleteKeysInRedis('*:fake-number');
    expect(helper.redisDel).toBeCalledTimes(3);
  });

  it('shouldnt call redisDel when NO keys returned from redisScan', async () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisDel = jest.fn();
    helper.scanKeysInRedis = jest.fn().mockReturnValueOnce([]);
    await deleteKeysInRedis('*:fake-number');
    expect(helper.redisDel).toBeCalledTimes(0);
  });
});

describe('getValueFromRedis', () => {
  it('should call GET with key and return parse data', async () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisGet = jest
      .fn()
      .mockReturnValueOnce(
        '{"deviceToken":"device-token","pinVerificationAttempt":0}'
      );
    const response = await getValueFromRedis(mockKey, RedisKeys.DEVICE_KEY);
    expect(helper.redisGet).toHaveBeenCalledWith('device:key');
    expect(response).toEqual({
      deviceToken: 'device-token',
      pinVerificationAttempt: 0,
    });
  });

  it('should set key in redis if data is not present and creator is defined', async () => {
    const helper = jest.requireActual('./redis.helper');
    helper.redisGet = jest.fn().mockReturnValueOnce(null);
    helper.redisSet = jest.fn(() => {
      return 'OK';
    });
    const mockCreator = jest.fn().mockReturnValueOnce('new value');

    const response = await getValueFromRedis(
      mockKey,
      RedisKeys.DEVICE_KEY,
      undefined,
      mockCreator,
      mockdeviceKeyExpiry
    );
    expect(helper.redisGet).toHaveBeenCalledWith('device:key');
    expect(helper.redisSet).toHaveBeenCalledWith(
      'device:key',
      10,
      JSON.stringify('new value')
    );
    expect(response).toBe('new value');
  });
});

describe('generateKey', () => {
  it('should return pin:key as key if key type is DEVICE_KEY', () => {
    expect(generateKey(mockKey, RedisKeys.PIN_KEY)).toBe(`pin:${mockKey}`);
  });

  it('should return device:key as key if key type is DEVICE_KEY', () => {
    expect(generateKey(mockKey, RedisKeys.DEVICE_KEY)).toBe(
      `device:${mockKey}`
    );
  });

  it('should return device:key:id as key if key type is DEVICE_KEY and id is passed as parameter', () => {
    expect(generateKey(mockKey, RedisKeys.DEVICE_KEY, 'id')).toBe(
      `device:${mockKey}:id`
    );
  });

  it('should return phone-number:registration:key as key if key type is PHONE_NUMBER_REGISTRATION_KEY', () => {
    expect(generateKey(mockKey, RedisKeys.PHONE_NUMBER_REGISTRATION_KEY)).toBe(
      `phone-number:registration:${mockKey}`
    );
  });

  it('should return pin-verification:key:id as key if key type is PIN_VERIFICATION_KEY', () => {
    expect(generateKey(mockKey, RedisKeys.PIN_VERIFICATION_KEY, 'id')).toBe(
      `pin-verification:${mockKey}:id`
    );
  });

  it('should return pharm:key as key if key type is NEARBY_PHARMACIES_KEY', () => {
    expect(generateKey(mockKey, RedisKeys.NEARBY_PHARMACIES_KEY)).toBe(
      `pharm:${mockKey}`
    );
  });
});

describe('logEvent', () => {
  const key = 'REDIS_CONNECTION_READY';

  it('should call logRedisEventInAppInsights and log message as warning if loglevel is `warn`', () => {
    logEvent(key, 'warn');
    expect(logger.warn).toHaveBeenCalledWith(
      'REDIS_CONNECTION_READY, hostname: redis-host, port: 999, errorMessage : undefined'
    );

    expect(logRedisEventInAppInsightsMock).toHaveBeenCalledWith(
      key,
      redisHostName,
      redisPort,
      'REDIS_CONNECTION_READY'
    );
  });

  it('should call logRedisEventInAppInsights and log message as info if loglevel is `info`', () => {
    logEvent(key, 'info');
    expect(logInfo).toHaveBeenCalledWith(
      'REDIS_CONNECTION_READY, hostname: redis-host, port: 999, errorMessage : undefined'
    );
    expect(logRedisEventInAppInsightsMock).toHaveBeenCalledWith(
      key,
      redisHostName,
      redisPort,
      'REDIS_CONNECTION_READY'
    );
  });

  it('should call logRedisEventInAppInsights and log message as error if loglevel is `error`', () => {
    logEvent(key, 'error');
    expect(logError).toHaveBeenCalledWith(
      'REDIS_CONNECTION_READY, hostname: redis-host, port: 999, errorMessage : undefined'
    );
    expect(logRedisEventInAppInsightsMock).toHaveBeenCalledWith(
      key,
      redisHostName,
      redisPort,
      'REDIS_CONNECTION_READY'
    );
  });

  it('should call logRedisEventInAppInsights and log the error message if error is unknown and message is passed', () => {
    const unknownError = 'unknown redis message';
    logEvent('REDIS_UNKNOWN_ERROR', 'error', unknownError);
    expect(logError).toHaveBeenCalledWith(
      `REDIS_UNKNOWN_ERROR, hostname: redis-host, port: 999, errorMessage : ${unknownError}`
    );
    expect(logRedisEventInAppInsightsMock).toHaveBeenCalledWith(
      'REDIS_UNKNOWN_ERROR',
      redisHostName,
      redisPort,
      unknownError
    );
  });
});
