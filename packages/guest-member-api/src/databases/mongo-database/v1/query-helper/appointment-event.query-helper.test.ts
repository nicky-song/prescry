// Copyright 2020 Prescryptive Health, Inc.

import moment from 'moment';
import { IDatabase } from '../setup/setup-database';
import {
  getAllAppointmentEventsForMember,
  getAppointmentEventByOrderNumber,
  getMaxOrderNumberFromAppointment,
  getUpcomingAppointmentsCountEventForMember,
  getAppointmentEventByOrderNumberNoRxId,
  getUpcomingAppointmentEventsForMember,
  getPastAppointmentEventsForMember,
  getCancelledAppointmentEventsForMember,
} from './appointment-event.query-helper';

const limitMock = jest.fn();
const skipMock = jest.fn().mockImplementation(() => {
  return {
    limit: limitMock,
  };
});
const sortMock = jest.fn().mockImplementation(() => {
  return {
    skip: skipMock,
  };
});

const findOneMock = jest.fn().mockImplementation(() => {
  return {
    sort: sortMock,
  };
});

const countDocumentsMock = jest.fn().mockImplementation(() => {
  return {
    sort: sortMock,
  };
});
const findMock = jest.fn().mockImplementation(() => {
  return {
    sort: sortMock,
  };
});

const databaseMock = {
  Models: {
    AppointmentEventModel: {
      findOne: findOneMock,
      find: findMock,
      countDocuments: countDocumentsMock,
    },
  },
} as unknown as IDatabase;

describe('getAllAppointmentEventsForMember', () => {
  const memberIds = ['id1'];
  it('should call find() with required params', () => {
    getAllAppointmentEventsForMember(memberIds, databaseMock);
    expect(findMock).toHaveBeenCalledWith({
      $and: [
        { eventType: 'appointment/confirmation' },
        {
          $or: [
            { 'eventData.bookingStatus': 'Confirmed' },
            { 'eventData.bookingStatus': 'Completed' },
            {
              $and: [
                { 'eventData.bookingStatus': 'Cancelled' },
                {
                  'eventData.bookingStatusReason': {
                    $in: [
                      'CustomerInitiatedCancellation',
                      'PharmacistInitiatedCancellation',
                    ],
                  },
                },
              ],
            },
          ],
        },
        { 'eventData.appointment.memberRxId': { $in: memberIds } },
      ],
    });
    expect(sortMock).toHaveBeenCalledWith('-eventData.appointment.start');
  });
});

describe('getAppointmentEventByOrderNumber', () => {
  const memberId = 'id1';
  const appointmentId = 'appointment-id';
  it('should call findOne() with required params', () => {
    getAppointmentEventByOrderNumber(memberId, appointmentId, databaseMock);
    expect(findOneMock).toHaveBeenCalledWith({
      $and: [
        { 'eventData.orderNumber': appointmentId },
        { eventType: 'appointment/confirmation' },
        { 'eventData.appointment.memberRxId': memberId },
      ],
    });
    expect(sortMock).toHaveBeenCalledWith('-eventData.appointment.start');
  });
});

describe('getAppointmentEventByOrderNumberNoRxId', () => {
  const appointmentId = 'appointment-id';
  it('should call findOne() with required params', () => {
    getAppointmentEventByOrderNumberNoRxId(appointmentId, databaseMock);
    expect(findOneMock).toHaveBeenCalledWith({
      $and: [
        { 'eventData.orderNumber': appointmentId },
        { eventType: 'appointment/confirmation' },
      ],
    });
    expect(sortMock).toHaveBeenCalledWith('-eventData.appointment.start');
  });
});

describe('getMaxOrderNumberFromAppointment', () => {
  it('should call findOne() with required params', () => {
    getMaxOrderNumberFromAppointment(databaseMock);
    expect(findOneMock).toHaveBeenCalledWith(
      {
        $and: [
          { eventType: 'appointment/confirmation' },
          { 'eventData.orderNumber': { $exists: true } },
        ],
      },
      'eventData.orderNumber'
    );
    expect(sortMock).toHaveBeenCalledWith('-eventData.orderNumber');
  });
});

describe('getUpcomingAppointmentEventsForMember', () => {
  const memberIds = ['id1'];
  const skip = 15;
  const limit = 5;
  it('should call find() with required params', async () => {
    await getUpcomingAppointmentEventsForMember(
      memberIds,
      databaseMock,
      skip,
      limit
    );
    expect(findMock).toHaveBeenCalledWith({
      $and: [
        { eventType: 'appointment/confirmation' },
        {
          'eventData.bookingStatus': 'Confirmed',
        },
        { 'eventData.appointment.memberRxId': { $in: memberIds } },
        {
          'eventData.appointment.startInUtc': {
            $gte: moment.utc().format(),
          },
        },
      ],
    });
    expect(sortMock).toHaveBeenCalledWith('eventData.appointment.start');
    expect(skipMock).toHaveBeenCalledWith(skip);
    expect(limitMock).toHaveBeenCalledWith(limit);
  });
});

describe('getPastAppointmentEventsForMember', () => {
  const memberIds = ['id1'];
  const skip = 15;
  const limit = 5;
  it('should call find() with required params', async () => {
    await getPastAppointmentEventsForMember(
      memberIds,
      databaseMock,
      skip,
      limit
    );
    expect(findMock).toHaveBeenCalledWith({
      $and: [
        { eventType: 'appointment/confirmation' },
        {
          $or: [
            { 'eventData.bookingStatus': 'Completed' },
            {
              $and: [
                { 'eventData.bookingStatus': 'Confirmed' },
                {
                  'eventData.appointment.startInUtc': {
                    $lt: moment.utc().format(),
                  },
                },
              ],
            },
          ],
        },
        { 'eventData.appointment.memberRxId': { $in: memberIds } },
      ],
    });
    expect(sortMock).toHaveBeenCalledWith('-eventData.appointment.start');
    expect(skipMock).toHaveBeenCalledWith(skip);
    expect(limitMock).toHaveBeenCalledWith(limit);
  });
});

describe('getCancelledAppointmentEventsForMember', () => {
  const memberIds = ['id1'];
  const skip = 15;
  const limit = 5;
  it('should call find() with required params', async () => {
    await getCancelledAppointmentEventsForMember(
      memberIds,
      databaseMock,
      skip,
      limit
    );
    expect(findMock).toHaveBeenCalledWith({
      $and: [
        { eventType: 'appointment/confirmation' },
        {
          $and: [
            { 'eventData.bookingStatus': 'Cancelled' },
            {
              'eventData.bookingStatusReason': {
                $in: [
                  'CustomerInitiatedCancellation',
                  'PharmacistInitiatedCancellation',
                ],
              },
            },
          ],
        },
        { 'eventData.appointment.memberRxId': { $in: memberIds } },
      ],
    });
    expect(sortMock).toHaveBeenCalledWith('-eventData.appointment.start');
    expect(skipMock).toHaveBeenCalledWith(skip);
    expect(limitMock).toHaveBeenCalledWith(limit);
  });
});
describe('getUpcomingAppointmentsCountEventForMember', () => {
  it('should call count with required params', () => {
    const memberIds = ['id1'];
    const currentDate = moment.utc().format();
    getUpcomingAppointmentsCountEventForMember(memberIds, databaseMock);
    expect(countDocumentsMock).toHaveBeenCalledWith({
      $and: [
        { eventType: 'appointment/confirmation' },
        { 'eventData.bookingStatus': 'Confirmed' },
        { 'eventData.appointment.memberRxId': { $in: memberIds } },
        { 'eventData.appointment.startInUtc': { $gte: currentDate } },
      ],
    });
    expect(sortMock).toHaveBeenCalledWith('-eventData.appointment.start');
  });
});
