// Copyright 2018 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ErrorBadRequest } from '../../../../errors/error-bad-request';
import { ErrorMaxPinAttempt } from '../../../../errors/error-max-pin-attempt';
import { ErrorConstants } from '../../../../theming/constants';
import { generatePinHash } from '../../../../utils/json-web-token-helper/json-web-token-helper';
import { addPin, updatePin, verifyPin } from '../../api/api-v1.pin';
import { handleCommonErrorAction } from '../../store/error-handling.actions';
import { RootState } from '../root-reducer';
import { startExperienceDispatch } from '../start-experience/dispatch/start-experience.dispatch';
import {
  addUpdatePinAction,
  addUpdatePinLoadingAction,
  clearAccountToken,
  IAddUpdatePinAsyncActionArgs,
  IVerifyPinAsyncActionArgs,
  navigateToBackAction,
  navigateToResetPinAction,
  setAuthExperienceAction,
  setErrorCodeAction,
  setHasPinMismatchedFlagAction,
  setNumberOfFailedAttemptsToVerifyAction,
  setPinStateDefault,
  setPinToBeVerifiedAction,
  verifyPinAction,
  verifyPinLoadingAction,
} from './secure-pin-reducer.actions';
import { tokenUpdateDispatch } from '../settings/dispatch/token-update.dispatch';
import { accountTokenClearDispatch } from '../settings/dispatch/account-token-clear.dispatch';
import { IApiResponse } from '../../../../models/api-response';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../guest-experience-logger.middleware';
import { ICreatePinScreenRouteProps } from './../../create-pin-screen/create-pin-screen';
import { SecurePinStateActionKeys } from './secure-pin-actions';
import { Workflow } from '../../../../models/workflow';
import { dataLoadingAction } from '../modal-popup/modal-popup.reducer.actions';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dispatchResetStackToFatalErrorScreen } from '../navigation/navigation-reducer.actions';

jest.mock('../modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('../settings/dispatch/account-token-clear.dispatch');
const accountTokenClearDispatchMock = accountTokenClearDispatch as jest.Mock;

jest.mock('../start-experience/dispatch/start-experience.dispatch');

jest.mock('../navigation/navigation-reducer.actions');
const dispatchResetStackToFatalErrorScreenMock =
  dispatchResetStackToFatalErrorScreen as unknown as jest.Mock;

jest.mock('../../../../utils/json-web-token-helper/json-web-token-helper');
jest.mock('../../api/api-v1.pin');
jest.mock('../settings/settings-reducer.actions');
jest.mock('../prescriptions/prescriptions-reducer.actions');
jest.mock('../../store/error-handling.actions');
jest.mock('../../guest-experience-logger.middleware');

const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;
const mockGetState = jest.fn();
const mockReduxDispatcher = jest.fn();
const mockGeneratePinHash = generatePinHash as jest.Mock;
const mockVerifyPin = verifyPin as jest.Mock;
const mockAddPin = addPin as jest.Mock;
const mockupdatePin = updatePin as jest.Mock;
const mockHandleCommonErrorAction = handleCommonErrorAction as jest.Mock;
const startExperienceDispatchMock = startExperienceDispatch as jest.Mock;

describe('secure-pin-reducer.actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setHasPinMismatchedFlagAction', () => {
    it('should issue SET_HAS_PIN_MISMATCHED action', () => {
      expect(setHasPinMismatchedFlagAction(true)).toMatchObject({
        payload: {
          hasPinMismatched: true,
        },
        type: SecurePinStateActionKeys.SET_HAS_PIN_MISMATCHED,
      });
    });
  });

  describe('setErrorCodeAction', () => {
    it('should issue SET_HAS_PIN_MISMATCHED action', () => {
      expect(setErrorCodeAction(2009)).toMatchObject({
        payload: {
          errorCode: 2009,
        },
        type: SecurePinStateActionKeys.SET_ERROR_CODE,
      });
    });
  });

  describe('setPinStateDefaultAction', () => {
    it('should issue SET_PIN_STATE_DEFAULT action', () => {
      expect(setPinStateDefault()).toMatchObject({
        type: SecurePinStateActionKeys.SET_PIN_STATE_DEFAULT,
      });
    });
  });

  describe('navigateToResetPinAction', () => {
    it('should navigate to verify identity screen', () => {
      navigateToResetPinAction(rootStackNavigationMock);

      expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledTimes(1);
      expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
        CustomAppInsightEvents.CLICKED_FORGOT_PIN_LINK,
        {}
      );

      expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
      expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
        1,
        'VerifyIdentity'
      );
    });
  });

  describe('setPinToBeVerifiedAction', () => {
    it('should issue SET_PIN_TO_BE_VERIFIED action', async () => {
      const mockState = {
        settings: {
          deviceToken: 'fake-device-token',
        },
      } as unknown as RootState;
      mockGetState.mockReturnValue(mockState);
      mockGeneratePinHash.mockReturnValueOnce('fake-hash');
      const actionDispatcher = await setPinToBeVerifiedAction('1234');
      await actionDispatcher(mockReduxDispatcher, mockGetState);
      expect(mockReduxDispatcher).toHaveBeenCalledWith({
        payload: {
          pinHash: 'fake-hash',
        },
        type: SecurePinStateActionKeys.SET_PIN_TO_BE_VERIFIED,
      });
    });
  });

  describe('setAuthExperienceAction', () => {
    it('should issue SET_AUTH_EXPERIENCE action', () => {
      expect(setAuthExperienceAction(true)).toMatchObject({
        payload: {
          isAuthExperience: true,
        },
        type: SecurePinStateActionKeys.SET_AUTH_EXPERIENCE,
      });
    });
  });

  describe('addUpdatePinLoadingAction', () => {
    it('calls data loading action', () => {
      const dataLoadingResponseMock = 'response-mock';
      dataLoadingActionMock.mockReturnValue(dataLoadingResponseMock);

      const pinMock = 'pin';
      const argsMock: IAddUpdatePinAsyncActionArgs = {
        pin: pinMock,
        pinScreenParams: {
          currentPin: 'current-pin',
          isUpdatePin: true,
          workflow: 'pbmActivate',
        },
        navigation: rootStackNavigationMock,
      };
      const response = addUpdatePinLoadingAction(argsMock);

      expect(dataLoadingActionMock).toHaveBeenCalledWith(
        addUpdatePinAction,
        argsMock
      );
      expect(response).toEqual(dataLoadingResponseMock);
    });
  });

  describe('setNumberOfFailedAttemptsToVerifyAction', () => {
    it('should issue SET_NUMBER_OF_FAILED_ATTEMPTS_TO_VERIFY action', () => {
      expect(setNumberOfFailedAttemptsToVerifyAction(3)).toEqual({
        payload: {
          numberOfFailedAttemptsToVerify: 3,
        },
        type: SecurePinStateActionKeys.SET_NUMBER_OF_FAILED_ATTEMPTS_TO_VERIFY,
      });
    });
  });

  describe('verifyPinLoadingAction', () => {
    it('calls data loading action', () => {
      const dataLoadingResponseMock = 'response-mock';
      dataLoadingActionMock.mockReturnValue(dataLoadingResponseMock);

      const pinMock = 'pin';
      const paramsMock: ICreatePinScreenRouteProps = {
        currentPin: 'current=pin',
        isUpdatePin: true,
      };
      const argsMock: IVerifyPinAsyncActionArgs = {
        navigation: rootStackNavigationMock,
        pin: pinMock,
        pinScreenParams: paramsMock,
      };
      const response = verifyPinLoadingAction(argsMock);

      expect(dataLoadingActionMock).toHaveBeenCalledWith(verifyPinAction, {
        pin: pinMock,
        pinScreenParams: paramsMock,
        navigation: rootStackNavigationMock,
      });
      expect(response).toEqual(dataLoadingResponseMock);
    });
  });

  describe('setPinAction', () => {
    const securePinReducerActions = jest.requireActual(
      './secure-pin-reducer.actions'
    );
    it('should set created PIN in store and should set hasPinMismatched false', async () => {
      const mockState = {
        settings: {
          deviceToken: 'fake-device-token',
        },
      } as unknown as RootState;
      mockGetState.mockReturnValue(mockState);
      mockGeneratePinHash.mockReturnValue('fake-hash');
      securePinReducerActions.setPinStateDefault = jest.fn();
      securePinReducerActions.setErrorCodeAction = jest.fn();
      const actionDispatcher = await securePinReducerActions.setPinAction(
        '1234'
      );
      await actionDispatcher(mockReduxDispatcher, mockGetState);
      expect(securePinReducerActions.setPinStateDefault).toHaveBeenCalled();
      expect(mockReduxDispatcher).toHaveBeenCalledWith({
        payload: { pinHash: 'fake-hash' },
        type: 'SET_CREATED_PIN_TO_STATE',
      });
      expect(securePinReducerActions.setErrorCodeAction).toHaveBeenCalled();
    });
  });

  describe('verifyPinAction', () => {
    const mockState = {
      config: {
        apis: {
          guestExperienceApi: {},
        },
      },
      settings: {
        deviceToken: 'fake-device-token',
        token: 'account-token',
      },
    } as unknown as RootState;

    beforeEach(() => {
      jest.clearAllMocks();
      mockGeneratePinHash.mockReturnValue('fake-hash');
      mockGetState.mockReturnValue(mockState);
    });

    const securePinReducerActions = jest.requireActual(
      './secure-pin-reducer.actions'
    );

    it('should call verifyPin api', async () => {
      const actionDispatcher = await securePinReducerActions.verifyPinAction({
        pin: '1234',
        pinScreenParams: { isUpdatePin: false },
        navigation: rootStackNavigationMock,
      });
      await actionDispatcher(mockReduxDispatcher, mockGetState);
      expect(mockVerifyPin).toHaveBeenCalled();
    });

    it('should call updateTokenSettingsAction when token and pin are present', async () => {
      const dispatchMock = jest.fn();
      mockVerifyPin.mockReturnValue({
        data: {
          accountToken: 'fake-account-token',
        },
      });
      const actionDispatcher = await securePinReducerActions.verifyPinAction({
        pin: '1234',
        pinScreenParams: { isUpdatePin: false },
        navigation: rootStackNavigationMock,
      });
      await actionDispatcher(dispatchMock, mockGetState);

      expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
        dispatchMock,
        'fake-account-token',
        undefined
      );
    });

    it('should call updateTokenSettingsAction when updated device token and pin are present', async () => {
      const dispatchMock = jest.fn();
      mockVerifyPin.mockReturnValue({
        data: {
          accountToken: 'fake-account-token',
        },
        refreshDeviceToken: 'updated-device-token-with-patientid',
      });
      const actionDispatcher = await securePinReducerActions.verifyPinAction({
        pin: '1234',
        pinScreenParams: { isUpdatePin: false },
        navigation: rootStackNavigationMock,
      });
      await actionDispatcher(dispatchMock, mockGetState);

      expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
        dispatchMock,
        'fake-account-token',
        'updated-device-token-with-patientid'
      );
    });

    it('should call setInitialScreenAction', async () => {
      mockGetState.mockReturnValue(mockState);
      securePinReducerActions.setPinToBeVerifiedAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      securePinReducerActions.setPinAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      mockVerifyPin.mockReturnValue({
        data: {
          accountToken: 'fake-account-token',
        },
      });

      const asyncAction = await securePinReducerActions.verifyPinAction({
        pin: '1234',
        pinScreenParams: { isUpdatePin: false },
        navigation: rootStackNavigationMock,
      });
      await asyncAction(mockReduxDispatcher, mockGetState);

      expect(startExperienceDispatchMock).toHaveBeenCalledWith(
        mockReduxDispatcher,
        mockGetState,
        rootStackNavigationMock,
        false,
        undefined
      );
    });

    it('should dispatch setHasPinMismatchedFlagAction when there is ErrorBadRequest', async () => {
      mockGetState.mockReturnValue(mockState);
      securePinReducerActions.setPinToBeVerifiedAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      securePinReducerActions.setPinAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      securePinReducerActions.setHasPinMismatchedFlagAction = jest.fn();
      mockVerifyPin.mockImplementation(() => {
        throw new ErrorBadRequest('error');
      });
      const asyncAction = await securePinReducerActions.verifyPinAction({
        pin: '1234',
        pinScreenParams: { isUpdatePin: false },
        navigation: rootStackNavigationMock,
      });
      await asyncAction(mockReduxDispatcher, mockGetState);
      expect(
        securePinReducerActions.setHasPinMismatchedFlagAction
      ).toHaveBeenCalledTimes(1);
      expect(
        securePinReducerActions.setHasPinMismatchedFlagAction
      ).toHaveBeenCalledWith(true);
      expect(dispatchResetStackToFatalErrorScreenMock).not.toBeCalled();
    });

    it('should dispatch handleCommonErrorAction when there is Error in ApiResponse', async () => {
      mockGetState.mockReturnValue(mockState);
      securePinReducerActions.setPinToBeVerifiedAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      securePinReducerActions.setPinAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      securePinReducerActions.setHasPinMismatchedFlagAction = jest.fn();

      const error = new ErrorApiResponse(ErrorConstants.errorInternalServer());
      mockVerifyPin.mockImplementation(() => {
        throw error;
      });
      const actionDispatcher = await securePinReducerActions.verifyPinAction({
        pin: '1234',
        pinScreenParams: { isUpdatePin: false },
        navigation: rootStackNavigationMock,
      });
      await actionDispatcher(mockReduxDispatcher, mockGetState);
      expect(mockHandleCommonErrorAction).toHaveBeenNthCalledWith(
        1,
        rootStackNavigationMock,
        error.message,
        error
      );
    });

    it('should dispatch setHasPinMismatchedFlagAction and setNumberOfFailedAttemptsToVerifyAction when there is ErrorMaxPinAttempt', async () => {
      const dispatchMock = jest.fn();
      mockGetState.mockReturnValue(mockState);
      securePinReducerActions.setPinToBeVerifiedAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      securePinReducerActions.setPinAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      securePinReducerActions.setHasPinMismatchedFlagAction = jest.fn();
      securePinReducerActions.setNumberOfFailedAttemptsToVerifyAction =
        jest.fn();
      mockVerifyPin.mockImplementation(() => {
        throw new ErrorMaxPinAttempt('error', 5);
      });

      const asyncAction = await securePinReducerActions.verifyPinAction({
        pin: '1234',
        pinScreenParams: { isUpdatePin: false },
        navigation: rootStackNavigationMock,
      });
      await asyncAction(dispatchMock, mockGetState);

      expect(accountTokenClearDispatchMock).toHaveBeenCalledWith(dispatchMock);
      expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
        'AccountLocked',
        {}
      );
    });
  });

  describe('addUpdatePinAction', () => {
    const securePinReducerActions = jest.requireActual(
      './secure-pin-reducer.actions'
    );

    const mockState = {
      config: {
        apis: {
          guestExperienceApi: {},
        },
      },
      securePin: {
        createdPinHash: 'fake-hash',
        verifyPinHash: 'fake-hash',
      },
      settings: {
        deviceToken: 'fake-device-token',
      },
    } as unknown as RootState;

    beforeEach(() => {
      jest.clearAllMocks();
      mockAddPin.mockReturnValue({
        data: {
          accountToken: 'fake-account-token',
        },
        refreshDeviceToken: 'updated-device-token',
      });
    });

    it('should call addPin api then dispatch setInitialScreenAction, update token and clear pin hashes from state  if createdPin and pinEnteredToBeVerified are equal', async () => {
      const dispatchMock = jest.fn();
      mockGetState.mockReturnValue(mockState);
      securePinReducerActions.setErrorCodeAction = jest.fn();
      securePinReducerActions.setPinStateDefault = jest.fn();
      securePinReducerActions.setHasPinMismatchedFlagAction = jest.fn();
      const asyncAction = securePinReducerActions.addUpdatePinAction({
        pin: '1123',
        pinScreenParams: { currentPin: '1123', isUpdatePin: false },
        navigation: rootStackNavigationMock,
      });
      await asyncAction(dispatchMock, mockGetState);

      expect(mockAddPin).toHaveBeenNthCalledWith(
        1,
        mockState.config.apis.guestExperienceApi,
        mockState.settings.deviceToken,
        mockState.securePin.createdPinHash
      );

      expect(tokenUpdateDispatchMock).toHaveBeenNthCalledWith(
        1,
        dispatchMock,
        'fake-account-token',
        'updated-device-token'
      );

      expect(
        securePinReducerActions.setPinStateDefault
      ).toHaveBeenNthCalledWith(1);

      expect(mockHandleCommonErrorAction).not.toHaveBeenCalled();
      expect(securePinReducerActions.setErrorCodeAction).not.toHaveBeenCalled();
      expect(
        securePinReducerActions.setHasPinMismatchedFlagAction
      ).not.toHaveBeenCalled();
      expect(startExperienceDispatchMock).toHaveBeenCalledWith(
        dispatchMock,
        mockGetState,
        rootStackNavigationMock,
        false,
        undefined
      );
    });

    it('should pass workflow in addPin success flow and update devicetoken if updatedDeviceToken exists', async () => {
      const dispatchMock = jest.fn();
      mockGetState.mockReturnValue(mockState);
      securePinReducerActions.setErrorCodeAction = jest.fn();
      securePinReducerActions.setPinStateDefault = jest.fn();
      securePinReducerActions.setHasPinMismatchedFlagAction = jest.fn();
      const workflowMock: Workflow = 'prescriptionTransfer';
      const pinScreenParams: ICreatePinScreenRouteProps = {
        workflow: workflowMock,
      };
      const asyncAction = securePinReducerActions.addUpdatePinAction({
        pin: '1123',
        pinScreenParams,
        navigation: rootStackNavigationMock,
      });
      await asyncAction(dispatchMock, mockGetState);

      expect(mockAddPin).toHaveBeenNthCalledWith(
        1,
        mockState.config.apis.guestExperienceApi,
        mockState.settings.deviceToken,
        mockState.securePin.createdPinHash
      );

      expect(tokenUpdateDispatchMock).toHaveBeenNthCalledWith(
        1,
        dispatchMock,
        'fake-account-token',
        'updated-device-token'
      );

      expect(
        securePinReducerActions.setPinStateDefault
      ).toHaveBeenNthCalledWith(1);

      expect(mockHandleCommonErrorAction).not.toHaveBeenCalled();
      expect(securePinReducerActions.setErrorCodeAction).not.toHaveBeenCalled();
      expect(
        securePinReducerActions.setHasPinMismatchedFlagAction
      ).not.toHaveBeenCalled();
      expect(startExperienceDispatchMock).toHaveBeenCalledTimes(1);
      expect(startExperienceDispatchMock).toHaveBeenCalledWith(
        dispatchMock,
        mockGetState,
        rootStackNavigationMock,
        false,
        workflowMock
      );
    });
    it('should set hasPinMismatched true if createdPin and pinEnteredToBeVerified are not equal', async () => {
      securePinReducerActions.setHasPinMismatchedFlagAction = jest.fn();
      securePinReducerActions.setPinToBeVerifiedAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      securePinReducerActions.setPinAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      const state = {
        ...mockState,
        securePin: {
          createdPin: '1123',
          pinEnteredToVerify: '1123',
        },
      };
      mockGetState.mockReturnValue(state);
      const actionDispatcher = securePinReducerActions.addUpdatePinAction({
        pin: '1123',
        navigation: rootStackNavigationMock,
        pinScreenParams: {},
      });
      await actionDispatcher(mockReduxDispatcher, mockGetState);
    });

    it('should set errorCode 2009 if error with response code 2009 and should navigate to create pin screen', async () => {
      securePinReducerActions.setErrorCodeAction = jest.fn();
      securePinReducerActions.setPinToBeVerifiedAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      const state = {
        ...mockState,
        securePin: {
          createdPin: '1123',
          createdPinHash: 'pinHash',
          pinEnteredToVerify: '1123',
          verifyPinHash: 'pinHash',
        },
        settings: { token: 'token', deviceToken: 'deviceToken' },
      };
      mockGetState.mockReturnValue(state);
      mockupdatePin.mockImplementation(() => {
        throw { code: 2009 };
      });
      const pinScreenParams = { currentPin: '1123', isUpdatePin: true };
      const actionDispatcher = securePinReducerActions.addUpdatePinAction({
        pinScreenParams,
        pin: '1123',
        navigation: rootStackNavigationMock,
      });
      await actionDispatcher(mockReduxDispatcher, mockGetState);
      expect(securePinReducerActions.setErrorCodeAction).toHaveBeenCalled();
      expect(securePinReducerActions.setErrorCodeAction).toHaveBeenCalledWith(
        2009
      );
      expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
      const expectedCreatePinParams: ICreatePinScreenRouteProps =
        pinScreenParams;
      expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
        'CreatePin',
        expectedCreatePinParams
      );
    });

    it('dispatches account token update when updating pin', async () => {
      const dispatchMock = jest.fn();
      securePinReducerActions.setPinToBeVerifiedAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      const state = {
        ...mockState,
        securePin: {
          createdPin: '1123',
          createdPinHash: 'pinHash',
          pinEnteredToVerify: '1123',
          verifyPinHash: 'pinHash',
        },
        settings: { token: 'token', deviceToken: 'deviceToken' },
      };
      mockGetState.mockReturnValue(state);

      const responseMock: IApiResponse = {
        message: 'success',
        status: 'ok',
      };
      mockupdatePin.mockResolvedValue(responseMock);

      const asyncAction = securePinReducerActions.addUpdatePinAction({
        pinScreenParams: {
          currentPin: '1123',
          isUpdatePin: true,
        },
        pin: '1123',
      });
      await asyncAction(dispatchMock, mockGetState);

      expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
        dispatchMock,
        responseMock.refreshToken
      );
    });

    it('should dispatch handleCommonErrorAction when there is Error in ApiResponse in case of addPin', async () => {
      securePinReducerActions.setErrorCodeAction = jest.fn();
      securePinReducerActions.setPinToBeVerifiedAction = jest
        .fn()
        .mockReturnValue((dispatch: unknown) => dispatch);
      const state = {
        ...mockState,
        securePin: {
          createdPinHash: 'pinHash',
          verifyPinHash: 'pinHash',
        },
        settings: { token: 'token', deviceToken: 'deviceToken' },
      };
      mockGetState.mockReturnValue(state);

      const error = new ErrorApiResponse(ErrorConstants.errorInternalServer());
      mockAddPin.mockImplementation(() => {
        throw error;
      });
      const actionDispatcher = securePinReducerActions.addUpdatePinAction({
        pinScreenParams: {
          isUpdatePin: false,
        },
        pin: '1234',
        navigation: rootStackNavigationMock,
      });
      await actionDispatcher(mockReduxDispatcher, mockGetState);

      expect(mockHandleCommonErrorAction).toHaveBeenNthCalledWith(
        1,
        rootStackNavigationMock,
        error.message,
        error
      );
    });
  });

  describe('handle back navigation', () => {
    it('return to previous screen', async () => {
      const actionDispatcher = navigateToBackAction(rootStackNavigationMock);
      await actionDispatcher(mockReduxDispatcher);
      expect(rootStackNavigationMock.goBack).toBeCalledTimes(1);
    });
  });

  describe('clearAccountToken', () => {
    it('clears account token', async () => {
      const actionDispatcher = clearAccountToken();
      await actionDispatcher(mockReduxDispatcher);
      expect(accountTokenClearDispatchMock).toHaveBeenCalled();
    });
  });
});
