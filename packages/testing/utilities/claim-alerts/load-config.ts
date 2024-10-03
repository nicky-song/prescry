// Copyright 2022 Prescryptive Health, Inc.

import * as fs from 'fs';
import { DrugPrice } from '../../types';
import { MyRxRedis } from '../../data-access';

const claimAlertsOffsetKey = 'myrx:TEST_AUTOMATION:claim-alerts:offset';

const configFilePath = './utilities/claim-alerts/claim-alert.config.json';

const loadConfig = async (drugList: DrugPrice[]) => {
  const configBuffer = fs.readFileSync(configFilePath);
  const config = JSON.parse(configBuffer.toString('utf8'));

  const { startingKeys, currentOffset } = config;
  const { authorizationNumber, rxNumber } = startingKeys;

  const session = new MyRxRedis();
  try {
    const count = drugList.length;
    if (!(await session.get(claimAlertsOffsetKey))) {
      await session.set(claimAlertsOffsetKey, currentOffset);
    }
    const newOffset = await session.incrBy(claimAlertsOffsetKey, count);
    const baseOffset = newOffset - count;
    // format for authorization T1234567890XXXXX
    // format for rxNumber T1234XXXX
    const drugConfig = drugList.map((drug, ix) => ({
      ...drug,
      authorizationNumber: `T${authorizationNumber + baseOffset + 1 + ix}`,
      rxNumber: `T${rxNumber + baseOffset + 1 + ix}`,
    }));
    return drugConfig;
  } catch (error) {
    throw new Error(`Failed to load claim alert offset with error ${error}`);
  } finally {
    await session.close();
  }
};

export default loadConfig;
