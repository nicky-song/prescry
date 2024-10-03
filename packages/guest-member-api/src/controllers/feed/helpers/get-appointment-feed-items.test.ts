// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  getAllAppointmentEventsForMember,
  getUpcomingAppointmentsCountEventForMember,
} from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { ServiceTypes } from '@phx/common/src/models/provider-location';
import { getAppointmentFeedItems } from './get-appointment-feed-items';
import { IFeedItemParams } from './get-feed-item-context';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IFeaturesState } from '@phx/common/src/experiences/guest-experience/guest-experience-features';

const feed = {
  feedCode: 'appointments',
  enabled: true,
  context: {
    title: 'Appointments',
    description: 'Description for appointments',
  },
  priority: 1,
};
const membersMock = ['id1'];
const databaseMock = {} as IDatabase;
const dateOfBirth = '01/01/2000';
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

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper'
);

const getAllAppointmentEventsForMemberMock =
  getAllAppointmentEventsForMember as jest.Mock;
const getUpcomingAppointmentsCountEventForMemberMock =
  getUpcomingAppointmentsCountEventForMember as jest.Mock;

beforeEach(() => {
  getAllAppointmentEventsForMemberMock.mockReset();
  getUpcomingAppointmentsCountEventForMemberMock.mockReset();
});

describe('getAppointmentFeedItems', () => {
  it('should return appointment context for appointments with no count if only exists past appointments', async () => {
    const appointments = [
      {
        identifiers: [],
        eventData: {
          appointment: { start: new Date('2020-08-13T18:00:00+0000') },
          orderNumber: '1269',
          serviceType: ServiceTypes.covid,
        },
        tags: [],
        eventType: 'appointment/confirmation',
      },
      {
        identifiers: [],
        eventData: {
          appointment: { start: new Date('2020-08-13T18:00:00+0000') },
          orderNumber: '1270',
          serviceType: ServiceTypes.covid,
        },
        tags: [],
        eventType: 'appointment/confirmation',
      },
    ];
    const appointmentContext = [
      {
        feedCode: 'appointments',
        context: {
          defaultContext: {
            title: 'Appointments',
            description: 'Description for appointments',
          },
        },
      },
    ];
    getAllAppointmentEventsForMemberMock.mockReturnValueOnce(appointments);
    getUpcomingAppointmentsCountEventForMemberMock.mockReturnValueOnce(0);
    expect(await getAppointmentFeedItems(feedItemsParamsMock)).toEqual(
      appointmentContext
    );
    expect(
      getUpcomingAppointmentsCountEventForMemberMock
    ).toHaveBeenNthCalledWith(1, membersMock, databaseMock);
  });
  it('should return appointment context for appointments with no count if only exists cancelled appointments', async () => {
    const appointments = [
      {
        identifiers: [],
        eventData: {
          appointment: {
            start: new Date('2020-08-13T18:00:00+0000'),
            bookingStatus: 'Cancelled',
            bookingStatusReason: 'CustomerInitiated',
          },
          orderNumber: '1269',
          serviceType: ServiceTypes.covid,
        },
        tags: [],
        eventType: 'appointment/confirmation',
      },
    ];
    const appointmentContext = [
      {
        feedCode: 'appointments',
        context: {
          defaultContext: {
            title: 'Appointments',
            description: 'Description for appointments',
          },
        },
      },
    ];
    getAllAppointmentEventsForMemberMock.mockReturnValueOnce(appointments);
    expect(await getAppointmentFeedItems(feedItemsParamsMock)).toEqual(
      appointmentContext
    );
    expect(
      getUpcomingAppointmentsCountEventForMemberMock
    ).toHaveBeenNthCalledWith(1, membersMock, databaseMock);
  });

  it('should return with number of upcoming appointments if there exists future appointments', async () => {
    const appointments = [
      {
        identifiers: [],
        eventData: {
          appointment: { start: new Date('2025-08-13T18:00:00+0000') },
          orderNumber: '1235',
          serviceType: ServiceTypes.covid,
        },
        tags: [],
        eventType: 'appointment/confirmation',
      },
    ];
    const appointmentContext = [
      {
        feedCode: 'appointments',
        context: {
          defaultContext: {
            title: 'Appointments (1)',
            description: 'Description for appointments',
          },
        },
      },
    ];
    getAllAppointmentEventsForMemberMock.mockReturnValueOnce(appointments);
    getUpcomingAppointmentsCountEventForMemberMock.mockReturnValueOnce(1);
    expect(await getAppointmentFeedItems(feedItemsParamsMock)).toEqual(
      appointmentContext
    );
    expect(getAllAppointmentEventsForMemberMock).toHaveBeenNthCalledWith(
      1,
      membersMock,
      databaseMock
    );
    expect(
      getUpcomingAppointmentsCountEventForMemberMock
    ).toHaveBeenNthCalledWith(1, membersMock, databaseMock);
  });

  it('should return empty array if no appointments returned from database', async () => {
    getAllAppointmentEventsForMemberMock.mockReturnValueOnce(null);
    expect(await getAppointmentFeedItems(feedItemsParamsMock)).toEqual([]);
    expect(getAllAppointmentEventsForMemberMock).toHaveBeenCalledTimes(1);
    expect(
      getUpcomingAppointmentsCountEventForMemberMock
    ).not.toHaveBeenCalled();
  });

  it('should return empty array if no members', async () => {
    expect(
      await getAppointmentFeedItems({ ...feedItemsParamsMock, members: [] })
    ).toEqual([]);
    expect(getAllAppointmentEventsForMemberMock).not.toBeCalled();
    expect(getUpcomingAppointmentsCountEventForMemberMock).not.toBeCalled();
  });
});
