// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { getMembershipFeedItems } from './get-membership-feed-items';
import { IFeedItemParams } from './get-feed-item-context';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IFeaturesState } from '@phx/common/src/experiences/guest-experience/guest-experience-features';

const membersMock = ['id1'];
const databaseMock = {} as IDatabase;
const rxGroupTypesMock: string[] = ['SIE'];
const dateOfBirth = '01/01/2000';
const feed = {
  feedCode: 'addMembership',
  enabled: true,
  context: {
    title: 'Add Membership',
    description: 'Description for addMembership',
  },
  priority: 1,
};
const feedItemsParamsMock: IFeedItemParams = {
  feed,
  members: membersMock,
  database: databaseMock,
  dateOfBirth,
  features: {} as IFeaturesState,
  rxGroupTypes: rxGroupTypesMock,
  loggedInMemberIds: [],
  configuration: configurationMock,
};
describe('getMembershipFeedItems', () => {
  it('should return empty array for addMembership feed if members exists in database', () => {
    expect(getMembershipFeedItems(feedItemsParamsMock)).toEqual([]);
  });

  it('should return addMembership feed item if no members', () => {
    expect(
      getMembershipFeedItems({ ...feedItemsParamsMock, members: [] })
    ).toEqual([
      {
        feedCode: 'addMembership',
        context: {
          defaultContext: {
            title: 'Add Membership',
            description: 'Description for addMembership',
          },
        },
      },
    ]);
  });

  it('should return addMembership feed item if members exists but not SIE or COVID19 in database', () => {
    expect(
      getMembershipFeedItems({
        ...feedItemsParamsMock,
        rxGroupTypes: ['CASH'],
      })
    ).toEqual([
      {
        feedCode: 'addMembership',
        context: {
          defaultContext: {
            title: 'Add Membership',
            description: 'Description for addMembership',
          },
        },
      },
    ]);
  });
});
