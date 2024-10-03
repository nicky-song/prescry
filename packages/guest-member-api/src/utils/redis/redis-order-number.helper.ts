// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { IAppointmentEvent } from '../../models/appointment-event';
import { redisClient, RedisKeys, redisGet, logEvent } from './redis.helper';
import { getMaxOrderNumberFromAppointment } from '../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { Multi } from 'redis';

const OrderNumber = { current: 0, max: 0, initiated: false };

export const reset = (current: number, max: number, initiated: boolean) => {
  OrderNumber.initiated = initiated;
  setCurrent(current);
  setMax(max);
};

const isInitiated = () => OrderNumber.initiated;
const getCurrent = () => OrderNumber.current;
const setCurrent = (value: number) => {
  OrderNumber.current = value;
  logEvent('REDIS_ORDERNUMBER_SETCURRENT', 'info', JSON.stringify(value));
  return value;
};
const setMax = (value: number) => {
  OrderNumber.max = value;
  logEvent('REDIS_ORDERNUMBER_SETMAX', 'info', JSON.stringify(value));
  return value;
};

export const getMax = () => OrderNumber.max;
export const getNext = async (
  database: IDatabase,
  orderNumberBlockLength: number
) => {
  if (!isInitiated()) {
    await initiate(database, orderNumberBlockLength);
  }
  const current = getCurrent();
  const max = getMax();
  if (current < max) {
    return setCurrent(current + 1).toString();
  }
  await initiate(database, orderNumberBlockLength);
  const updated = getCurrent();
  return setCurrent(updated + 1).toString();
};

export async function initiate(
  database: IDatabase,
  orderNumberBlockLength: number
): Promise<boolean> {
  const rawValue: string | null = await redisGet(RedisKeys.ORDER_NUMBER_KEY);
  logEvent('REDIS_ORDERNUMBER_INITIATE_FROMREDIS', 'info', rawValue ?? 'null');

  if (rawValue) {
    return initiateFromRawValue(orderNumberBlockLength, rawValue, logEvent);
  }
  const appointmentEvent = await getMaxOrderNumberFromAppointment(database);
  logEvent('REDIS_ORDERNUMBER_INITIATE_FROMDB', 'info', rawValue ?? 'null');

  if (appointmentEvent) {
    return initiateFromAppointment(appointmentEvent, orderNumberBlockLength);
  }
  return false;
}

export async function initiateFromRawValue(
  orderNumberBlockLength: number,
  rawValue: string,
  log: typeof logEvent
) {
  const current = parseInt(rawValue, 10) + 1;
  const result = await execAsync<number>(
    redisClient
      .multi()
      .incrby(RedisKeys.ORDER_NUMBER_KEY, orderNumberBlockLength)
  );
  if (result?.length < 1) {
    log('REDIS_ORDERNUMBER_ERROR', 'error', JSON.stringify(result || 'NULL'));
    return false;
  }

  reset(current, result[0], true);
  return true;
}

export async function initiateFromAppointment(
  appointment: IAppointmentEvent,
  orderNumberBlockLength: number
) {
  const orderNumberStart =
    Math.ceil(
      parseInt(appointment.eventData.orderNumber, 10) / orderNumberBlockLength
    ) * orderNumberBlockLength;

  const result = await execAsync<number>(
    redisClient
      .multi()
      .incrby(RedisKeys.ORDER_NUMBER_KEY, orderNumberStart)
      .incrby(RedisKeys.ORDER_NUMBER_KEY, orderNumberBlockLength)
  );

  if (result.length < 2) {
    logEvent(
      'REDIS_ORDERNUMBER_ERROR',
      'error',
      JSON.stringify(result || 'NULL')
    );
    return false;
  }

  reset(result[0] + 1, result[1], true);
  return true;
}

async function execAsync<T>(multi: Multi): Promise<T[]> {
  return await new Promise<T[]>((resolve, reject) => {
    multi.exec((error: Error | null, result: T[]) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}
