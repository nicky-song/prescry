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

import { addRecoveryEmailHandler } from './add-recovery-email.handler';
import { IPerson } from '@phx/common/src/models/person';
import { getLoggedInUserProfileForRxGroupType } from '../../../utils/person/get-dependent-person.helper';
import { publishPersonUpdateMessage } from '../../../utils/service-bus/person-update-helper';
import { ACTION_UPDATE_PERSON } from '../../../constants/service-bus-actions';
import { updatePatientByMasterId } from '../../../utils/external-api/identity/update-patient-by-master-id';
import { configurationMock } from '../../../mock-data/configuration.mock';
import {
  mockPatientEmailAndPhone,
  mockPatientOnlyEmail,
  mockPatientOnlyPhone,
} from '../../../mock-data/fhir-patient.mock';

const mockPhoneNumber = 'fake-phone';
const mockEmail = 'test@prescryptive.com';
const requestMock = {
  body: {
    email: mockEmail,
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

describe('addRecoveryEmailHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if email is already present', async () => {
    const responseMock = {
      locals: {
        device: {
          data: mockPhoneNumber,
        },
        account: {
          phoneNumber: mockPhoneNumber,
          firstName: 'test',
          lastName: 'test-last',
          recoveryEmail: mockEmail,
        },
        patient: mockPatientOnlyEmail,
      },
    } as unknown as Response;

    await addRecoveryEmailHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.ADD_EMAIL_ERROR
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
        },
        patient: mockPatientOnlyPhone,
      },
    } as unknown as Response;

    await addRecoveryEmailHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledWith({
      phoneNumber: mockPhoneNumber,
      recoveryEmail: mockEmail,
    });

    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.ADD_EMAIL_SUCCESS
    );
  });

  it('should call UnknownFailureResponse if exception occurred', async () => {
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
        },
        patient: mockPatientOnlyPhone,
      },
    } as unknown as Response;
    
    await addRecoveryEmailHandler(
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
          },
          patient: mockPatientOnlyPhone,
        },
      } as unknown as Response;
      getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce(personMock);

      await addRecoveryEmailHandler(
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

  it('should return error if patient does not exists in response local', async () => {
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

    await addRecoveryEmailHandler(
      requestMock,
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

  it('should return error if email is already present in patient', async () => {
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

    await addRecoveryEmailHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(knownFailureResponseMock).toBeCalledTimes(1);
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.ADD_EMAIL_ERROR
    );
    expect(updatePatientByMasterIdMock).not.toBeCalled();
  });

  it('should update email if not exists', async () => {
    const responseMock = {
      locals: {
        device: {
          data: mockPhoneNumber,
        },
        patient: mockPatientOnlyPhone,
        account: {
          phoneNumber: mockPhoneNumber,
          firstName: 'test',
          lastName: 'test-last',
        },
      },
    } as unknown as Response;
    updatePatientByMasterIdMock.mockReturnValueOnce(true);
    await addRecoveryEmailHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(updatePatientByMasterIdMock).toBeCalledWith(
      mockPatientEmailAndPhone.id,
      mockPatientEmailAndPhone,
      configurationMock
    );
    expect(publishAccountUpdateMessageMock).toHaveBeenCalledWith({
      phoneNumber: mockPhoneNumber,
      recoveryEmail: 'test@prescryptive.com',
    });
    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.ADD_EMAIL_SUCCESS
    );
  });

  it('should return error if update API fails', async () => {
    const responseMock = {
      locals: {
        device: {
          data: mockPhoneNumber,
        },
        patient: { ...mockPatientEmailAndPhone, telecom: [] },
        account: {
          phoneNumber: mockPhoneNumber,
          firstName: 'test',
          lastName: 'test-last',
        },
      },
    } as unknown as Response;
    const error = { message: 'internal error' };
    updatePatientByMasterIdMock.mockImplementationOnce(() => {
      throw error;
    });
    await addRecoveryEmailHandler(
      requestMock,
      responseMock,
      configurationMock,
    );

    expect(updatePatientByMasterIdMock).toBeCalledWith(
      mockPatientOnlyEmail.id,
      mockPatientOnlyEmail,
      configurationMock
    );
    expect(unknownResponseMock).toHaveBeenCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
