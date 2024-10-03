// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { PatientTestResultsController } from './patient-test-results.controller';
import { ITestResult } from '@phx/common/src/models/api-response/test-result-response';
import { IPatientTestResultEvent } from '../../databases/mongo-database/v1/definitions/patient-test-result-event.definition';
import { getTestResultByOrderNumberForMembers } from '../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper';
import { IPatientTestResult } from '../../models/patient-test-result';
import { getAllowedMemberIdsForLoggedInUser } from '../../utils/person/get-dependent-person.helper';
import { getAllRecordsForLoggedInPerson } from '../../utils/person/get-logged-in-person.helper';
import {
  SuccessResponse,
  UnknownFailureResponse,
  KnownFailureResponse,
} from '../../utils/response-helper';
import { buildPatientTestResult } from './helpers/build-patient-test-results';
import { buildPatientTestResultPdf } from './helpers/build-patient-test-result.pdf';
import { pdfMock } from '../../mock-data/pdf-mock.mock';
import { configurationMock } from '../../mock-data/configuration.mock';
import { ApiConstants } from '../../constants/api-constants';
import { publishViewAuditEvent } from '../../utils/health-record-event/publish-view-audit-event';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { knownFailureResponseAndPublishEvent } from '../../utils/known-failure-and-publish-audit-event';
import { databaseMock } from '../../mock-data/database.mock';

jest.mock('../../utils/request-helper');
jest.mock('../../utils/response-helper');
jest.mock('./helpers/build-patient-test-results');
jest.mock('../../utils/person/get-logged-in-person.helper');
jest.mock('../../utils/request/request-app-locals.helper');
jest.mock(
  '../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper'
);
jest.mock('../../utils/person/get-dependent-person.helper');

jest.mock('./helpers/build-patient-test-result.pdf');

const routerResponseMock = {
  locals: {
    personInfo: {
      primaryMemberRxId: 'memberId',
    },
  },
} as unknown as Response;

const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const buildPatientTestResultMock = buildPatientTestResult as jest.Mock;
const getAllRecordsForLoggedInPersonMock =
  getAllRecordsForLoggedInPerson as jest.Mock;
const getAllowedMemberIdsForLoggedInUserMock =
  getAllowedMemberIdsForLoggedInUser as jest.Mock;
const getTestResultByOrderNumberForMembersMock =
  getTestResultByOrderNumberForMembers as jest.Mock;
const buildPatientTestResultPdfMock = buildPatientTestResultPdf as jest.Mock;

jest.mock('../../utils/known-failure-and-publish-audit-event');
const knownFailureResponseAndPublishEventMock =
  knownFailureResponseAndPublishEvent as jest.Mock;
jest.mock('../../utils/health-record-event/publish-view-audit-event');
const publishViewAuditEventMock = publishViewAuditEvent as jest.Mock;
const patientTestResultMock: IPatientTestResult = {
  icd10: ['U07.D'],
  primaryMemberRxId: '2020052501',
  productOrService: '00000190000',
  fillDate: new Date('2020-11-01'),
  provider: '1881701167',
  orderNumber: '1234',
};
const patientTestResultEventMock: IPatientTestResultEvent = {
  identifiers: [
    {
      type: 'memberRxId',
      value: '2020052501',
    },
  ],
  createdOn: 1594235032,
  createdBy: 'patientTestResultProcessor',
  tags: [],
  eventType: 'observation',
  eventData: patientTestResultMock,
};
const mockResult: ITestResult = {
  icd10: ['U07.D'],
  memberId: '2020052501',
  productOrService: '00000190000',
  memberFirstName: 'FirstName',
  memberLastName: 'LastName',
  memberDateOfBirth: '2000-01-01',
  fillDate: new Date('2020-11-01'),
  orderNumber: '1234',
  date: '10/31/2020',
  serviceDescription: 'test-service',
};

const requestParamMock = {
  query: {
    ordernumber: '1234',
  },
} as unknown as Request;

beforeEach(() => {
  jest.clearAllMocks();
  getAllRecordsForLoggedInPersonMock.mockReturnValue([
    { primaryMemberRxId: 'memberId' },
  ]);
});

describe('PatientTestResultsController', () => {
  it('should get patient test results for the orderNumber if its passed in param', async () => {
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValue(['member-id']);
    getTestResultByOrderNumberForMembersMock.mockResolvedValueOnce(
      patientTestResultEventMock
    );
    buildPatientTestResultMock.mockReturnValue(mockResult);
    buildPatientTestResultPdfMock.mockReturnValueOnce(pdfMock);
    const routeHandler = new PatientTestResultsController(
      databaseMock,
      configurationMock
    ).getPatientTestResults;
    await routeHandler(requestParamMock, routerResponseMock);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(routerResponseMock);
    expect(successResponseMock.mock.calls[0][2]).toEqual({
      testResult: mockResult,
      testResultPdf: expect.stringContaining(pdfMock),
    });
    expect(getTestResultByOrderNumberForMembersMock).toHaveBeenCalledWith(
      ['member-id'],
      '1234',
      databaseMock
    );
    expect(publishViewAuditEventMock).toBeCalledWith(
      requestParamMock,
      routerResponseMock,
      ApiConstants.AUDIT_VIEW_EVENT_TEST_RESULTS,
      '1234',
      true
    );
  });

  it('should return error response when test result is not found', async () => {
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValue(['member-id']);
    getTestResultByOrderNumberForMembersMock.mockResolvedValueOnce(undefined);
    const routeHandler = new PatientTestResultsController(
      databaseMock,
      configurationMock
    ).getPatientTestResults;
    await routeHandler(requestParamMock, routerResponseMock);
    expect(knownFailureResponseAndPublishEventMock).toBeCalledTimes(1);
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestParamMock,
      routerResponseMock,
      ApiConstants.AUDIT_VIEW_EVENT_TEST_RESULTS,
      '1234',
      HttpStatusCodes.NOT_FOUND,
      ErrorConstants.TEST_RESULT_NOT_FOUND
    );
  });

  it('Should return error response on server error', async () => {
    getTestResultByOrderNumberForMembersMock.mockImplementation(() => {
      throw new Error('unknown error occured');
    });
    const routeHandler = new PatientTestResultsController(
      databaseMock,
      configurationMock
    ).getPatientTestResults;
    await routeHandler(requestParamMock, routerResponseMock);
    expect(unknownFailureResponseMock).toBeCalledTimes(1);
  });

  it('should return bad request if orderNumber is missing in param', async () => {
    getAllowedMemberIdsForLoggedInUserMock.mockReturnValue(['member-id']);
    const requestOrderNumberParamMock = {
      query: {},
    } as unknown as Request;
    const routeHandler = new PatientTestResultsController(
      databaseMock,
      configurationMock
    ).getPatientTestResults;
    await routeHandler(requestOrderNumberParamMock, routerResponseMock);
    expect(knownFailureResponseMock).toBeCalledTimes(1);
  });
});
