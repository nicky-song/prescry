// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { knownFailureResponseAndPublishEvent } from '../../../utils/known-failure-and-publish-audit-event';
import { getAppointmentEventByOrderNumberNoRxId } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { buildAppointmentItem } from '../helpers/build-appointment-item';
import { getAppointmentHandler } from './get-appointment.handler';
import { IAppointmentItem } from '@phx/common/src/models/api-response/appointment.response';
import {
  IAppointment,
  IAppointmentEvent,
  IAppointmentInfo,
} from '../../../models/appointment-event';
import { getAllowedPersonsForLoggedInUser } from '../../../utils/person/get-dependent-person.helper';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { buildAppointmentPdf } from '../helpers/build-appointment-pdf';
import { publishViewAuditEvent } from '../../../utils/health-record-event/publish-view-audit-event';
import { ApiConstants } from '../../../constants/api-constants';
import { databaseMock } from '../../../mock-data/database.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IPerson } from '@phx/common/src/models/person';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import {
  mockPatient,
  mockPbmPatient,
} from '../../../mock-data/fhir-patient.mock';
import { assertHasPatient } from '../../../assertions/assert-has-patient';
import {
  getAllActivePatientsForLoggedInUser,
  getPatientWithMemberId,
} from '../../../utils/fhir-patient/patient.helper';
import { IPatient } from '../../../models/fhir/patient/patient';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper'
);
const getAppointmentEventByOrderNumberNoRxIdMock =
  getAppointmentEventByOrderNumberNoRxId as jest.Mock;

jest.mock('../../../utils/person/get-dependent-person.helper');
const getAllowedPersonsForLoggedInUserMock =
  getAllowedPersonsForLoggedInUser as jest.Mock;

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../helpers/build-appointment-item');
const buildAppointmentItemMock = buildAppointmentItem as jest.Mock;

jest.mock('../helpers/build-appointment-pdf');
const buildAppointmentPdfMock = buildAppointmentPdf as jest.Mock;

jest.mock('../../../utils/known-failure-and-publish-audit-event');
const knownFailureResponseAndPublishEventMock =
  knownFailureResponseAndPublishEvent as jest.Mock;

jest.mock('../../../utils/health-record-event/publish-view-audit-event');
const publishViewAuditEventMock = publishViewAuditEvent as jest.Mock;

jest.mock('../../../assertions/assert-has-patient');
const assertHasPatientMock = assertHasPatient as jest.Mock;

jest.mock('../../../utils/fhir-patient/patient.helper');
const getAllActivePatientsForLoggedInUserMock =
  getAllActivePatientsForLoggedInUser as jest.Mock;
const getPatientWithMemberIdMock = getPatientWithMemberId as jest.Mock;

describe('getAppointmentHandler', () => {
  const requestMock = {
    app: {},
    query: {},
    params: {
      identifier: '1234',
    },
  } as unknown as Request;
  const requestV2Mock = {
    app: {},
    query: {},
    params: {
      identifier: '1234',
    },
    headers: {
      [RequestHeaders.apiVersion]: 'v2',
    },
  } as unknown as Request;

  const routerResponseMock = {} as Response;

  const loggedInPersonMock = {
    primaryMemberRxId: 'member-id1',
    dateOfBirth: '2001-01-01',
  } as IPerson;
  const secondaryPersonMock = {
    primaryMemberRxId: 'member-id101',
    dateOfBirth: '2002-02-02',
  } as IPerson;

  beforeEach(() => {
    jest.clearAllMocks();
    successResponseMock.mockReturnValue('success');
    getAllowedPersonsForLoggedInUserMock.mockReturnValue([
      {
        primaryMemberRxId: 'member-id1',
        dateOfBirth: '2001-01-01',
      },
      {
        primaryMemberRxId: 'member-id101',
        dateOfBirth: '2002-02-02',
      },
    ]);
  });

  it('asserts patient exists in response locals (v2)', async () => {
    const memberRxIdMock = 'member-rx-id';
    const appointmentDetailsMock: Partial<IAppointmentEvent> = {
      eventData: {
        appointment: {
          memberRxId: memberRxIdMock,
        } as IAppointmentInfo,
      } as IAppointment,
    };
    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValue(
      appointmentDetailsMock
    );

    const activePatientsMock: IPatient[] = [mockPatient, mockPbmPatient];
    getAllActivePatientsForLoggedInUserMock.mockReturnValue(activePatientsMock);
    getPatientWithMemberIdMock.mockReturnValue(mockPbmPatient);

    const responseMock = {
      locals: { patient: mockPatient },
    } as unknown as Response;

    await getAppointmentHandler(
      requestV2Mock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getAllActivePatientsForLoggedInUserMock,
      responseMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      getPatientWithMemberIdMock,
      activePatientsMock,
      memberRxIdMock
    );
    expectToHaveBeenCalledOnceOnlyWith(assertHasPatientMock, mockPbmPatient);
  });

  it('builds appointment (v2)', async () => {
    const appointmentMock = {
      eventType: 'appointment/confirmation',
      eventData: {
        appointment: {
          memberRxId: 'member-id1',
        },
      },
      appointment: {},
      orderNumber: '1234',
    } as unknown as IAppointmentEvent;
    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValue(appointmentMock);

    getPatientWithMemberIdMock.mockReturnValue(mockPbmPatient);

    const responseMock = {
      locals: { patient: mockPatient },
    } as unknown as Response;

    await getAppointmentHandler(
      requestV2Mock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      buildAppointmentItemMock,
      appointmentMock,
      databaseMock,
      configurationMock,
      mockPbmPatient.birthDate
    );
  });

  it('returns success from getAppointmentHandler if there is an appointment for loggedInPerson', async () => {
    const appointment = {
      eventType: 'appointment/confirmation',
      eventData: {
        appointment: {
          memberRxId: 'member-id1',
        },
      },
      appointment: {},
      orderNumber: '1234',
    } as unknown as IAppointmentEvent;
    const appointmentItem: IAppointmentItem = {
      serviceName: 'service1',
      customerName: 'name',
      customerDateOfBirth: '01/01/2000',
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
      serviceDescription: 'service description',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };

    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(appointment);
    buildAppointmentItemMock.mockReturnValueOnce(appointmentItem);

    getAllowedPersonsForLoggedInUserMock.mockReturnValue([
      loggedInPersonMock,
      secondaryPersonMock,
    ]);

    const response = await getAppointmentHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(response).toEqual('success');

    expectToHaveBeenCalledOnceOnlyWith(
      getAllowedPersonsForLoggedInUserMock,
      routerResponseMock
    );
    expect(getAppointmentEventByOrderNumberNoRxIdMock).toHaveBeenCalledWith(
      '1234',
      databaseMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      buildAppointmentItemMock,
      appointment,
      databaseMock,
      configurationMock,
      loggedInPersonMock.dateOfBirth
    );

    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        appointment: appointmentItem,
      }
    );
  });

  it('returns success from getAppointmentHandler if there is an appointment for a dependent of the loggedInPerson', async () => {
    const appointment = {
      eventType: 'appointment/confirmation',
      eventData: {
        appointment: {
          memberRxId: 'member-id101',
        },
      },
      appointment: {},
      orderNumber: '1234',
    } as unknown as IAppointmentEvent;
    const appointmentItem: IAppointmentItem = {
      serviceName: 'service1',
      customerName: 'name',
      customerDateOfBirth: '01/01/2000',
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
      serviceDescription: 'service description',
      bookingStatus: 'Confirmed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
      appointmentLink: 'appointmentLink',
    };

    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(appointment);
    buildAppointmentItemMock.mockReturnValueOnce(appointmentItem);

    getAllowedPersonsForLoggedInUserMock.mockReturnValue([
      loggedInPersonMock,
      secondaryPersonMock,
    ]);

    const response = await getAppointmentHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(response).toEqual('success');
    expectToHaveBeenCalledOnceOnlyWith(
      getAllowedPersonsForLoggedInUserMock,
      routerResponseMock
    );

    expect(getAppointmentEventByOrderNumberNoRxIdMock).toHaveBeenCalledWith(
      '1234',
      databaseMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      buildAppointmentItemMock,
      appointment,
      databaseMock,
      configurationMock,
      secondaryPersonMock.dateOfBirth
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        appointment: appointmentItem,
      }
    );
  });

  it('returns success response with no value of appointment if there is no appointment for the id in database', async () => {
    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(null);
    const response = await getAppointmentHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(response).toEqual('success');
    expect(buildAppointmentItemMock).not.toBeCalled();
    expect(getAllowedPersonsForLoggedInUserMock).not.toHaveBeenCalled();
    expect(successResponseMock).toBeCalled();
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.SUCCESS_OK,
      {
        appointment: undefined,
      }
    );
  });
  it('returns unauthorized error from getAppointmentHandler if primaryMemberRxId is incorrect for all allowed persons', async () => {
    const appointment = {
      eventType: 'appointment/confirmation',
      eventData: {
        appointment: {
          memberRxId: 'member-id2',
        },
      },
      appointment: {},
      orderNumber: '1234',
    } as unknown as IAppointmentEvent;
    const expected = {} as Response<unknown>;
    knownFailureResponseAndPublishEventMock.mockReturnValueOnce(expected);
    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(appointment);

    const response = await getAppointmentHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(response).toEqual(expected);
    expect(getAllowedPersonsForLoggedInUserMock).toBeCalledTimes(1);
    expect(getAllowedPersonsForLoggedInUserMock).toHaveBeenCalledWith(
      routerResponseMock
    );
    expect(knownFailureResponseAndPublishEventMock).toBeCalledTimes(1);
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      ApiConstants.AUDIT_VIEW_EVENT_APPOINTMENT,
      '1234',
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
    expect(buildAppointmentItemMock).not.toBeCalled();
    expect(publishViewAuditEventMock).not.toBeCalled();
  });

  it('should return pdf in base64 string format', async () => {
    const appointment = {
      eventType: 'appointment/confirmation',
      eventData: {
        appointment: {
          memberRxId: 'member-id1',
        },
      },
      appointment: {},
      orderNumber: '1234',
    } as unknown as IAppointmentEvent;
    const appointmentItem: IAppointmentItem = {
      serviceName: 'service1',
      customerName: 'name',
      customerDateOfBirth: '01/01/2000',
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
      serviceDescription: 'service description',
      bookingStatus: 'Completed',
      startInUtc: new Date('2020-12-15T13:00:00+0000'),
      serviceType: '',
    } as IAppointmentItem;

    getAppointmentEventByOrderNumberNoRxIdMock.mockReturnValueOnce(appointment);
    buildAppointmentItemMock.mockReturnValueOnce(appointmentItem);

    getAllowedPersonsForLoggedInUserMock.mockReturnValue([
      loggedInPersonMock,
      secondaryPersonMock,
    ]);

    const response = await getAppointmentHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );

    expect(response).toEqual('success');
    expectToHaveBeenCalledOnceOnlyWith(
      getAllowedPersonsForLoggedInUserMock,
      routerResponseMock
    );

    expect(getAppointmentEventByOrderNumberNoRxIdMock).toHaveBeenCalledWith(
      '1234',
      databaseMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      buildAppointmentItemMock,
      appointment,
      databaseMock,
      configurationMock,
      loggedInPersonMock.dateOfBirth
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      routerResponseMock,
      SuccessConstants.DOCUMENT_FOUND,
      {
        appointment: appointmentItem,
      }
    );
    expect(buildAppointmentPdfMock).toHaveBeenCalled();
    expect(publishViewAuditEventMock).toBeCalledWith(
      requestMock,
      routerResponseMock,
      ApiConstants.AUDIT_VIEW_EVENT_APPOINTMENT,
      '1234',
      true
    );
  });

  it('returns error from getAppointmentHandler if any exception occurs', async () => {
    const error = { message: 'internal error' };
    getAppointmentEventByOrderNumberNoRxIdMock.mockImplementation(() => {
      throw error;
    });
    const expected = {} as Response<unknown>;
    unknownFailureResponseMock.mockReturnValueOnce(expected);
    const response = await getAppointmentHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
    expect(response).toEqual(expected);
    expect(getAllowedPersonsForLoggedInUserMock).not.toHaveBeenCalled();
    expect(buildAppointmentItemMock).not.toBeCalled();
    expect(unknownFailureResponseMock).toBeCalledTimes(1);
    expect(unknownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
