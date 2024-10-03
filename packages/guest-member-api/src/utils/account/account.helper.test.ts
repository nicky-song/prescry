// Copyright 2021 Prescryptive Health, Inc.

import { addAccountCreationKeyInRedis } from '../../databases/redis/redis-query-helper';
import {
  IAccountUpdate,
  publishAccountUpdateMessage,
} from '../service-bus/account-update-helper';
import { publishAccountUpdateMessageAndAddToRedis } from './account.helper';

jest.mock('../service-bus/account-update-helper');
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;

jest.mock('../../databases/redis/redis-query-helper');
const addAccountCreationKeyInRedisMock =
  addAccountCreationKeyInRedis as jest.Mock;

describe('accountHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('publishAccountUpdateMessageAndAddToRedis', () => {
    it('should call addAccountCreationKeyInRedis if message has dateOfBirth', async () => {
      const mockPhone = '+1XXXXXXXXX';
      const mockAccountUpdateWithDateOfBirth: IAccountUpdate = {
        dateOfBirth: '01/01/2020',
        firstName: 'JOHNNY',
        lastName: 'APPLESEED',
        phoneNumber: mockPhone,
      };
      await publishAccountUpdateMessageAndAddToRedis(
        mockAccountUpdateWithDateOfBirth,
        100
      );

      expect(publishAccountUpdateMessageMock).toBeCalledWith(
        mockAccountUpdateWithDateOfBirth
      );
      expect(addAccountCreationKeyInRedisMock).toHaveBeenCalledWith(
        mockPhone,
        mockAccountUpdateWithDateOfBirth,
        100
      );
    });

    it('should not call addAccountCreationKeyInRedis if message do not have dateOfBirth', async () => {
      const mockAccountUpdate: IAccountUpdate = {
        phoneNumber: '+1XXXXXXXXX',
        pinHash: 'test',
        accountKey: 'key',
      };
      await publishAccountUpdateMessageAndAddToRedis(mockAccountUpdate, 100);

      expect(publishAccountUpdateMessageMock).toBeCalledWith(mockAccountUpdate);
      expect(addAccountCreationKeyInRedisMock).not.toHaveBeenCalled();
    });
  });
});
