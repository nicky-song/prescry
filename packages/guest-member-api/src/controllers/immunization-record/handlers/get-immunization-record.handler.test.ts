// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  SuccessConstants,
  ErrorConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  getImmunizationRecordByOrderNumberForMembers,
  getImmunizationRecordByVaccineCodeForMembers,
} from '../../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  IProtocolApplied,
  IImmunizationRecordEvent,
  IVaccineCode,
} from '../../../models/immunization-record';
import { getAllowedMemberIdsForLoggedInUser } from '../../../utils/person/get-dependent-person.helper';
import {
  SuccessResponse,
  UnknownFailureResponse,
  KnownFailureResponse,
} from '../../../utils/response-helper';
import { knownFailureResponseAndPublishEvent } from '../../../utils/known-failure-and-publish-audit-event';
import { buildImmunizationRecord } from '../../immunization-record/helpers/build-immunization-record';

import { getImmunizationRecordHandler } from './get-immunization-record.handler';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ApiConstants } from '../../../constants/api-constants';
import { publishViewAuditEvent } from '../../../utils/health-record-event/publish-view-audit-event';

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper'
);
jest.mock('../../../utils/person/get-dependent-person.helper');
jest.mock('../../../utils/response-helper');
jest.mock('../../immunization-record/helpers/build-immunization-record');
jest.mock('../../../utils/request/request-app-locals.helper');
const routerResponseMock = {} as Response;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const getImmunizationRecordByOrderNumberForMembersMock =
  getImmunizationRecordByOrderNumberForMembers as jest.Mock;
const getImmunizationRecordByVaccineCodeForMembersMock =
  getImmunizationRecordByVaccineCodeForMembers as jest.Mock;
const buildImmunizationRecordMock = buildImmunizationRecord as jest.Mock;
const getAllowedMemberIdsForLoggedInUserMock =
  getAllowedMemberIdsForLoggedInUser as jest.Mock;

jest.mock('../../../utils/known-failure-and-publish-audit-event');
const knownFailureResponseAndPublishEventMock =
  knownFailureResponseAndPublishEvent as jest.Mock;

jest.mock('../../../utils/health-record-event/publish-view-audit-event');
const publishViewAuditEventMock = publishViewAuditEvent as jest.Mock;

const databaseMock = {
  Models: {},
} as unknown as IDatabase;
const requestMock = {
  app: {},
  query: {},
  params: {
    identifier: '1234',
  },
} as unknown as Request;

beforeEach(() => {
  jest.clearAllMocks();
  successResponseMock.mockReturnValue('success');
  getAllowedMemberIdsForLoggedInUserMock.mockReturnValue(['member-id1']);
});

describe('getImmunizationRecordHandler', () => {
  it('returns success if there is atleast one procedure for loggedInPerson', async () => {
    const immunizationRecordEvent = {
      eventType: 'immunization',
      eventData: {
        orderNumber: '1234',
        immunizationId: '561bf978-c4c2-4c14-a889-599348f7fef2',
        manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
        lotNumber: '12221',
        vaccineCodes: [
          {
            code: '91300',
          } as IVaccineCode,
        ],
        protocolApplied: {
          series: '1-dose',
          doseNumber: 1,
          seriesDoses: 2,
        } as IProtocolApplied,
        memberRxId: 'member-id1',
      },
    } as unknown as IImmunizationRecordEvent;

    const immunizationRecord = {
      orderNumber: '1234',
      immunizationId: '561bf978-c4c2-4c14-a889-599348f7fef2',
      manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
      lotNumber: '12221',
      doseNumber: 1,
      memberId: 'member-id1',
      vaccineCode: '91300',
    };

    const pastProcedureResult = [immunizationRecord];

    getImmunizationRecordByOrderNumberForMembersMock.mockReturnValueOnce(
      immunizationRecordEvent
    );
    buildImmunizationRecordMock.mockReturnValueOnce(immunizationRecord);

    const response = await getImmunizationRecordHandler(
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

    expect(
      getImmunizationRecordByOrderNumberForMembersMock
    ).toHaveBeenCalledWith(['member-id1'], '1234', databaseMock);
    expect(buildImmunizationRecordMock).toBeCalledTimes(1);
    expect(buildImmunizationRecordMock).toHaveBeenCalledWith(
      immunizationRecordEvent,
      databaseMock,
      configurationMock
    );

    expect(getImmunizationRecordByVaccineCodeForMembersMock).not.toBeCalled();

    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.SUCCESS_OK,
      {
        immunizationResult: pastProcedureResult,
      }
    );
  });

  it('returns success with all previous dosage details if there is more than one procedure for loggedInPerson', async () => {
    const immunizationRecordEvent = {
      eventType: 'immunization',
      eventData: {
        orderNumber: '1234',
        immunizationId: '561bf978-c4c2-4c14-a889-599348f7fef2',
        manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
        lotNumber: '12221',
        vaccineCodes: [
          {
            code: '91300',
          } as IVaccineCode,
        ],
        protocolApplied: {
          series: '1-dose',
          doseNumber: 2,
          seriesDoses: 2,
        } as IProtocolApplied,
        memberRxId: 'member-id1',
      },
    } as unknown as IImmunizationRecordEvent;

    const immunizationRecordForSecondDose = {
      orderNumber: '1234',
      immunizationId: '561bf978-c4c2-4c14-a889-599348f7fef2',
      manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
      lotNumber: '12221',
      doseNumber: 2,
      memberId: 'member-id1',
      vaccineCode: '91300',
    };

    const immunizationRecordForFirstDose = {
      orderNumber: '2345',
      immunizationId: '561bf978-c4c2-4c14-a889-756248f7fef2',
      manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
      lotNumber: '12221',
      doseNumber: 1,
      memberId: 'member-id1',
      vaccineCode: '91300',
    };

    const immunizationRecordEventByVaccineCode = [
      {
        eventType: 'immunization',
        eventData: {
          orderNumber: '1234',
          immunizationId: '561bf978-c4c2-4c14-a889-599348f7fef2',
          manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
          lotNumber: '12221',
          vaccineCodes: [
            {
              code: '91300',
            } as IVaccineCode,
          ],
          protocolApplied: {
            series: '1-dose',
            doseNumber: 2,
            seriesDoses: 2,
          } as IProtocolApplied,
          memberRxId: 'member-id1',
        },
      } as IImmunizationRecordEvent,
      {
        eventType: 'immunization',
        eventData: {
          orderNumber: '2345',
          immunizationId: '561bf978-c4c2-4c14-a889-756248f7fef2',
          manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
          lotNumber: '12221',
          vaccineCodes: [
            {
              code: '91300',
            } as IVaccineCode,
          ],
          protocolApplied: {
            series: '1-dose',
            doseNumber: 1,
            seriesDoses: 2,
          } as IProtocolApplied,
          memberRxId: 'member-id1',
        },
      } as IImmunizationRecordEvent,
    ] as unknown as IImmunizationRecordEvent;

    const pastProcedureResult = [immunizationRecordForSecondDose];

    getImmunizationRecordByOrderNumberForMembersMock.mockReturnValueOnce(
      immunizationRecordEvent
    );
    getImmunizationRecordByVaccineCodeForMembersMock.mockResolvedValueOnce(
      immunizationRecordEventByVaccineCode
    );
    buildImmunizationRecordMock
      .mockReturnValueOnce(immunizationRecordForSecondDose)
      .mockReturnValue(immunizationRecordForFirstDose);

    const response = await getImmunizationRecordHandler(
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

    expect(
      getImmunizationRecordByOrderNumberForMembersMock
    ).toHaveBeenCalledWith(['member-id1'], '1234', databaseMock);

    expect(buildImmunizationRecordMock).toHaveBeenNthCalledWith(
      1,
      immunizationRecordEvent,
      databaseMock,
      configurationMock
    );

    expect(getImmunizationRecordByVaccineCodeForMembersMock).toBeCalled();
    expect(
      getImmunizationRecordByVaccineCodeForMembersMock
    ).toHaveBeenCalledWith(
      ['member-id1'],
      immunizationRecordForSecondDose.vaccineCode,
      databaseMock
    );
    pastProcedureResult.push(immunizationRecordForFirstDose);
    expect(buildImmunizationRecordMock).toBeCalledTimes(2);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.SUCCESS_OK,
      {
        immunizationResult: pastProcedureResult,
      }
    );
  });

  it('returns success from getImmunizationRecordHandler if there is a procedure for a dependent of the loggedInPerson', async () => {
    const immunizationRecordEvent = {
      eventType: 'immunization',
      eventData: {
        orderNumber: '1234',
        immunizationId: '561bf978-c4c2-4c14-a889-599348f7fef2',
        manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
        lotNumber: '12221',
        vaccineCodes: [
          {
            code: '91300',
          } as IVaccineCode,
        ],
        protocolApplied: {
          series: '1-dose',
          doseNumber: 1,
          seriesDoses: 2,
        } as IProtocolApplied,
        memberRxId: 'member-id101',
      },
    } as unknown as IImmunizationRecordEvent;

    const immunizationRecord = {
      orderNumber: '1234',
      immunizationId: '561bf978-c4c2-4c14-a889-599348f7fef2',
      manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
      lotNumber: '12221',
      doseNumber: 1,
      memberId: 'member-id101',
      vaccineCode: '91300',
    };

    getAllowedMemberIdsForLoggedInUserMock.mockReturnValueOnce([
      'member-id101',
    ]);
    getImmunizationRecordByOrderNumberForMembersMock.mockReturnValueOnce(
      immunizationRecordEvent
    );
    buildImmunizationRecordMock.mockReturnValueOnce(immunizationRecord);

    const response = await getImmunizationRecordHandler(
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

    expect(
      getImmunizationRecordByOrderNumberForMembersMock
    ).toHaveBeenCalledWith(['member-id101'], '1234', databaseMock);
    expect(buildImmunizationRecordMock).toBeCalledTimes(1);
    expect(buildImmunizationRecordMock).toHaveBeenCalledWith(
      immunizationRecordEvent,
      databaseMock,
      configurationMock
    );
    expect(getImmunizationRecordByVaccineCodeForMembersMock).not.toBeCalled();
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.SUCCESS_OK,
      {
        immunizationResult: [immunizationRecord],
      }
    );
  });

  it('returns all previous dosage details if there is more than one procedure for a dependent of the loggedInPerson', async () => {
    const memberIds = ['member-id1', 'member-id101'];
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValue(memberIds);
    const immunizationRecordEvent = {
      eventType: 'immunization',
      eventData: {
        orderNumber: '1234',
        immunizationId: '561bf978-c4c2-4c14-a889-599348f7fef2',
        manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
        lotNumber: '12221',
        vaccineCodes: [
          {
            code: '91300',
          } as IVaccineCode,
        ],
        protocolApplied: {
          series: '1-dose',
          doseNumber: 2,
          seriesDoses: 2,
        } as IProtocolApplied,
        memberRxId: 'member-id101',
      },
    } as unknown as IImmunizationRecordEvent;

    const immunizationRecordForSecondDose = {
      orderNumber: '1234',
      immunizationId: '561bf978-c4c2-4c14-a889-599348f7fef2',
      manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
      lotNumber: '12221',
      doseNumber: 2,
      memberId: 'member-id101',
      vaccineCode: '91300',
    };

    const immunizationRecordForFirstDose = {
      orderNumber: '2345',
      immunizationId: '561bf978-c4c2-4c14-a889-756248f7fef2',
      manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
      lotNumber: '12221',
      doseNumber: 1,
      memberId: 'member-id101',
      vaccineCode: '91300',
    };

    const immunizationRecordEventByVaccineCode = [
      {
        eventType: 'immunization',
        eventData: {
          orderNumber: '1234',
          immunizationId: '561bf978-c4c2-4c14-a889-599348f7fef2',
          manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
          lotNumber: '12221',
          vaccineCodes: [
            {
              code: '91300',
            } as IVaccineCode,
          ],
          protocolApplied: {
            series: '1-dose',
            doseNumber: 2,
            seriesDoses: 2,
          } as IProtocolApplied,
          memberRxId: 'member-id101',
        },
      } as IImmunizationRecordEvent,
      {
        eventType: 'immunization',
        eventData: {
          orderNumber: '2345',
          immunizationId: '561bf978-c4c2-4c14-a889-756248f7fef2',
          manufacturer: 'Pfizer-Biontech Covid-19 Vaccine',
          lotNumber: '12221',
          vaccineCodes: [
            {
              code: '91300',
            } as IVaccineCode,
          ],
          protocolApplied: {
            series: '1-dose',
            doseNumber: 1,
            seriesDoses: 2,
          } as IProtocolApplied,
          memberRxId: 'member-id101',
        },
      } as IImmunizationRecordEvent,
    ] as unknown as IImmunizationRecordEvent;

    const pastProcedureResult = [immunizationRecordForSecondDose];

    getImmunizationRecordByOrderNumberForMembersMock.mockReturnValueOnce(
      immunizationRecordEvent
    );
    getImmunizationRecordByVaccineCodeForMembersMock.mockResolvedValueOnce(
      immunizationRecordEventByVaccineCode
    );
    buildImmunizationRecordMock
      .mockReturnValueOnce(immunizationRecordForSecondDose)
      .mockReturnValue(immunizationRecordForFirstDose);

    const response = await getImmunizationRecordHandler(
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

    expect(
      getImmunizationRecordByOrderNumberForMembersMock
    ).toHaveBeenCalledWith(memberIds, '1234', databaseMock);

    expect(buildImmunizationRecordMock).toHaveBeenNthCalledWith(
      1,
      immunizationRecordEvent,
      databaseMock,
      configurationMock
    );

    expect(getImmunizationRecordByVaccineCodeForMembersMock).toBeCalled();
    expect(
      getImmunizationRecordByVaccineCodeForMembersMock
    ).toHaveBeenCalledWith(
      memberIds,
      immunizationRecordForSecondDose.vaccineCode,
      databaseMock
    );
    pastProcedureResult.push(immunizationRecordForFirstDose);
    expect(buildImmunizationRecordMock).toBeCalledTimes(2);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      SuccessConstants.SUCCESS_OK,
      {
        immunizationResult: pastProcedureResult,
      }
    );
    expect(publishViewAuditEventMock).toBeCalledWith(
      requestMock,
      routerResponseMock,
      ApiConstants.AUDIT_VIEW_EVENT_VACCINE_RECORD,
      '1234',
      true
    );
  });
  it('returns unauthorized error if unauthorized person tries to access the data', async () => {
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValueOnce([]);
    const expected = {} as Response<unknown>;
    knownFailureResponseAndPublishEventMock.mockReturnValueOnce(expected);
    const response = await getImmunizationRecordHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(response).toEqual(expected);
    expect(getAllowedMemberIdsForLoggedInUserMock).toBeCalledTimes(1);
    expect(getAllowedMemberIdsForLoggedInUserMock).toHaveBeenCalledWith(
      routerResponseMock
    );
    expect(getImmunizationRecordByOrderNumberForMembersMock).toBeCalled();
    expect(
      getImmunizationRecordByOrderNumberForMembersMock
    ).toHaveBeenCalledWith([], '1234', databaseMock);
    expect(getImmunizationRecordByVaccineCodeForMembersMock).not.toBeCalled();
    expect(knownFailureResponseAndPublishEventMock).toBeCalledTimes(1);
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      ApiConstants.AUDIT_VIEW_EVENT_VACCINE_RECORD,
      '1234',
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
    expect(publishViewAuditEventMock).not.toBeCalled();

    expect(buildImmunizationRecordMock).not.toBeCalled();
  });

  it('returns error if order number is not passed', async () => {
    const requestNoParamMock = {
      app: {},
      query: {},
      params: {},
    } as unknown as Request;
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValue(['member-id1']);
    const expected = {} as Response<unknown>;
    knownFailureResponseMock.mockReturnValueOnce(expected);
    const response = await getImmunizationRecordHandler(
      requestNoParamMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(response).toEqual(expected);
    expect(getAllowedMemberIdsForLoggedInUserMock).toBeCalledTimes(1);
    expect(getAllowedMemberIdsForLoggedInUserMock).toHaveBeenCalledWith(
      routerResponseMock
    );
    expect(getImmunizationRecordByOrderNumberForMembersMock).not.toBeCalled();
    expect(getImmunizationRecordByVaccineCodeForMembersMock).not.toBeCalled();
    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.ORDER_NUMBER_MISSING
    );
    expect(publishViewAuditEventMock).not.toBeCalled();
    expect(buildImmunizationRecordMock).not.toBeCalled();
  });
  it('returns error from getImmunizationRecordHandler if any exception occurs', async () => {
    const error = { message: 'internal server error' };
    getImmunizationRecordByOrderNumberForMembersMock.mockImplementation(() => {
      throw error;
    });
    const expected = {} as Response<unknown>;
    unknownFailureResponseMock.mockReturnValueOnce(expected);
    const response = await getImmunizationRecordHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
    expect(getAllowedMemberIdsForLoggedInUserMock).toHaveBeenCalled();
    expect(response).toEqual(expected);

    expect(unknownFailureResponseMock).toBeCalledTimes(1);
    expect(unknownFailureResponseMock).toHaveBeenCalledWith(
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
