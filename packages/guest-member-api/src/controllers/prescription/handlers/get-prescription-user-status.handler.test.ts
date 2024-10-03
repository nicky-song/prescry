// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { configurationMock } from '../../../mock-data/configuration.mock';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getPrescriptionUserStatusHandler } from './get-prescription-user-status.handler';
import { IFhir } from '../../../models/fhir/fhir';
import {
  getPrescriptionById,
  IGetPrescriptionHelperResponse,
} from '../helpers/get-prescription-by-id';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { prescriptionBlockchainFhirMock } from '../mock/get-mock-fhir-object';
import { getPrescriptionInfoForSmartContractAddress } from '../helpers/get-prescription-info-for-smart-contract-address.helper';
import { masterIdExistInPersonCollection } from '../../../utils/person/person-helper';
import { getPatientAccountByAccountId } from '../../../utils/external-api/patient-account/get-patient-account-by-account-id';
import { patientAccountPrimaryMock } from '../../../mock-data/patient-account.mock';

jest.mock('../../../utils/response-helper');
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const SuccessResponseMock = SuccessResponse as jest.Mock;
const UnknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../helpers/get-prescription-by-id');
const getPrescriptionByIdMock = getPrescriptionById as jest.Mock;

jest.mock('../../../utils/request/get-request-query');
const getRequestQueryMock = getRequestQuery as jest.Mock;

jest.mock('../helpers/get-prescription-info-for-smart-contract-address.helper');
const getPrescriptionInfoForSmartContractAddressMock =
  getPrescriptionInfoForSmartContractAddress as jest.Mock;

jest.mock('../../../utils/person/person-helper');

const masterIdExistInPersonCollectionMock =
  masterIdExistInPersonCollection as jest.Mock;

jest.mock(
  '../../../utils/external-api/patient-account/get-patient-account-by-account-id'
);
const getPatientAccountByAccountIdMock =
  getPatientAccountByAccountId as jest.Mock;

const fhirWithMyRxIdMock = {
  resourceType: 'Bundle',
  id: 'mock',
  identifier: {
    value: 'MOCK-RXNUMBER',
  },
  type: 'collection',
  timestamp: '2021-04-29T13:30:20.0834604-07:00',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        id: 'id-1',
        telecom: [
          {
            system: 'phone',
            value: '1111111111',
            use: 'home',
          },
          {
            system: 'phone',
            value: '1111111111',
            use: 'mobile',
          },
          {
            system: 'phone',
            value: '1111111111',
            use: 'work',
          },
        ],
      },
    },
  ],
} as unknown as IFhir;
beforeEach(() => {
  jest.clearAllMocks();
  getPrescriptionByIdMock.mockReturnValue({ prescription: fhirWithMyRxIdMock });
});

describe('getPrescriptionUserStatusHandler', () => {
  it('returns error when request does not have identifier param', async () => {
    const responseMock = {} as Response;
    const requestMock = {
      params: {},
    } as unknown as Request;

    await getPrescriptionUserStatusHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PRESCRIPTION_ID_MISSING
    );
  });

  it('returns failure response when getPrescriptionById endpoint throws an error', async () => {
    const responseMock = {} as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;

    getPrescriptionByIdMock.mockReturnValueOnce(Error('failed'));

    await getPrescriptionUserStatusHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'failed'
    );
  });
  it('returns failure response when getPrescriptionById returns error response', async () => {
    const responseMock = {} as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;

    getPrescriptionByIdMock.mockReturnValueOnce({
      errorCode: 400,
    });

    await getPrescriptionUserStatusHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INTERNAL_SERVER_ERROR
    );
  });
  it('returns failure response when patient resource doesnt exist in the prescription', async () => {
    const responseMock = {} as Response;
    const requestMock = {
      params: { identifier: 'id-2' },
    } as unknown as Request;

    const prescriptionResponseMock = {
      prescription: {
        resourceType: 'Bundle',
        id: 'mock',
        identifier: {
          value: 'MOCK-RXNUMBER',
        },
        type: 'collection',
        timestamp: '2021-04-29T13:30:20.0834604-07:00',
        entry: [],
      } as unknown as IFhir,
    };

    getPrescriptionByIdMock.mockReturnValueOnce(prescriptionResponseMock);

    await getPrescriptionUserStatusHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      ErrorConstants.NO_PATIENT_FOUND_PRESCRIPTION
    );
  });
  it('returns SUCCESS response when prescriptionID starts with mock', async () => {
    const responseMock = {} as Response;
    const requestMock = {
      params: { identifier: 'mock' },
    } as unknown as Request;

    await getPrescriptionUserStatusHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(SuccessResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      {
        personExists: true,
      }
    );
  });

  it('returns SUCCESS response when prescriptionID starts with mock and includes no-user', async () => {
    const responseMock = {} as Response;
    const requestMock = {
      params: { identifier: 'mock-no-user' },
    } as unknown as Request;

    await getPrescriptionUserStatusHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(SuccessResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.SUCCESS_OK,
      {
        personExists: false,
      }
    );
  });

  it('returns SUCCESS response with personExists status as TRUE when valid prescription and patient ID exists', async () => {
    const responseMock = {} as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;

    await getPrescriptionUserStatusHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(SuccessResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.PERSON_FOUND_SUCCESSFULLY,
      {
        personExists: true,
      }
    );
  });

  it('returns success response with status: false when patient ID doesnt exist', async () => {
    const responseMock = {} as Response;
    const requestMock = {
      params: { identifier: 'id-2' },
    } as unknown as Request;

    const fhirWithoutPatientIdMock = {
      resourceType: 'Bundle',
      id: 'mock',
      identifier: {
        value: 'MOCK-RXNUMBER',
      },
      type: 'collection',
      timestamp: '2021-04-29T13:30:20.0834604-07:00',
      entry: [
        {
          resource: {
            resourceType: 'Patient',
            telecom: [
              {
                system: 'phone',
                value: '1111111111',
                use: 'home',
              },
              {
                system: 'phone',
                value: '1111111111',
                use: 'mobile',
              },
              {
                system: 'phone',
                value: '1111111111',
                use: 'work',
              },
            ],
          },
        },
      ],
    } as unknown as IFhir;

    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: fhirWithoutPatientIdMock,
    });
    await getPrescriptionUserStatusHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(SuccessResponseMock).toHaveBeenCalledWith(
      responseMock,
      ErrorConstants.PERSON_NOT_FOUND,
      {
        personExists: false,
      }
    );
  });
  it('returns unknownFailureResponse for any exception', async () => {
    const responseMock = {} as Response;
    const requestMock = {
      params: { identifier: 'id-2' },
    } as unknown as Request;

    getPrescriptionByIdMock.mockImplementation(() => {
      throw new Error();
    });
    await getPrescriptionUserStatusHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(UnknownFailureResponseMock).toBeCalled();
  });

  it('returns success response with personExists status as TRUE when valid blockchain prescription and master id exists', async () => {
    getRequestQueryMock.mockReturnValue('true');

    const responseMock = {} as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;

    const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
      prescription: prescriptionBlockchainFhirMock,
    };

    getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
      prescriptionApiResponseMock
    );

    masterIdExistInPersonCollectionMock.mockReturnValueOnce(true);

    getPatientAccountByAccountIdMock.mockReturnValue(patientAccountPrimaryMock);

    await getPrescriptionUserStatusHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(getPrescriptionInfoForSmartContractAddressMock).toBeCalledWith(
      'id-1',
      configurationMock
    );

    expect(getPatientAccountByAccountIdMock).toHaveBeenCalledWith(
      configurationMock,
      'MYRX-ID',
      false,
      true
    );

    expect(SuccessResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.PERSON_FOUND_SUCCESSFULLY,
      {
        personExists: true,
      }
    );
  });

  it('returns success response with personExists status as FALSE when master id doesnt exist', async () => {
    getRequestQueryMock.mockReturnValue('true');

    const responseMock = {} as Response;
    const requestMock = {
      params: { identifier: 'id-1' },
    } as unknown as Request;

    const prescriptionApiResponseMock: IGetPrescriptionHelperResponse = {
      prescription: prescriptionBlockchainFhirMock,
    };

    getPrescriptionInfoForSmartContractAddressMock.mockReturnValue(
      prescriptionApiResponseMock
    );

    masterIdExistInPersonCollectionMock.mockReturnValueOnce(false);

    getPatientAccountByAccountIdMock.mockReturnValue(undefined);

    await getPrescriptionUserStatusHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(getPrescriptionInfoForSmartContractAddressMock).toBeCalledWith(
      'id-1',
      configurationMock
    );

    expect(getPatientAccountByAccountIdMock).toHaveBeenCalledWith(
      configurationMock,
      'MYRX-ID',
      false,
      true
    );

    expect(SuccessResponseMock).toHaveBeenCalledWith(
      responseMock,
      ErrorConstants.PERSON_NOT_FOUND,
      {
        personExists: false,
      }
    );
  });
});
