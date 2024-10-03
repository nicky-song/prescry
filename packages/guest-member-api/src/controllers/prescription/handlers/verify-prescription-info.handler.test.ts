// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { verifyPrescriptionInfoHandler } from './verify-prescription-info.handler';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { ErrorConstants } from '../../../constants/response-messages';
import { SuccessConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { verifyPrescriptionInfoHelper } from '../helpers/verify-prescription-info.helper';
import { configurationMock } from '../../../mock-data/configuration.mock';
import {
  differenceInYear,
  UTCDate,
} from '@phx/common/src/utils/date-time-helper';
import { sendOneTimePassword } from '../../../utils/one-time-password/send-one-time-password';
import { databaseMock } from '../../../mock-data/database.mock';
import { twilioMock } from '../../../mock-data/twilio.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import {
  ICommonBusinessMonitoringEventData,
  ICommonBusinessMonitoringEvent,
} from '../../../models/common-business-monitoring-event';

jest.mock('../../../utils/response-helper');
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;

jest.mock('../../../utils/one-time-password/send-one-time-password');
const sendOneTimePasswordHelperMock = sendOneTimePassword as jest.Mock;

jest.mock('../helpers/verify-prescription-info.helper');
const verifyPrescriptionInfoHelperMock =
  verifyPrescriptionInfoHelper as jest.Mock;

jest.mock('@phx/common/src/utils/date-time-helper');
const differenceInYearMock = differenceInYear as jest.Mock;
const UTCDateMock = UTCDate as jest.Mock;

const responseMock = {} as Response;

describe('verifyPrescriptionInfoHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UTCDateMock.mockReturnValueOnce(2000000).mockReturnValue(1000000);
    differenceInYearMock.mockReturnValue(14);
  });

  it('returns BAD_REQUEST error when request lacks the identifier param', async () => {
    const requestMock = {
      params: {},
      body: { firstName: 'DIAN', dateOfBirth: 'January-01-1980' },
    } as unknown as Request;

    await verifyPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioMock,
      databaseMock
    );
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PRESCRIPTION_ID_MISSING
    );
  });

  it('returns BAD_REQUEST when request date of birth is below age limit', async () => {
    UTCDateMock.mockReturnValueOnce(2000000).mockReturnValue(1000000);
    differenceInYearMock.mockReturnValue(12);
    const requestMock = {
      params: {
        identifier: 'mock-identifier',
      },
      body: {
        firstName: 'DIAN',
        dateOfBirth: 'January-01-1980',
      },
    } as unknown as Request;

    await verifyPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioMock,
      databaseMock
    );
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.ACCOUNT_CREATION_AGE_REQUIREMENT_NOT_MET(
        configurationMock.childMemberAgeLimit
      )
    );
  });

  it('returns KNOWN FAILURE response if verifyPrescriptionInfoHelper returns false (EndpointVersion: %p)', async () => {
    const requestMock = {
      params: {
        identifier: 'mock-identifier',
      },
      body: {
        firstName: 'DIAN',
        dateOfBirth: 'January-01-1980',
      },
    } as unknown as Request;

    const serviceBusEventMock: ICommonBusinessMonitoringEvent = {
      topic: 'Business',
      eventData: {
        idType: 'id-type',
      } as ICommonBusinessMonitoringEventData,
    };
    verifyPrescriptionInfoHelperMock.mockReturnValue({
      prescriptionInfoValid: false,
      errorCode: HttpStatusCodes.BAD_REQUEST,
      errorMessage: ErrorConstants.INVALID_PRESCRIPTION_DATA,
      serviceBusEvent: serviceBusEventMock,
    });

    await verifyPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioMock,
      databaseMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_PRESCRIPTION_DATA,
      undefined,
      undefined,
      undefined,
      serviceBusEventMock
    );
  });

  it('returns KNOWN FAILURE response if verifyPrescriptionInfoHelper returns true but telephone doesnt exist (EndpointVersion: %p)', async () => {
    const requestMock = {
      params: {
        identifier: 'mock-identifier',
      },
      body: {
        firstName: 'DIAN',
        dateOfBirth: 'January-01-1980',
      },
    } as unknown as Request;

    verifyPrescriptionInfoHelperMock.mockReturnValue({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: undefined,
        lastName: 'ALAM',
      },
    });

    await verifyPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioMock,
      databaseMock
    );

    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PHONE_NUMBER_MISSING
    );
  });

  it('calls  sendOneTimePasswordHelper when verifyPrescriptionInfoHelper returns true and telephone number exists (EndpointVersion: %p)', async () => {
    const requestMock = {
      params: {
        identifier: 'mock-identifier',
      },
      body: {
        firstName: 'DIAN',
        dateOfBirth: 'January-01-1980',
      },
    } as unknown as Request;

    verifyPrescriptionInfoHelperMock.mockReturnValue({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: '+11111111',
        lastName: 'ALAM',
      },
    });

    await verifyPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioMock,
      databaseMock
    );
    expect(sendOneTimePasswordHelperMock).toBeCalled();
  });

  it('returns UnKnownFailureResponse INTERNAL_SERVER_ERROR error when sendOneTimePasswordHelper throws exception (EndpointVersion: %p)', async () => {
    const requestMock = {
      params: {
        identifier: 'mock-identifier',
      },
      body: { firstName: 'DIAN', dateOfBirth: 'January-01-1980' },
    } as unknown as Request;

    verifyPrescriptionInfoHelperMock.mockReturnValue({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: '+11111111',
        lastName: 'ALAM',
      },
    });

    const error = new Error('some-error');
    sendOneTimePasswordHelperMock.mockImplementationOnce(() => {
      throw error;
    });
    await verifyPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioMock,
      databaseMock
    );
    expect(unknownFailureResponseMock).toBeCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );

    expect(sendOneTimePasswordHelperMock).toBeCalledWith(
      requestMock,
      responseMock,
      twilioMock,
      configurationMock,
      '+11111111'
    );
  });
  it('returns KnownFailureResponse  when sendOneTimePasswordHelper return false response (EndpointVersion: %p)', async () => {
    const requestMock = {
      params: {
        identifier: 'mock-identifier',
      },
      body: { firstName: 'DIAN', dateOfBirth: 'January-01-1980' },
    } as unknown as Request;

    verifyPrescriptionInfoHelperMock.mockReturnValue({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: '+111111111',
        lastName: 'ALAM',
      },
    });

    sendOneTimePasswordHelperMock.mockReturnValueOnce({
      isCodeSent: false,
      errorCode: HttpStatusCodes.SERVER_DATA_ERROR,
      errorMessage: ErrorConstants.SOMETHING_WENT_WRONG,
    });
    await verifyPrescriptionInfoHandler(
      requestMock,
      responseMock,
      configurationMock,
      twilioMock,
      databaseMock
    );
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.SERVER_DATA_ERROR,
      ErrorConstants.SOMETHING_WENT_WRONG
    );

    expect(sendOneTimePasswordHelperMock).toBeCalledWith(
      requestMock,
      responseMock,
      twilioMock,
      configurationMock,
      '+111111111'
    );
  });

  it.each([[false], [true], [true]])(
    'return SUCCESS response when sendOneTimePasswordHelper returns true (IsBlockchain: %p)',
    async (isBlockchain: boolean) => {
      const requestMock = {
        params: {
          identifier: 'mock-identifier',
        },
        body: {
          firstName: 'DIAN',
          dateOfBirth: 'January-01-1980',
          blockchain: isBlockchain,
        },
      } as unknown as Request;

      const prescriptionInfoMock = {
        prescriptionId: 'mock-identifier',
        firstName: 'DIAN',
        dateOfBirth: '1980-01-01',
      };
      verifyPrescriptionInfoHelperMock.mockReturnValue({
        prescriptionIsValid: true,
        filteredUserInfo: {
          telephone: '+111111111',
          lastName: 'last-name',
        },
      });

      sendOneTimePasswordHelperMock.mockReturnValueOnce({
        isCodeSent: true,
      });

      await verifyPrescriptionInfoHandler(
        requestMock,
        responseMock,
        configurationMock,
        twilioMock,
        databaseMock
      );

      expect(verifyPrescriptionInfoHelperMock).toBeCalledWith(
        databaseMock,
        prescriptionInfoMock,
        configurationMock,
        undefined,
        isBlockchain
      );

      expect(successResponseMock).toBeCalledWith(
        responseMock,
        SuccessConstants.SEND_SUCCESS_MESSAGE,
        {
          phoneNumber: '+111111111',
        }
      );
    }
  );
});
