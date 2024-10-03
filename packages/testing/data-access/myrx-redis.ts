// Copyright 2022 Prescryptive Health, Inc.

import redis from 'redis';

export class MyRxRedis {
  private client: redis.RedisClient;

  constructor() {
    const redisPort = process.env.MYRX_REDIS_PORT;
    if (redisPort === undefined)
      throw new Error('MyRx Redis port is not defined');

    const redisHost = process.env.MYRX_REDIS_HOST;
    if (redisHost === undefined)
      throw new Error('MyRx Redis host is not defined');

    const redisAccessKey = process.env.MYRX_REDIS_ACCESS_KEY;
    if (redisAccessKey === undefined)
      throw new Error('MyRx Redis access key is not defined');

    this.client = redis.createClient(
      new Number(redisPort).valueOf(),
      redisHost,
      {
        auth_pass: redisAccessKey,
        no_ready_check: true,
        tls: { servername: redisHost },
      }
    );
  }

  public static readonly testAutomationLockPrefix =
    'myrx:TEST_AUTOMATION_LOCK_v2:';

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.quit((err, _reply) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public scan(
    matchPattern: string
  ): Promise<{ cursor: string; elements: string[] }>;
  public scan(
    cursor: string,
    matchPattern: string
  ): Promise<{ cursor: string; elements: string[] }>;
  public scan(
    cursor: string,
    matchPattern: string,
    count: string
  ): Promise<{ cursor: string; elements: string[] }>;
  public scan(
    cursor = '0',
    matchPattern?: string,
    count = '50000'
  ): Promise<{ cursor: string; elements: string[] }> {
    return new Promise((resolve, reject) => {
      const scanCallback = (err: Error | null, reply: [string, string[]]) => {
        if (err) reject(err);
        resolve({ cursor: reply[0], elements: reply[1] });
      };

      if (!matchPattern) {
        this.client.scan(cursor, 'count', count, scanCallback);
      } else {
        this.client.scan(
          cursor,
          'count',
          count,
          'match',
          matchPattern,
          scanCallback
        );
      }
    });
  }

  public set(key: string): Promise<'OK' | undefined>;
  public set(key: string, value: string): Promise<'OK' | undefined>;
  public set(
    key: string,
    value: string,
    mode: string,
    duration: number
  ): Promise<'OK' | undefined>;
  public set(
    key: string,
    value: string,
    mode: string,
    duration: number,
    flag: string
  ): Promise<'OK' | undefined>;
  public set(
    key: string,
    value = '',
    mode?: string,
    duration?: number,
    flag?: string
  ): Promise<'OK' | undefined> {
    return new Promise((resolve, reject) => {
      if (flag && mode && duration) {
        this.client.set(key, value, mode, duration, flag, (err, reply) => {
          if (err) reject(err);
          resolve(reply);
        });
      } else if (mode && duration) {
        this.client.set(key, value, mode, duration, (err, reply) => {
          if (err) reject(err);
          resolve(reply);
        });
      } else {
        this.client.set(key, value, (err, reply) => {
          if (err) reject(err);
          resolve(reply);
        });
      }
    });
  }

  public del(keys: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.del(keys, (err, reply) => {
        if (err) reject(err);
        if (reply < keys.length) {
          // eslint-disable-next-line no-console
          console.warn(`Removed keys ${keys} with result ${reply}`);
        }
        resolve(reply);
      });
    });
  }

  public get(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }

  public incrBy(key: string, increment: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.incrby(key, increment, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }
}
