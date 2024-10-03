// Copyright 2021 Prescryptive Health, Inc.

import { loadMemberDataDispatch } from '../../../member-list-info/dispatch/load-member-data.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../../root-navigation.actions';
import { dispatchResetStackToFatalErrorScreen } from '../../navigation-reducer.actions';
import { pickAPharmacyNavigateDispatch } from './pick-a-pharmacy-navigate.dispatch';
import { pickAPharmacyDeepNavigateDispatch } from './pick-a-pharmacy-deep-navigate.dispatch';
import { rootStackNavigationMock } from './../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { popToTop } from '../../../../navigation/navigation.helper';
import { IShoppingPickAPharmacyScreenRouteProps } from '../../../../screens/shopping/pick-a-pharmacy/shopping-pick-a-pharmacy.screen';

jest.mock('../../../member-list-info/dispatch/load-member-data.dispatch');
const loadMemberDataDispatchMock = loadMemberDataDispatch as jest.Mock;

jest.mock('./pick-a-pharmacy-navigate.dispatch');
const pickAPharmacyNavigateDispatchMock =
  pickAPharmacyNavigateDispatch as jest.Mock;

jest.mock('../../../root-navigation.actions');
const handleKnownAuthenticationErrorActionMock =
  handleKnownAuthenticationErrorAction as jest.Mock;

jest.mock('../../navigation-reducer.actions');
const dispatchResetStackToFatalErrorScreenMock =
  dispatchResetStackToFatalErrorScreen as jest.Mock;

jest.mock('../../../../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

describe('pickAPharmacyDeepNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches member data load', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    await pickAPharmacyDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'prescription-id'
    );

    expect(loadMemberDataDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
  });

  it('does not navigate to "Pick a Location" screen if redirected for login', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    loadMemberDataDispatchMock.mockResolvedValue(true);

    await pickAPharmacyDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'prescription-id'
    );

    expect(pickAPharmacyNavigateDispatchMock).not.toHaveBeenCalledWith();
  });

  it('dispatches navigate to "Pick a Location" screen', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const prescriptionIdMock = 'prescription-id';

    loadMemberDataDispatchMock.mockResolvedValue(false);

    await pickAPharmacyDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      prescriptionIdMock
    );

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);

    const expectedRouteProps: IShoppingPickAPharmacyScreenRouteProps = {
      prescriptionId: prescriptionIdMock,
      navigateToHome: true,
    };
    expect(pickAPharmacyNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      expectedRouteProps
    );
  });

  it('dispatches navigate to "Pick a Location" screen for blockchain prescription', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const prescriptionIdMock = 'prescription-id';

    loadMemberDataDispatchMock.mockResolvedValue(false);

    await pickAPharmacyDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      prescriptionIdMock,
      true
    );

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);

    const expectedRouteProps: IShoppingPickAPharmacyScreenRouteProps = {
      prescriptionId: prescriptionIdMock,
      navigateToHome: true,
      blockchain: true,
    };
    expect(pickAPharmacyNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      expectedRouteProps
    );
  });

  it('handles known authentication errors', async () => {
    const dispatchMock = jest.fn();
    const errorMock = Error('Boom!');

    loadMemberDataDispatchMock.mockImplementation(() => {
      throw errorMock;
    });
    handleKnownAuthenticationErrorActionMock.mockReturnValue(true);

    await pickAPharmacyDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock,
      'prescription-id'
    );

    expect(handleKnownAuthenticationErrorActionMock).toHaveBeenCalledWith(
      dispatchMock,
      rootStackNavigationMock,
      errorMock
    );
    expect(dispatchResetStackToFatalErrorScreenMock).not.toHaveBeenCalled();
  });

  it('dispatches reset to fatal error screen', async () => {
    const dispatchMock = jest.fn();

    loadMemberDataDispatchMock.mockImplementation(() => {
      throw Error('Boom!');
    });
    handleKnownAuthenticationErrorActionMock.mockReturnValue(false);

    await pickAPharmacyDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock,
      'prescription-id'
    );

    expect(dispatchResetStackToFatalErrorScreenMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });
});
