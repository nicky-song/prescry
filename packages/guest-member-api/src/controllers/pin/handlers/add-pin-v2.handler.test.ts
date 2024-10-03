// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '../../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { generateHash } from '../../../utils/bcryptjs-helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { IPatientAccountAuthentication } from '../../../models/platform/patient-account/properties/patient-account-authentication';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { updatePatientAccountPin } from '../../../utils/patient-account/update-patient-account-pin';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { addPinHandlerV2 } from './add-pin-v2.handler';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { trackAddPinEvent } from '../../../utils/custom-event-helper';
import { IPatient } from '../../../models/fhir/patient/patient';
import { generateAccountToken } from '../../../utils/account-token.helper';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('../../../utils/bcryptjs-helper');
const generateHashMock = generateHash as jest.Mock;

jest.mock('../../../utils/service-bus/account-update-helper');
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;

jest.mock('../../../utils/account-token.helper');
const generateAccountTokenMock = generateAccountToken as jest.Mock;

jest.mock('../../../utils/response-helper');
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../../../utils/custom-event-helper');
const trackAddPinEventMock = trackAddPinEvent as jest.Mock;

jest.mock('../../../utils/patient-account/update-patient-account-pin');
const updatePatientAccountPinMock = updatePatientAccountPin as jest.Mock;

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

describe('addPinHandlerV2', () => {
  const mockPhoneNumber = 'fake-phone';
  const mockDeviceKey = 'device-key';
  const requestMock = {
    body: {
      encryptedPin: 'encryptedPin',
    },
  } as Request;

  const patientMock: IPatient = {
    id: 'master-id-mock',
  };

  const routerResponseMock = {
    locals: {
      device: {
        data: mockPhoneNumber,
        identifier: 'id-1',
        type: 'phone',
      },
      deviceKeyRedis: mockDeviceKey,
      patientAccount: {},
      patient: patientMock,
    },
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns failure response if patient account record does not exist for v2 endpoint', async () => {
    getRequiredResponseLocalMock
      .mockReturnValueOnce({
        data: mockPhoneNumber,
      })
      .mockReturnValueOnce(mockDeviceKey)
      .mockReturnValueOnce(patientMock);

    const error = { message: 'internal error' };

    getRequiredResponseLocalMock.mockImplementation(() => {
      throw error;
    });

    await addPinHandlerV2(requestMock, routerResponseMock, configurationMock);

    expect(updatePatientAccountPinMock).not.toHaveBeenCalled();
    expectToHaveBeenCalledOnceOnlyWith(
      unknownResponseMock,
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });

  it('returns failure response if pin already exist in patient account record', async () => {
    const authenticationMock: Partial<IPatientAccountAuthentication> = {
      metadata: {
        PIN: [
          {
            key: 'pin-key-mock',
            value: 'pin-hash-mock',
          },
        ],
      },
    };

    const patientAccountMock = {
      authentication: authenticationMock,
    } as IPatientAccount;

    const routerResponseWithPatientAccountMock = {
      ...routerResponseMock,
      locals: {
        ...routerResponseMock.locals,
        patientAccount: patientAccountMock,
      },
    } as unknown as Response;

    generateHashMock.mockReturnValueOnce('newPinHash');

    getRequiredResponseLocalMock
      .mockReturnValueOnce({
        data: mockPhoneNumber,
      })
      .mockReturnValueOnce(mockDeviceKey)
      .mockReturnValueOnce(patientMock)
      .mockReturnValue(patientAccountMock);

    await addPinHandlerV2(
      requestMock,
      routerResponseWithPatientAccountMock,
      configurationMock
    );

    expect(updatePatientAccountPinMock).not.toHaveBeenCalled();
    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      routerResponseWithPatientAccountMock,
      HttpStatusCodes.FORBIDDEN_ERROR,
      ErrorConstants.PIN_ALREADY_SET
    );
  });

  it('calls patient account endpoint to update pin key and pin hash when for v2 endpoint', async () => {
    generateAccountTokenMock.mockReturnValue('token');
    const pinHashMock = 'newPinHash';
    const masterIdMock = 'master-id-mock';

    const authenticationMock: Partial<IPatientAccountAuthentication> = {
      metadata: {},
    };

    const patientAccountMock = {
      accountId: 'account-id-mock',
      authentication: authenticationMock,
      patient: {
        id: masterIdMock,
      },
    } as IPatientAccount;

    const routerResponseWithPatientAccountMock = {
      ...routerResponseMock,
      locals: {
        ...routerResponseMock.locals,
        patientAccount: patientAccountMock,
      },
    } as unknown as Response;

    generateHashMock.mockReturnValueOnce('newPinHash');

    getRequiredResponseLocalMock
      .mockReturnValueOnce({
        data: mockPhoneNumber,
      })
      .mockReturnValueOnce(mockDeviceKey)
      .mockReturnValueOnce(patientMock)
      .mockReturnValue(patientAccountMock);

    await addPinHandlerV2(
      requestMock,
      routerResponseWithPatientAccountMock,
      configurationMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      updatePatientAccountPinMock,
      mockDeviceKey,
      pinHashMock,
      configurationMock,
      patientAccountMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      generateAccountTokenMock,
      {
        patientAccountId: 'account-id-mock',
        cashMasterId: masterIdMock,
        phoneNumber: 'fake-phone',
      },
      configurationMock.jwtTokenSecretKey,
      configurationMock.accountTokenExpiryTime
    );
    expectToHaveBeenCalledOnceOnlyWith(publishAccountUpdateMessageMock, {
      accountKey: mockDeviceKey,
      phoneNumber: mockPhoneNumber,
      pinHash: 'newPinHash',
    });
    expectToHaveBeenCalledOnceOnlyWith(trackAddPinEventMock, 'account-id-mock');
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      routerResponseWithPatientAccountMock,
      SuccessConstants.ADD_PIN_SUCCESS,
      { accountToken: 'token' }
    );
  });

  it('should call UnknownFailureResponse if exception occured', async () => {
    const authenticationMock: Partial<IPatientAccountAuthentication> = {
      metadata: {},
    };

    const patientAccountMock = {
      authentication: authenticationMock,
    } as IPatientAccount;

    getRequiredResponseLocalMock
      .mockReturnValueOnce({
        data: mockPhoneNumber,
      })
      .mockReturnValueOnce(mockDeviceKey)
      .mockReturnValueOnce(patientMock)
      .mockReturnValue(patientAccountMock);

    const error = { message: 'internal error' };

    generateAccountTokenMock.mockImplementation(() => {
      throw error;
    });

    await addPinHandlerV2(requestMock, routerResponseMock, configurationMock);

    expectToHaveBeenCalledOnceOnlyWith(
      unknownResponseMock,
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
