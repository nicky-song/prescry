// Copyright 2018 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../errors/error-bad-request';
import { ErrorInternalServer } from '../../../errors/error-internal-server';
import { ErrorInvalidAuthToken } from '../../../errors/error-invalid-auth-token';
import { ErrorPhoneNumberMismatched } from '../../../errors/error-phone-number-mismatched';
import { TooManyRequestError } from '../../../errors/error-too-many-requests';
import { ErrorTwilioPermissionDenied } from '../../../errors/error-twilio-permission-denied';
import { ErrorUnauthorizedAccess } from '../../../errors/error-unauthorized-access';
import {
  IApiResponse,
  IMembersApiResponse,
} from '../../../models/api-response';
import { IPendingPrescriptionsList } from '../../../models/pending-prescription';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import {
  HttpStatusCodes,
  InternalErrorCode,
  TwilioErrorCodes,
} from './../../../errors/error-codes';
import { RequestHeaders } from './api-request-headers';
import {
  getMemberContactInfo,
  getPendingPrescriptions,
  loginUser,
  sendOneTimePassword,
  updateMemberContactInfo,
  verifyOneTimePassword,
} from './api-v1';
import { IMemberContactInfo } from '../../../models/member-info/member-contact-info';
import { ILoginRequestBody } from '../../../models/api-request-body/login.request-body';
import { ErrorNotFound } from '../../../errors/error-not-found';

jest.mock('../../../utils/api.helper', () => ({
  buildCommonHeaders: jest.fn(),
  buildUrl: jest.fn(),
  call: jest.fn(),
}));

const mockBuildURL = buildUrl as jest.Mock;
const mockCall = call as jest.Mock;
const mockBuildCommonHeaders = buildCommonHeaders as jest.Mock;

beforeEach(() => {
  mockBuildURL.mockReset();
  mockCall.mockReset();
  mockBuildCommonHeaders.mockReset();
});

const mockConfig: IApiConfig = {
  env: {
    host: 'localhost',
    port: '4300',
    protocol: 'https',
    version: 'v1',
    url: '/api',
  },
  paths: {
    login: 'login',
    pendingPrescriptions: '/pending-prescriptions/:id',
    sendOneTimePassword: '/one-time-password/send',
  },
};

const mockPhoneNumber = '1234567890';
const mockDeviceToken = 'mock-device-token';
const customHeaders = new Headers();
customHeaders.append(
  RequestHeaders.memberInfoRequestId,
  'member-info-request-id'
);
customHeaders.append(
  RequestHeaders.prescriptionInfoRequestId,
  'prescripton-info-request-id'
);
const refreshToken = 'refresh-token';
customHeaders.append(RequestHeaders.refreshAccountToken, refreshToken);
customHeaders.append(
  RequestHeaders.apiVersion,
  'v1'
);

describe('getPendingPrescriptions', () => {
  const mockToken = 'mock-auth-token';
  it('calls call() with config.endpoint', async () => {
    mockBuildURL.mockImplementation(
      () => 'http://localhost:4300/api/pending-prescriptions/mock'
    );

    const mockPrescription = {
      _id: '5c5252d5a259db252cfd0302',
      identifier: 'mock-list',
      prescriptions: 'mock-prescriptions',
    } as unknown as IPendingPrescriptionsList;

    mockCall.mockImplementation(() => {
      return {
        headers: customHeaders,
        json: () => ({
          data: {
            pendingPrescriptionList: mockPrescription,
          },
          message: 'fake message',
          status: 'success',
        }),

        ok: true,
      };
    });

    mockBuildCommonHeaders.mockImplementation(() => {
      return {
        Authorization: mockToken,
        'x-prescryptive-device-token': 'mock-device-token',
      };
    });

    const pendingPrescriptionsList = await getPendingPrescriptions(
      mockConfig,
      'test-pending-rx-list-id',
      mockToken,
      mockDeviceToken
    );
    expect(mockBuildURL).toHaveBeenNthCalledWith(
      1,
      mockConfig,
      'pendingPrescriptions',
      {
        ':id': 'test-pending-rx-list-id',
      }
    );
    expect(mockCall).toHaveBeenNthCalledWith(
      1,
      'http://localhost:4300/api/pending-prescriptions/mock',
      undefined,
      'GET',
      {
        Authorization: mockToken,
        [RequestHeaders.deviceTokenRequestHeader]: mockDeviceToken,
      }
    );
    expect(pendingPrescriptionsList).toEqual({
      data: {
        pendingPrescriptionList: mockPrescription,
      },
      memberInfoRequestId: 'member-info-request-id',
      message: 'fake message',
      prescriptionInfoRequestId: 'prescripton-info-request-id',
      refreshToken,
      status: 'success',
    });
  });

  it("should throw Error with message 'Not Found'", async () => {
    expect.assertions(1);
    mockCall.mockResolvedValueOnce({
      json: () => jest.fn(),
      ok: false,
      status: 404,
    });
    try {
      await getPendingPrescriptions(
        mockConfig,
        'test-pending-rx-list-id',
        mockToken
      );
    } catch (error) {
      expect(error).toEqual(new Error(ErrorConstants.errorNotFound));
    }
  });

  it("should throw Error with message 'Error in getting pending prescriptions'", async () => {
    expect.assertions(1);
    mockCall.mockResolvedValueOnce({
      json: () => jest.fn(),
      ok: false,
    });
    try {
      await getPendingPrescriptions(
        mockConfig,
        'test-pending-rx-list-id',
        mockToken
      );
    } catch (error) {
      expect(error).toEqual(
        new Error(ErrorConstants.errorForGettingPendingPrescriptions)
      );
    }
  });

  it("should throw ErrorInvalidAuthToken with message 'Auth Token is invalid or expired' in case of UNAUTHORIZED_REQUEST", async () => {
    expect.assertions(1);
    mockCall.mockResolvedValueOnce({
      json: () => jest.fn(),
      ok: false,
      status: 401,
    });
    try {
      await getPendingPrescriptions(
        mockConfig,
        'test-pending-rx-list-id',
        mockToken
      );
    } catch (error) {
      expect(error).toEqual(
        new ErrorInvalidAuthToken(ErrorConstants.errorInvalidAuthToken)
      );
    }
  });

  it("should throw ErrorInvalidAuthToken with message 'Auth Token is invalid or expired' in case of FORBIDDEN_ERROR", async () => {
    expect.assertions(1);
    mockCall.mockResolvedValueOnce({
      json: () => jest.fn(),
      ok: false,
      status: HttpStatusCodes.FORBIDDEN_ERROR,
    });
    try {
      await getPendingPrescriptions(
        mockConfig,
        'test-pending-rx-list-id',
        mockToken
      );
    } catch (error) {
      expect(error).toEqual(
        new ErrorInvalidAuthToken(ErrorConstants.errorInvalidAuthToken)
      );
    }
  });
});

describe('loginUser API call', () => {
  const mockMemberLoginInfo: ILoginRequestBody = {
    dateOfBirth: '08-20-2019',
    firstName: 'fake firstName',
    lastName: 'fake lastName',
    primaryMemberRxId: '327',
    accountRecoveryEmail: 'test@test.com',
  };

  it('calls call() with config.endpoint', async () => {
    mockBuildURL.mockImplementation(() => 'http://localhost:4300/api/login');
    mockCall.mockImplementation(() => {
      return {
        json: () => ({
          message: 'fake message',
          responseCode: 2001,
          status: 'success',
        }),
        ok: true,
      };
    });
    mockBuildCommonHeaders.mockImplementation(() => ({
      'x-prescryptive-device-token': mockDeviceToken
    }));

    await loginUser(mockConfig, mockMemberLoginInfo, mockDeviceToken);

    expect(mockBuildURL).toHaveBeenNthCalledWith(1, mockConfig, 'login', {});
    expect(call).toHaveBeenNthCalledWith(
      1,
      'http://localhost:4300/api/login',
      mockMemberLoginInfo,
      'POST',
      {
        'x-prescryptive-device-token': mockDeviceToken,
      },
      undefined
    );
  });

  it('returns a response', async () => {
    mockBuildURL.mockImplementation(() => 'http://localhost:4300/api/login');
    mockCall.mockImplementation(() => {
      return {
        json: () => ({
          message: 'fake message',
          responseCode: 2001,
          status: 'success',
        }),
        ok: true,
      };
    });

    const response = await loginUser(
      mockConfig,
      mockMemberLoginInfo,

      mockDeviceToken
    );
    expect(response.responseCode).toBe(2001);
    expect(response.status).toBe('success');
    expect(response.message).toBe('fake message');
  });

  it("should throw Error with message 'Not Found' again'", async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        message: 'fake message',
        status: 'success',
      }),
      ok: false,
      status: 404,
    });
    try {
      await loginUser(mockConfig, mockMemberLoginInfo, mockDeviceToken);
    } catch (error) {
      expect(error).toEqual(new ErrorNotFound('fake message'));
    }
  });

  it('should throw ErrorInternalServer, when status code is SERVER_DATA_ERROR', async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        message: 'fake message',
        status: 'failure',
      }),
      ok: false,
      status: HttpStatusCodes.SERVER_DATA_ERROR,
    });
    try {
      await loginUser(mockConfig, mockMemberLoginInfo, mockDeviceToken);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorInternalServer);
      expect((error as Error).message).toEqual(
        ErrorConstants.errorInternalServer()
      );
    }
  });

  it('should throw ErrorInternalServer, when status code is INTERNAL_SERVER_ERROR', async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        message: 'fake message',
        status: 'failure',
      }),
      ok: false,
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    });
    try {
      await loginUser(mockConfig, mockMemberLoginInfo, mockDeviceToken);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorInternalServer);
      expect((error as Error).message).toEqual(
        ErrorConstants.errorInternalServer()
      );
    }
  });
  it('should throw BAD_REQUEST, when status code is DEVICE_TOKEN_MISSING', async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        message: 'Phone token is not supplied',
        status: 'failure',
      }),
      ok: false,
      status: HttpStatusCodes.BAD_REQUEST,
    });
    try {
      await loginUser(mockConfig, mockMemberLoginInfo);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorBadRequest);
      expect((error as Error).message).toEqual(ErrorConstants.errorBadRequest);
    }
  });
});
describe('sendOneTimePassword', () => {
  it.each([[undefined], [true]])(
    'calls call() with config.endpoint when isBlockchain is %p',
    async (isBlockchainMock?: boolean) => {
      mockBuildURL.mockImplementation(
        () => 'http://localhost:4300/api/one-time-password/send'
      );
      mockCall.mockImplementation(() => {
        return {
          json: () => ({
            message: 'fake message',
            status: 'success',
          }),
          ok: true,
        };
      });

      await sendOneTimePassword(
        mockConfig,
        mockPhoneNumber,
        undefined,
        isBlockchainMock
      );
      expect(mockBuildURL).toHaveBeenNthCalledWith(
        1,
        mockConfig,
        'sendOneTimePassword',
        {}
      );
      expect(call).toHaveBeenNthCalledWith(
        1,
        'http://localhost:4300/api/one-time-password/send',
        { phoneNumber: mockPhoneNumber, isBlockchain: isBlockchainMock },
        'POST',
        undefined
      );
    }
  );

  it('returns a success response when one time password is generated', async () => {
    mockBuildURL.mockImplementation(
      () => 'http://localhost:4300/api/one-time-password/send'
    );
    mockCall.mockImplementation(() => {
      return {
        headers: customHeaders,
        json: () => ({
          message: 'One Time Password sent successful',
          status: 'success',
        }),
        ok: true,
      };
    });
    const response = (await sendOneTimePassword(
      mockConfig,
      'phoneNumber'
    )) as IApiResponse;

    const expectedResponse: IApiResponse = {
      status: 'success',
      message: 'One Time Password sent successful',
    };
    expect(response).toEqual(expectedResponse);
  });

  it('should throw TooManyRequestError, when status code is 429 and code is MAX_SEND_ATTEMPTS_REACHED', async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        code: TwilioErrorCodes.MAX_SEND_ATTEMPTS_REACHED,
        message: 'fake message',
      }),
      ok: false,
      status: 429,
    });
    try {
      await sendOneTimePassword(mockConfig, 'phoneNumber');
    } catch (error) {
      expect(error).toBeInstanceOf(TooManyRequestError);
      expect((error as Error).message).toEqual(
        ErrorConstants.errorTwilioMaxSendCodeAttempts
      );
    }
  });

  it('returns a error response when one time password is not generated', async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        status: 404,
      }),
      ok: false,
    });
    try {
      await sendOneTimePassword(mockConfig, 'phoneNumber');
    } catch (error) {
      expect(error).toEqual(
        new Error(ErrorConstants.errorInSendingOneTimePassword)
      );
    }
  });

  it("should throw ErrorInvalidAuthToken with message 'Auth Token is invalid or expired'", async () => {
    expect.assertions(1);
    mockCall.mockResolvedValueOnce({
      json: () => ({
        message: 'fake message',
        status: 'failure',
      }),
      ok: false,
      status: 401,
    });
    try {
      await sendOneTimePassword(mockConfig, 'phoneNumber');
    } catch (error) {
      expect(error).toEqual(
        new ErrorInvalidAuthToken(ErrorConstants.errorInvalidAuthToken)
      );
    }
  });

  it('should throw ErrorTwilioPermissionDenied, when status code is 401 and code is PERMISSION_DENIED', async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        code: TwilioErrorCodes.PERMISSION_DENIED,
        message: 'fake message',
      }),
      ok: false,
      status: 401,
    });
    try {
      await sendOneTimePassword(mockConfig, 'phoneNumber');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorTwilioPermissionDenied);
      expect((error as Error).message).toEqual(
        ErrorConstants.errorInSendingOneTimePassword
      );
    }
  });

  it("should throw ErrorInvalidAuthToken with message 'Auth Token is invalid or expired' in case of FORBIDDEN_ERROR", async () => {
    expect.assertions(1);
    mockCall.mockResolvedValueOnce({
      json: () => ({
        message: 'fake message',
        status: 'failure',
      }),
      ok: false,
      status: HttpStatusCodes.FORBIDDEN_ERROR,
    });
    try {
      await sendOneTimePassword(mockConfig, 'phoneNumber');
    } catch (error) {
      expect(error).toEqual(
        new ErrorInvalidAuthToken(ErrorConstants.errorInvalidAuthToken)
      );
    }
  });
});

describe('sendOneTimePassword', () => {
  it('calls call() with config.endpoint', async () => {
    mockBuildURL.mockImplementation(
      () => 'http://localhost:4300/api/one-time-password/send'
    );
    mockCall.mockImplementation(() => {
      return {
        json: () => ({
          message: 'fake message',
          status: 'success',
        }),
        ok: true,
      };
    });

    await sendOneTimePassword(mockConfig, mockPhoneNumber);
    expect(mockBuildURL).toHaveBeenNthCalledWith(
      1,
      mockConfig,
      'sendOneTimePassword',
      {}
    );
    expect(call).toHaveBeenNthCalledWith(
      1,
      'http://localhost:4300/api/one-time-password/send',
      { phoneNumber: mockPhoneNumber },
      'POST',
      undefined
    );
  });

  it('returns a success response when one time password is generated', async () => {
    mockBuildURL.mockImplementation(
      () => 'http://localhost:4300/api/one-time-password/send'
    );
    mockCall.mockImplementation(() => {
      return {
        json: () => ({
          message: 'One Time Password sent successful',
          status: 'success',
        }),
        ok: true,
      };
    });
    const response = (await sendOneTimePassword(
      mockConfig,

      mockPhoneNumber
    )) as IApiResponse;
    expect(response.status).toBe('success');
    expect(response.message).toBe('One Time Password sent successful');
  });

  it('should add automation-token when received and returns a success response', async () => {
    mockCall.mockImplementation(() => {
      return {
        json: () => ({
          message: 'One Time Password sent successful',
          status: 'success',
        }),
        ok: true,
      };
    });

    const response = (await sendOneTimePassword(
      mockConfig,

      mockPhoneNumber,

      'automation-token'
    )) as IApiResponse;
    expect(response.status).toBe('success');
    expect(response.message).toBe('One Time Password sent successful');
  });

  it('returns a error response when one time password is not generated', async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        status: 404,
      }),
      ok: false,
    });
    try {
      await sendOneTimePassword(mockConfig, mockPhoneNumber);
    } catch (error) {
      expect(error).toEqual(
        new Error(ErrorConstants.errorInSendingOneTimePassword)
      );
    }
  });

  it('should throw ErrorTwilioPermissionDenied, when status code is 401 and code is PERMISSION_DENIED', async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        code: TwilioErrorCodes.PERMISSION_DENIED,
        message: 'fake message',
      }),
      ok: false,
      status: 401,
    });
    try {
      await sendOneTimePassword(
        mockConfig,

        mockPhoneNumber
      );
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorTwilioPermissionDenied);
      expect((error as Error).message).toEqual(
        ErrorConstants.errorInSendingOneTimePassword
      );
    }
  });
});

describe('getMemberContactInfo', () => {
  const mockIPerson = {
    email: 'thomas.young@gmail.com',
    firstName: 'Thomas',
    isPrimary: true,
    lastName: 'Young',
    phoneNumber: '+1 (425) 999-999',
    primaryMemberRxId: 'TY-9999999999',
  } as IMemberContactInfo;

  const mockRetryPolicy = {} as IRetryPolicy;

  it('calls call() with config.endpoint', async () => {
    const accountToken = 'mock-account-token';

    mockBuildURL.mockImplementation(
      () => 'http://localhost:4300/api/members'
    );
    mockCall.mockImplementation(() => {
      return {
        headers: customHeaders,
        json: () => ({
          data: {
            memberDetails: mockIPerson,
          },
          message: null,
          status: 'success',
        }),
        ok: true,
      };
    });

    mockBuildCommonHeaders.mockImplementation(() => {
      return {
        Authorization: accountToken,
        'x-prescryptive-device-token': 'mock-device-token',
      };
    });

    await getMemberContactInfo(
      mockConfig,
      accountToken,
      mockRetryPolicy,
      mockDeviceToken
    );
    expect(mockBuildURL).toHaveBeenNthCalledWith(1, mockConfig, 'members', {});
    expect(mockBuildCommonHeaders).toHaveBeenCalledWith(
      mockConfig,
      accountToken,
      mockDeviceToken
    );
    expect(call).toHaveBeenNthCalledWith(
      1,
      'http://localhost:4300/api/members',
      null,
      'GET',
      {
        Authorization: accountToken,
        [RequestHeaders.deviceTokenRequestHeader]: mockDeviceToken,
      },
      mockRetryPolicy
    );
  });

  it('returns member details', async () => {
    mockBuildURL.mockImplementation(
      () => 'http://localhost:4300/api/members'
    );
    mockCall.mockImplementation(() => {
      return {
        headers: customHeaders,
        json: () => ({
          data: {
            memberDetails: mockIPerson,
          },
          message: null,
          status: 'success',
        }),
        ok: true,
      };
    });
    const response = (await getMemberContactInfo(
      mockConfig,
      'test-token'
    )) as IMembersApiResponse;

    expect(response).toEqual({
      data: {
        memberDetails: mockIPerson,
      },
      memberInfoRequestId: 'member-info-request-id',
      message: null,
      refreshToken,
      status: 'success',
    });
  });

  it("should throw Error with message 'Not Found' if contact details are not found ", async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({}),
      ok: false,
      status: 404,
    });
    try {
      await getMemberContactInfo(mockConfig, 'test-token');
    } catch (error) {
      expect(error).toEqual(new Error(ErrorConstants.errorNotFound));
    }
  });

  it("should throw Error with message 'Error in getting Member Contact Info' if api respond with status 500", async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        status: 500,
      }),
      ok: false,
    });
    try {
      await getMemberContactInfo(mockConfig, 'test-token');
    } catch (error) {
      expect(error).toEqual(
        new Error(ErrorConstants.errorForGettingMemberContactInfo)
      );
    }
  });

  it("should throw ErrorInvalidAuthToken with message 'Auth Token is invalid or expired' if api respond with error code 401", async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({}),
      ok: false,
      status: 401,
    });
    try {
      await getMemberContactInfo(mockConfig, 'test-token');
    } catch (error) {
      expect(error).toEqual(
        new ErrorInvalidAuthToken(ErrorConstants.errorInvalidAuthToken)
      );
    }
  });

  it('should throw Phone number mismatched error if api respond with error code 401 and PHONE_NUMER_MISMATCHED internal code', async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        code: InternalErrorCode.UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED,
      }),
      ok: false,
      status: 401,
    });
    try {
      await getMemberContactInfo(mockConfig, 'test-token');
    } catch (error) {
      expect(error).toEqual(
        new ErrorPhoneNumberMismatched(
          ErrorConstants.errorPhoneNumberMismatched
        )
      );
    }
  });

  it("should throw ErrorInvalidAuthToken with message 'Auth Token is invalid or expired' in case of FORBIDDEN_ERROR", async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({}),
      ok: false,
      status: HttpStatusCodes.FORBIDDEN_ERROR,
    });
    try {
      await getMemberContactInfo(mockConfig, 'test-token');
    } catch (error) {
      expect(error).toEqual(
        new ErrorInvalidAuthToken(ErrorConstants.errorInvalidAuthToken)
      );
    }
  });
});

describe('verifyOneTimePassword', () => {
  const mockVerificationCode = '123456';

  it('calls call() with config.endpoint', async () => {
    mockBuildURL.mockImplementation(
      () => 'http://localhost:4300/api/one-time-password/verify'
    );

    mockCall.mockImplementation(() => {
      return {
        json: () => ({
          data: {
            deviceToken: 'fake-deviceToken',
          },
          message: 'Success message',
          status: 'success',
        }),
        ok: true,
      };
    });

    await verifyOneTimePassword(
      mockConfig,
      mockVerificationCode,

      mockPhoneNumber,

      undefined
    );
    expect(mockBuildURL).toHaveBeenNthCalledWith(
      1,
      mockConfig,
      'verifyOneTimePassword',
      {}
    );
    expect(call).toHaveBeenNthCalledWith(
      1,
      'http://localhost:4300/api/one-time-password/verify',
      { code: mockVerificationCode, phoneNumber: mockPhoneNumber },
      'POST',
      undefined
    );
  });

  it('returns a success response 2002 when phone is verified and pin is present in database', async () => {
    mockBuildURL.mockImplementation(
      () => 'http://localhost:4300/api/one-time-password/verify'
    );
    mockCall.mockImplementation(() => {
      return {
        json: () => ({
          data: {
            deviceToken: 'mock-phone-token',
            pinEncryptionSalt: 'mock-salt-code-B',
          },
          message:
            'Phone Number has been verified successfully. Please verify device using pin',
          responseCode: 2002,
          status: 'success',
        }),
        ok: true,
      };
    });
    const response = await verifyOneTimePassword(
      mockConfig,
      mockVerificationCode,

      mockPhoneNumber,

      undefined
    );
    expect(response).toEqual({
      data: {
        deviceToken: 'mock-phone-token',
        pinEncryptionSalt: 'mock-salt-code-B',
      },
      message:
        'Phone Number has been verified successfully. Please verify device using pin',
      responseCode: 2002,
      status: 'success',
    });
  });

  it('returns a success response 2001 when phone is verified and pin is not present in database', async () => {
    mockBuildURL.mockImplementation(
      () => 'http://localhost:4300/api/one-time-password/verify'
    );
    mockCall.mockImplementation(() => {
      return {
        json: () => ({
          data: {
            deviceToken: 'mock-phone-token',
            pinEncryptionSalt: 'mock-salt-code-B',
          },
          message:
            'Phone Number has been verified successfully. Please add pin',
          responseCode: 2001,
          status: 'success',
        }),
        ok: true,
      };
    });
    const response = await verifyOneTimePassword(
      mockConfig,
      mockVerificationCode,

      mockPhoneNumber,

      undefined
    );
    expect(response).toEqual({
      data: {
        deviceToken: 'mock-phone-token',
        pinEncryptionSalt: 'mock-salt-code-B',
      },
      message: 'Phone Number has been verified successfully. Please add pin',
      responseCode: 2001,
      status: 'success',
    });
  });

  it('returns a success response 2003 when phone is verified and phone is not linked to any Account in database', async () => {
    mockBuildURL.mockImplementation(
      () => 'http://localhost:4300/api/one-time-password/verify'
    );
    mockCall.mockImplementation(() => {
      return {
        json: () => ({
          data: {
            deviceToken: 'mock-phone-token',
            pinEncryptionSalt: 'mock-salt-code-B',
          },
          message: 'Phone Number has been verified successfully. Please login',
          responseCode: 2003,
          status: 'success',
        }),
        ok: true,
      };
    });
    const response = await verifyOneTimePassword(
      mockConfig,
      mockVerificationCode,

      mockPhoneNumber,

      undefined
    );
    expect(response).toEqual({
      data: {
        deviceToken: 'mock-phone-token',
        pinEncryptionSalt: 'mock-salt-code-B',
      },
      message: 'Phone Number has been verified successfully. Please login',
      responseCode: 2003,
      status: 'success',
    });
  });

  it('returns an error response when one time password is not verified', async () => {
    expect.assertions(1);
    mockCall.mockResolvedValueOnce({
      json: () => ({
        message: 'Invalid code',
        status: 'failure',
      }),
      ok: false,
    });

    try {
      await verifyOneTimePassword(
        mockConfig,
        mockVerificationCode,

        mockPhoneNumber,

        undefined
      );
    } catch (error) {
      expect(error).toEqual(
        new Error(ErrorConstants.errorIncorrectCodeForPhoneVerification)
      );
    }
  });
});

describe('updateMemberContactInfo', () => {
  const mockIdentifier = 'mock-identifier';
  const mockEmail = 'mock-email';
  const mockPhoneNumber2 = 'mock-phoneNumber';
  const mockToken = 'fake-token';
  const mockId = 'mock-secondary-member-id';

  it('calls call() with config.endpoint', async () => {
    mockBuildURL.mockImplementation(
      () => 'http://localhost:4300/api/updateMember'
    );
    mockCall.mockImplementation(() => {
      return {
        headers: customHeaders,
        json: () => ({
          message: 'Success message',
          status: 'success',
        }),
        ok: true,
      };
    });
    mockBuildCommonHeaders.mockImplementation(() => ({
      Authorization: mockToken
    }));

    const response = await updateMemberContactInfo(
      mockConfig,
      mockToken,
      mockIdentifier,
      {
        email: mockEmail,
        phoneNumber: mockPhoneNumber2,
        secondaryMemberIdentifier: mockId,
      }
    );
    expect(mockBuildURL).toHaveBeenNthCalledWith(
      1,
      mockConfig,
      'updateMember',
      { ':id': mockIdentifier }
    );

    expect(call).toHaveBeenNthCalledWith(
      1,
      'http://localhost:4300/api/updateMember',
      {
        email: mockEmail,
        phoneNumber: mockPhoneNumber2,
        secondaryMemberIdentifier: mockId,
      },
      'PUT',
      { Authorization: mockToken }
    );

    expect(response).toEqual({
      message: 'Success message',
      refreshToken,
      status: 'success',
    });
  });

  it("should throw ErrorInvalidAuthToken with message 'Auth Token is invalid or expired' in case of FORBIDDEN_ERROR", async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        message: 'unauthorized error',
        status: 'failure',
      }),
      ok: false,
      status: HttpStatusCodes.FORBIDDEN_ERROR,
    });
    try {
      await updateMemberContactInfo(mockConfig, mockToken, mockIdentifier, {
        email: mockEmail,
        phoneNumber: mockPhoneNumber2,
        secondaryMemberIdentifier: mockId,
      });
    } catch (error) {
      expect(error).toEqual(
        new ErrorInvalidAuthToken(ErrorConstants.errorInvalidAuthToken)
      );
    }
  });

  it('should throw UnauthorizedAccess with message if status code is 401', async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        message: 'unauthorized error',
        status: 'failure',
      }),
      ok: false,
      status: 401,
    });
    try {
      await updateMemberContactInfo(mockConfig, mockToken, mockIdentifier, {
        email: mockEmail,
        phoneNumber: mockPhoneNumber2,
        secondaryMemberIdentifier: mockId,
      });
    } catch (error) {
      expect(error).toEqual(
        new ErrorUnauthorizedAccess(
          ErrorConstants.errorUnauthorizedToUpdateMemberContactInfo
        )
      );
    }
  });

  it('should throw Error with errorInUpdatingMemberInfo message for unknown/unhandeled error', async () => {
    mockCall.mockResolvedValueOnce({
      json: () => ({
        message: 'service bus error',
        status: 'failure',
      }),
      ok: false,
      status: 411,
    });
    try {
      await updateMemberContactInfo(mockConfig, mockToken, mockIdentifier, {
        email: mockEmail,
        phoneNumber: mockPhoneNumber2,
        secondaryMemberIdentifier: mockId,
      });
    } catch (error) {
      expect(error).toEqual(
        new Error(ErrorConstants.errorInUpdatingMemberInfo)
      );
    }
  });
});
