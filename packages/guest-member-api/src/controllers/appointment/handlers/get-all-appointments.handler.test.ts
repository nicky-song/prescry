// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';

import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';

import {
  getAllAppointmentEventsForMember,
  getCancelledAppointmentEventsForMember,
  getPastAppointmentEventsForMember,
  getUpcomingAppointmentEventsForMember,
} from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { buildAppointmentListItem } from '../helpers/build-appointment-list-item';
import { getAllAppointmentsHandler } from './get-all-appointments.handler';
import { IAppointmentEvent } from '../../../models/appointment-event';
import { IAppointmentItem } from '@phx/common/src/models/api-response/appointment.response';
import { getAllowedMemberIdsForLoggedInUser } from '../../../utils/person/get-dependent-person.helper';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { configurationMock } from '../../../mock-data/configuration.mock';

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper'
);
jest.mock('../../../utils/response-helper');
jest.mock('../helpers/build-appointment-list-item');
jest.mock('../../../utils/person/get-dependent-person.helper');
jest.mock('../../../utils/request/get-request-query');

const routerResponseMock = {} as Response;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const getAllAppointmentEventsForMemberMock =
  getAllAppointmentEventsForMember as jest.Mock;
const buildAppointmentListItemMock = buildAppointmentListItem as jest.Mock;
const getAllowedMemberIdsForLoggedInUserMock =
  getAllowedMemberIdsForLoggedInUser as jest.Mock;
const databaseMock = {
  Models: {},
} as unknown as IDatabase;
const requestMock = {
  app: {},
  query: {},
} as unknown as Request;
const getRequestQueryMock = getRequestQuery as jest.Mock;
const getUpcomingAppointmentEventsForMemberMock =
  getUpcomingAppointmentEventsForMember as jest.Mock;
const getPastAppointmentEventsForMemberMock =
  getPastAppointmentEventsForMember as jest.Mock;
const getCancelledAppointmentEventsForMemberMock =
  getCancelledAppointmentEventsForMember as jest.Mock;

beforeEach(() => {
  jest.resetAllMocks();
  successResponseMock.mockReturnValue('success');
});
describe('getAllAppointmentsHandler', () => {
  it('returns success from getAllAppointmentsHandler if there is no error from database', async () => {
    const appointment1 = {
      eventType: 'appointment/confirmation',
      eventData: { appointment: {}, orderNumber: '1234' },
    } as unknown as IAppointmentEvent;
    const appointment2 = {
      eventType: 'appointment/confirmation',
      eventData: { appointment: {}, orderNumber: '1235' },
    };
    const appointments = [appointment1, appointment2];
    const appointmentItem1: IAppointmentItem = {
      serviceName: 'service1',
      customerName: 'name1',
      customerDateOfBirth: '01/03/2000',
      status: 'Accepted',
      orderNumber: '1234',
      locationName: 'Rx Pharmacy',
      address1: 'street',
      city: 'city',
      state: 'WA',
      zip: 'fake-zip',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
      procedureCode: 'procedure-code',
      serviceDescription: 'service-description',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };
    const appointmentItem2: IAppointmentItem = {
      serviceName: 'service2',
      customerName: 'name2',
      customerDateOfBirth: '01/02/2000',
      status: 'Accepted',
      orderNumber: '1235',
      locationName: 'Rx Pharmacy',
      address1: 'street',
      city: 'city',
      state: 'WA',
      zip: 'fake-zip2',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
      procedureCode: 'procedure-code2',
      serviceDescription: 'service-description2',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValueOnce(['member-id1']);
    getAllAppointmentEventsForMemberMock.mockReturnValueOnce(appointments);
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentItem1);
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentItem2);

    const response = await getAllAppointmentsHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(response).toEqual('success');
    expect(getAllowedMemberIdsForLoggedInUserMock).toHaveBeenCalledWith(
      routerResponseMock
    );

    expect(getAllAppointmentEventsForMemberMock).toHaveBeenCalledWith(
      ['member-id1'],
      databaseMock
    );
    expect(buildAppointmentListItemMock).toBeCalledTimes(2);
    expect(buildAppointmentListItemMock.mock.calls[0]).toEqual([
      appointment1,
      configurationMock,
    ]);
    expect(buildAppointmentListItemMock.mock.calls[1]).toEqual([
      appointment2,
      configurationMock,
    ]);

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        appointments: [appointmentItem1, appointmentItem2],
      }
    );
  });

  it('includes appointments for dependendents from getAllAppointmentsHandler if there is no error from database', async () => {
    const appointment1 = {
      eventType: 'appointment/confirmation',
      eventData: { appointment: {}, orderNumber: '1234' },
    } as unknown as IAppointmentEvent;
    const appointment2 = {
      eventType: 'appointment/confirmation',
      eventData: { appointment: {}, orderNumber: '1235' },
    };
    const appointment3 = {
      eventType: 'appointment/confirmation',
      eventData: { appointment: {}, orderNumber: '1236' },
    };
    const appointments = [appointment1, appointment2, appointment3];
    const appointmentItem1: IAppointmentItem = {
      serviceName: 'service1',
      customerName: 'name1',
      customerDateOfBirth: '12/30/1999',
      status: 'Accepted',
      orderNumber: '1234',
      locationName: 'Rx Pharmacy',
      address1: 'street',
      city: 'city',
      state: 'WA',
      zip: 'fake-zip',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
      procedureCode: 'procedure-code',
      serviceDescription: 'service-description',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };
    const appointmentItem2: IAppointmentItem = {
      serviceName: 'service2',
      customerName: 'name2',
      customerDateOfBirth: '12/31/1999',
      status: 'Accepted',
      orderNumber: '1235',
      locationName: 'Rx Pharmacy',
      address1: 'street',
      city: 'city',
      state: 'WA',
      zip: 'fake-zip2',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
      procedureCode: 'procedure-code2',
      serviceDescription: 'service-description2',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };

    const appointmentItem3: IAppointmentItem = {
      serviceName: 'service3',
      customerName: 'dependent',
      customerDateOfBirth: '01/01/2000',
      status: 'Accepted',
      orderNumber: '1235',
      locationName: 'Rx Pharmacy',
      address1: 'street',
      city: 'city',
      state: 'WA',
      zip: 'fake-zip2',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
      procedureCode: 'procedure-code3',
      serviceDescription: 'service-description2',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };

    getAllAppointmentEventsForMemberMock.mockReturnValueOnce(appointments);
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValueOnce([
      'member-id1',
      'member-id101',
    ]);
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentItem1);
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentItem2);
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentItem3);
    const response = await getAllAppointmentsHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(response).toEqual('success');
    expect(getAllowedMemberIdsForLoggedInUserMock).toBeCalledTimes(1);
    expect(getAllowedMemberIdsForLoggedInUserMock).toHaveBeenCalledWith(
      routerResponseMock
    );
    expect(getAllAppointmentEventsForMemberMock).toHaveBeenCalledWith(
      ['member-id1', 'member-id101'],
      databaseMock
    );
    expect(buildAppointmentListItemMock).toBeCalledTimes(3);
    expect(buildAppointmentListItemMock.mock.calls[0]).toEqual([
      appointment1,
      configurationMock,
    ]);
    expect(buildAppointmentListItemMock.mock.calls[1]).toEqual([
      appointment2,
      configurationMock,
    ]);
    expect(buildAppointmentListItemMock.mock.calls[2]).toEqual([
      appointment3,
      configurationMock,
    ]);

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        appointments: [appointmentItem1, appointmentItem2, appointmentItem3],
      }
    );
  });

  it('returns success from getAllAppointmentsHandler with no appointments if there is no appointments for user in database', async () => {
    getAllAppointmentEventsForMemberMock.mockReturnValueOnce([]);
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValueOnce(['member-id1']);
    await getAllAppointmentsHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(getAllowedMemberIdsForLoggedInUserMock).toBeCalledTimes(1);
    expect(getAllowedMemberIdsForLoggedInUserMock).toHaveBeenCalledWith(
      routerResponseMock
    );
    expect(getAllAppointmentEventsForMemberMock).toHaveBeenCalledWith(
      ['member-id1'],
      databaseMock
    );
    expect(buildAppointmentListItemMock).not.toBeCalled();
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        appointments: [],
      }
    );
  });
  it('returns error from getAllAppointmentsHandler if any exception occurs', async () => {
    const error = { message: 'internal error' };
    getAllowedMemberIdsForLoggedInUserMock.mockImplementation(() => {
      throw error;
    });
    await getAllAppointmentsHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(getAllowedMemberIdsForLoggedInUserMock).toBeCalledTimes(1);
    expect(getAllowedMemberIdsForLoggedInUserMock).toHaveBeenCalledWith(
      routerResponseMock
    );
    expect(getAllAppointmentEventsForMemberMock).not.toBeCalled();
    expect(buildAppointmentListItemMock).not.toBeCalled();
    expect(unknownFailureResponseMock).toBeCalledTimes(1);
    expect(unknownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });

  it('returns upcoming appointments when appointment type is upcoming', async () => {
    const appointment1 = {
      eventType: 'appointment/confirmation',
      eventData: { appointment: {}, orderNumber: '1234' },
    } as unknown as IAppointmentEvent;
    const appointment2 = {
      eventType: 'appointment/confirmation',
      eventData: { appointment: {}, orderNumber: '1235' },
    };
    const appointments = [appointment1, appointment2];
    const appointmentItem1: IAppointmentItem = {
      serviceName: 'service1',
      customerName: 'name1',
      customerDateOfBirth: '01/03/2000',
      status: 'Accepted',
      orderNumber: '1234',
      locationName: 'Rx Pharmacy',
      address1: 'street',
      city: 'city',
      state: 'WA',
      zip: 'fake-zip',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
      procedureCode: 'procedure-code',
      serviceDescription: 'service-description',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };
    const appointmentItem2: IAppointmentItem = {
      serviceName: 'service2',
      customerName: 'name2',
      customerDateOfBirth: '01/02/2000',
      status: 'Accepted',
      orderNumber: '1235',
      locationName: 'Rx Pharmacy',
      address1: 'street',
      city: 'city',
      state: 'WA',
      zip: 'fake-zip2',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
      procedureCode: 'procedure-code2',
      serviceDescription: 'service-description2',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValueOnce(['member-id1']);
    getUpcomingAppointmentEventsForMemberMock.mockReturnValueOnce(appointments);
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentItem1);
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentItem2);
    getRequestQueryMock.mockReturnValueOnce(0);
    getRequestQueryMock.mockReturnValueOnce('upcoming');

    const response = await getAllAppointmentsHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(response).toEqual('success');
    expect(getAllowedMemberIdsForLoggedInUserMock).toHaveBeenCalledWith(
      routerResponseMock
    );

    expect(getUpcomingAppointmentEventsForMemberMock).toHaveBeenCalledWith(
      ['member-id1'],
      databaseMock,
      0,
      5
    );
    expect(buildAppointmentListItemMock).toBeCalledTimes(2);
    expect(buildAppointmentListItemMock.mock.calls[0]).toEqual([
      appointment1,
      configurationMock,
    ]);
    expect(buildAppointmentListItemMock.mock.calls[1]).toEqual([
      appointment2,
      configurationMock,
    ]);

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        appointments: [appointmentItem1, appointmentItem2],
      }
    );
  });

  it('returns past appointments when appointment type is past', async () => {
    const appointment1 = {
      eventType: 'appointment/confirmation',
      eventData: { appointment: {}, orderNumber: '1234' },
    } as unknown as IAppointmentEvent;
    const appointment2 = {
      eventType: 'appointment/confirmation',
      eventData: { appointment: {}, orderNumber: '1235' },
    };
    const appointments = [appointment1, appointment2];
    const appointmentItem1: IAppointmentItem = {
      serviceName: 'service1',
      customerName: 'name1',
      customerDateOfBirth: '01/03/2000',
      status: 'Accepted',
      orderNumber: '1234',
      locationName: 'Rx Pharmacy',
      address1: 'street',
      city: 'city',
      state: 'WA',
      zip: 'fake-zip',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
      procedureCode: 'procedure-code',
      serviceDescription: 'service-description',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };
    const appointmentItem2: IAppointmentItem = {
      serviceName: 'service2',
      customerName: 'name2',
      customerDateOfBirth: '01/02/2000',
      status: 'Accepted',
      orderNumber: '1235',
      locationName: 'Rx Pharmacy',
      address1: 'street',
      city: 'city',
      state: 'WA',
      zip: 'fake-zip2',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
      procedureCode: 'procedure-code2',
      serviceDescription: 'service-description2',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValueOnce(['member-id1']);
    getPastAppointmentEventsForMemberMock.mockReturnValueOnce(appointments);
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentItem1);
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentItem2);
    getRequestQueryMock.mockReturnValueOnce(5);
    getRequestQueryMock.mockReturnValueOnce('past');

    const response = await getAllAppointmentsHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(response).toEqual('success');
    expect(getAllowedMemberIdsForLoggedInUserMock).toHaveBeenCalledWith(
      routerResponseMock
    );

    expect(getPastAppointmentEventsForMemberMock).toHaveBeenCalledWith(
      ['member-id1'],
      databaseMock,
      5,
      5
    );
    expect(buildAppointmentListItemMock).toBeCalledTimes(2);
    expect(buildAppointmentListItemMock.mock.calls[0]).toEqual([
      appointment1,
      configurationMock,
    ]);
    expect(buildAppointmentListItemMock.mock.calls[1]).toEqual([
      appointment2,
      configurationMock,
    ]);

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        appointments: [appointmentItem1, appointmentItem2],
      }
    );
  });

  it('returns cancelled appointments when appointment type is cancelled', async () => {
    const appointment1 = {
      eventType: 'appointment/confirmation',
      eventData: { appointment: {}, orderNumber: '1234' },
    } as unknown as IAppointmentEvent;
    const appointment2 = {
      eventType: 'appointment/confirmation',
      eventData: { appointment: {}, orderNumber: '1235' },
    };
    const appointments = [appointment1, appointment2];
    const appointmentItem1: IAppointmentItem = {
      serviceName: 'service1',
      customerName: 'name1',
      customerDateOfBirth: '01/03/2000',
      status: 'Accepted',
      orderNumber: '1234',
      locationName: 'Rx Pharmacy',
      address1: 'street',
      city: 'city',
      state: 'WA',
      zip: 'fake-zip',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
      procedureCode: 'procedure-code',
      serviceDescription: 'service-description',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };
    const appointmentItem2: IAppointmentItem = {
      serviceName: 'service2',
      customerName: 'name2',
      customerDateOfBirth: '01/02/2000',
      status: 'Accepted',
      orderNumber: '1235',
      locationName: 'Rx Pharmacy',
      address1: 'street',
      city: 'city',
      state: 'WA',
      zip: 'fake-zip2',
      date: 'date',
      time: 'time',
      providerTaxId: 'dummy Tax Id',
      paymentStatus: 'no_payment_required',
      procedureCode: 'procedure-code2',
      serviceDescription: 'service-description2',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValueOnce(['member-id1']);
    getCancelledAppointmentEventsForMemberMock.mockReturnValueOnce(
      appointments
    );
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentItem1);
    buildAppointmentListItemMock.mockReturnValueOnce(appointmentItem2);
    getRequestQueryMock.mockReturnValueOnce('invalid-number');
    getRequestQueryMock.mockReturnValueOnce('cancelled');

    const response = await getAllAppointmentsHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(response).toEqual('success');
    expect(getAllowedMemberIdsForLoggedInUserMock).toHaveBeenCalledWith(
      routerResponseMock
    );

    expect(getCancelledAppointmentEventsForMemberMock).toHaveBeenCalledWith(
      ['member-id1'],
      databaseMock,
      0,
      5
    );
    expect(buildAppointmentListItemMock).toBeCalledTimes(2);
    expect(buildAppointmentListItemMock.mock.calls[0]).toEqual([
      appointment1,
      configurationMock,
    ]);
    expect(buildAppointmentListItemMock.mock.calls[1]).toEqual([
      appointment2,
      configurationMock,
    ]);

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        appointments: [appointmentItem1, appointmentItem2],
      }
    );
  });
  // TODO: input start val
});
