// Copyright 2018 Prescryptive Health, Inc.

import { IApiResponse } from '../../../../models/api-response';
import { ErrorConstants } from '../../../../theming/constants';
import { guestExperienceCustomEventLogger } from '../../guest-experience-logger.middleware';
import {
  EnsureAddPinResponse,
  ensureApiResponse,
  EnsureGetMemberContactInfoResponse,
  EnsureGetPendingPrescriptionResponse,
  EnsureRedirectResponse,
  ensureVerifyOneTimePasswordResponse,
  EnsureVerifyPinResponse,
} from './ensure-api-response';

jest.mock('../../guest-experience-logger.middleware', () => ({
  guestExperienceCustomEventLogger: jest.fn(),
}));

const fakeUrl = 'fake-url';
const mockGuestExperienceCustomEventLogger =
  guestExperienceCustomEventLogger as jest.Mock;

beforeEach(() => {
  mockGuestExperienceCustomEventLogger.mockReset();
});

describe('ensureApiResponse', () => {
  it('throws error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => ensureApiResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('returns responseJson if response data is valid', () => {
    const mockResponseJson: IApiResponse = {
      message: 'everything is tickity boo',
      status: 'success',
    };
    const result = ensureApiResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});

describe('EnsureGetPendingPrescriptionResponse', () => {
  it('should return pending prescriptions as a response when prescriptions are present in response', () => {
    const mockJsonResponse = {
      data: {
        pendingPrescriptionList: {
          identifier: '123',
          prescriptions: [],
        },
      },
    };
    const result = EnsureGetPendingPrescriptionResponse(
      mockJsonResponse,
      fakeUrl
    );
    expect(result).toMatchObject(mockJsonResponse);
  });

  it('should throw error and log it app insights when pending prescriptions are not present in response', () => {
    const mockJsonResponse = {};
    expect(() =>
      EnsureGetPendingPrescriptionResponse(mockJsonResponse, fakeUrl)
    ).toThrowError(ErrorConstants.errorInternalServer());
    expect(mockGuestExperienceCustomEventLogger).toHaveBeenCalledWith(
      'GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR',
      {
        ExpectedFrom: fakeUrl,
        ExpectedInterface: 'IGetPendingPrescriptionResponse',
        Message:
          'Response received from the api does not match the expected interface',
      }
    );
  });
});

describe('ensureVerifyOneTimePasswordResponse', () => {
  it('should return deviceToken as response', () => {
    const mockJsonResponse = {
      data: {
        deviceToken: 'fake token',
      },
    };
    const result = ensureVerifyOneTimePasswordResponse(
      mockJsonResponse,
      fakeUrl
    );
    expect(result).toMatchObject(mockJsonResponse);
  });

  it('should throw error and log it app insights when deviceToken is not present in response', () => {
    const mockJsonResponse = {};
    expect(() =>
      ensureVerifyOneTimePasswordResponse(mockJsonResponse, fakeUrl)
    ).toThrowError(ErrorConstants.errorInternalServer());
    expect(mockGuestExperienceCustomEventLogger).toHaveBeenCalledWith(
      'GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR',
      {
        ExpectedFrom: fakeUrl,
        ExpectedInterface: 'IVerifyOneTimePasswordV2',
        Message:
          'Response received from the api does not match the expected interface',
      }
    );
  });
});

describe('EnsureGetMemberContactInfoResponse', () => {
  it('should return member details as response', () => {
    const mockJsonResponse = {
      data: {
        memberDetails: {
          dateOfBirth: 'fake dateOfBirth',
          email: 'fake email',
          firstName: 'fake firstName',
          identifier: 'fake identifier',
          isPhoneNumberVerified: false,
          isPrimary: false,
          lastName: 'fake lastName',
          phoneNumber: 'fake phoneNumber',
          primaryMemberRxId: 'fake primaryMemberRxId',
        },
      },
    };
    const result = EnsureGetMemberContactInfoResponse(
      mockJsonResponse,
      fakeUrl
    );
    expect(result).toMatchObject(mockJsonResponse);
  });

  it('should throw error and log it app insights when member details are not present in response', () => {
    const mockJsonResponse = {};
    expect(() =>
      EnsureGetMemberContactInfoResponse(mockJsonResponse, fakeUrl)
    ).toThrowError(ErrorConstants.errorInternalServer());
    expect(mockGuestExperienceCustomEventLogger).toHaveBeenCalledWith(
      'GUEST_EXPERIENCE_UI_API_RESPONSE_ERROR',
      {
        ExpectedFrom: fakeUrl,
        ExpectedInterface: 'IMembersApiResponse',
        Message:
          'Response received from the api does not match the expected interface',
      }
    );
  });
});

describe('EnsureRedirectResponse()', () => {
  it('should throw error if response invalid', () => {
    const mockJsonResponse = {};
    expect(() => EnsureRedirectResponse(mockJsonResponse)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockJsonResponse = { data: { deviceToken: 'deviceToken' } };
    expect(EnsureRedirectResponse(mockJsonResponse)).toEqual(mockJsonResponse);
  });
});

describe('EnsureAddPinResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => EnsureAddPinResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: { accountToken: 'accountToken' } };
    const result = EnsureAddPinResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});

describe('EnsureVerifyPinResponse()', () => {
  it('should throw error if response data is invalid', () => {
    const mockResponseJson = {};
    expect(() => EnsureVerifyPinResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if response data is valid', () => {
    const mockResponseJson = { data: { accountToken: 'accountToken' } };
    const result = EnsureVerifyPinResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
