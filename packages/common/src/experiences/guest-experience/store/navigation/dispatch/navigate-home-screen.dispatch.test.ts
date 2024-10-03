// Copyright 2018 Prescryptive Health, Inc.

import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import {
  dispatchResetStackToFatalErrorScreen,
  resetStackToHome,
} from '../navigation-reducer.actions';
import { verifyPrescriptionNavigateDispatch } from '../dispatch/drug-search/verify-prescription-navigate.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { navigateHomeScreenDispatch } from './navigate-home-screen.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IHomeScreenRouteProps } from '../../../home-screen/home-screen';
import { isPbmMember } from '../../../../../utils/profile.helper';
import { RootState } from '../../root-reducer';
import { GuestExperienceFeatures } from '../../../guest-experience-features';
import { IMemberProfileState } from '../../member-profile/member-profile-reducer';
import { IDigitalIDCardScreenRouteProps } from '../../../screens/digital-id-card/digital-id-card.screen';
import { popToTop } from '../../../navigation/navigation.helper';

jest.mock('../../root-navigation.actions');
const handleKnownAuthenticationErrorActionMock =
  handleKnownAuthenticationErrorAction as jest.Mock;

jest.mock('../navigation-reducer.actions');
const dispatchResetStackToFatalErrorScreenMock =
  dispatchResetStackToFatalErrorScreen as jest.Mock;
const resetStackToHomeMock = resetStackToHome as jest.Mock;

jest.mock('../../member-list-info/dispatch/load-member-data.dispatch', () => ({
  loadMemberDataDispatch: jest.fn(),
}));
const loadMemberDataDispatchMock = loadMemberDataDispatch as jest.Mock;

jest.mock('../../feed/dispatch/get-feed.dispatch');

jest.mock('../dispatch/drug-search/verify-prescription-navigate.dispatch');
const verifyPrescriptionNavigateDispatchMock =
  verifyPrescriptionNavigateDispatch as jest.Mock;

jest.mock('../../../../../utils/profile.helper');
const isPbmMemberMock = isPbmMember as jest.Mock;

jest.mock('../../../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

describe('navigateHomeScreenDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches to home screen if loading member data is not redirected and workflow prop is not passsed', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    loadMemberDataDispatchMock.mockResolvedValue(false);

    await navigateHomeScreenDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(resetStackToHomeMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      undefined
    );
    expect(dispatchResetStackToFatalErrorScreenMock).not.toHaveBeenCalled();
  });

  it('dispatches to home screen if loading member data is not redirected with modelContent if passed', async () => {
    const modalContent: IHomeScreenRouteProps = {
      modalContent: { showModal: true },
    };
    const dispatch = jest.fn();
    const getState = jest.fn();
    loadMemberDataDispatchMock.mockResolvedValue(false);

    await navigateHomeScreenDispatch(
      dispatch,
      getState,
      rootStackNavigationMock,
      modalContent
    );
    expect(resetStackToHomeMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      modalContent
    );
    expect(dispatchResetStackToFatalErrorScreenMock).not.toHaveBeenCalled();
  });

  it('dispatches to verifyPrescription screen if loading member data is not redirected and workflow prop is prescriptionTransfer', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    loadMemberDataDispatchMock.mockResolvedValue(false);

    await navigateHomeScreenDispatch(
      dispatch,
      getState,
      rootStackNavigationMock,
      undefined,
      'prescriptionTransfer'
    );

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(verifyPrescriptionNavigateDispatchMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock
    );
    expect(dispatchResetStackToFatalErrorScreen).not.toHaveBeenCalled();
  });

  it.each([
    [false, 'SmartPrice', undefined],
    [true, 'DigitalIDCard', { backToHome: true }],
  ])(
    'dispatches expected screen if loading member data is not redirected and workflow prop is "startSaving" (isPbmMember: %p)',
    async (
      isMemberMock: boolean,
      expectedScreen: string,
      expectedRouteParams: undefined | IDigitalIDCardScreenRouteProps
    ) => {
      const dispatch = jest.fn();

      const stateMock: Partial<RootState> = {
        features: GuestExperienceFeatures,
        memberProfile: {
          profileList: [{ rxGroupType: 'rx-group-type' }],
        } as IMemberProfileState,
      };
      const getState = jest.fn().mockReturnValue(stateMock);
      loadMemberDataDispatchMock.mockResolvedValue(false);

      isPbmMemberMock.mockReturnValue(isMemberMock);

      await navigateHomeScreenDispatch(
        dispatch,
        getState,
        rootStackNavigationMock,
        undefined,
        'startSaving'
      );

      expect(popToTopMock).toBeCalledWith(rootStackNavigationMock);
      expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
        1,
        expectedScreen,
        expectedRouteParams
      );

      expect(verifyPrescriptionNavigateDispatchMock).not.toHaveBeenCalled();
      expect(dispatchResetStackToFatalErrorScreen).not.toHaveBeenCalled();

      expect(isPbmMemberMock).toHaveBeenCalledWith(
        stateMock.memberProfile?.profileList,
        GuestExperienceFeatures
      );
    }
  );

  it('is not dispatched to home screen if loading member data is redirected', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    loadMemberDataDispatchMock.mockResolvedValue(true);

    await navigateHomeScreenDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalled();
    expect(dispatchResetStackToFatalErrorScreen).not.toHaveBeenCalled();
    expect(rootStackNavigationMock.canGoBack).not.toBeCalled();
    expect(rootStackNavigationMock.popToTop).not.toBeCalled();
  });

  it('dispatches to fatal screen if error', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const expectedError: Error = new Error('error');
    (loadMemberDataDispatch as jest.Mock).mockImplementation(() => {
      throw expectedError;
    });

    await navigateHomeScreenDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(rootStackNavigationMock.navigate).not.toHaveBeenCalled();
    expect(dispatchResetStackToFatalErrorScreen).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock
    );
    expect(handleKnownAuthenticationErrorActionMock).toHaveBeenCalledWith(
      dispatchMock,
      rootStackNavigationMock,
      expectedError
    );
  });
});
