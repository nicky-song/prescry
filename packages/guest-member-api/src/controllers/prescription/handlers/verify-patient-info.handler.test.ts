// Copyright 2023 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  KnownFailureResponse,
  SuccessResponse,
} from '../../../utils/response-helper';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { ErrorConstants } from '../../../constants/response-messages';
import { SuccessConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { verifyPatientInfoHandler } from './verify-patient-info.handler';
import { validateIdentity } from '../helpers/validate-identity';
import { validateAndAddConsent } from '../helpers/validate-and-add-consent';

jest.mock('../../../utils/response-helper');
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;

jest.mock('../helpers/validate-identity');
const validateIdentityMock = validateIdentity as jest.Mock;

jest.mock('../helpers/validate-and-add-consent');
const validateAndAddConsentMock = validateAndAddConsent as jest.Mock;

const responseMock = {} as Response;

describe('verifyPatientInfoHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ValidateIdentity
  it('returns KNOWN FAILURE response if validateIdentity returns success: false', async () => {
    const requestMock = {
      params: {
        smartContractAddress: 'smart-contract-address',
      },
      body: {
        firstName: 'DIAN',
        dateOfBirth: 'January-01-1980',
        consent: false,
      },
    } as unknown as Request;

    validateIdentityMock.mockReturnValue({
      success: false,
      error: ErrorConstants.IDENTITY_VERIFICATION_FAILED,
    });

    await verifyPatientInfoHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.IDENTITY_VERIFICATION_FAILED
    );
  });

  it('return SUCCESS response when validateIdentity returns success', async () => {
    const requestMock = {
      params: {
        smartContractAddress: 'smart-contract-address',
      },
      body: {
        firstName: 'DIAN',
        lastName: 'ALAM',
        dateOfBirth: 'January-01-1980',
        consent: false,
      },
    } as unknown as Request;

    validateIdentityMock.mockReturnValue({
      success: true,
    });

    await verifyPatientInfoHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(validateIdentityMock).toBeCalledWith(configurationMock, {
      ...requestMock.body,
      smartContractAddress: 'smart-contract-address',
    });

    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.SEND_SUCCESS_MESSAGE,
      {
        success: true,
      }
    );
  });

  // Add Consent
  it('returns BAD_REQUEST error when request lacks the accountId body property when consent is true', async () => {
    const requestMock = {
      params: {
        smartContractAddress: 'smart-contract-address',
      },
      body: {
        firstName: 'DIAN',
        lastName: 'ALAM',
        dateOfBirth: 'January-01-1980',
        consent: true,
      },
    } as unknown as Request;

    await verifyPatientInfoHandler(
      requestMock,
      responseMock,
      configurationMock
    );
    expect(knownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.ACCOUNT_ID_MISSING
    );
  });

  it('returns KNOWN FAILURE response if validateAndAddConsent returns success: false', async () => {
    const requestMock = {
      params: {
        smartContractAddress: 'smart-contract-address',
      },
      body: {
        accountId: 'test-id',
        firstName: 'DIAN',
        lastName: 'ALAM',
        dateOfBirth: 'January-01-1980',
        consent: true,
      },
    } as unknown as Request;

    validateAndAddConsentMock.mockReturnValue({
      success: false,
      error: ErrorConstants.IDENTITY_VERIFICATION_FAILED,
    });

    await verifyPatientInfoHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.IDENTITY_VERIFICATION_FAILED
    );
  });

  it('return SUCCESS response when validateAndAddConsent returns success', async () => {
    const requestMock = {
      params: {
        smartContractAddress: 'smart-contract-address',
      },
      body: {
        accountId: 'test-id',
        firstName: 'DIAN',
        lastName: 'ALAM',
        dateOfBirth: 'January-01-1980',
        consent: true,
      },
    } as unknown as Request;

    validateAndAddConsentMock.mockReturnValue({
      success: true,
    });

    await verifyPatientInfoHandler(
      requestMock,
      responseMock,
      configurationMock
    );

    expect(validateAndAddConsentMock).toBeCalledWith(configurationMock, {
      ...requestMock.body,
      smartContractAddress: 'smart-contract-address',
    });

    expect(successResponseMock).toBeCalledWith(
      responseMock,
      SuccessConstants.SEND_SUCCESS_MESSAGE,
      {
        success: true,
      }
    );
  });
});
