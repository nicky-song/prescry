// Copyright 2021 Prescryptive Health, Inc.

import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IFeedItemParams } from './get-feed-item-context';
import { getDefaultContextFeedItem } from './get-default-context-feed-item';
import { IFeedItem } from '@phx/common/src/models/api-response/feed-response';
import {
  IStaticFeed,
  IStaticFeedContext,
  IStaticFeedContextServiceItem,
} from '@phx/common/src/models/static-feed';
import { getFeedItemForContextServiceList } from './get-feed-item-context-service-list';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IFeaturesState } from '@phx/common/src/experiences/guest-experience/guest-experience-features';

jest.mock('./get-default-context-feed-item');
jest.mock('@phx/common/src/utils/date-time-helper');

const getDefaultContextFeedItemMock = getDefaultContextFeedItem as jest.Mock;

describe('getFeedItemForContextServiceList', () => {
  const feed = {
    feedCode: 'scheduleTestAll',
    enabled: true,
    context: {
      title: 'Book a COVID-19 test',
      description: 'Find a pharmacy near you',
      serviceList: [
        {
          title: 'Rapid COVID-19 Antigen test',
          description: 'For NY state residents',
          minAge: 18,
          serviceType: 'abbott_antigen',
          markDownText:
            '* Tests for current infection\n* Less sensitive\n* Nasal swab\n* Same day result',
          cost: '$65',
          enabled: true,
        } as IStaticFeedContextServiceItem,
        {
          title: 'Book a COVID Antigen test Medicare (Part B only)',
          description: 'For NY state residents',
          minAge: 18,
          serviceType: 'medicare_abbott_antigen',
          markDownText:
            '* Tests for current infection\n* Less sensitive\n* Nasal swab\n* Same day result',
          cost: 'FREE',
          enabled: false,
        } as IStaticFeedContextServiceItem,
        {
          title: 'Book a COVID PCR test',
          description: 'For NY state residents',
          minAge: 18,
          serviceType: 'test-covid19-pcr-cquentia',
          markDownText:
            '* Tests for current infection\n* More sensitive\n* Nasal swab\n* Longer time to result: 2-4 business days',
          cost: '$155',
          featureFlag: 'usedose',
          enabled: true,
        } as IStaticFeedContextServiceItem,
      ],
    } as IStaticFeedContext,
  } as IStaticFeed;
  const membersMock = ['id1'];
  const databaseMock = {} as IDatabase;
  const dateOfBirth = '01/01/1989';
  const feedItemsParamsMock: IFeedItemParams = {
    feed,
    members: membersMock,
    database: databaseMock,
    dateOfBirth,
    features: {} as IFeaturesState,
    rxGroupTypes: ['CASH', 'SIE'],
    loggedInMemberIds: [],
    configuration: configurationMock,
  };

  const age = 31;

  beforeEach(() => {
    getDefaultContextFeedItemMock.mockReset();
  });

  it('should return feed item if minimum age validation does not exists', () => {
    const filteredServiceList = [
      {
        title: 'Rapid COVID-19 Antigen test',
        description: 'For NY state residents',
        minAge: 18,
        serviceType: 'abbott_antigen',
        markDownText:
          '* Tests for current infection\n* Less sensitive\n* Nasal swab\n* Same day result',
        cost: '$65',
      },
      {
        title: 'Book a COVID PCR test',
        description: 'For NY state residents',
        minAge: 18,
        serviceType: 'test-covid19-pcr-cquentia',
        markDownText:
          '* Tests for current infection\n* More sensitive\n* Nasal swab\n* Longer time to result: 2-4 business days',
        cost: '$155',
      },
    ];
    const expectedFeed = {
      feedCode: 'scheduleTestAll',
      defaultContext: {
        title: 'Book a COVID-19 test',
        description: 'Find a pharmacy near you',
        services: filteredServiceList,
      },
    };
    getDefaultContextFeedItemMock.mockReturnValueOnce(expectedFeed);
    expect(getFeedItemForContextServiceList(feedItemsParamsMock, age)).toEqual([
      expectedFeed,
    ]);
  });

  it('should NOT return feed item if minimum age validation exists and user does not meet age limitation', () => {
    const feedWithMinimumAge = {
      ...feed,
      context: {
        ...feed.context,
        minAge: 18,
      },
    };

    const calculatedAge = 15;

    const feedItemsParams: IFeedItemParams = {
      feed: feedWithMinimumAge,
      members: membersMock,
      database: databaseMock,
      dateOfBirth,
      features: {} as IFeaturesState,
      rxGroupTypes: ['CASH', 'SIE'],
      loggedInMemberIds: [],
      configuration: configurationMock,
    };
    const expectedFeedResult: IFeedItem[] = [];
    expect(getDefaultContextFeedItemMock).not.toBeCalled();
    expect(
      getFeedItemForContextServiceList(feedItemsParams, calculatedAge)
    ).toEqual(expectedFeedResult);
  });

  it('should return feed item with the services if any validation exists in serviceList and user meets all the criteria', () => {
    const feedWithMinimumAge = {
      ...feed,
      context: {
        ...feed.context,
        minAge: 18,
      },
    };

    const feedItemsParams: IFeedItemParams = {
      feed: feedWithMinimumAge,
      members: membersMock,
      database: databaseMock,
      dateOfBirth,
      features: {
        usevaccine: true,
        usepharmacy: true,
      } as IFeaturesState,
      rxGroupTypes: ['CASH', 'SIE'],
      loggedInMemberIds: [],
      configuration: configurationMock,
    };

    const filteredServiceList = [
      {
        title: 'Rapid COVID-19 Antigen test',
        description: 'For NY state residents',
        minAge: 18,
        serviceType: 'abbott_antigen',
        markDownText:
          '* Tests for current infection\n* Less sensitive\n* Nasal swab\n* Same day result',
        cost: '$65',
      },
    ];
    const expectedFeed = {
      feedCode: 'scheduleTestAll',
      defaultContext: {
        title: 'Book a COVID-19 test',
        description: 'Find a pharmacy near you',
        services: filteredServiceList,
      },
    };
    getDefaultContextFeedItemMock.mockReturnValueOnce(expectedFeed);
    expect(getFeedItemForContextServiceList(feedItemsParams, age)).toEqual([
      expectedFeed,
    ]);
  });

  it('should NOT return feed item if any validation exists in service List and user does not meet the criteria', () => {
    const expectedFeedResult: IFeedItem[] = [];
    const calculatedAge = 15;
    expect(getDefaultContextFeedItemMock).not.toBeCalled();
    expect(
      getFeedItemForContextServiceList(feedItemsParamsMock, calculatedAge)
    ).toEqual(expectedFeedResult);
  });
});
