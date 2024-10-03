// Copyright 2018 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';
import { searchStaticFeed } from './static-feed-helper';
const findMock = jest.fn();
const sortMock = jest.fn();
const selectMock = jest.fn();
const databaseMock = {
  Models: {
    StaticFeedModel: {
      find: findMock,
    },
  },
} as unknown as IDatabase;

const findMockResonse = { sort: sortMock };
const sortMockResonse = { select: selectMock };
jest.mock('@phx/common/src/models/api-response/feed-response');
jest.mock('mongoose');
beforeEach(() => {
  findMock.mockReset();
  findMock.mockReturnValue(findMockResonse);
  sortMock.mockReset();
  sortMock.mockReturnValue(sortMockResonse);
  selectMock.mockReset();
});

describe('searchStaticFeed', () => {
  const audience = ['test'];
  const currentDate = new Date();
  it('should call find with required paramas', () => {
    searchStaticFeed(databaseMock, audience, currentDate);
    expect(findMock).toHaveBeenCalledWith({
      $and: [
        { enabled: true },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: currentDate } },
          ],
        },
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: { $lte: currentDate } },
          ],
        },
        {
          $or: [
            { audience: { $exists: false } },
            {
              $and: [
                { 'audience.include': { $exists: false } },
                { 'audience.exclude': { $exists: false } },
              ],
            },
            {
              $and: [
                { 'audience.exclude': { $exists: true } },
                { 'audience.exclude': { $nin: audience } },
              ],
            },
            {
              $and: [
                { 'audience.include': { $exists: true } },
                { 'audience.include': { $in: audience } },
              ],
            },
          ],
        },
      ],
    });
    expect(sortMock).toBeCalledWith({ priority: 1 });
    expect(selectMock).toBeCalledWith({
      feedCode: 1,
      context: 1,
      priorty: 1,
      _id: 0,
    });
  });
});
