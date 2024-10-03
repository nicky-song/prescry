// Copyright 2020 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { handleCommonErrorAction } from '../../error-handling.actions';
import { internalErrorDispatch } from './internal-error.dispatch';

jest.mock('../../error-handling.actions', () => ({
  handleCommonErrorAction: jest.fn(),
}));
const handleCommonErrorActionMock = handleCommonErrorAction as jest.Mock;

describe('internalErrorDispatch', () => {
  it('dispatches internal error', () => {
    const errorMock = Error('Boom!');

    internalErrorDispatch(rootStackNavigationMock, errorMock);

    expect(handleCommonErrorActionMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      '',
      errorMock
    );
  });
});
