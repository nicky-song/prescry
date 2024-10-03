// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IPastProcedure } from '@phx/common/src/models/api-response/past-procedure-response';
import { IPatientTestResultEvent } from '../../databases/mongo-database/v1/definitions/patient-test-result-event.definition';
import { getAllImmunizationRecordsForMember } from '../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper';
import { getAllTestResultsForMember } from '../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper';
import {
  IImmunizationRecord,
  IProtocolApplied,
  IImmunizationRecordEvent,
} from '../../models/immunization-record';
import { IPatientTestResult } from '../../models/patient-test-result';
import { getAllRecordsForLoggedInPerson } from '../../utils/person/get-logged-in-person.helper';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../utils/response-helper';
import { buildPastProcedureFromImmunizationRecord } from './helpers/build-past-procedure-from-immunization-record';
import { PatientPastProceduresController } from './patient-past-procedures.controller';
import { buildPastProcedureFromTestResults } from './helpers/build-past-procedure-from-test-results';
import { databaseMock } from '../../mock-data/database.mock';

jest.mock('../../utils/response-helper');
jest.mock('../../utils/person/get-logged-in-person.helper');
jest.mock(
  '../../databases/mongo-database/v1/query-helper/patient-test-result-event.query-helper'
);
jest.mock(
  '../../databases/mongo-database/v1/query-helper/immunization-record-event.query-helper'
);
jest.mock('./helpers/build-past-procedure-from-test-results');
jest.mock('./helpers/build-past-procedure-from-immunization-record');

const routerResponseMock = {
  locals: {
    personInfo: {
      primaryMemberRxId: 'memberId',
    },
  },
} as unknown as Response;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const getAllTestResultsForMemberMock = getAllTestResultsForMember as jest.Mock;
const getAllImmunizationRecordsForMemberMock =
  getAllImmunizationRecordsForMember as jest.Mock;
const buildPatientImmunizationRecordMock =
  buildPastProcedureFromImmunizationRecord as jest.Mock;
const buildPastProcedureFromTestResultsMock =
  buildPastProcedureFromTestResults as jest.Mock;
const getAllRecordsForLoggedInPersonMock =
  getAllRecordsForLoggedInPerson as jest.Mock;

const patientTestResultMock: IPatientTestResult = {
  icd10: ['U07.D'],
  primaryMemberRxId: '2020052501',
  productOrService: '00000190000',
  fillDate: new Date('2020-11-01'),
  provider: '1881701167',
  orderNumber: '1234',
};
const patientTestResultMock2: IPatientTestResult = {
  icd10: ['U07.A'],
  primaryMemberRxId: '2020052501',
  productOrService: '99999099211',
  fillDate: new Date('2020-10-31'),
  provider: '1881701167',
  orderNumber: '1235',
};
const patientImmunizationRecordMock: IImmunizationRecord = {
  immunizationId: 'test-id',
  orderNumber: '1237',
  manufacturer: 'test-manufacturer',
  lotNumber: 'test-lot',
  protocolApplied: {} as IProtocolApplied,
  memberRxId: '2020052501',
  vaccineCodes: [],
};
const patientImmunizationRecordMock2: IImmunizationRecord = {
  immunizationId: 'test-id',
  orderNumber: '1238',
  manufacturer: 'test-manufacturer',
  lotNumber: 'test-lot',
  protocolApplied: {} as IProtocolApplied,
  memberRxId: '2020052502',
  vaccineCodes: [],
};
const patientTestResultsEventMock: IPatientTestResultEvent[] = [
  {
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
    eventData: {
      ...patientTestResultMock,
    },
  },
  {
    identifiers: [
      {
        type: 'memberRxId',
        value: '2020052501',
      },
    ],
    createdOn: 1585245032,
    createdBy: 'patientTestResultProcessor',
    tags: [],
    eventType: 'observation',
    eventData: {
      ...patientTestResultMock2,
    },
  },
];

const patientImmunizationRecordEventMock: IImmunizationRecordEvent[] = [
  {
    identifiers: [
      {
        type: 'memberRxId',
        value: '2020052501',
      },
    ],
    createdOn: 1594235032,
    createdBy: 'patientTestResultProcessor',
    tags: [],
    eventType: 'immunization',
    eventData: {
      ...patientImmunizationRecordMock,
    },
  },
  {
    identifiers: [
      {
        type: 'memberRxId',
        value: '2020052502',
      },
    ],
    createdOn: 1594235043,
    createdBy: 'patientTestResultProcessor',
    tags: [],
    eventType: 'immunization',
    eventData: {
      ...patientImmunizationRecordMock2,
    },
  },
];

const mockResult: IPastProcedure = {
  memberFirstName: 'FirstName',
  memberLastName: 'LastName',
  orderNumber: '1234',
  date: '10/31/2020',
  serviceDescription: 'test-service',
  procedureType: 'observation',
};

const mockResult2: IPastProcedure = {
  memberFirstName: 'FirstName',
  memberLastName: 'LastName',
  orderNumber: '1235',
  date: '10/31/2020',
  serviceDescription: 'test-service',
  procedureType: 'observation',
};
const mockResult3: IPastProcedure = {
  memberFirstName: 'FirstName',
  memberLastName: 'LastName',
  orderNumber: '1237',
  date: '10/31/2020',
  serviceDescription: 'immunization-test',
  procedureType: 'immunization',
};
const mockResult4: IPastProcedure = {
  memberFirstName: 'FirstName',
  memberLastName: 'LastName',
  orderNumber: '1238',
  date: '10/31/2020',
  serviceDescription: 'immunization-test',
  procedureType: 'immunization',
};
const requestParamMock = {
  query: {
    ordernumber: '1234',
  },
} as unknown as Request;

describe('PatientPastProceduresController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getAllRecordsForLoggedInPersonMock.mockReturnValue([
      { primaryMemberRxId: 'memberId' },
    ]);
  });

  it('should get all patient past procedures', async () => {
    getAllTestResultsForMemberMock.mockResolvedValueOnce(
      patientTestResultsEventMock
    );
    getAllImmunizationRecordsForMemberMock.mockResolvedValueOnce(
      patientImmunizationRecordEventMock
    );
    buildPastProcedureFromTestResultsMock.mockReturnValueOnce(mockResult);
    buildPastProcedureFromTestResultsMock.mockReturnValueOnce(mockResult2);
    buildPatientImmunizationRecordMock.mockReturnValueOnce(mockResult3);
    buildPatientImmunizationRecordMock.mockReturnValueOnce(mockResult4);
    const routeHandler = new PatientPastProceduresController(databaseMock)
      .getAllPastProceduresForPatients;
    await routeHandler(requestParamMock, routerResponseMock);
    expect(buildPastProcedureFromTestResultsMock).toHaveBeenNthCalledWith(
      1,
      patientTestResultsEventMock[0],
      databaseMock
    );
    expect(buildPastProcedureFromTestResultsMock).toHaveBeenNthCalledWith(
      2,
      patientTestResultsEventMock[1],
      databaseMock
    );
    expect(buildPatientImmunizationRecordMock).toHaveBeenNthCalledWith(
      1,
      patientImmunizationRecordEventMock[0],
      databaseMock
    );
    expect(buildPatientImmunizationRecordMock).toHaveBeenNthCalledWith(
      2,
      patientImmunizationRecordEventMock[1],
      databaseMock
    );
    expect(buildPastProcedureFromTestResultsMock).toHaveBeenCalledTimes(2);
    expect(buildPatientImmunizationRecordMock).toHaveBeenCalledTimes(2);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(routerResponseMock);
    expect(successResponseMock.mock.calls[0][2]).toEqual({
      pastProcedures: [mockResult, mockResult2, mockResult3, mockResult4],
    });
  });
  it('should not add undefined procedures', async () => {
    getAllTestResultsForMemberMock.mockResolvedValueOnce(
      patientTestResultsEventMock
    );
    getAllImmunizationRecordsForMemberMock.mockResolvedValueOnce(
      patientImmunizationRecordEventMock
    );
    buildPastProcedureFromTestResultsMock.mockReturnValueOnce(mockResult);
    buildPastProcedureFromTestResultsMock.mockReturnValueOnce(undefined);
    buildPatientImmunizationRecordMock.mockReturnValueOnce(undefined);
    buildPatientImmunizationRecordMock.mockReturnValueOnce(mockResult4);
    const routeHandler = new PatientPastProceduresController(databaseMock)
      .getAllPastProceduresForPatients;
    await routeHandler(requestParamMock, routerResponseMock);
    expect(buildPastProcedureFromTestResultsMock).toHaveBeenNthCalledWith(
      1,
      patientTestResultsEventMock[0],
      databaseMock
    );
    expect(buildPastProcedureFromTestResultsMock).toHaveBeenNthCalledWith(
      2,
      patientTestResultsEventMock[1],
      databaseMock
    );
    expect(buildPatientImmunizationRecordMock).toHaveBeenNthCalledWith(
      1,
      patientImmunizationRecordEventMock[0],
      databaseMock
    );
    expect(buildPatientImmunizationRecordMock).toHaveBeenNthCalledWith(
      2,
      patientImmunizationRecordEventMock[1],
      databaseMock
    );
    expect(buildPastProcedureFromTestResultsMock).toHaveBeenCalledTimes(2);
    expect(buildPatientImmunizationRecordMock).toHaveBeenCalledTimes(2);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(routerResponseMock);
    expect(successResponseMock.mock.calls[0][2]).toEqual({
      pastProcedures: [mockResult, mockResult4],
    });
  });
  it('should return no past procedures if no matching results found ', async () => {
    getAllTestResultsForMemberMock.mockReturnValueOnce([]);
    getAllImmunizationRecordsForMemberMock.mockReturnValueOnce([]);
    const routeHandler = new PatientPastProceduresController(databaseMock)
      .getAllPastProceduresForPatients;
    await routeHandler({} as Request, routerResponseMock);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(routerResponseMock);
    expect(successResponseMock.mock.calls[0][2]).toEqual({
      pastProcedures: [],
    });
    expect(getAllTestResultsForMemberMock).toHaveBeenCalledTimes(1);
    expect(getAllImmunizationRecordsForMemberMock).toHaveBeenCalledTimes(1);
    expect(buildPastProcedureFromTestResultsMock).not.toHaveBeenCalled();
  });

  it('Should return error response on server error', async () => {
    getAllTestResultsForMemberMock.mockImplementation(() => {
      throw new Error('unknown error occured');
    });
    const routeHandler = new PatientPastProceduresController(databaseMock)
      .getAllPastProceduresForPatients;
    await routeHandler(requestParamMock, routerResponseMock);
    expect(unknownFailureResponseMock).toBeCalledTimes(1);
  });

  it('Should return error response on server error for immunization records', async () => {
    getAllTestResultsForMemberMock.mockReturnValueOnce([]);
    getAllImmunizationRecordsForMemberMock.mockImplementation(() => {
      throw new Error('unknown error occured');
    });
    const routeHandler = new PatientPastProceduresController(databaseMock)
      .getAllPastProceduresForPatients;
    await routeHandler(requestParamMock, routerResponseMock);
    expect(unknownFailureResponseMock).toBeCalledTimes(1);
  });

  it('Should return all past procedures sorted by createdOn if multiple for same order number', async () => {
    const testResultEvent1: IPatientTestResultEvent = {
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
      eventData: {
        ...patientTestResultMock,
      },
    };
    const testResultEvent2: IPatientTestResultEvent = {
      identifiers: [
        {
          type: 'memberRxId',
          value: '2020052501',
        },
      ],
      createdOn: 1604123434,
      createdBy: 'patientTestResultProcessor',
      tags: [],
      eventType: 'observation',
      eventData: {
        ...patientTestResultMock2,
      },
    };
    const testResultEvent3: IPatientTestResultEvent = {
      identifiers: [
        {
          type: 'memberRxId',
          value: '2020052501',
        },
      ],
      createdOn: 1585255032,
      createdBy: 'patientTestResultProcessor',
      tags: [],
      eventType: 'observation',
      eventData: {
        icd10: ['U07.A'],
        primaryMemberRxId: '2020052501',
        productOrService: '00000190000',
        fillDate: new Date('2020-12-11'),
        provider: '1881701167',
        orderNumber: '1237',
      },
    };
    const testResultEvent4: IPatientTestResultEvent = {
      identifiers: [
        {
          type: 'memberRxId',
          value: '2020052501',
        },
      ],
      createdOn: 1604296234,
      createdBy: 'patientTestResultProcessor',
      tags: [],
      eventType: 'observation',
      eventData: {
        icd10: ['U07.B'],
        primaryMemberRxId: '2020052501',
        productOrService: '00000190000',
        fillDate: new Date('2020-11-02'),
        provider: '1881701167',
        orderNumber: '1235',
      },
    };
    const testResultEvent5: IPatientTestResultEvent = {
      identifiers: [
        {
          type: 'memberRxId',
          value: '2020052501',
        },
      ],
      createdOn: 1604310634,
      createdBy: 'patientTestResultProcessor',
      tags: [],
      eventType: 'observation',
      eventData: {
        icd10: ['U07.E'],
        primaryMemberRxId: '2020052501',
        productOrService: '00000190000',
        fillDate: new Date('2020-11-02'),
        provider: '1881701167',
        orderNumber: '1235',
      },
    };
    const allResultsWithDuplicateOrderNumber: IPatientTestResultEvent[] = [
      testResultEvent1,
      testResultEvent2,
      testResultEvent3,
      testResultEvent4,
      testResultEvent5,
    ];
    const immunizationRecordEvent1: IImmunizationRecordEvent = {
      identifiers: [
        {
          type: 'memberRxId',
          value: '2020052501',
        },
      ],
      createdOn: 1594235032,
      createdBy: 'patientTestResultProcessor',
      tags: [],
      eventType: 'immunization',
      eventData: {
        ...patientImmunizationRecordMock2,
      },
    };
    const immunizationRecordEvent2: IImmunizationRecordEvent = {
      identifiers: [
        {
          type: 'memberRxId',
          value: '2020052501',
        },
      ],
      createdOn: 1604123434,
      createdBy: 'patientTestResultProcessor',
      tags: [],
      eventType: 'immunization',
      eventData: {
        ...patientImmunizationRecordMock2,
      },
    };
    const immunizationResultsWithDuplicateOrderNumber: IImmunizationRecordEvent[] =
      [immunizationRecordEvent1, immunizationRecordEvent2];
    const mockResult2Final: IPastProcedure = {
      memberFirstName: 'FirstName',
      memberLastName: 'LastName',
      orderNumber: '1235',
      date: '10/30/2020',
      serviceType: 'test-type',
      serviceDescription: 'test-service',
      procedureType: 'observation',
    };
    const mockResult3Final: IPastProcedure = {
      memberFirstName: 'FirstName',
      memberLastName: 'LastName',
      orderNumber: '1237',
      date: '12/11/2020',
      serviceType: 'test-type',
      serviceDescription: 'test-service',
      procedureType: 'observation',
    };
    const mockResult4Final: IPastProcedure = {
      memberFirstName: 'FirstName',
      memberLastName: 'LastName',
      orderNumber: '1238',
      date: '12/12/2020',
      serviceDescription: 'immunization-test',
      procedureType: 'immunization',
    };
    getAllTestResultsForMemberMock.mockResolvedValueOnce(
      allResultsWithDuplicateOrderNumber
    );
    getAllImmunizationRecordsForMemberMock.mockResolvedValueOnce(
      immunizationResultsWithDuplicateOrderNumber
    );
    buildPastProcedureFromTestResultsMock.mockReturnValueOnce(mockResult);
    buildPastProcedureFromTestResultsMock.mockReturnValueOnce(mockResult2Final);
    buildPastProcedureFromTestResultsMock.mockReturnValueOnce(mockResult3Final);
    buildPatientImmunizationRecordMock.mockReturnValueOnce(mockResult4Final);
    const routeHandler = new PatientPastProceduresController(databaseMock)
      .getAllPastProceduresForPatients;
    await routeHandler(requestParamMock, routerResponseMock);
    expect(successResponseMock).toBeCalledTimes(1);
    expect(successResponseMock.mock.calls[0][0]).toBe(routerResponseMock);
    expect(successResponseMock.mock.calls[0][2]).toEqual({
      pastProcedures: [
        mockResult4Final,
        mockResult3Final,
        mockResult,
        mockResult2Final,
      ],
    });

    expect(buildPastProcedureFromTestResultsMock).toHaveBeenCalledTimes(3);
    expect(buildPastProcedureFromTestResultsMock).toHaveBeenNthCalledWith(
      1,
      testResultEvent1,
      databaseMock
    );
    expect(buildPastProcedureFromTestResultsMock).toHaveBeenNthCalledWith(
      2,
      testResultEvent5,
      databaseMock
    );
    expect(buildPastProcedureFromTestResultsMock).toHaveBeenNthCalledWith(
      3,
      testResultEvent3,
      databaseMock
    );
    expect(buildPatientImmunizationRecordMock).toHaveBeenCalledTimes(1);
    expect(buildPatientImmunizationRecordMock).toHaveBeenNthCalledWith(
      1,
      immunizationRecordEvent2,
      databaseMock
    );
  });
});
