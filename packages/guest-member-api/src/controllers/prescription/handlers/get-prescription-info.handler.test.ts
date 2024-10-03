// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ErrorConstants } from '../../../constants/response-messages';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { knownFailureResponseAndPublishEvent } from '../../../utils/known-failure-and-publish-audit-event';
import {
  getLoggedInUserPatientForRxGroupType,
  isMasterIdValidForUserAndDependents,
  isMemberIdValidForUserAndDependents,
} from '../../../utils/person/get-dependent-person.helper';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { IPerson } from '@phx/common/src/models/person';
import { getPrescriptionInfoHandler } from './get-prescription-info.handler';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { configurationMock } from '../../../mock-data/configuration.mock';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import { ApiConstants } from '../../../constants/api-constants';
import { publishViewAuditEvent } from '../../../utils/health-record-event/publish-view-audit-event';
import { buildPrescriptionInfoResponse } from '../helpers/build-prescription-info-response';
import {
  getPrescriptionById,
  IGetPrescriptionHelperResponse,
} from '../helpers/get-prescription-by-id';
import { buildUpdatePrescriptionParams } from '../helpers/build-update-prescription-params';
import { updatePrescriptionWithMemberId } from '../helpers/update-prescriptions-with-member-id';
import {
  prescriptionBlockchainFhirMock,
  prescriptionBlockchainNoMasterIdFhirMock,
  prescriptionFhirMock,
  prescriptionFhirMockNoZip,
  prescriptionFhirNoPatientMock,
  prescriptionFhirWithoutMemberIdMock,
  prescriptionWithPharmacyFhirMock,
} from '../mock/get-mock-fhir-object';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { getPrescriptionInfoForSmartContractAddress } from '../helpers/get-prescription-info-for-smart-contract-address.helper';
import { buildBlockchainPrescriptionInfoResponse } from '../helpers/build-blockchain-prescription-info-response';
import { isPrescriptionPhoneNumberValid } from '../../../utils/is-prescription-phone-number-valid';
import { IContactPoint } from '../../../models/fhir/contact-point';
import { IPatient } from '../../../models/fhir/patient/patient';

jest.mock('../../../utils/response-helper');
jest.mock('../helpers/build-prescription-info-response');
jest.mock('../helpers/build-blockchain-prescription-info-response');
jest.mock('../../../utils/person/get-dependent-person.helper');
jest.mock('../helpers/get-prescription-by-id');
jest.mock('../helpers/build-update-prescription-params');

jest.mock('../helpers/update-prescriptions-with-member-id');
const updatePrescriptionWithMemberIdMock =
  updatePrescriptionWithMemberId as jest.Mock;

jest.mock('../../../utils/request/get-request-query');
const getRequestQueryMock = getRequestQuery as jest.Mock;

const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const buildPrescriptionInfoResponseMock =
  buildPrescriptionInfoResponse as jest.Mock;

const buildBlockchainPrescriptionInfoResponseMock =
  buildBlockchainPrescriptionInfoResponse as jest.Mock;
const getPrescriptionByIdMock = getPrescriptionById as jest.Mock;
const isMemberIdValidForUserAndDependentsMock =
  isMemberIdValidForUserAndDependents as jest.Mock;
const isMasterIdValidForUserAndDependentsMock =
  isMasterIdValidForUserAndDependents as jest.Mock;
const buildUpdatePrescriptionParamsMock =
  buildUpdatePrescriptionParams as jest.Mock;

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;
const getResponseLocalMock = getResponseLocal as jest.Mock;

jest.mock('../../../utils/known-failure-and-publish-audit-event');
const knownFailureResponseAndPublishEventMock =
  knownFailureResponseAndPublishEvent as jest.Mock;

jest.mock('../../../utils/health-record-event/publish-view-audit-event');
const publishViewAuditEventMock = publishViewAuditEvent as jest.Mock;

jest.mock('../helpers/get-prescription-info-for-smart-contract-address.helper');
const getPrescriptionInfoForSmartContractAddressMock =
  getPrescriptionInfoForSmartContractAddress as jest.Mock;

const getLoggedInUserPatientForRxGroupTypeMock =
  getLoggedInUserPatientForRxGroupType as jest.Mock;

jest.mock('../../../utils/is-prescription-phone-number-valid');
const isPrescriptionPhoneNumberValidMock =
  isPrescriptionPhoneNumberValid as jest.Mock;

const databaseMock = {} as IDatabase;
const mockPersonList = [
  {
    rxGroupType: 'SIE',
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '01/01/2000',
    primaryMemberRxId: 'id-1',
  } as IPerson,
];

const phoneNumberMock = '+11111111112';

const telecomMock = [
  {
    system: 'phone',
    value: phoneNumberMock,
    use: 'mobile',
  },
] as IContactPoint[];

const loggedInPatientMock: Partial<IPatient> = {
  telecom: telecomMock,
};

describe('getPrescriptionInfoHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getResponseLocalMock.mockReturnValue(mockPersonList);
    getLoggedInUserPatientForRxGroupTypeMock.mockReturnValue(
      loggedInPatientMock as IPatient
    );
  });

  it('returns error when request does not have identifier param', async () => {
    const responseMock = {} as Response;
    const requestMock = {
      params: {},
    } as unknown as Request;
    const expected = {} as Response;
    knownFailureResponseMock.mockReturnValueOnce(expected);
    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      ErrorConstants.PRESCRIPTION_ID_MISSING
    );

    expect(buildPrescriptionInfoResponseMock).not.toBeCalled();
  });
  it('returns error if not mock prescription and no person profile exists', async () => {
    const responseMock = { locals: {} } as unknown as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;
    const expected = {} as Response;
    getResponseLocalMock.mockReturnValueOnce(undefined);
    knownFailureResponseAndPublishEventMock.mockReturnValueOnce(expected);
    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      'id-1',
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.NO_MEMBERSHIP_FOUND
    );
    expect(buildPrescriptionInfoResponseMock).not.toBeCalled();
  });
  it('returns error if get prescription api returns error', async () => {
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;
    const expected = {} as Response;
    knownFailureResponseAndPublishEventMock.mockReturnValueOnce(expected);
    getPrescriptionByIdMock.mockReturnValueOnce({
      errorCode: 404,
    });
    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      'id-1',
      404,
      ErrorConstants.INTERNAL_SERVER_ERROR
    );
    expect(buildPrescriptionInfoResponseMock).not.toBeCalled();
  });
  it('returns error if member id does not match', async () => {
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;
    const expected = {} as Response;
    knownFailureResponseAndPublishEventMock.mockReturnValueOnce(expected);
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirMock,
    });
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(false);
    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
    expect(isMemberIdValidForUserAndDependentsMock).toBeCalledWith(
      responseMock,
      'MYRX-ID'
    );
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      'id-1',
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
    expect(buildPrescriptionInfoResponseMock).not.toBeCalled();
  });
  it('Returns error if prescriptionPhone does not match user phone and prescription doesnt have memberID', async () => {
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;

    getRequiredResponseLocalMock.mockReturnValueOnce({ data: '+1NEWPHONE' });
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirWithoutMemberIdMock,
    });

    await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
    expect(isMemberIdValidForUserAndDependentsMock).not.toBeCalled();
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      'id-1',
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PRESCRIPTION_TELEPHONE_DOES_NOT_MATCH
    );
  });
  it('calls update Prescription endpoint if prescription doesnt have memberID', async () => {
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;
    const paramsMock = {
      clientPatientId: 'id-1',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: '+11111111111' });
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirWithoutMemberIdMock,
    });
    updatePrescriptionWithMemberIdMock.mockReturnValueOnce({ success: true });
    buildUpdatePrescriptionParamsMock.mockReturnValueOnce(paramsMock);
    await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
    expect(isMemberIdValidForUserAndDependentsMock).not.toBeCalled();
    expect(updatePrescriptionWithMemberIdMock).toHaveBeenCalledWith(
      paramsMock,
      configurationMock
    );
  });
  it('return failure response when update Prescription endpoint return error', async () => {
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;
    const paramsMock = {
      clientPatientId: 'id-1',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirWithoutMemberIdMock,
    });
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: '+11111111111' });
    updatePrescriptionWithMemberIdMock.mockReturnValueOnce({
      status: '500',
      error: 'message',
    });
    buildUpdatePrescriptionParamsMock.mockReturnValueOnce(paramsMock);
    await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
    expect(isMemberIdValidForUserAndDependentsMock).not.toBeCalled();
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      'id-1',
      HttpStatusCodes.SERVER_DATA_ERROR,
      ErrorConstants.PRESCRIPTION_UPDATE_FAILURE
    );
    expect(buildPrescriptionInfoResponseMock).not.toBeCalled();
  });

  it('returns failure response if clientPatientID doesnt exist ', async () => {
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;
    const paramsMock = {
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };

    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirWithoutMemberIdMock,
    });
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: '+11111111111' });
    buildUpdatePrescriptionParamsMock.mockReturnValueOnce(paramsMock);
    await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
    expect(isMemberIdValidForUserAndDependentsMock).not.toBeCalled();
    expect(updatePrescriptionWithMemberIdMock).not.toBeCalled();
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      'id-1',
      HttpStatusCodes.NOT_FOUND,
      ErrorConstants.PRESCRIPTION_UPDATE_MEMBERID_MISSING
    );
    expect(buildPrescriptionInfoResponseMock).not.toBeCalled();
  });
  it('return failure response patient resource doesnt exist in prescription', async () => {
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirNoPatientMock,
    });
    await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
    expect(isMemberIdValidForUserAndDependentsMock).not.toBeCalled();
    expect(updatePrescriptionWithMemberIdMock).not.toBeCalled();
    expect(buildUpdatePrescriptionParamsMock).not.toBeCalled();
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      'id-1',
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.NO_PATIENT_FOUND_PRESCRIPTION
    );
    expect(buildPrescriptionInfoResponseMock).not.toBeCalled();
  });
  it('returns mock prescription when identifier is mock', async () => {
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'mock' },
    } as unknown as Request;
    const expected = {} as Response;
    buildPrescriptionInfoResponseMock.mockReturnValueOnce(expected);
    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(buildPrescriptionInfoResponseMock).toHaveBeenCalledWith(
      responseMock,
      'mock',
      prescriptionFhirMock,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(knownFailureResponseMock).not.toBeCalled();
  });
  it('returns mock-pharmacy prescription when identifier is mock-pharmacy', async () => {
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'mock-pharmacy' },
    } as unknown as Request;
    const expected = {} as Response;
    buildPrescriptionInfoResponseMock.mockReturnValueOnce(expected);
    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(buildPrescriptionInfoResponseMock).toHaveBeenCalledWith(
      responseMock,
      'mock-pharmacy',
      prescriptionWithPharmacyFhirMock,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(knownFailureResponseMock).not.toBeCalled();
  });

  it('returns mock prescription with no zip when identifier is mock-zip', async () => {
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'mock-zip' },
    } as unknown as Request;
    const expected = {} as Response;
    buildPrescriptionInfoResponseMock.mockReturnValueOnce(expected);
    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(buildPrescriptionInfoResponseMock).toHaveBeenCalledWith(
      responseMock,
      'mock-zip',
      prescriptionFhirMockNoZip,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(knownFailureResponseMock).not.toBeCalled();
  });
  it('return actual prescription when user is a valid user for prescription', async () => {
    const mockPersonListValid = [
      {
        rxGroupType: 'SIE',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'MYRX-ID',
      } as IPerson,
    ];
    const responseMock = {
      locals: { personList: mockPersonListValid },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;
    const expected = {} as Response;
    buildPrescriptionInfoResponseMock.mockReturnValue(expected);
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirMock,
    });
    isMemberIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    getResponseLocalMock.mockReturnValueOnce(mockPersonListValid);
    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
    expect(isMemberIdValidForUserAndDependentsMock).toBeCalledWith(
      responseMock,
      'MYRX-ID'
    );
    expect(buildPrescriptionInfoResponse).toHaveBeenCalledWith(
      responseMock,
      'id-1',
      prescriptionFhirMock,
      mockPersonListValid,
      configurationMock,
      databaseMock
    );
    expect(knownFailureResponseMock).not.toBeCalled();
    expect(publishViewAuditEventMock).toBeCalledWith(
      requestMock,
      responseMock,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      'id-1',
      true
    );
  });
  it('returns error from getPrescriptionInfoHandler if any exception occurs', async () => {
    const error = { message: 'internal error' };
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;
    const expected = {} as Response;
    unknownFailureResponseMock.mockReturnValueOnce(expected);
    getPrescriptionByIdMock.mockImplementation(() => {
      throw error;
    });
    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(getPrescriptionByIdMock).toBeCalledWith('id-1', configurationMock);
    expect(buildPrescriptionInfoResponseMock).not.toBeCalled();
    expect(unknownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });

  it('returns mock blockchain prescription when identifier is mock-blockchain and blockchain query parameter is true', async () => {
    getRequestQueryMock.mockReturnValue('true');
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      query: { blockchain: 'true' },
      params: { identifier: 'mock-blockchain' },
    } as unknown as Request;
    const expected = {} as Response;

    const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
      prescription: prescriptionBlockchainFhirMock,
    };

    getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
      prescriptionApiResponseMock
    );
    buildBlockchainPrescriptionInfoResponseMock.mockReturnValueOnce(expected);

    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(expected);
    expect(buildBlockchainPrescriptionInfoResponseMock).toHaveBeenCalledWith(
      responseMock,
      'mock-blockchain',
      prescriptionBlockchainFhirMock,
      mockPersonList,
      configurationMock,
      databaseMock
    );
    expect(knownFailureResponseMock).not.toBeCalled();
  });

  it('return actual blockchain prescription when user is a valid user for prescription', async () => {
    const mockPersonListValid = [
      {
        rxGroupType: 'SIE',
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '01/01/2000',
        primaryMemberRxId: 'MYRX-ID',
      } as IPerson,
    ];
    const responseMock = {
      locals: { personList: mockPersonListValid },
    } as unknown as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;
    const expected = {} as Response;
    buildBlockchainPrescriptionInfoResponseMock.mockReturnValueOnce(expected);
    const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
      prescription: prescriptionBlockchainFhirMock,
    };

    getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
      prescriptionApiResponseMock
    );
    isMasterIdValidForUserAndDependentsMock.mockReturnValueOnce(true);
    getResponseLocalMock.mockReturnValueOnce(mockPersonListValid);
    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toEqual(expected);
    expect(getPrescriptionInfoForSmartContractAddressMock).toBeCalledWith(
      'id-1',
      configurationMock
    );
    expect(isMasterIdValidForUserAndDependentsMock).toBeCalledWith(
      responseMock,
      'MYRX-ID'
    );
    expect(buildBlockchainPrescriptionInfoResponseMock).toHaveBeenCalledWith(
      responseMock,
      'id-1',
      prescriptionBlockchainFhirMock,
      mockPersonListValid,
      configurationMock,
      databaseMock
    );
    expect(isPrescriptionPhoneNumberValidMock).not.toBeCalled();
    expect(knownFailureResponseMock).not.toBeCalled();
    expect(publishViewAuditEventMock).toBeCalledWith(
      requestMock,
      responseMock,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      'id-1',
      true
    );
  });

  it('returns failure response for blockchain prescription when masterId is missing', async () => {
    getRequestQueryMock.mockReturnValue('true');
    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      query: { blockchain: 'true' },
      params: { identifier: 'id-1' },
    } as unknown as Request;
    const expected = {} as Response;

    const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
      prescription: prescriptionBlockchainNoMasterIdFhirMock,
    };

    getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
      prescriptionApiResponseMock
    );
    buildBlockchainPrescriptionInfoResponseMock.mockReturnValueOnce(expected);

    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(undefined);
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      ErrorConstants.PRESCRIPTION_MASTER_ID_MISSING
    );
  });

  it('returns failure response for blockchain prescription when masterId does not match person or dependant masterId', async () => {
    getRequestQueryMock.mockReturnValue('true');

    const prescriptionIdMock = 'id-1';

    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      query: { blockchain: 'true' },
      params: { identifier: prescriptionIdMock },
    } as unknown as Request;
    const expected = {} as Response;

    const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
      prescription: {
        ...prescriptionBlockchainFhirMock,
        id: prescriptionIdMock,
      },
    };

    getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
      prescriptionApiResponseMock
    );
    buildBlockchainPrescriptionInfoResponseMock.mockReturnValueOnce(expected);

    isMasterIdValidForUserAndDependentsMock.mockReturnValue(false);

    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(undefined);
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      prescriptionIdMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
  });

  it('returns failure response for blockchain prescription when phone number does not match logged in user phone number', async () => {
    getRequestQueryMock.mockReturnValue('true');

    const prescriptionIdMock = 'id-1';

    const responseMock = {
      locals: { personList: mockPersonList },
    } as unknown as Response;
    const requestMock = {
      query: { blockchain: 'true' },
      params: { identifier: prescriptionIdMock },
    } as unknown as Request;
    const expected = {} as Response;

    const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
      prescription: {
        ...prescriptionBlockchainFhirMock,
        id: prescriptionIdMock,
      },
    };

    getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
      prescriptionApiResponseMock
    );
    buildBlockchainPrescriptionInfoResponseMock.mockReturnValueOnce(expected);

    isMasterIdValidForUserAndDependentsMock.mockReturnValue(false);

    isPrescriptionPhoneNumberValidMock.mockResolvedValueOnce(false);

    const actual = await getPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      databaseMock
    );
    expect(actual).toBe(undefined);
    expect(knownFailureResponseAndPublishEventMock).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      ApiConstants.AUDIT_VIEW_EVENT_PRESCRIPTION,
      prescriptionIdMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.UNAUTHORIZED_ACCESS
    );
  });
});
