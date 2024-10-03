// Copyright 2018 Prescryptive Health, Inc.

import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import redis, { RedisClient, RetryStrategyOptions } from 'redis';
import { promisify } from 'util';
import { HealthController } from '../../controllers/health/health.controller';
import { logRedisEventInAppInsight } from '../custom-event-helper';
import { logger } from '../server-helper';

export interface IDeviceKeyValues {
  deviceToken: string;
}

export interface IPinVerificationKeyValues {
  pinVerificationAttempt: number;
}

export interface IIdentityVerificationKeyValues {
  identityVerificationAttempt: number;
}

export interface IPinKeyValues {
  // TODO: remove the optional properties one we move to v2 tokens completely
  dateOfBirth?: string;
  firstName?: string;
  lastName?: string;
  pinHash: string;
  accountKey: string;
  _id?: string;
}

export interface IPhoneRegistrationKeyValues {
  dateOfBirth: string;
  firstName: string;
  identifier: string;
  lastName: string;
}

export interface IAccountCreationKeyValues {
  dateOfBirth: string;
  firstName: string;
  phoneNumber: string;
  lastName: string;
}
export enum RedisKeys {
  DEVICE_KEY = 'device',
  PIN_KEY = 'pin',
  ACCOUNT_CREATE_KEY = 'account-creation',
  PERSON_CREATE_KEY = 'person-creation',
  PHONE_NUMBER_REGISTRATION_KEY = 'phone-number:registration',
  PIN_VERIFICATION_KEY = 'pin-verification',
  IDENTITY_VERIFICATION_ATTEMPTS_KEY = 'identity-verification-attempts',
  ORDER_NUMBER_KEY = 'uniqueid:ordernumber',
  NEARBY_PHARMACIES_KEY = 'pharm',
  CMS_CONTENT_KEY = 'content',
  AUTH0_KEY = 'auth0',
}

export type RedisTelemetryKeys =
  | 'REDIS_CONNECTION_CLOSE'
  | 'REDIS_CONNECTION_END'
  | 'REDIS_CONNECTION_READY'
  | 'REDIS_CONNECTION_RECONNECTING'
  | 'REDIS_CONNECTION_REFUSED'
  | 'REDIS_CONNECTION_SUCCESS'
  | 'REDIS_MAX_ATTEMPTS_EXHAUSTED'
  | 'REDIS_UNKNOWN_ERROR'
  | 'REDIS_ORDERNUMBER_INITIATE_FROMREDIS'
  | 'REDIS_ORDERNUMBER_INITIATE_FROMDB'
  | 'REDIS_ORDERNUMBER_SETMAX'
  | 'REDIS_ORDERNUMBER_SETCURRENT'
  | 'REDIS_ORDERNUMBER_ERROR'
  | 'REDIS_ORDERNUMBER_RESET';

export let redisClient: RedisClient;
export let deviceTokenKeyExpiryIn: number;
export let pinKeyExpiryIn: number;
export let pinVerificationKeyExpiryIn: number;
export let redisHostName: string;
export let redisPort: number;
export let redisScanCountNumber: string;

const KEY_PREFIX = 'myrx:';

export let redisGet: (key: string) => Promise<string | null>;
export let redisSet: (
  key: string,
  expiresIn: number,
  value: string
) => Promise<string>;

export let redisScan: (
  cursor: string,
  match: string,
  pattern: string,
  count: string,
  number: string
) => Promise<[string, string[]] | null>;

export let redisDel: (key: string) => Promise<number | null>;

export const initializeRedisClient = (
  port: number,
  hostName: string,
  authPass: string,
  deviceTokenKeyExpiryInSeconds: number,
  pinKeyExpiryTimeInSeconds: number,
  pinVerificationKeyExpiryInSeconds: number,
  pinResetScanDeleteCount: string
) => {
  deviceTokenKeyExpiryIn = deviceTokenKeyExpiryInSeconds;
  pinKeyExpiryIn = pinKeyExpiryTimeInSeconds;
  redisHostName = hostName;
  redisPort = port;
  pinVerificationKeyExpiryIn = pinVerificationKeyExpiryInSeconds;
  redisScanCountNumber = pinResetScanDeleteCount;

  redisClient = redis.createClient(redisPort, redisHostName, {
    auth_pass: authPass,
    no_ready_check: true,
    prefix: KEY_PREFIX,
    retry_strategy: redisRetryStrategy,
    tls: { servername: hostName },
  });

  redisGet = promisify(redisClient.get).bind(redisClient);
  redisSet = promisify(redisClient.setex).bind(redisClient);
  redisScan = promisify(redisClient.scan).bind(redisClient);
  redisDel = promisify(redisClient.del).bind(redisClient);

  trackRedisEvents();
};

export async function addKeyInRedis<T>(
  key: string,
  value: T,
  expiresIn: number,
  keyType: RedisKeys,
  id?: string
): Promise<boolean> {
  const fullKey = generateKey(key, keyType, id);
  const res = await redisSet(fullKey, expiresIn, JSON.stringify(value));
  if (res === 'OK') {
    return true;
  }
  return false;
}

export async function getValueFromRedis<T>(
  key: string,
  keyType: RedisKeys,
  id?: string,
  creator?: () => Promise<T | undefined>,
  expiresIn?: number
): Promise<T | undefined> {
  const fullKey = generateKey(key, keyType, id);
  const rawValue: string | null = await redisGet(fullKey);

  if (rawValue) {
    const value = JSON.parse(rawValue);
    return value;
  }

  if (creator && expiresIn) {
    const newValue = await creator();
    if (newValue !== undefined) {
      await addKeyInRedis<T>(key, newValue, expiresIn, keyType, id);
      return newValue;
    }
  }
  return;
}

export const generateKey = (key: string, keyType: RedisKeys, id?: string) => {
  let updatedKey = `${keyType}:${key}`;
  if (id) {
    updatedKey += `:${id}`;
  }
  return updatedKey;
};

export const redisRetryStrategy = (
  options: RetryStrategyOptions
): Error | number => {
  if (
    options.error &&
    (options.error.code === 'ECONNREFUSED' ||
      options.error.code === 'NR_CLOSED')
  ) {
    logEvent('REDIS_CONNECTION_REFUSED', 'warn');
  }

  if (options.attempt > 5) {
    HealthController.failureReason =
      ErrorConstants.REDIS_MAX_ATTEMPTS_EXHAUSTED;
    HealthController.state = 'failed';
    return new Error('REDIS_MAX_ATTEMPTS_EXHAUSTED');
  }

  return 1000;
};

export const scanKeysInRedis = async (pattern: string) => {
  const keys: string[] = [];
  let cursor = '0';

  do {
    const reply = await redisScan(
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      redisScanCountNumber
    );
    if (reply) {
      cursor = reply[0];
      keys.push(...reply[1]);
    } else {
      return [];
    }
  } while (cursor !== '0');
  return keys;
};

export const deleteKeysInRedis = async (pattern: string) => {
  const keys = await scanKeysInRedis(pattern);
  await Promise.all(
    keys.map(async (key) => {
      const KeyWithOutPrefix = key.substr(KEY_PREFIX.length);
      await redisDel(KeyWithOutPrefix);
    })
  );
};

export const trackRedisEvents = () => {
  redisClient.on('connect', (): void => {
    logEvent('REDIS_CONNECTION_SUCCESS', 'info');
  });

  redisClient.on('ready', (): void => {
    HealthController.state = 'live';
    logEvent('REDIS_CONNECTION_READY', 'info');
  });

  redisClient.on('close', (): void => {
    logEvent('REDIS_CONNECTION_CLOSE', 'warn');
  });

  redisClient.on('reconnecting', (): void => {
    logEvent('REDIS_CONNECTION_RECONNECTING', 'info');
  });

  redisClient.on('end', (): void => {
    logEvent('REDIS_CONNECTION_END', 'warn');
  });

  redisClient.on('error', (err: Error): void => {
    if (err.message === 'REDIS_MAX_ATTEMPTS_EXHAUSTED') {
      logEvent('REDIS_MAX_ATTEMPTS_EXHAUSTED', 'warn');
    } else {
      logEvent('REDIS_UNKNOWN_ERROR', 'error', err.message);
    }
  });
};

export const logEvent = (
  key: RedisTelemetryKeys,
  logLevel: 'error' | 'info' | 'warn',
  message?: string
) => {
  const logMessage = `${key}, hostname: ${redisHostName}, port: ${redisPort}, errorMessage : ${message}`;

  if (logLevel === 'error') {
    logger.error(logMessage);
  }

  if (logLevel === 'info') {
    logger.info(logMessage);
  }

  if (logLevel === 'warn') {
    logger.warn(logMessage);
  }

  logRedisEventInAppInsight(key, redisHostName, redisPort, message || key);
};
