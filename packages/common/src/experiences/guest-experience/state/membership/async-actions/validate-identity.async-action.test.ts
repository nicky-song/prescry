// Copyright 2023 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';

import { validateIdentityDispatch } from '../dispatch/validate-identity.dispatch';
import {
  IValidateIdentityAsyncActionArgs,
  validateIdentityAsyncAction,
} from './validate-identity.async-action';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/validate-identity.dispatch');
const validateIdentityDispatchMock = validateIdentityDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();
const loadingTextMock = 'Loading prescription mock';
describe('validateIdentityAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('dispatches validate identity', async () => {
    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';

    const argsMock: IValidateIdentityAsyncActionArgs = {
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      navigation: rootStackNavigationMock,
      membershipDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await validateIdentityAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](
      argsMock,
      true,
      loadingTextMock
    );
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(validateIdentityDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('Should call dataLoadingAction with expected arguments', async () => {
    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';

    const argsMock: IValidateIdentityAsyncActionArgs = {
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      navigation: rootStackNavigationMock,
      membershipDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await validateIdentityAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock,
      true
    );
  });

  it('handles errors', async () => {
    const errorMock = new Error('Boom!');
    validateIdentityDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';

    const argsMock: IValidateIdentityAsyncActionArgs = {
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      navigation: rootStackNavigationMock,
      membershipDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await validateIdentityAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](
      argsMock,
      true,
      loadingTextMock
    );
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      reduxDispatchMock,
      rootStackNavigationMock
    );
  });
});
