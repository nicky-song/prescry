// Copyright 2021 Prescryptive Health, Inc.

import { ErrorActivationRecordMismatch } from '../../../../../errors/error-activation-record-mismatch';
import { ErrorApiResponse } from '../../../../../errors/error-api-response';
import { InternalResponseCode } from '../../../../../errors/error-codes';
import { ErrorUserDataMismatch } from '../../../../../errors/error-data-mismatch-create-account';
import { ErrorInternalServer } from '../../../../../errors/error-internal-server';
import { TooManyRequestError } from '../../../../../errors/error-too-many-requests';
import { ICreateAccountRequestBody } from '../../../../../models/api-request-body/create-account.request-body';
import { ICreateAccount } from '../../../../../models/create-account';
import { Workflow } from '../../../../../models/workflow';
import { createAccount } from '../../../api/api-v1.create-account';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { ICreateAccountScreenRouteProps } from '../../../screens/sign-in/create-account/create-account.screen';
import { handleTwilioErrorAction } from '../../error-handling.actions';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { setIdentityVerificationEmailFlagAction } from '../../identity-verification/actions/set-identity-verification-email-flag.action';
import { updateDeviceTokenSettingsAction } from '../../settings/settings-reducer.actions';
import { setMissingAccountErrorMessageAction } from '../../support-error/support-error.reducer.actions';
import { ICreateAccountAsyncActionArgs } from '../async-actions/create-account.async-action';
import { dispatchVerificationCodeErrorState } from '../phone-number-verification-reducer.actions';
import { createAccountDispatch } from './create-account.dispatch';

jest.mock('../../../api/api-v1.create-account');
const createAccountMock = createAccount as jest.Mock;

jest.mock('../../error-handling.actions');
const handleTwilioErrorActionMock = handleTwilioErrorAction as jest.Mock;

jest.mock('../../error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

jest.mock(
  '../../identity-verification/actions/set-identity-verification-email-flag.action'
);
jest.mock('../../settings/settings-reducer.actions');
const updateDeviceTokenSettingsActionMock =
  updateDeviceTokenSettingsAction as jest.Mock;

jest.mock('../phone-number-verification-reducer.actions');
const dispatchVerificationCodeErrorStateMock =
  dispatchVerificationCodeErrorState as jest.Mock;

const accountMock: ICreateAccount = {
  firstName: 'Johnny',
  lastName: 'AppleSeed',
  email: 'test@test.com',
  dateOfBirth: 'January-01-2010',
  phoneNumber: '+11234567890',
  isTermAccepted: true,
};
const workflowMock: Workflow = 'prescriptionTransfer';
const codeMock = '123456';
const createAccountActionArgs: ICreateAccountAsyncActionArgs = {
  account: accountMock,
  workflow: workflowMock,
  code: codeMock,
  navigation: rootStackNavigationMock,
};
const createAccountRequestBody: ICreateAccountRequestBody = {
  firstName: 'Johnny',
  lastName: 'AppleSeed',
  email: 'test@test.com',
  dateOfBirth: 'January-01-2010',
  phoneNumber: '+11234567890',
  code: codeMock,
};
const configMock = GuestExperienceConfig;
const getStateMock = jest
  .fn()
  .mockReturnValue({ config: configMock, features: {} });

describe('createAccountDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createAccountMock.mockReturnValue({
      data: { deviceToken: 'token' },
    });
    updateDeviceTokenSettingsActionMock.mockReturnValue(
      (dispatch: unknown) => dispatch
    );
  });

  it('makes API request', async () => {
    const dispatchMock = jest.fn();

    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionArgs
    );

    expect(createAccountMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      createAccountRequestBody
    );
  });

  it('updates device token and dispatches set identity verification email ', async () => {
    const dispatchMock = jest.fn();
    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionArgs
    );

    expect(createAccountMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      createAccountRequestBody
    );

    expect(updateDeviceTokenSettingsActionMock).toHaveBeenCalledWith('token');

    expect(dispatchMock).toHaveBeenCalledWith(
      setIdentityVerificationEmailFlagAction({
        recoveryEmailExists: false,
      })
    );
  });
  it('adds country code to phone number if not exists before calling createAccount API', async () => {
    const dispatchMock = jest.fn();

    const createAccountActionWithoutCountryCode = {
      ...createAccountActionArgs,
      account: { ...accountMock, phoneNumber: '1234567890' },
    };

    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionWithoutCountryCode
    );

    expect(createAccountMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      createAccountRequestBody
    );

    expect(updateDeviceTokenSettingsActionMock).toHaveBeenCalledWith('token');

    expect(dispatchMock).toHaveBeenCalledWith(
      setIdentityVerificationEmailFlagAction({
        recoveryEmailExists: false,
      })
    );
  });

  it('calls createAccount with primaryMemberRxId when provided', async () => {
    const dispatchMock = jest.fn();
    const createAccountRequestBodyWithMemberId: ICreateAccountRequestBody = {
      ...createAccountRequestBody,
      primaryMemberRxId: 'primary-id',
    };
    const createAccountActionWithMemberIdArgs = {
      ...createAccountActionArgs,
      account: { ...accountMock, primaryMemberRxId: 'primary-id' },
    };

    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionWithMemberIdArgs
    );

    expect(createAccountMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      createAccountRequestBodyWithMemberId
    );

    expect(updateDeviceTokenSettingsActionMock).toHaveBeenCalledWith('token');

    expect(dispatchMock).toHaveBeenCalledWith(
      setIdentityVerificationEmailFlagAction({
        recoveryEmailExists: false,
      })
    );
  });
  it('calls createAccount with prescriptionId when provided', async () => {
    const dispatchMock = jest.fn();
    const createAccountRequestBodyWithRxId: ICreateAccountRequestBody = {
      ...createAccountRequestBody,
      prescriptionId: 'prescription-id',
    };
    const createAccountActionWithMemberIdArgs = {
      ...createAccountActionArgs,
      account: { ...accountMock, prescriptionId: 'prescription-id' },
    };

    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionWithMemberIdArgs
    );

    expect(createAccountMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      createAccountRequestBodyWithRxId
    );
  });
  it('calls createAccount with blockchain parameter when provided', async () => {
    const dispatchMock = jest.fn();
    const createAccountRequestBodyWithBlockchain: ICreateAccountRequestBody = {
      ...createAccountRequestBody,
      prescriptionId: 'prescription-id',
      isBlockchain: true,
    };
    const createAccountActionWithBlockchainArgs = {
      ...createAccountActionArgs,
      account: {
        ...accountMock,
        prescriptionId: 'prescription-id',
        isBlockchain: true,
      },
    };

    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionWithBlockchainArgs
    );

    expect(createAccountMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      createAccountRequestBodyWithBlockchain
    );
  });
  it('dispatches loginPinNavigateDispatch if response code is REQUIRE_USER_VERIFY_PIN ', async () => {
    const dispatchMock = jest.fn();
    createAccountMock.mockReturnValueOnce({
      data: { deviceToken: 'token' },
      responseCode: InternalResponseCode.REQUIRE_USER_VERIFY_PIN,
    });
    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionArgs
    );

    expect(createAccountActionArgs.navigation.navigate).toHaveBeenCalledWith(
      'LoginPin',
      {
        workflow: workflowMock,
      }
    );
  });

  it('dispatches createPinNavigateDispatch if response code is REQUIRE_USER_SET_PIN ', async () => {
    const dispatchMock = jest.fn();
    createAccountMock.mockReturnValueOnce({
      data: { deviceToken: 'token' },
      responseCode: InternalResponseCode.REQUIRE_USER_SET_PIN,
    });
    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionArgs
    );

    expect(createAccountActionArgs.navigation.navigate).toHaveBeenCalledWith(
      'CreatePin',
      { workflow: 'prescriptionTransfer' }
    );
  });

  it('dispatches isOneTimePasswordSent flag as false if code is wrong', async () => {
    const dispatchMock = jest.fn();
    const errorMock = new Error('error');
    createAccountMock.mockImplementation(() => {
      throw errorMock;
    });
    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionArgs
    );
    expect(updateDeviceTokenSettingsActionMock).not.toHaveBeenCalled();
    expect(dispatchVerificationCodeErrorStateMock).toHaveBeenCalledWith(
      dispatchMock,
      true
    );
  });

  it('dispatches handleTwilioErrorAction if TooManyRequestError', async () => {
    const dispatchMock = jest.fn();
    const errorMock = new TooManyRequestError('twilio-error');
    createAccountMock.mockImplementation(() => {
      throw errorMock;
    });
    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionArgs
    );
    expect(updateDeviceTokenSettingsActionMock).not.toHaveBeenCalled();
    expect(handleTwilioErrorActionMock).toHaveBeenCalledWith(
      dispatchMock,
      createAccountActionArgs.navigation,
      'twilio-error'
    );
  });

  it('dispatches internalErrorDispatch if ErrorInternalServer', async () => {
    const dispatchMock = jest.fn();
    const errorMock = new ErrorInternalServer('server-error');
    createAccountMock.mockImplementation(() => {
      throw errorMock;
    });
    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionArgs
    );
    expect(updateDeviceTokenSettingsActionMock).not.toHaveBeenCalled();
    expect(internalErrorDispatchMock).toHaveBeenCalledWith(
      createAccountActionArgs.navigation,
      errorMock
    );
  });

  it('dispatches setMissingAccountErrorMessageAction, dispatchNavigateToScreen if ErrorApiResponse', async () => {
    const dispatchMock = jest.fn();
    const errorMock = new ErrorApiResponse('error-api-response');
    createAccountMock.mockImplementation(() => {
      throw errorMock;
    });
    await createAccountDispatch(
      dispatchMock,
      getStateMock,
      createAccountActionArgs
    );
    expect(updateDeviceTokenSettingsActionMock).not.toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalledWith(
      setMissingAccountErrorMessageAction('error-api-response')
    );
    expect(createAccountActionArgs.navigation.navigate).toHaveBeenCalledWith(
      'SupportError'
    );
  });
  it.each([[ErrorUserDataMismatch], [ErrorActivationRecordMismatch]])(
    'dispatches to create account screen if %p',
    async (
      errorType:
        | typeof ErrorUserDataMismatch
        | typeof ErrorActivationRecordMismatch
    ) => {
      const dispatchMock = jest.fn();
      const errorMock = new errorType('data-mismatch-error');
      createAccountMock.mockImplementation(() => {
        throw errorMock;
      });
      await createAccountDispatch(
        dispatchMock,
        getStateMock,
        createAccountActionArgs
      );
      expect(updateDeviceTokenSettingsActionMock).not.toHaveBeenCalled();

      const expectedArgs: ICreateAccountScreenRouteProps = {
        workflow: createAccountActionArgs.workflow,
        phoneNumber: createAccountActionArgs.account.phoneNumber,
        errorType: 'userDataMismatch',
      };
      expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
        'CreateAccount',
        expectedArgs
      );
    }
  );
  it('dispatches to create account screen if ErrorUserDataMismatch for prescription flow', async () => {
    const accountMockWithPrescriptionID = {
      ...accountMock,
      prescriptionId: 'prescription-id',
    };
    const args: ICreateAccountAsyncActionArgs = {
      account: accountMockWithPrescriptionID,
      workflow: workflowMock,
      code: codeMock,
      navigation: rootStackNavigationMock,
    };
    const dispatchMock = jest.fn();
    const errorMock = new ErrorUserDataMismatch('data-mismatch-error');
    createAccountMock.mockImplementation(() => {
      throw errorMock;
    });
    await createAccountDispatch(dispatchMock, getStateMock, args);
    expect(updateDeviceTokenSettingsActionMock).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'CreateAccount',
      {
        workflow: createAccountActionArgs.workflow,
        phoneNumber: createAccountActionArgs.account.phoneNumber,
        errorType: 'userDataMismatch',
        prescriptionId: 'prescription-id',
      }
    );
  });
});
