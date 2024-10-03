// Copyright 2021 Prescryptive Health, Inc.

import { IVerifyIdentityRequestBody } from '../../../../../models/api-request-body/verify-identity.request-body';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { identityVerificationDataLoadingAsyncAction } from './identity-verification-data-loading.async-action';
import {
  identityVerificationAsyncAction,
  IIdentityVerificationAsyncActionArgs,
} from './identity-verification.async-action';

jest.mock('./identity-verification.async-action');
const identityVerificationAsyncActionMock =
  identityVerificationAsyncAction as jest.Mock;
jest.mock('../../modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

describe('identityVerificationDataLoadingAsyncAction', () => {
  it('calls dataLoadingAction', () => {
    const requestBodyMock = {
      phoneNumber: 'phone',
      emailAddress: 'test@test.com',
      dateOfBirth: 'dob',
    } as IVerifyIdentityRequestBody;
    const args: IIdentityVerificationAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      requestBody: requestBodyMock,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
    };
    identityVerificationDataLoadingAsyncAction(args);
    expect(dataLoadingActionMock).toBeCalledWith(
      identityVerificationAsyncActionMock,
      args
    );
  });
});
