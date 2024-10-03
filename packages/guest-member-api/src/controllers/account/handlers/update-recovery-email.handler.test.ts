// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';

import { updateRecoveryEmailHandler } from './update-recovery-email.handler';
import { IPerson } from '@phx/common/src/models/person';
import { getLoggedInUserProfileForRxGroupType } from '../../../utils/person/get-dependent-person.helper';
import { publishPersonUpdateMessage } from '../../../utils/service-bus/person-update-helper';
import { ACTION_UPDATE_PERSON } from '../../../constants/service-bus-actions';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { getPreferredEmailFromPatient } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import { updatePatientContactInfo } from '../../../utils/fhir-patient/update-patient-contact-info';
import { updatePatientByMasterId } from '../../../utils/external-api/identity/update-patient-by-master-id';
import {
  mockPatientEmailAndPhone,
  mockPatientEmailAndPhoneUpdated,
  mockPatientOnlyEmail,
} from '../../../mock-data/fhir-patient.mock';
import { ErrorRequestInitialization } from '@phx/common/src/errors/error-request-initialization';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

const mockPhoneNumber = 'fake-phone';
const requestMock = {
  body: {
    email: 'testnew@prescryptive.com',
    oldEmail: 'test@prescryptive.com',
  },
} as Request;
const requestV2Mock = {
  ...requestMock,
  headers: {
    [RequestHeaders.apiVersion]: 'v2',
  },
} as Request;

jest.mock('../../../utils/service-bus/account-update-helper');
jest.mock('../../../utils/response-helper');
jest.mock('../../../utils/person/get-dependent-person.helper');
jest.mock('../../../utils/service-bus/person-update-helper');

const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;
const unknownResponseMock = UnknownFailureResponse as jest.Mock;
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;
const getLoggedInUserProfileForRxGroupTypeMock =
  getLoggedInUserProfileForRxGroupType as jest.Mock;
const publishPersonUpdateMessageMock = publishPersonUpdateMessage as jest.Mock;

jest.mock('../../../utils/external-api/identity/update-patient-by-master-id');
const updatePatientByMasterIdMock = updatePatientByMasterId as jest.Mock;

jest.mock('../../../utils/fhir-patient/get-contact-info-from-patient');
const getPreferredEmailFromPatientMock =
  getPreferredEmailFromPatient as jest.Mock;

jest.mock('../../../utils/fhir-patient/update-patient-contact-info');
const updatePatientContactInfoMock = updatePatientContactInfo as jest.Mock;
beforeEach(() => {
  jest.clearAllMocks();
});

describe('updateRecoveryEmailHandler', () => {
  it('should return error if oldEmail in request does not match with the DB', async () => {
    const responseMock = {
      locals: {
        device: {
          data: mockPhoneNumber,
        },
        account: {
          phoneNumber: mockPhoneNumber,
          firstName: 'test',
          lastName: 'test-last',
          recoveryEmail: 'oldtestnew@prescryptive.com',
        },
      },
    } as unknown as Response;

    await updateRecoveryEmailHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.UPDATE_EMAIL_ERROR
    );
  });

  it('should publish message to service bus if no error', async () => {
    const responseMock = {
      locals: {
        device: {
          data: mockPhoneNumber,
        },
        account: {
          phoneNumber: mockPhoneNumber,
          firstName: 'test',
          lastName: 'test-last',
          recoveryEmail: 'test@prescryptive.com',
        },
      },
    } as unknown as Response;
    await updateRecoveryEmailHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledWith({
      phoneNumber: mockPhoneNumber,
      recoveryEmail: 'testnew@prescryptive.com',
    });

    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.UPDATE_EMAIL_SUCCESS
    );
  });
  it('should call UnknownFailureResponse if exception occured', async () => {
    const error = { message: 'internal error' };
    publishAccountUpdateMessageMock.mockImplementationOnce(() => {
      throw error;
    });
    const responseMock = {
      locals: {
        device: {
          data: mockPhoneNumber,
        },
        account: {
          phoneNumber: mockPhoneNumber,
          firstName: 'test',
          lastName: 'test-last',
          recoveryEmail: 'test@prescryptive.com',
        },
      },
    } as unknown as Response;
    await updateRecoveryEmailHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(unknownResponseMock).toHaveBeenCalled();
    expect(unknownResponseMock).toHaveBeenCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });

  it.each([
    [
      {
        identifier: 'mock-identifier',
        firstName: 'mock-first',
        lastName: 'mock-last',
        dateOfBirth: '2000-03-01',
      } as IPerson,
      true,
    ],
    [undefined, false],
  ])(
    'should publish person update message to service bus',
    async (personMock: IPerson | undefined, expected: boolean) => {
      const responseMock = {
        locals: {
          device: {
            data: mockPhoneNumber,
          },
          account: {
            phoneNumber: mockPhoneNumber,
            firstName: 'test',
            lastName: 'test-last',
            recoveryEmail: 'test@prescryptive.com',
          },
        },
      } as unknown as Response;
      getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce(personMock);

      await updateRecoveryEmailHandler(
        requestMock,
        responseMock,
        configurationMock,
      );

      expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalled();
      if (expected) {
        expect(publishPersonUpdateMessageMock).toHaveBeenCalledWith(
          ACTION_UPDATE_PERSON,
          {
            identifier: personMock?.identifier,
            email: requestMock.body.email,
            recentlyUpdated: true,
            updatedFields: ['email'],
          }
        );
      } else {
        expect(publishPersonUpdateMessageMock).not.toHaveBeenCalled();
      }
    }
  );

  it('v2: should return error if patient does not exists in response local', async () => {
    const responseMock = {
      locals: {
        device: {
          data: mockPhoneNumber,
        },
        account: {
          phoneNumber: mockPhoneNumber,
          firstName: 'test',
          lastName: 'test-last',
        },
      },
    } as unknown as Response;
    const errorMock = new ErrorRequestInitialization('locals.patient');
    await updateRecoveryEmailHandler(
      requestV2Mock,
      responseMock,
      configurationMock,
    );

    expect(unknownResponseMock).toBeCalledTimes(1);
    expect(unknownResponseMock).toBeCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );
    expect(updatePatientByMasterIdMock).not.toBeCalled();
  });
  it('v2: should return error if patient does not have id', async () => {
    const responseMock = {
      locals: {
        device: {
          data: mockPhoneNumber,
        },
        account: {
          phoneNumber: mockPhoneNumber,
          firstName: 'test',
          lastName: 'test-last',
        },
        patient: { ...mockPatientEmailAndPhoneUpdated, id: undefined },
      },
    } as unknown as Response;

    await updateRecoveryEmailHandler(
      requestV2Mock,
      responseMock,
      configurationMock,
    );

    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      ErrorConstants.PATIENT_RECORD_MISSING
    );
    expect(updatePatientByMasterIdMock).not.toBeCalled();
  });
  it('v2: should return error if email is already present in patient and it does not match with patient', async () => {
    const responseMock = {
      locals: {
        device: {
          data: mockPhoneNumber,
        },
        patient: mockPatientEmailAndPhoneUpdated,
        account: {
          phoneNumber: mockPhoneNumber,
          firstName: 'test',
          lastName: 'test-last',
        },
      },
    } as unknown as Response;
    getPreferredEmailFromPatientMock.mockReturnValueOnce(
      'test123@prescryptive.com'
    );
    await updateRecoveryEmailHandler(
      requestV2Mock,
      responseMock,
      configurationMock,
    );

    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.UPDATE_EMAIL_ERROR
    );
    expect(updatePatientByMasterIdMock).not.toBeCalled();
  });
  it('v2: should update email if not exists', async () => {
    const responseMock = {
      locals: {
        device: {
          data: mockPhoneNumber,
        },
        patient: mockPatientEmailAndPhone,
        account: {
          phoneNumber: mockPhoneNumber,
          firstName: 'test',
          lastName: 'test-last',
        },
      },
    } as unknown as Response;
    getPreferredEmailFromPatientMock.mockReturnValueOnce(
      'test@prescryptive.com'
    );
    updatePatientContactInfoMock.mockReturnValueOnce(
      mockPatientEmailAndPhoneUpdated
    );
    updatePatientByMasterIdMock.mockReturnValueOnce(true);

    await updateRecoveryEmailHandler(
      requestV2Mock,
      responseMock,
      configurationMock,
    );
    expect(getPreferredEmailFromPatientMock).toHaveBeenCalledWith(
      mockPatientEmailAndPhone
    );
    expect(updatePatientContactInfoMock).toBeCalledWith(
      mockPatientEmailAndPhone,
      'home',
      'email',
      'testnew@prescryptive.com'
    );
    expect(updatePatientByMasterIdMock).toBeCalledWith(
      mockPatientOnlyEmail.id,
      mockPatientEmailAndPhoneUpdated,
      configurationMock
    );
    expect(publishAccountUpdateMessageMock).toHaveBeenCalledWith({
      phoneNumber: mockPhoneNumber,
      recoveryEmail: 'testnew@prescryptive.com',
    });
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.UPDATE_EMAIL_SUCCESS
    );
  });
  it('v2: should return error if update API fails', async () => {
    const responseMock = {
      locals: {
        device: {
          data: mockPhoneNumber,
        },
        patient: mockPatientEmailAndPhone,
        account: {
          phoneNumber: mockPhoneNumber,
          firstName: 'test',
          lastName: 'test-last',
        },
      },
    } as unknown as Response;
    getPreferredEmailFromPatientMock.mockReturnValueOnce(
      'test@prescryptive.com'
    );
    updatePatientContactInfoMock.mockReturnValueOnce(
      mockPatientEmailAndPhoneUpdated
    );
    const error = { message: 'internal error' };
    updatePatientByMasterIdMock.mockImplementationOnce(() => {
      throw error;
    });
    await updateRecoveryEmailHandler(
      requestV2Mock,
      responseMock,
      configurationMock,
    );

    expect(updatePatientByMasterIdMock).toBeCalledWith(
      mockPatientEmailAndPhoneUpdated.id,
      mockPatientEmailAndPhoneUpdated,
      configurationMock
    );
    expect(unknownResponseMock).toHaveBeenCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
