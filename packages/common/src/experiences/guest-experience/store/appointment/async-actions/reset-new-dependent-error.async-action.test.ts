// Copyright 2020 Prescryptive Health, Inc.

import { resetNewDependentErrorAction } from '../actions/reset-new-dependent-error.action';
import { resetNewDependentErrorAsyncAction } from './reset-new-dependent-error.async-action';

const dispatchMock = jest.fn();
jest.mock('../actions/reset-new-dependent-error.action');
const resetNewDependentErrorActionMock = resetNewDependentErrorAction as jest.Mock;

describe('resetNewDependentErrorAsyncAction', () => {
  it('dispatches resetNewDependentErrorAction when there is an error and then dependent info is changed', async () => {
    const asyncAction = resetNewDependentErrorAsyncAction();
    await asyncAction(dispatchMock);
    expect(resetNewDependentErrorActionMock).toHaveBeenCalled();
  });
});
