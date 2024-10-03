// Copyright 2020 Prescryptive Health, Inc.

import {
  getFeedContext,
  getFeedItemContext,
  IFeedContextParams,
  IFeedItemParams,
} from './get-feed-item-context';
import { ServiceTypes } from '@phx/common/src/models/provider-location';
import {
  IStaticFeed,
  IStaticFeedContext,
  IStaticFeedContextServiceItem,
} from '@phx/common/src/models/static-feed';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { getMembershipFeedItems } from './get-membership-feed-items';
import { getPastProcedureFeedItems } from './get-past-procedures-feed-items';
import { getFeedItemForContextServiceList } from './get-feed-item-context-service-list';
import { CalculateAbsoluteAge } from '@phx/common/src/utils/date-time-helper';
import { getAppointmentFeedItems } from './get-appointment-feed-items';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IFeedItem } from '@phx/common/src/models/api-response/feed-response';
import { IFeaturesState } from '@phx/common/src/experiences/guest-experience/guest-experience-features';

jest.mock('./get-appointment-feed-items');
jest.mock('./get-membership-feed-items');
jest.mock('./get-past-procedures-feed-items');
jest.mock('./get-feed-item-context-service-list');
jest.mock('@phx/common/src/utils/date-time-helper');
const getAppointmentFeedItemsMock = getAppointmentFeedItems as jest.Mock;
const getMembershipFeedItemsMock = getMembershipFeedItems as jest.Mock;
const getPastProcedureFeedItemsMock = getPastProcedureFeedItems as jest.Mock;
const getFeedItemForContextServiceListMock =
  getFeedItemForContextServiceList as jest.Mock;
const calculateAbsoluteAgeMock = CalculateAbsoluteAge as jest.Mock;

const mockMembers = ['id1'];
const dateOfBirth = '01/01/2000';
const databaseMock = {} as IDatabase;
const testResultFeed: IStaticFeed = {
  feedCode: 'testResults',
  enabled: true,
  context: {
    title: 'Test Results',
    description: 'Description for testResults',
  },
  priority: 1,
};
const appointmentFeed: IStaticFeed = {
  feedCode: 'appointments',
  enabled: true,
  context: {
    title: 'Appointments',
    description: 'Description for appointments',
  },
  priority: 2,
};
const moreInfoFeed: IStaticFeed = {
  feedCode: 'moreInfo',
  enabled: true,
  context: {
    type: 'static',
    markDownText: 'some url',
  },
  priority: 3,
};
const pcrTestFeed: IStaticFeed = {
  feedCode: 'scheduleTestPCR',
  enabled: true,
  context: {
    title: 'Schedule PCR Test',
    description: 'Description for scheduleTestPCR',
  },
  priority: 4,
};
const medicineCabinetTestFeed: IStaticFeed = {
  feedCode: 'medicineCabinet',
  enabled: true,
  context: {
    title: 'Medicine cabinet',
    description: 'View your prescription',
  },
  priority: 5,
};

const scheduleTestAllFeed: IStaticFeed = {
  feedCode: 'scheduleTestAll',
  context: {
    title: 'Book a COVID-19 test',
    description: 'Find a pharmacy near you',
    minAge: 18,
    serviceList: [
      {
        title: 'Rapid COVID-19 Antigen test $65',
        description: 'For NY state residents',
        minAge: 18,
        serviceType: 'abbott_antigen',
        subText: [
          {
            language: 'English',
            markDownText: 'subtext-english-markdown-text-1-mock',
          },
          {
            language: 'Spanish',
            markDownText: 'subtext-spanish-markdown-text-1-mock',
          },
        ],
        cost: '$65',
      } as IStaticFeedContextServiceItem,
      {
        title: 'Book a COVID PCR test',
        description: 'For NY state residents',
        minAge: 18,
        serviceType: 'test-covid19-pcr-cquentia',
        subText: [
          {
            language: 'English',
            markDownText: 'subtext-english-markdown-text-2-mock',
          },
          {
            language: 'Spanish',
            markDownText: 'subtext-spanish-markdown-text-2-mock',
          },
        ],
        cost: '$155',
      } as IStaticFeedContextServiceItem,
    ],
  },
  priority: 140,
  enabled: true,
};
const scheduleTestFeed: IStaticFeed = {
  feedCode: 'scheduleTest',
  context: {
    title: 'Book a COVID-19 test',
    description: 'Find a pharmacy near you',
    minAge: 18,
    serviceType: 'COVID-19 Antigen Testing',
  },
  priority: 140,
  enabled: true,
};
const feedCodes: IStaticFeed[] = [
  testResultFeed,
  appointmentFeed,
  moreInfoFeed,
  pcrTestFeed,
  scheduleTestAllFeed,
  scheduleTestFeed,
  medicineCabinetTestFeed,
];
const rxGroupTypesMock: string[] = ['SIE', 'COVID19'];
const feedContextParamsMock: IFeedContextParams = {
  feedItems: feedCodes,
  members: mockMembers,
  database: databaseMock,
  dateOfBirth,
  features: {} as IFeaturesState,
  rxGroupTypes: rxGroupTypesMock,
  loggedInMemberIds: [],
  loggedInMasterIds: [],
  configuration: configurationMock,
};
const feedItemsParamsMock: IFeedItemParams = {
  feed: testResultFeed,
  members: mockMembers,
  database: databaseMock,
  dateOfBirth,
  features: {} as IFeaturesState,
  rxGroupTypes: rxGroupTypesMock,
  loggedInMemberIds: [],
  configuration: configurationMock,
};
const testResultsContext = [
  {
    feedCode: 'testResults',
    context: {
      defaultContext: {
        testResultId: 'event-id',
        title: 'Test Results',
        description: 'Description for testResults',
      },
    },
  },
];
const appointmentContext = [
  {
    feedCode: 'appointments',
    context: {
      defaultContext: {
        appointmentTime: 'start-time',
        serviceType: ServiceTypes.antigen,
        title: 'Appointments',
        description: 'Description for appointments',
      },
    },
  },
];
const scheduleTestPCRContext = [
  {
    feedCode: 'scheduleTestPCR',
    context: {
      defaultContext: {
        title: 'Schedule PCR Test',
        description: 'Description for scheduleTestPCR',
      },
    },
  },
];
const moreInfoContext = [
  {
    feedCode: 'moreInfo',
    context: {
      defaultContext: {
        type: 'static',
        markDownText: 'some url',
      },
    },
  },
];

const scheduleTestAllContext = [
  {
    feedCode: 'scheduleTestAll',
    context: {
      defaultContext: {
        title: 'Book a COVID-19 test',
        description: 'Find a pharmacy near you',
        serviceList: [
          {
            description: 'For NY state residents',
            cost: '$65',
            markDownText:
              '* Tests for current infection↵* Less sensitive↵* Nasal swab↵* Same day result',
            minAge: 18,
            serviceType: 'abbott_antigen',
            title: 'Rapid COVID-19 Antigen test',
          },
          {
            title: 'Book a COVID PCR test',
            description: 'For NY state residents',
            minAge: 18,
            serviceType: 'test-covid19-pcr-cquentia',
            markDownText:
              '* Tests for current infection↵* More sensitive↵* Nasal swab↵* Longer time to result: 2-4 business days',
            cost: '$155',
          },
        ],
      },
    } as IStaticFeedContext,
  },
];

const scheduleTestContext = [
  {
    feedCode: 'scheduleTest',
    context: {
      defaultContext: {
        title: 'Book a COVID-19 test',
        description: 'Find a pharmacy near you',
        serviceType: 'COVID-19 Antigen Testing',
      },
    } as IStaticFeedContext,
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  calculateAbsoluteAgeMock.mockReturnValue(31);
});
describe('getFeedContext', () => {
  it('should get context for items which are returned from database', async () => {
    const medicineCabinetFeedItem: IFeedItem[] = [
      {
        feedCode: 'medicineCabinet',
        context: {
          defaultContext: {
            title: medicineCabinetTestFeed.context?.title,
            description: medicineCabinetTestFeed.context?.description,
          },
        },
      },
    ];

    const feedContext = [
      ...testResultsContext,
      ...appointmentContext,
      ...moreInfoContext,
      ...scheduleTestPCRContext,
      ...scheduleTestAllContext,
      ...scheduleTestContext,
      ...medicineCabinetFeedItem,
    ];
    getPastProcedureFeedItemsMock.mockReturnValueOnce(testResultsContext);
    getAppointmentFeedItemsMock.mockReturnValueOnce(appointmentContext);
    getFeedItemForContextServiceListMock.mockReturnValueOnce(
      scheduleTestAllContext
    );
    calculateAbsoluteAgeMock.mockReturnValueOnce(31);

    expect(await getFeedContext({ ...feedContextParamsMock })).toEqual(
      feedContext
    );
    expect(getPastProcedureFeedItemsMock).toBeCalledWith({
      ...feedContextParamsMock,
      feed: testResultFeed,
    });
    expect(getAppointmentFeedItemsMock).toBeCalledWith({
      ...feedContextParamsMock,
      feed: appointmentFeed,
    });
    expect(getAppointmentFeedItemsMock).toBeCalledWith({
      ...feedContextParamsMock,
      feed: appointmentFeed,
    });
    expect(getFeedItemForContextServiceListMock).toBeCalledWith(
      {
        ...feedContextParamsMock,
        feed: scheduleTestAllFeed,
      },
      31
    );
  });

  it('should return empty array if no feed codes', async () => {
    expect(
      await getFeedContext({ ...feedContextParamsMock, feedItems: [] })
    ).toEqual([]);
    expect(getPastProcedureFeedItemsMock).not.toBeCalled();
    expect(getAppointmentFeedItemsMock).not.toBeCalled();
    expect(getFeedItemForContextServiceListMock).not.toBeCalled();
  });
});

describe('getFeedItemContext', () => {
  it('should get context for test result items which are returned from database', async () => {
    getPastProcedureFeedItemsMock.mockReturnValueOnce(testResultsContext);
    expect(await getFeedItemContext(feedItemsParamsMock)).toEqual(
      testResultsContext
    );
    expect(getPastProcedureFeedItemsMock).toBeCalledWith(feedItemsParamsMock);
  });
  it('should return empty array if no test results returned from database', async () => {
    getPastProcedureFeedItemsMock.mockReturnValueOnce([]);
    expect(await getFeedItemContext(feedItemsParamsMock)).toEqual([]);
    expect(getPastProcedureFeedItemsMock).toBeCalledWith(feedItemsParamsMock);
    expect(getAppointmentFeedItemsMock).not.toBeCalled();
  });

  it('should get context for appointments which are returned from database', async () => {
    getAppointmentFeedItemsMock.mockReturnValueOnce(appointmentContext);
    expect(
      await getFeedItemContext({
        ...feedItemsParamsMock,
        feed: appointmentFeed,
      })
    ).toEqual(appointmentContext);
    expect(getAppointmentFeedItemsMock).toBeCalledWith({
      ...feedItemsParamsMock,
      feed: appointmentFeed,
    });
    expect(getPastProcedureFeedItemsMock).not.toBeCalled();
  });
  it('should return empty array if no appointments returned from database', async () => {
    getAppointmentFeedItemsMock.mockReturnValueOnce([]);
    expect(
      await getFeedItemContext({
        ...feedItemsParamsMock,
        feed: appointmentFeed,
      })
    ).toEqual([]);
    expect(getAppointmentFeedItemsMock).toBeCalledWith({
      ...feedItemsParamsMock,
      feed: appointmentFeed,
    });
    expect(getPastProcedureFeedItemsMock).not.toBeCalled();
  });

  it('should return feed for addMembership if no members exists in database', async () => {
    const feed = {
      feedCode: 'addMembership',
      enabled: true,
      feedTitle: 'Add Membership',
      feedDescription: 'Description for addMembership',
      priority: 1,
    };
    const addMembershipContext = [
      {
        feedCode: 'addMembership',
        context: {
          defaultContext: {
            title: 'Add Membership',
            description: 'Description for addMembership',
          },
        },
      },
    ];
    getMembershipFeedItemsMock.mockReturnValue(addMembershipContext);
    expect(await getFeedItemContext({ ...feedItemsParamsMock, feed })).toEqual(
      addMembershipContext
    );
    expect(getMembershipFeedItemsMock).toBeCalledWith({
      ...feedItemsParamsMock,
      feed,
    });
    expect(getPastProcedureFeedItemsMock).not.toBeCalled();
    expect(getAppointmentFeedItemsMock).not.toBeCalled();
  });
  it('should return feed if any feed has serviceList in the feed context and all criteria met', async () => {
    const feedItemsParams: IFeedItemParams = {
      feed: scheduleTestAllFeed,
      members: mockMembers,
      database: databaseMock,
      dateOfBirth,
      features: {} as IFeaturesState,
      rxGroupTypes: rxGroupTypesMock,
      loggedInMemberIds: [],
      configuration: configurationMock,
    };
    getFeedItemForContextServiceListMock.mockReturnValueOnce(
      scheduleTestAllContext
    );
    expect(await getFeedItemContext(feedItemsParams)).toEqual(
      scheduleTestAllContext
    );
    expect(getPastProcedureFeedItemsMock).not.toBeCalled();
    expect(getAppointmentFeedItemsMock).not.toBeCalled();
    expect(getMembershipFeedItemsMock).not.toBeCalled();
  });

  it('should return empty array if any feed has serviceList in the feed context and not satisfying requirements', async () => {
    const scheduleTestAllFeedWithOptions: IStaticFeed = {
      feedCode: 'scheduleTestAll',
      context: {
        title: 'Book a COVID-19 test',
        description: 'Find a pharmacy near you',
        minAge: 18,
        serviceList: [
          {
            title: 'Rapid COVID-19 Antigen test $65',
            description: 'For NY state residents',
            minAge: 18,
            serviceType: 'abbott_antigen',
            featureFlag: 'usedose',
            markDownText:
              '* Tests for current infection\n* Less sensitive\n* Nasal swab\n* Same day result',
            cost: '$65',
            enabled: true,
          } as IStaticFeedContextServiceItem,
          {
            title: 'Book a COVID PCR test',
            description: 'For NY state residents',
            minAge: 18,
            serviceType: 'test-covid19-pcr-cquentia',
            markDownText:
              '* Tests for current infection↵* More sensitive↵* Nasal swab↵* Longer time to result: 2-4 business days',
            cost: '$155',
            enabled: false,
          } as IStaticFeedContextServiceItem,
        ],
      },
      priority: 140,
      enabled: true,
    };
    const feedItemsParams: IFeedItemParams = {
      feed: scheduleTestAllFeedWithOptions,
      members: mockMembers,
      database: databaseMock,
      dateOfBirth,
      features: {
        usegrouptypecovid: true,
        usepharmacy: true,
      } as IFeaturesState,
      rxGroupTypes: rxGroupTypesMock,
      loggedInMemberIds: [],
      configuration: configurationMock,
    };

    getFeedItemForContextServiceListMock.mockReturnValueOnce([]);
    expect(await getFeedItemContext(feedItemsParams)).toEqual([]);
    expect(getPastProcedureFeedItemsMock).not.toBeCalled();
    expect(getAppointmentFeedItemsMock).not.toBeCalled();
    expect(getMembershipFeedItemsMock).not.toBeCalled();
  });

  it('should return feed if it has context and satisfying requirements', async () => {
    const feedItemsParams: IFeedItemParams = {
      feed: scheduleTestFeed,
      members: mockMembers,
      database: databaseMock,
      dateOfBirth,
      features: {} as IFeaturesState,
      rxGroupTypes: rxGroupTypesMock,
      loggedInMemberIds: [],
      configuration: configurationMock,
    };
    expect(await getFeedItemContext(feedItemsParams)).toEqual(
      scheduleTestContext
    );
    expect(getPastProcedureFeedItemsMock).not.toBeCalled();
    expect(getAppointmentFeedItemsMock).not.toBeCalled();
    expect(getMembershipFeedItemsMock).not.toBeCalled();
    expect(getFeedItemForContextServiceListMock).not.toBeCalled();
  });

  it('should return empty array if feed has context and not meeting the criteria(age limitation)', async () => {
    const feedItemsParams: IFeedItemParams = {
      feed: scheduleTestFeed,
      members: mockMembers,
      database: databaseMock,
      dateOfBirth: '01/01/2020',
      features: {
        usegrouptypecovid: true,
        usepharmacy: true,
      } as IFeaturesState,
      rxGroupTypes: rxGroupTypesMock,
      loggedInMemberIds: [],
      configuration: configurationMock,
    };
    calculateAbsoluteAgeMock.mockReturnValueOnce(2);
    expect(await getFeedItemContext(feedItemsParams)).toEqual([]);
    expect(getPastProcedureFeedItemsMock).not.toBeCalled();
    expect(getAppointmentFeedItemsMock).not.toBeCalled();
    expect(getMembershipFeedItemsMock).not.toBeCalled();
    expect(getFeedItemForContextServiceListMock).not.toBeCalled();
  });
  it('should return only feedCode, title and description in context for all other feedCodes', async () => {
    const feedItemsParams: IFeedItemParams = {
      feed: moreInfoFeed,
      members: mockMembers,
      database: databaseMock,
      dateOfBirth: '01/01/2020',
      features: {
        usegrouptypecovid: true,
        usepharmacy: true,
      } as IFeaturesState,
      rxGroupTypes: rxGroupTypesMock,
      loggedInMemberIds: [],
      configuration: configurationMock,
    };
    expect(await getFeedItemContext(feedItemsParams)).toEqual(moreInfoContext);
    expect(getPastProcedureFeedItemsMock).not.toBeCalled();
    expect(getAppointmentFeedItemsMock).not.toBeCalled();
    expect(getMembershipFeedItemsMock).not.toBeCalled();
    expect(getFeedItemForContextServiceListMock).not.toBeCalled();
  });
});
