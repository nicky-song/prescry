// Copyright 2021 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../../errors/error-api-response';
import { ErrorInternalServer } from '../../../../../errors/error-internal-server';
import { APITypes } from '../../../api/api-v1-helper';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { handleAuthUserApiErrorsAction } from '../async-actions/handle-api-errors-for-auth-users.async-action';
import { handlePostLoginApiErrorsAction } from './navigate-post-login-error.dispatch';
import { rootStackNavigationMock } from './../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../async-actions/handle-api-errors-for-auth-users.async-action');
const handleAuthUserApiErrorsActionMock =
  handleAuthUserApiErrorsAction as jest.Mock;

jest.mock('../../error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

describe('handlePostLoginApiErrorsAction', () => {
  it('should call handleAuthUserApiErrorsAction', async () => {
    const dispatchMock = jest.fn();
    const errorMock = new Error();

    await handlePostLoginApiErrorsAction(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
    expect(handleAuthUserApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
  });

  it('handles internal server error', async () => {
    const dispatchMock = jest.fn();
    const errorMock = new ErrorInternalServer(
      'internal servere error',
      APITypes.PROVIDER_LOCATIONS
    );

    handleAuthUserApiErrorsActionMock.mockImplementation(() => {
      throw errorMock;
    });

    await handlePostLoginApiErrorsAction(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'SupportError'
    );
  });

  it('handles other api response errors', async () => {
    const dispatchMock = jest.fn();
    const errorMock = new ErrorApiResponse('Boom!');

    handleAuthUserApiErrorsActionMock.mockImplementation(() => {
      throw errorMock;
    });

    await handlePostLoginApiErrorsAction(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'SupportError'
    );
  });

  it('handles all other errors', async () => {
    const dispatchMock = jest.fn();
    const errorMock = new Error();

    handleAuthUserApiErrorsActionMock.mockImplementation(() => {
      throw errorMock;
    });

    await handlePostLoginApiErrorsAction(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );

    expect(internalErrorDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      errorMock
    );
  });
});
