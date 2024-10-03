// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { PickAPharmacy } from '../../../pick-a-pharmacy/pick-a-pharmacy';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { DrugSearchPickAPharmacyScreen } from './drug-search-pick-a-pharmacy.screen';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import {
  defaultPharmacyFilterPreferences,
  defaultSessionState,
  ISessionState,
} from '../../../state/session/session.state';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import {
  defaultDrugSearchState,
  IDrugSearchState,
} from '../../../state/drug-search/drug-search.state';
import { lyricaSearchResultMock } from '../../../__mocks__/drug-search-response.mock';
import { setSelectedPharmacyDispatch } from '../../../state/drug-search/dispatch/set-selected-pharmacy.dispatch';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import {
  defaultMembershipState,
  IMembershipState,
} from '../../../state/membership/membership.state';
import { profileListMock } from '../../../__mocks__/profile-list.mock';
import { ISessionContext } from '../../../context-providers/session/session.context';
import { getLastZipCodeFromSettings } from '../../../../../utils/session.helper';
import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../../../__mocks__/pharmacy-drug-price.mock';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import {
  getDrugPriceAsyncAction,
  IGetDrugPriceAsyncActionArgs,
} from '../../../state/drug-search/async-actions/get-drug-price.async-action';
import { getDrugInformation } from '../../../api/api-v1.get-drug-information';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import {
  getUserLocationAsyncAction,
  IGetUserLocationAsyncActionArgs,
} from '../../../state/session/async-actions/get-user-location.async-action';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { fetchUserPosition } from '../../../state/session/utils/fetch-user-position';
import { IDrugSearchContext } from '../../../context-providers/drug-search/drug-search.context';
import { setLocationDeniedErrorMessageDispatch } from '../../../state/drug-search/dispatch/set-location-denied-error-message.dispatch';
import { translateCoordinateHelper } from '../../../../../utils/translate-coordinate.helper';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';
import { assertIsDefined } from '../../../../../assertions/assert-is-defined';

jest.mock('../../../../../utils/translate-coordinate.helper');
const translateCoordinateHelperMock = translateCoordinateHelper as jest.Mock;

jest.mock(
  '../../../state/drug-search/dispatch/set-location-denied-error-message.dispatch'
);
const setLocationDeniedErrorMessageDispatchMock =
  setLocationDeniedErrorMessageDispatch as jest.Mock;

jest.mock('../../../../../utils/session.helper');
const getLastZipCodeFromSettingsMock = getLastZipCodeFromSettings as jest.Mock;
jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../pick-a-pharmacy/pick-a-pharmacy', () => ({
  PickAPharmacy: () => <div />,
}));

jest.mock(
  '../../../context-providers/drug-search/use-drug-search-context.hook'
);
const useDrugSearchContextMock = useDrugSearchContext as jest.Mock;

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../state/drug-search/dispatch/set-selected-pharmacy.dispatch');
const setSelectedPharmacyDispatchMock =
  setSelectedPharmacyDispatch as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock(
  '../../../state/drug-search/async-actions/get-drug-price.async-action'
);
const getDrugPriceAsyncActionMock = getDrugPriceAsyncAction as jest.Mock;

jest.mock(
  '../../../state/session/async-actions/get-user-location.async-action'
);
const getUserLocationAsyncActionMock = getUserLocationAsyncAction as jest.Mock;

jest.mock('../../../api/api-v1.get-drug-information');
const getDrugInformationMock = getDrugInformation as jest.Mock;

jest.mock('../../../state/session/utils/fetch-user-position');
const fetchUserPositionMock = fetchUserPosition as jest.Mock;

const membershipStateMock: Partial<IMembershipState> = {
  ...defaultMembershipState,
  profileList: profileListMock,
};

interface IStateCalls {
  infoLink: [string, jest.Mock];
}

const defaultConfigurationMock = drugSearchResultHelper.getDefaultConfiguration(
  lyricaSearchResultMock
);

function stateReset({ infoLink = ['', jest.fn()] }: Partial<IStateCalls>) {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce(infoLink);
}

describe('DrugSearchPickAPharmacy', () => {
  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn().mockReturnValue({ features: {} });
  const sessionDispatchMock = jest.fn();
  const reduxContextMock: IReduxContext = {
    dispatch: reduxDispatchMock,
    getState: reduxGetStateMock,
  };
  beforeEach(() => {
    jest.clearAllMocks();
    const drugSearchStateMock: Partial<IDrugSearchState> = {
      ...defaultDrugSearchState,
      selectedDrug: lyricaSearchResultMock,
    };
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    });
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const sessionContextMock: ISessionContext = {
      sessionDispatch: sessionDispatchMock,
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    useMembershipContextMock.mockReturnValue({
      membershipState: membershipStateMock,
      membershipDispatch: jest.fn(),
    });
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    stateReset({});
    getLastZipCodeFromSettingsMock.mockReturnValueOnce('');

    translateCoordinateHelperMock.mockImplementation((coordinate: number) =>
      Number(coordinate.toFixed(6))
    );
  });

  it('calls PickAPharmacy component with default props', () => {
    const testRenderer = renderer.create(<DrugSearchPickAPharmacyScreen />);
    const PickAPharmacyComponent = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(PickAPharmacyComponent.type).toEqual(PickAPharmacy);
    expect(PickAPharmacyComponent.props.pharmacies).toEqual([]);
    expect(PickAPharmacyComponent.props.onPharmacyPress).toEqual(
      expect.any(Function)
    );
    expect(PickAPharmacyComponent.props.showProfileAvatar).toEqual(true);
    expect(PickAPharmacyComponent.props.logoClickAction).toEqual(
      LogoClickActionEnum.CONFIRM
    );
    expect(PickAPharmacyComponent.props.canShowContent).toEqual(true);
    expect(
      PickAPharmacyComponent.props.showNoPharmaciesFoundErrorMessage
    ).toEqual(false);
    expect(PickAPharmacyComponent.props.isGettingUserLocation).toEqual(false);
  });

  it('renders expected PickAPharmacy component when no pharmacies found', () => {
    const drugSearchStateMock: Partial<IDrugSearchState> = {
      ...defaultDrugSearchState,
      noPharmaciesFound: true,
    };
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    });
    const sessionStateMock: Partial<ISessionState> = {
      userLocation: {
        city: 'mock-city',
        state: 'mock-state',
        zipCode: '12345',
      },
    };
    useSessionContextMock.mockReturnValue({
      sessionState: sessionStateMock,
      sessionContext: jest.fn(),
    });

    const testRenderer = renderer.create(<DrugSearchPickAPharmacyScreen />);

    const PickAPharmacyComponent = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(PickAPharmacyComponent.type).toEqual(PickAPharmacy);
    expect(PickAPharmacyComponent.props.pharmacies).toEqual([]);
    expect(PickAPharmacyComponent.props.onPharmacyPress).toEqual(
      expect.any(Function)
    );
    expect(PickAPharmacyComponent.props.showProfileAvatar).toEqual(true);
    expect(PickAPharmacyComponent.props.canShowContent).toEqual(true);
    expect(
      PickAPharmacyComponent.props.showNoPharmaciesFoundErrorMessage
    ).toEqual(true);
  });

  it('requests updated price when zipcode and selectedConfiguration are changed', async () => {
    const userLocationMock: ILocationCoordinates = {
      latitude: 99,
      longitude: 99,
    };
    const pharmaciesMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ];

    const defaultConfigurationMock =
      drugSearchResultHelper.getDefaultConfiguration(lyricaSearchResultMock);

    const drugSearchDispatchMock = jest.fn();
    const drugSearchStateMock: Partial<IDrugSearchState> = {
      ...defaultDrugSearchState,
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      pharmacies: pharmaciesMock,
      noPharmaciesFound: false,
    };
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
    });
    const sessionContextMock: ISessionContext = {
      sessionDispatch: sessionDispatchMock,
      sessionState: { ...defaultSessionState, userLocation: userLocationMock },
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    rootStackNavigationMock.isFocused = jest.fn().mockReturnValueOnce(true);
    renderer.create(<DrugSearchPickAPharmacyScreen />);
    stateReset({});
    expect(useEffectMock).toHaveBeenNthCalledWith(3, expect.any(Function), [
      { distance: 25, sortBy: 'distance' },
      userLocationMock,
      defaultConfigurationMock,
    ]);

    const effectHandler = useEffectMock.mock.calls[2][0];

    assertIsDefined(defaultConfigurationMock);
    await effectHandler();
    const expectedArgs: IGetDrugPriceAsyncActionArgs = {
      location: userLocationMock,
      sortBy: defaultPharmacyFilterPreferences.sortBy,
      ndc: defaultConfigurationMock.ndc,
      supply: defaultConfigurationMock.supply,
      quantity: defaultConfigurationMock.quantity,
      isUnauthExperience: true,
      distance: defaultPharmacyFilterPreferences.distance,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
      navigation: rootStackNavigationMock,
    };
    expect(getDrugPriceAsyncActionMock).toHaveBeenCalledWith(expectedArgs);
  });

  it('Calls App Insights when pharmacy card clicked', () => {
    const pharmaciesMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ];

    const defaultConfigurationMock =
      drugSearchResultHelper.getDefaultConfiguration(lyricaSearchResultMock);
    const drugSearchStateMock: Partial<IDrugSearchState> = {
      ...defaultDrugSearchState,
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      pharmacies: pharmaciesMock,
      noPharmaciesFound: false,
    };
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<DrugSearchPickAPharmacyScreen />);

    const PickAPharmacyComponent = testRenderer.root.findByType(PickAPharmacy);

    const args = {
      ncpdp: pharmaciesMock[0].pharmacy.ncpdp,
      isBestPrice: pharmacyDrugPrice1Mock.price?.memberPays,
      pharmacyDrugPrice: pharmaciesMock[0],
    };
    PickAPharmacyComponent.props.onPharmacyPress(args);

    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.DRUG_SEARCH_USER_SELECTS_PHARMACY,
      {
        ndc: defaultConfigurationMock?.ndc,
        ncpdp: pharmaciesMock[0].pharmacy.ncpdp,
        isBestPrice: pharmacyDrugPrice1Mock.price?.memberPays,
      }
    );
  });

  it('dispatches set selected pharmacy when pharmacy pressed', () => {
    const pharmaciesMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ];

    const defaultConfigurationMock =
      drugSearchResultHelper.getDefaultConfiguration(lyricaSearchResultMock);
    const drugSearchStateMock: Partial<IDrugSearchState> = {
      ...defaultDrugSearchState,
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      pharmacies: pharmaciesMock,
      noPharmaciesFound: false,
    };

    const drugSearchDispatchMock = jest.fn();
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
    });

    const testRenderer = renderer.create(<DrugSearchPickAPharmacyScreen />);

    const PickAPharmacyComponent = testRenderer.root.findByType(PickAPharmacy);

    const args = {
      ncpdp: pharmaciesMock[0].pharmacy.ncpdp,
      isBestPrice: pharmacyDrugPrice1Mock.price?.memberPays,
      pharmacyDrugPrice: pharmaciesMock[0],
    };
    PickAPharmacyComponent.props.onPharmacyPress(args);

    expect(setSelectedPharmacyDispatchMock).toHaveBeenCalledWith(
      drugSearchDispatchMock,
      args.pharmacyDrugPrice
    );
  });

  it('navigates to "What Comes Next" when pharmacy pressed', () => {
    const pharmaciesMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ];

    const defaultConfigurationMock =
      drugSearchResultHelper.getDefaultConfiguration(lyricaSearchResultMock);
    const drugSearchStateMock: Partial<IDrugSearchState> = {
      ...defaultDrugSearchState,
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      pharmacies: pharmaciesMock,
      noPharmaciesFound: false,
    };

    const drugSearchDispatchMock = jest.fn();
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
    });

    const testRenderer = renderer.create(<DrugSearchPickAPharmacyScreen />);

    const PickAPharmacyComponent = testRenderer.root.findByType(PickAPharmacy);

    const args = {
      ncpdp: pharmaciesMock[0].pharmacy.ncpdp,
      isBestPrice: pharmacyDrugPrice1Mock.price?.memberPays,
      pharmacyDrugPrice: pharmaciesMock[0],
    };
    PickAPharmacyComponent.props.onPharmacyPress(args);

    expect(rootStackNavigationMock.navigate).toBeCalledWith(
      'WhatComesNext',
      {}
    );
  });

  it('dispatches home navigation when back button is pressed', () => {
    const pharmaciesMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ];

    const defaultConfigurationMock =
      drugSearchResultHelper.getDefaultConfiguration(lyricaSearchResultMock);
    const drugSearchStateMock: Partial<IDrugSearchState> = {
      ...defaultDrugSearchState,
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      pharmacies: pharmaciesMock,
      noPharmaciesFound: false,
    };

    const drugSearchDispatchMock = jest.fn();
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
    });

    const testRenderer = renderer.create(<DrugSearchPickAPharmacyScreen />);

    const PickAPharmacyComponent = testRenderer.root.findByType(PickAPharmacy);

    PickAPharmacyComponent.props.navigateBack();

    expect(rootStackNavigationMock.goBack).toHaveBeenCalledTimes(1);
  });

  it.each([
    [undefined, undefined, undefined],
    ['Bellevue', undefined, 'Bellevue'],
    [undefined, 'WA', 'WA'],
    ['Bellevue', 'WA', 'Bellevue, WA'],
  ])(
    'Set Location Text set as City, State when city/state exist (city: %p, state: %p) ',
    (city?: string, state?: string, title?: string) => {
      const pharmaciesMock: IPharmacyDrugPrice[] = [
        pharmacyDrugPrice1Mock,
        pharmacyDrugPrice2Mock,
      ];

      const drugSearchStateMock: Partial<IDrugSearchState> = {
        ...defaultDrugSearchState,
        selectedDrug: lyricaSearchResultMock,
        bestPricePharmacy: pharmacyDrugPrice1Mock,
        pharmacies: pharmaciesMock,
        noPharmaciesFound: false,
      };
      useDrugSearchContextMock.mockReturnValue({
        drugSearchState: drugSearchStateMock,
        drugSearchDispatch: jest.fn(),
      });
      const sessionStateMock: Partial<ISessionState> = {
        userLocation: {
          city,
          state,
        },
      };
      useSessionContextMock.mockReturnValue({
        sessionState: sessionStateMock,
        sessionContext: jest.fn(),
      });
      const testRenderer = renderer.create(<DrugSearchPickAPharmacyScreen />);

      const PickAPharmacyComponent =
        testRenderer.root.findByType(PickAPharmacy);

      expect(PickAPharmacyComponent.props.pharmacyLocation).toEqual(title);
    }
  );

  it('dispatches configure medication navigate when edit icon is pressed', () => {
    const pharmaciesMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ];

    const defaultConfigurationMock =
      drugSearchResultHelper.getDefaultConfiguration(lyricaSearchResultMock);
    const drugSearchStateMock: Partial<IDrugSearchState> = {
      ...defaultDrugSearchState,
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      pharmacies: pharmaciesMock,
      noPharmaciesFound: false,
    };

    const drugSearchDispatchMock = jest.fn();
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
    });

    const testRenderer = renderer.create(<DrugSearchPickAPharmacyScreen />);

    const PickAPharmacyComponent = testRenderer.root.findByType(PickAPharmacy);
    PickAPharmacyComponent.props.configureMedication();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'ConfigureMedication'
    );
  });

  it('call getDrugInformation when selectedConfiguration are changed', async () => {
    getDrugInformationMock.mockReturnValueOnce({
      externalLink: 'https://mock.com',
    });
    // const apiConfigMock = GuestExperienceConfig.apis.contentManagementApi;
    const pharmaciesMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ];

    const defaultConfigurationMock =
      drugSearchResultHelper.getDefaultConfiguration(lyricaSearchResultMock);

    const drugSearchDispatchMock = jest.fn();
    const drugSearchStateMock: Partial<IDrugSearchState> = {
      ...defaultDrugSearchState,
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      pharmacies: pharmaciesMock,
      noPharmaciesFound: false,
    };
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
    });
    renderer.create(<DrugSearchPickAPharmacyScreen />);
    stateReset({
      infoLink: ['https://mock.com', jest.fn()],
    });
    expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
      defaultConfigurationMock,
    ]);

    const effectHandler = useEffectMock.mock.calls[2][0];
    await effectHandler();
    // expect(getDrugInformationMock).toHaveBeenCalledWith(
    //   apiConfigMock,
    //   defaultConfigurationMock?.ndc
    // );

    // const testRenderer = renderer.create(<DrugSearchPickAPharmacyScreen />);
    // const PickAPharmacyComponent = testRenderer.root
    //   .children[0] as ReactTestInstance;

    // expect(PickAPharmacyComponent.type).toEqual(PickAPharmacy);
    // expect(
    //   PickAPharmacyComponent.props.prescriptionTitleProps.externalInfoLink
    // ).toEqual('https://mock.com');
  });

  it('call getDrugInformation when selectedConfiguration are changed', () => {
    getDrugInformationMock.mockReturnValueOnce({
      externalLink: 'https://mock.com',
    });
    const pharmaciesMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ];
    const sortByMock = 'distance';
    const distanceMock = 25;
    const userLocationMock: ILocationCoordinates = {
      latitude: 99,
      longitude: 99,
    };

    const drugSearchDispatchMock = jest.fn();
    const drugSearchStateMock: Partial<IDrugSearchState> = {
      ...defaultDrugSearchState,
      selectedDrug: lyricaSearchResultMock,
      selectedConfiguration: defaultConfigurationMock,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      pharmacies: pharmaciesMock,
      noPharmaciesFound: false,
    };
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
    });
    const sessionContextMock: ISessionContext = {
      sessionDispatch: sessionDispatchMock,
      sessionState: { ...defaultSessionState, userLocation: userLocationMock },
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    rootStackNavigationMock.isFocused = jest.fn().mockReturnValueOnce(true);

    renderer.create(<DrugSearchPickAPharmacyScreen />);

    stateReset({
      infoLink: ['https://mock.com', jest.fn()],
    });
    expect(useEffectMock).toHaveBeenNthCalledWith(3, expect.any(Function), [
      {
        sortBy: sortByMock,
        distance: distanceMock,
      },
      userLocationMock,
      {
        ndc: '00071101568',
        quantity: 60,
        supply: 60,
      },
    ]);

    const effectHandler = useEffectMock.mock.calls[2][0];
    effectHandler();

    assertIsDefined(defaultConfigurationMock);
    const expectedArgs: IGetDrugPriceAsyncActionArgs = {
      location: userLocationMock,
      sortBy: defaultPharmacyFilterPreferences.sortBy,
      ndc: defaultConfigurationMock.ndc,
      supply: defaultConfigurationMock.supply,
      quantity: defaultConfigurationMock.quantity,
      isUnauthExperience: true,
      distance: defaultPharmacyFilterPreferences.distance,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
      navigation: rootStackNavigationMock,
    };
    expect(getDrugPriceAsyncActionMock).toHaveBeenCalledWith(expectedArgs);

    const testRenderer = renderer.create(<DrugSearchPickAPharmacyScreen />);

    const PickAPharmacyComponent = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(PickAPharmacyComponent.type).toEqual(PickAPharmacy);
    expect(
      PickAPharmacyComponent.props.prescriptionTitleProps.externalInfoLink
    ).toEqual('https://mock.com');
  });

  it('calls fetchUserPosition, handleUserPositionChange, and handleGetGeolocationData on mount', async () => {
    const prescriptionIdMock = 'prescription-id-mock';
    const navigationToHomeMock = false;

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
        navigateToHome: navigationToHomeMock,
      },
    });

    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
    };
    const drugSearchDispatchMock = jest.fn();
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    const sessionDispatchMock = jest.fn();
    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        userLocation: undefined,
      },
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    renderer.create(<DrugSearchPickAPharmacyScreen />);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), []);

    const effectHandler = useEffectMock.mock.calls[0][0];

    effectHandler();

    expect(fetchUserPositionMock.mock.calls.length).toEqual(1);
    expect(fetchUserPositionMock.mock.calls).toEqual([
      [expect.any(Function), sessionDispatchMock],
    ]);

    const handleUserPositionChange = fetchUserPositionMock.mock.calls[0][0];

    const userDeviceLocationMock: ILocationCoordinates = {
      latitude: 99.999999999,
      longitude: 111.111111111,
    };
    const errorMessageMock = 'error-message-mock';

    await handleUserPositionChange(userDeviceLocationMock, errorMessageMock);

    expect(setLocationDeniedErrorMessageDispatchMock).toHaveBeenCalledWith(
      drugSearchDispatchMock,
      errorMessageMock
    );

    expect(translateCoordinateHelperMock).toHaveBeenNthCalledWith(
      1,
      userDeviceLocationMock.latitude
    );
    expect(translateCoordinateHelperMock).toHaveBeenNthCalledWith(
      2,
      userDeviceLocationMock.longitude
    );

    const expectedGetUserLocationAsyncActionArgs: IGetUserLocationAsyncActionArgs =
      {
        location: {
          latitude: translateCoordinateHelperMock(
            userDeviceLocationMock.latitude
          ),
          longitude: translateCoordinateHelperMock(
            userDeviceLocationMock.longitude
          ),
        },
        sessionDispatch: sessionDispatchMock,
        reduxDispatch: reduxDispatchMock,
        reduxGetState: reduxGetStateMock,
        navigation: rootStackNavigationMock,
      };
    const actualGetUserLocationAsyncActionArgs =
      getUserLocationAsyncActionMock.mock.calls[0][0];

    expect(actualGetUserLocationAsyncActionArgs.location).toEqual(
      expectedGetUserLocationAsyncActionArgs.location
    );

    expect(guestExperienceCustomEventLogger).toHaveBeenCalledWith(
      CustomAppInsightEvents.PRESCRIPTION_USER_LOCATION_SERVICE_USED,
      {
        latitude: translateCoordinateHelperMock(
          userDeviceLocationMock.latitude
        ),
        longitude: translateCoordinateHelperMock(
          userDeviceLocationMock.longitude
        ),
      }
    );
  });

  it.each([
    [undefined, undefined],
    [99.99, undefined],
    [undefined, 111.111],
  ])(
    'does not complete handleUserPositionChange if userDeviceLocation (latitude: %s, longitude: %s)',
    async (latitudeMock?: number, longitudeMock?: number) => {
      const prescriptionIdMock = 'prescription-id-mock';
      const navigationToHomeMock = false;

      useRouteMock.mockReturnValue({
        params: {
          prescriptionId: prescriptionIdMock,
          navigateToHome: navigationToHomeMock,
        },
      });

      const drugSearchStateMock: IDrugSearchState = {
        ...defaultDrugSearchState,
      };
      const drugSearchDispatchMock = jest.fn();
      const drugSearchContextMock: IDrugSearchContext = {
        drugSearchState: drugSearchStateMock,
        drugSearchDispatch: drugSearchDispatchMock,
      };
      useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

      const sessionDispatchMock = jest.fn();
      const sessionContextMock: ISessionContext = {
        sessionState: {
          ...defaultSessionState,
          userLocation: undefined,
        },
        sessionDispatch: sessionDispatchMock,
      };
      useSessionContextMock.mockReturnValue(sessionContextMock);

      renderer.create(<DrugSearchPickAPharmacyScreen />);

      expect(useEffectMock).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
        []
      );

      const effectHandler = useEffectMock.mock.calls[0][0];

      effectHandler();

      expect(fetchUserPositionMock.mock.calls.length).toEqual(1);
      expect(fetchUserPositionMock.mock.calls).toEqual([
        [expect.any(Function), sessionDispatchMock],
      ]);

      const handleUserPositionChange = fetchUserPositionMock.mock.calls[0][0];

      const userDeviceLocationMock: ILocationCoordinates = {
        latitude: latitudeMock,
        longitude: longitudeMock,
      };
      const errorMessageMock = 'error-message-mock';

      await handleUserPositionChange(userDeviceLocationMock, errorMessageMock);

      expect(setLocationDeniedErrorMessageDispatchMock).toHaveBeenCalledWith(
        drugSearchDispatchMock,
        errorMessageMock
      );

      expect(translateCoordinateHelperMock).not.toHaveBeenCalled();
      expect(getUserLocationAsyncActionMock).not.toHaveBeenCalled();
      expect(guestExperienceCustomEventLogger).not.toHaveBeenCalled();
    }
  );

  it('handleGetGeolocationData handles geolocationDataError', async () => {
    const prescriptionIdMock = 'prescription-id-mock';
    const navigationToHomeMock = false;

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
        navigateToHome: navigationToHomeMock,
      },
    });

    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
    };
    const drugSearchDispatchMock = jest.fn();
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: drugSearchDispatchMock,
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    const sessionDispatchMock = jest.fn();
    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        userLocation: undefined,
      },
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    renderer.create(<DrugSearchPickAPharmacyScreen />);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), []);

    const effectHandler = useEffectMock.mock.calls[0][0];

    effectHandler();

    expect(fetchUserPositionMock.mock.calls).toEqual([
      [expect.any(Function), sessionDispatchMock],
    ]);

    const handleUserPositionChange = fetchUserPositionMock.mock.calls[0][0];

    const userDeviceLocationMock: ILocationCoordinates = {
      latitude: 99.999999999,
      longitude: 111.111111111,
    };
    const errorMessageMock = 'error-message-mock';

    const geolocationDataErrorMock: Error = new Error(
      'get-user-location-async-action-error-mock'
    );
    getUserLocationAsyncActionMock.mockImplementationOnce(() => {
      throw geolocationDataErrorMock;
    });

    await handleUserPositionChange(userDeviceLocationMock, errorMessageMock);

    expect(setLocationDeniedErrorMessageDispatchMock).toHaveBeenCalledWith(
      drugSearchDispatchMock,
      errorMessageMock
    );

    expect(translateCoordinateHelperMock).toHaveBeenNthCalledWith(
      1,
      userDeviceLocationMock.latitude
    );
    expect(translateCoordinateHelperMock).toHaveBeenNthCalledWith(
      2,
      userDeviceLocationMock.longitude
    );

    expect(setLocationDeniedErrorMessageDispatchMock).toHaveBeenCalledWith(
      drugSearchDispatchMock,
      geolocationDataErrorMock.message
    );
  });
});
