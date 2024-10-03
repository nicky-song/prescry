// Copyright 2023 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { addConsentDispatch } from '../dispatch/add-consent.dispatch';
import {
  addConsentAsyncAction,
  IAddConsentAsyncActionArgs,
} from './add-consent.async-action';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/add-consent.dispatch');
const addConsentDispatchMock = addConsentDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();
const loadingTextMock = 'Loading prescription mock';
describe('addConsentAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('dispatches add consent', async () => {
    const accountIdMock = 'account-id-mock';
    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';
    const consentMock = true;

    const argsMock: IAddConsentAsyncActionArgs = {
      accountId: accountIdMock,
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      consent: consentMock,
      navigation: rootStackNavigationMock,
      membershipDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await addConsentAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](
      argsMock,
      true,
      loadingTextMock
    );
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(addConsentDispatch).toHaveBeenCalledWith(argsMock);
  });

  it('Should call dataLoadingAction with expected arguments', async () => {
    const accountIdMock = 'account-id-mock';
    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';
    const consentMock = true;

    const argsMock: IAddConsentAsyncActionArgs = {
      accountId: accountIdMock,
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      consent: consentMock,
      navigation: rootStackNavigationMock,
      membershipDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await addConsentAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock,
      true
    );
  });

  it('handles errors', async () => {
    const errorMock = new Error('Boom!');
    addConsentDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const accountIdMock = 'account-id-mock';
    const smartContractAddressMock = 'smart-contract-address-mock';
    const firstNameMock = 'first-name-mock';
    const lastNameMock = 'last-name-mock';
    const dateOfBirthMock = 'date-of-birth-mock';
    const consentMock = true;

    const argsMock: IAddConsentAsyncActionArgs = {
      accountId: accountIdMock,
      smartContractAddress: smartContractAddressMock,
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      consent: consentMock,
      navigation: rootStackNavigationMock,
      membershipDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await addConsentAsyncAction(argsMock);

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
