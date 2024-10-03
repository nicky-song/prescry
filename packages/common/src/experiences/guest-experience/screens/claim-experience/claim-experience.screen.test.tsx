// Copyright 2022 Prescryptive Health, Inc.

import React, { useEffect } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { ClaimExperienceScreen } from './claim-experience.screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useClaimAlertContext } from '../../context-providers/claim-alert/use-claim-alert-context';
import { popToTop } from '../../navigation/navigation.helper';
import { getClaimAlertAsyncAction } from '../../state/claim-alert/async-actions/get-claim-alert.async-action';
import { IPrescribedMedication } from '../../../../models/prescribed-medication';
import { ClaimNotification } from '../../../../models/claim-alert/claim-alert';
import { View } from 'react-native';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../context-providers/claim-alert/use-claim-alert-context');
const useClaimAlertContextMock = useClaimAlertContext as jest.Mock;

jest.mock('../../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

jest.mock('../../state/claim-alert/async-actions/get-claim-alert.async-action');
const getClaimAlertAsyncActionMock = getClaimAlertAsyncAction as jest.Mock;

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

describe('ClaimExperienceScreen', () => {
  const identifierMock = 'identifier-mock';
  const dispatchMock = jest.fn();
  const getStateMock = jest.fn();

  const claimAlertDispatchMock = jest.fn();
  const prescribedMedicationMock = {} as IPrescribedMedication;
  const notificationTypeMock: ClaimNotification = 'alternativesAvailable';

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    useRouteMock.mockReturnValue({
      params: {
        identifier: identifierMock,
      },
    });

    useReduxContextMock.mockReturnValue({
      dispatch: dispatchMock,
      getState: getStateMock,
    });

    useClaimAlertContextMock.mockReturnValue({
      claimAlertState: {
        prescribedMedication: prescribedMedicationMock,
        notificationType: notificationTypeMock,
      },
      claimAlertDispatch: claimAlertDispatchMock,
    });
  });

  it('renders as BasicPageConnected', () => {
    const testRenderer = renderer.create(<ClaimExperienceScreen />);

    const page = testRenderer.root.children[0] as ReactTestInstance;

    expect(page.type).toEqual(BasicPageConnected);
    expect(page.props.body.type).toEqual(View);
    expect(page.props.body.props.testID).toEqual('claimExperienceScreen');
  });

  it('calls getClaimAlertAsyncAction on mount if !prescribedMedication', () => {
    useClaimAlertContextMock.mockReset();
    useClaimAlertContextMock.mockReturnValue({
      claimAlertState: {
        prescribedMedication: undefined,
        notificationType: undefined,
      },
      claimAlertDispatch: claimAlertDispatchMock,
    });

    renderer.create(<ClaimExperienceScreen />);

    expect(useEffectMock.mock.calls[0][1]).toEqual([undefined]);

    useEffectMock.mock.calls[0][0]();

    expect(getClaimAlertAsyncActionMock).toHaveBeenCalledTimes(1);
    expect(getClaimAlertAsyncActionMock).toHaveBeenNthCalledWith(1, {
      identifier: identifierMock,
      claimAlertDispatch: claimAlertDispatchMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
      navigation: rootStackNavigationMock,
    });
  });

  it('navigates to RecommendedAlternativesScreen when notificationType: alternativesAvailable', () => {
    useClaimAlertContextMock.mockReset();
    useClaimAlertContextMock.mockReturnValue({
      claimAlertState: {
        prescribedMedication: prescribedMedicationMock,
        notificationType: 'alternativesAvailable' as ClaimNotification,
      },
      claimAlertDispatch: claimAlertDispatchMock,
    });

    renderer.create(<ClaimExperienceScreen />);

    expect(useEffectMock.mock.calls[0][1]).toEqual([prescribedMedicationMock]);

    useEffectMock.mock.calls[0][0]();

    expect(popToTopMock).toHaveBeenCalledTimes(1);
    expect(popToTopMock).toHaveBeenNthCalledWith(1, rootStackNavigationMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'ClaimAlertStack',
      {
        screen: 'RecommendedAlternatives',
      }
    );
  });

  it('navigates to GreatPriceScreen when notificationType: bestPrice', () => {
    useClaimAlertContextMock.mockReset();
    useClaimAlertContextMock.mockReturnValue({
      claimAlertState: {
        prescribedMedication: prescribedMedicationMock,
        notificationType: 'bestPrice' as ClaimNotification,
      },
      claimAlertDispatch: claimAlertDispatchMock,
    });

    renderer.create(<ClaimExperienceScreen />);

    useEffectMock.mock.calls[0][0]();

    expect(popToTopMock).toHaveBeenCalledTimes(1);
    expect(popToTopMock).toHaveBeenNthCalledWith(1, rootStackNavigationMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'ClaimAlertStack',
      {
        screen: 'GreatPrice',
      }
    );
  });

  it('navigates to ClaimReversalScreen when notificationType: reversal', () => {
    useClaimAlertContextMock.mockReset();
    useClaimAlertContextMock.mockReturnValue({
      claimAlertState: {
        prescribedMedication: prescribedMedicationMock,
        notificationType: 'reversal' as ClaimNotification,
      },
      claimAlertDispatch: claimAlertDispatchMock,
    });

    renderer.create(<ClaimExperienceScreen />);

    useEffectMock.mock.calls[0][0]();

    expect(popToTopMock).toHaveBeenCalledTimes(1);
    expect(popToTopMock).toHaveBeenNthCalledWith(1, rootStackNavigationMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'ClaimAlertStack',
      {
        screen: 'ClaimReversal',
      }
    );
  });
});
