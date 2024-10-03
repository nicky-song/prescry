// Copyright 2018 Prescryptive Health, Inc.

import { hideLoadingDispatch } from '../loading/dispatch/hide-loading.dispatch';
import { showLoadingDispatch } from '../loading/dispatch/show-loading.dispatch';
import { RootState } from '../root-reducer';
import { dataLoadingAction } from './modal-popup.reducer.actions';

jest.mock('../loading/dispatch/show-loading.dispatch');
const showLoadingDispatchMock = showLoadingDispatch as jest.Mock;

jest.mock('../loading/dispatch/hide-loading.dispatch');
const hideLoadingDispatchMock = hideLoadingDispatch as jest.Mock;

describe('dataLoadingAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches actions on success', async () => {
    const reducerActionMock = jest
      .fn()
      .mockReturnValue('reducer-action-return-value');
    const argsMock = { isTrue: true };
    const dispatchMock = jest.fn();
    const showMessageMock = true;
    const messageMainHeaderMock = 'message-main-header';

    const actionDispatcher = dataLoadingAction(
      reducerActionMock,
      argsMock,
      showMessageMock,
      messageMainHeaderMock
    );

    await actionDispatcher(dispatchMock, () => ({} as RootState));

    expect(showLoadingDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      showMessageMock,
      messageMainHeaderMock
    );

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith('reducer-action-return-value');
    expect(reducerActionMock).toHaveBeenCalledWith(argsMock);

    expect(hideLoadingDispatchMock).toHaveBeenCalledWith(dispatchMock);
  });

  it('dispatches hide loading on failure', async () => {
    const reducerActionMock = jest.fn().mockImplementation(() => {
      throw Error('Nope!');
    });

    const dispatchMock = jest.fn();

    try {
      const actionDispatcher = dataLoadingAction(reducerActionMock, {});
      await actionDispatcher(dispatchMock, () => ({} as RootState));
      fail('Expected exception but none thrown!');
    } catch {
      expect(hideLoadingDispatchMock).toHaveBeenCalledWith(dispatchMock);
    }
  });
});
