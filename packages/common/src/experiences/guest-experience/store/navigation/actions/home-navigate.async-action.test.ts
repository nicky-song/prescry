// Copyright 2020 Prescryptive Health, Inc.

import { homeNavigateAsyncAction } from './home-navigate.async-action';
import { navigateHomeScreenDispatch } from '../dispatch/navigate-home-screen.dispatch';
import { rootStackNavigationMock } from './../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { handleNavigateToHome } from '../handle-navigate-to-home';
import { IHomeScreenRouteProps } from '../../../home-screen/home-screen';
import { IPopupModalProps } from '../../../../../components/modal/popup-modal/popup-modal';

jest.mock('../handle-navigate-to-home');
const handleNavigateToHomeMock = handleNavigateToHome as jest.Mock;

jest.mock('../dispatch/navigate-home-screen.dispatch');
const navigateHomeScreenDispatchMock = navigateHomeScreenDispatch as jest.Mock;

describe('HomeNavigateAsyncAction', () => {
  it('dispatches navigate to Home screen', async () => {
    const asyncAction = await homeNavigateAsyncAction(rootStackNavigationMock);

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({ features: {} });
    await asyncAction(dispatchMock, getStateMock);

    expect(navigateHomeScreenDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      {} as IHomeScreenRouteProps
    );
    expect(getStateMock).toBeCalledTimes(1);
  });

  it('calls handleNavigateToHome for updating url', async () => {
    const asyncAction = await homeNavigateAsyncAction(rootStackNavigationMock);

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({ features: {} });
    await asyncAction(dispatchMock, getStateMock);

    expect(navigateHomeScreenDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      {} as IHomeScreenRouteProps
    );
    expect(getStateMock).toBeCalledTimes(1);
    expect(handleNavigateToHomeMock).toHaveBeenCalledWith(undefined);
  });

  it('calls handleNavigateToHome with feature flags for updating url', async () => {
    const asyncAction = await homeNavigateAsyncAction(rootStackNavigationMock);

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({ features: {} });
    await asyncAction(dispatchMock, getStateMock);

    expect(navigateHomeScreenDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      {} as IHomeScreenRouteProps
    );
    expect(getStateMock).toBeCalledTimes(1);
    expect(handleNavigateToHomeMock).toHaveBeenCalledWith(undefined);
  });

  it('calls handleNavigateToHome with feature flags for updating url', async () => {
    const asyncAction = await homeNavigateAsyncAction(rootStackNavigationMock);

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      features: { usevaccine: true, usepharmacy: true },
    });
    await asyncAction(dispatchMock, getStateMock);

    expect(navigateHomeScreenDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      {} as IHomeScreenRouteProps
    );
    expect(getStateMock).toBeCalledTimes(1);
    expect(handleNavigateToHomeMock).toHaveBeenCalledWith(
      '?f=usevaccine:1,usepharmacy:1'
    );
  });

  it('calls handleNavigateToHome with modalContent in props', async () => {
    const modalContent: IPopupModalProps = { isOpen: true };
    const asyncAction = await homeNavigateAsyncAction(
      rootStackNavigationMock,
      modalContent
    );

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      features: {},
    });
    await asyncAction(dispatchMock, getStateMock);

    expect(navigateHomeScreenDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      { modalContent } as IHomeScreenRouteProps
    );
    expect(getStateMock).toBeCalledTimes(1);
    expect(handleNavigateToHomeMock).toHaveBeenCalledWith(
      '?f=usevaccine:1,usepharmacy:1'
    );
  });
});
