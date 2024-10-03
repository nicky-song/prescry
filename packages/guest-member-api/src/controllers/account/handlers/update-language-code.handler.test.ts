// Copyright 2022 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { updateLanguageCodeHandler } from './update-language-code.handler';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { patientAccountPrimaryWithPatientMock } from '../../../mock-data/patient-account.mock';
import { updatePatientAccountLanguageCode } from '../../../utils/patient-account/update-patient-account-language-code';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { assertHasPatient } from '../../../assertions/assert-has-patient';
import { updatePatientLanguageCode } from '../../../utils/fhir-patient/update-patient-language-code';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { mockPatient } from '../../../mock-data/fhir-patient.mock';

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../../../utils/service-bus/account-update-helper');
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;

jest.mock(
  '../../../utils/patient-account/update-patient-account-language-code'
);
const updatePatientAccountLanguageCodeMock =
  updatePatientAccountLanguageCode as jest.Mock;

jest.mock('../../../utils/fhir-patient/update-patient-language-code');
const updatePatientLanguageCodeMock = updatePatientLanguageCode as jest.Mock;

jest.mock('../../../assertions/assert-has-patient');
const assertHasPatientMock = assertHasPatient as jest.Mock;

const languageCodeMock = 'lang-code-mock';
const phoneNumberMock = 'phone-number-mock';

describe('updateLanguageCodeHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getRequiredResponseLocalMock.mockReturnValue({
      phoneNumber: phoneNumberMock,
    });
  });

  it.each(['v1, v2'])(
    'calls publishAccountUpdateMessage with languageCode',
    async (versionMock: string) => {
      const requestMock = {
        body: {
          languageCode: languageCodeMock,
        },
        headers: {
          [RequestHeaders.apiVersion]: versionMock,
        },
      } as unknown as Request;
      const responseMock = {} as unknown as Response;

      await updateLanguageCodeHandler(
        configurationMock,
        requestMock,
        responseMock
      );

      expect(updatePatientAccountLanguageCodeMock).not.toHaveBeenCalled();
      expect(updatePatientLanguageCodeMock).not.toHaveBeenCalled();
      expect(publishAccountUpdateMessageMock).toHaveBeenCalledTimes(1);
      expect(publishAccountUpdateMessageMock).toHaveBeenNthCalledWith(1, {
        phoneNumber: phoneNumberMock,
        languageCode: languageCodeMock,
      });
    }
  );

  it.each(['v1', 'v2'])(
    'calls updatePatientAccountLanguageCode if patientAccountExists if endpoint is %p',
    async (versionMock: string) => {
      getRequiredResponseLocalMock.mockClear();
      getRequiredResponseLocalMock
        .mockReturnValue({
          phoneNumber: phoneNumberMock,
        })
        .mockReturnValue(patientAccountPrimaryWithPatientMock);

      const requestMock = {
        body: {
          languageCode: languageCodeMock,
        },
        headers: {
          [RequestHeaders.apiVersion]: versionMock,
        },
      } as unknown as Request;
      const responseMock = {} as unknown as Response;

      await updateLanguageCodeHandler(
        configurationMock,
        requestMock,
        responseMock
      );
      if (versionMock === 'v2') {
        expect(updatePatientAccountLanguageCodeMock).toHaveBeenCalledTimes(1);
        expect(updatePatientAccountLanguageCodeMock).toHaveBeenNthCalledWith(
          1,
          configurationMock,
          patientAccountPrimaryWithPatientMock,
          languageCodeMock
        );
      } else {
        expect(updatePatientAccountLanguageCodeMock).not.toHaveBeenCalled();
      }
    }
  );

  it.each(['v1', 'v2'])(
    'calls updatePatientLanguageCode if patientAccountExists if endpoint is %p',
    async (versionMock: string) => {
      getRequiredResponseLocalMock.mockClear();
      getRequiredResponseLocalMock.mockReturnValue(mockPatient);

      const requestMock = {
        body: {
          languageCode: languageCodeMock,
        },
        headers: {
          [RequestHeaders.apiVersion]: versionMock,
        },
      } as unknown as Request;
      const responseMock = {} as unknown as Response;

      await updateLanguageCodeHandler(
        configurationMock,
        requestMock,
        responseMock
      );
      if (versionMock === 'v2') {
        expectToHaveBeenCalledOnceOnlyWith(assertHasPatientMock, mockPatient);
        expect(updatePatientLanguageCodeMock).toHaveBeenCalledTimes(1);
        expect(updatePatientLanguageCodeMock).toHaveBeenNthCalledWith(
          1,
          configurationMock,
          mockPatient,
          languageCodeMock
        );
      } else {
        expect(updatePatientLanguageCodeMock).not.toHaveBeenCalled();
      }
    }
  );

  it('returns SuccessResponse on publishAccountUpdateMessage success', async () => {
    const requestMock = {
      body: {
        languageCode: languageCodeMock,
      },
    } as unknown as Request;
    const responseMock = {} as unknown as Response;

    const response = await updateLanguageCodeHandler(
      configurationMock,
      requestMock,
      responseMock
    );

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledTimes(1);
    expect(publishAccountUpdateMessageMock).toHaveBeenNthCalledWith(1, {
      phoneNumber: phoneNumberMock,
      languageCode: languageCodeMock,
    });

    expect(successResponseMock).toHaveBeenCalledTimes(1);
    expect(successResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      SuccessConstants.UPDATE_LANGUAGE_CODE_SUCCESS
    );

    expect(response).toEqual(
      successResponseMock(
        responseMock,
        SuccessConstants.UPDATE_LANGUAGE_CODE_SUCCESS
      )
    );
  });

  it('returns UnknownFailureResponse on publishAccountUpdateMessage failure', async () => {
    const requestMock = {
      body: {
        languageCode: languageCodeMock,
      },
    } as unknown as Request;
    const responseMock = {} as unknown as Response;

    const errorMock = new Error('error-mock');

    publishAccountUpdateMessageMock.mockImplementation(() => {
      throw errorMock;
    });

    const response = await updateLanguageCodeHandler(
      configurationMock,
      requestMock,
      responseMock
    );

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledTimes(1);
    expect(publishAccountUpdateMessageMock).toHaveBeenNthCalledWith(1, {
      phoneNumber: phoneNumberMock,
      languageCode: languageCodeMock,
    });

    expect(unknownFailureResponseMock).toHaveBeenCalledTimes(1);
    expect(unknownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );

    expect(response).toEqual(
      unknownFailureResponseMock(
        responseMock,
        ErrorConstants.INTERNAL_SERVER_ERROR,
        errorMock
      )
    );
  });
});
