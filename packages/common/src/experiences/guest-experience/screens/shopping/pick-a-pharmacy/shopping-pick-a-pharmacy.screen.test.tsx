// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import renderer from 'react-test-renderer';
import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { IShoppingContext } from '../../../context-providers/shopping/shopping.context';
import { useShoppingContext } from '../../../context-providers/shopping/use-shopping-context.hook';
import {
  getPrescriptionInfoAsyncAction,
  IGetPrescriptionInfoAsyncActionArgs,
} from '../../../state/shopping/async-actions/get-prescription-info.async-action';
import {
  getPrescriptionPharmaciesAsyncAction,
  IGetPrescriptionPharmaciesAsyncActionArgs,
} from '../../../state/shopping/async-actions/get-prescription-pharmacies.async-action';
import {
  defaultShoppingState,
  IShoppingState,
} from '../../../state/shopping/shopping.state';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../../../__mocks__/pharmacy-drug-price.mock';
import { prescriptionInfoMock } from '../../../__mocks__/prescription-info.mock';
import { orderPreviewNavigateDispatch } from '../../../store/navigation/dispatch/shopping/order-preview-navigate.dispatch';
import { confirmationNavigateDispatch } from '../../../store/navigation/dispatch/shopping/confirmation-navigate.dispatch';
import { IPharmacy } from '../../../../../models/pharmacy';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { ISessionContext } from '../../../context-providers/session/session.context';
import {
  defaultSessionState,
  ISessionState,
} from '../../../state/session/session.state';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { profileListMock } from '../../../__mocks__/profile-list.mock';
import {
  PickAPharmacy,
  IPickAPharmacyPrescribedMedicationProps,
} from '../../../pick-a-pharmacy/pick-a-pharmacy';
import {
  IShoppingPickAPharmacyScreenRouteProps,
  ShoppingPickAPharmacyScreen,
} from './shopping-pick-a-pharmacy.screen';
import { useRoute, useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { setPrescriptionPharmaciesDispatch } from '../../../state/shopping/dispatch/set-prescription-pharmacies.dispatch';
import { fetchUserPosition } from '../../../state/session/utils/fetch-user-position';
import { IAddress } from '../../../../../models/address';
import {
  getUserLocationAsyncAction,
  IGetUserLocationAsyncActionArgs,
} from '../../../state/session/async-actions/get-user-location.async-action';
import { setLocationDeniedErrorMessageDispatch } from '../../../state/shopping/dispatch/set-location-denied-error-message.dispatch';
import { translateCoordinateHelper } from '../../../../../utils/translate-coordinate.helper';
import { useUrl } from '../../../../../hooks/use-url';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';
import { IShoppingConfirmationScreenRouteProps } from '../confirmation/shopping-confirmation.screen';
import { IOrderPreviewScreenRouteProps } from '../order-preview/order-preview.screen';
import {
  getAlternativeDrugPriceAsyncAction,
  IGetAlternativeDrugPriceAsyncActionArgs,
} from '../../../state/shopping/async-actions/get-alternative-drug-price-response.async-action';
import { IAlternativeDrugPrice } from '../../../../../models/alternative-drug-price';
import { IPrescriptionInfo } from '../../../../../models/prescription-info';
import { alternativeDrugPriceMock } from '../../../__mocks__/alternative-drug-price.mock';
import { IDualDrugPrice, PbmType } from '../../../../../models/drug-price';
import { PricingOptionNavigateDispatch } from '../../../store/navigation/dispatch/shopping/pricing-option-navigate.dispatch';

import { PricingOption } from '../../../../../models/pricing-option';
import {
  getPricingOptionType,
  shouldNavigateToPricingOption,
} from '../../../../../utils/pricing-option.helper';
import { getDependentWithMemberId } from '../prescription-patient/get-dependent-with-member-id';
import { IPricingOptionsScreenRouteProps } from '../pricing-options/pricing-options.screen';

jest.mock('../prescription-patient/get-dependent-with-member-id');
const getDependentWithMemberIdMock = getDependentWithMemberId as jest.Mock;

jest.mock(
  '../../../state/shopping/async-actions/get-alternative-drug-price-response.async-action'
);
const getAlternativeDrugPriceAsyncActionMock =
  getAlternativeDrugPriceAsyncAction as jest.Mock;

jest.mock('../../../../../hooks/use-url');
const useUrlMock = useUrl as jest.Mock;

jest.mock('../../../../../utils/translate-coordinate.helper');
const translateCoordinateHelperMock = translateCoordinateHelper as jest.Mock;

jest.mock(
  '../../../state/shopping/dispatch/set-location-denied-error-message.dispatch'
);
const setLocationDeniedErrorMessageDispatchMock =
  setLocationDeniedErrorMessageDispatch as jest.Mock;

jest.mock(
  '../../../state/shopping/dispatch/set-prescription-pharmacies.dispatch'
);
const setPrescriptionPharmaciesDispatchMock =
  setPrescriptionPharmaciesDispatch as jest.Mock;

jest.mock('@react-navigation/native');

const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

jest.mock('../../../pick-a-pharmacy/pick-a-pharmacy', () => ({
  PickAPharmacy: () => <div />,
}));

jest.mock(
  '../../../../../components/member/cards/prescription-value/prescription-value.card',
  () => ({
    PrescriptionValueCard: () => <div />,
  })
);

jest.mock('../../../context-providers/shopping/use-shopping-context.hook');
const useShoppingContextMock = useShoppingContext as jest.Mock;

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

jest.mock('../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock(
  '../../../state/shopping/async-actions/get-prescription-info.async-action'
);
const getPrescriptionInfoAsyncActionMock =
  getPrescriptionInfoAsyncAction as jest.Mock;

jest.mock(
  '../../../state/shopping/async-actions/get-prescription-pharmacies.async-action'
);
const getPrescriptionPharmaciesAsyncActionMock =
  getPrescriptionPharmaciesAsyncAction as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/shopping/order-preview-navigate.dispatch'
);
const orderPreviewNavigateDispatchMock =
  orderPreviewNavigateDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/shopping/pricing-option-navigate.dispatch'
);
const PricingOptionNavigateDispatchMock =
  PricingOptionNavigateDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/shopping/confirmation-navigate.dispatch'
);
const confirmationNavigateDispatchMock =
  confirmationNavigateDispatch as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);

jest.mock(
  '../../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenNoApiRefreshDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

jest.mock('../../../state/session/utils/fetch-user-position');
const fetchUserPositionMock = fetchUserPosition as jest.Mock;

jest.mock(
  '../../../state/session/async-actions/get-user-location.async-action'
);
const getUserLocationAsyncActionMock = getUserLocationAsyncAction as jest.Mock;

const newPrescriptionId = prescriptionInfoMock.prescriptionId + 'xxx';

const setCoordinatesMock = jest.fn();
const setHasFetchedLocationMock = jest.fn();

const prescriptionInfoMock2 = {
  ...prescriptionInfoMock,
};

const bestPricePharmacyMock2 = {
  ...pharmacyDrugPrice1Mock,
};

const alternativeDrugPriceMock2 = {
  ...alternativeDrugPriceMock,
};

interface IStateMock {
  coordinates?: ILocationCoordinates;
  isGettingPharmacies?: boolean;
  hasFetchedLocation?: boolean;
}

const resetState = (args: IStateMock) => {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce([
    args.coordinates ?? {},
    setCoordinatesMock,
  ]);
  useStateMock.mockReturnValueOnce([
    args.hasFetchedLocation ?? false,
    setHasFetchedLocationMock,
  ]);
};

describe('ShoppingPickAPharmacyScreen', () => {
  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn().mockReturnValue({ features: {} });
  const reduxContextMock: IReduxContext = {
    dispatch: reduxDispatchMock,
    getState: reduxGetStateMock,
  };
  const sessionDispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    getDependentWithMemberIdMock.mockReturnValue(undefined);

    useShoppingContextMock.mockReturnValue({
      shoppingState: defaultShoppingState,
      shoppingDispatch: jest.fn(),
    });

    useReduxContextMock.mockReturnValue(reduxContextMock);
    useMembershipContextMock.mockReturnValueOnce({
      membershipState: { profileList: profileListMock },
    });
    resetState({});
    getNewDateMock.mockReturnValue(new Date());

    const sessionContextMock: ISessionContext = {
      sessionDispatch: sessionDispatchMock,
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    (rootStackNavigationMock.isFocused as jest.Mock).mockReturnValue(true);
    useNavigationMock.mockReturnValueOnce(rootStackNavigationMock);

    translateCoordinateHelperMock.mockImplementation((coordinate: number) => {
      return Number(coordinate.toFixed(6));
    });
  });

  it('calls pickApharmacy component with default props', () => {
    const prescriptionIdMock = 'prescription-id';
    const navigateToHomeMock = false;

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
        navigateToHome: navigateToHomeMock,
      },
    });

    const testRenderer = renderer.create(<ShoppingPickAPharmacyScreen />);
    const pickAPharmacy = testRenderer.root.findByType(PickAPharmacy);

    expect(pickAPharmacy.type).toEqual(PickAPharmacy);
    expect(pickAPharmacy.props.pharmacies).toEqual([]);
    expect(pickAPharmacy.props.onPharmacyPress).toEqual(expect.any(Function));
    expect(pickAPharmacy.props.navigateBack).toEqual(expect.any(Function));
    expect(pickAPharmacy.props.showProfileAvatar).toEqual(true);
    expect(pickAPharmacy.props.logoClickAction).toEqual(
      LogoClickActionEnum.CONFIRM
    );
    expect(pickAPharmacy.props.canShowContent).toBeUndefined();
    expect(pickAPharmacy.props.hasStickyView).toEqual(false);
    expect(pickAPharmacy.props.showNoPharmaciesFoundErrorMessage).toEqual(
      false
    );
    expect(pickAPharmacy.props.navigateToPointOfCare).toEqual(
      expect.any(Function)
    );
  });

  it('url should be updated with correct link', () => {
    const prescriptionIdMock = 'prescription-id';

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
      },
    });

    renderer.create(<ShoppingPickAPharmacyScreen />);

    expect(useUrlMock).toHaveBeenCalledWith(
      `/cabinet/prescription/${prescriptionIdMock}`
    );
  });

  it('url should be updated with correct link for blockchain prescription', () => {
    const prescriptionIdMock = 'prescription-id';

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
        blockchain: true,
      },
    });

    renderer.create(<ShoppingPickAPharmacyScreen />);

    expect(useUrlMock).toHaveBeenCalledWith(
      `/cabinet/bc/${prescriptionIdMock}`
    );
  });

  it('calls pickApharmacy component with no pharmacies found props', () => {
    const prescriptionIdMock = 'prescription-id';
    const navigateToHomeMock = false;
    const hasInsuranceMock = false;

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
        navigateToHome: navigateToHomeMock,
      },
    });
    const shoppingDispatchMock = jest.fn();
    const shoppingContextMock: IShoppingContext = {
      shoppingState: {
        prescriptionPharmacies: [],
        noPharmaciesFound: true,
        isGettingPharmacies: false,
        hasInsurance: hasInsuranceMock,
      },
      shoppingDispatch: shoppingDispatchMock,
    };

    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const testRenderer = renderer.create(<ShoppingPickAPharmacyScreen />);
    const pickAPharmacy = testRenderer.root.findByType(PickAPharmacy);

    expect(pickAPharmacy.type).toEqual(PickAPharmacy);
    expect(pickAPharmacy.props.pharmacies).toEqual([]);
    expect(pickAPharmacy.props.onPharmacyPress).toEqual(expect.any(Function));
    expect(pickAPharmacy.props.navigateBack).toEqual(expect.any(Function));
    expect(pickAPharmacy.props.showProfileAvatar).toEqual(true);
    expect(pickAPharmacy.props.canShowContent).toBeUndefined();
    expect(pickAPharmacy.props.hasStickyView).toEqual(false);
    expect(pickAPharmacy.props.showNoPharmaciesFoundErrorMessage).toEqual(true);
    expect(pickAPharmacy.props.navigateToPointOfCare).toEqual(
      expect.any(Function)
    );
    expect(pickAPharmacy.props.hasInsurance).toEqual(hasInsuranceMock);
  });

  it.each([
    [true, prescriptionInfoMock.prescriptionId, true, false],
    [false, newPrescriptionId, true, false],
    [false, prescriptionInfoMock.prescriptionId, false, false],
    [true, prescriptionInfoMock.prescriptionId, true, true],
  ])(
    'requests prescription info when prescription id changes (reloadPrescription: %p; prescriptionId: %p)',
    async (
      reloadPrescriptionMock: undefined | boolean,
      prescriptionIdMock: string,
      isRequestExpected: boolean,
      blockchainMock: boolean
    ) => {
      const navigateToHomeMock = false;

      const routeParamsMock: IShoppingPickAPharmacyScreenRouteProps = {
        prescriptionId: prescriptionIdMock,
        navigateToHome: navigateToHomeMock,
        reloadPrescription: reloadPrescriptionMock,
        blockchain: blockchainMock,
      };
      useRouteMock.mockReturnValue({
        params: routeParamsMock,
      });

      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo: prescriptionInfoMock,
      };
      const shoppingDispatchMock = jest.fn();
      const shoppingContextMock: IShoppingContext = {
        shoppingState: shoppingStateMock,
        shoppingDispatch: shoppingDispatchMock,
      };
      useShoppingContextMock.mockReturnValue(shoppingContextMock);

      renderer.create(<ShoppingPickAPharmacyScreen />);

      expect(useEffectMock).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
        []
      );

      const effectHandler = useEffectMock.mock.calls[0][0];
      await effectHandler();

      if (isRequestExpected) {
        const expectedArgs: IGetPrescriptionInfoAsyncActionArgs = {
          prescriptionId: prescriptionIdMock,
          reduxDispatch: reduxDispatchMock,
          reduxGetState: reduxGetStateMock,
          shoppingDispatch: shoppingDispatchMock,
          navigation: rootStackNavigationMock,
          userExists: true,
          blockchain: blockchainMock,
        };
        expect(getPrescriptionInfoAsyncActionMock).toHaveBeenCalledWith(
          expectedArgs
        );
      } else {
        expect(getPrescriptionInfoAsyncActionMock).not.toHaveBeenCalled();
      }
    }
  );

  it.each([
    [undefined, false],
    [pharmacyDrugPrice1Mock.pharmacy, true],
  ])(
    'navigates to confirmation screen when prescription has order (pharmacy: %p)',
    (orderPharmacyMock: IPharmacy | undefined, isOrderBooked: boolean) => {
      useReduxContextMock.mockReturnValue(reduxContextMock);
      const prescriptionIdMock = 'prescription-id';
      const navigateToHomeMock = false;
      const blockchainMock = true;

      const pickAPharmacyRoutePropsMock: IShoppingPickAPharmacyScreenRouteProps =
        {
          prescriptionId: prescriptionIdMock,
          navigateToHome: navigateToHomeMock,
          blockchain: blockchainMock,
        };
      useRouteMock.mockReturnValue({
        params: pickAPharmacyRoutePropsMock,
      });

      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo: {
          ...prescriptionInfoMock,
          pharmacy: orderPharmacyMock,
        },
      };
      const shoppingContextMock: IShoppingContext = {
        shoppingState: shoppingStateMock,
        shoppingDispatch: jest.fn(),
      };
      useShoppingContextMock.mockReturnValue(shoppingContextMock);

      renderer.create(<ShoppingPickAPharmacyScreen />);

      expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
        shoppingStateMock.prescriptionInfo,
      ]);

      const effectHandler = useEffectMock.mock.calls[1][0];
      effectHandler();

      if (isOrderBooked) {
        const expectedRouteProps: IShoppingConfirmationScreenRouteProps = {
          canGoBack: !navigateToHomeMock,
        };
        expect(confirmationNavigateDispatchMock).toHaveBeenCalledWith(
          rootStackNavigationMock,
          expectedRouteProps
        );
      } else {
        expect(confirmationNavigateDispatchMock).not.toHaveBeenCalled();
      }
    }
  );

  it.each([
    [undefined, 'not-prescription-id'],
    [undefined, 'prescription-id'],
  ])(
    'does not navigate to confirmation screen when prescription does not have an order (pharmacy: %p) even with same prescription id',
    (orderPharmacyMock: IPharmacy | undefined, prescriptionId: string) => {
      const prescriptionIdMock = prescriptionId;
      const navigateToHomeMock = false;

      useRouteMock.mockReturnValue({
        params: {
          prescriptionId: prescriptionIdMock,
          navigateToHome: navigateToHomeMock,
        },
      });
      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo: {
          ...prescriptionInfoMock,
          pharmacy: orderPharmacyMock,
        },
      };
      const shoppingContextMock: IShoppingContext = {
        shoppingState: shoppingStateMock,
        shoppingDispatch: jest.fn(),
      };
      useShoppingContextMock.mockReturnValue(shoppingContextMock);

      renderer.create(<ShoppingPickAPharmacyScreen />);

      expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
        shoppingStateMock.prescriptionInfo,
      ]);

      const effectHandler = useEffectMock.mock.calls[1][0];
      effectHandler();

      expect(confirmationNavigateDispatchMock).not.toHaveBeenCalled();
      expect(fetchUserPositionMock).not.toHaveBeenCalled();
    }
  );

  it('does not render sticky view when prescription info not yet available', () => {
    const shoppingStateMock: Partial<IShoppingState> = {
      ...defaultShoppingState,
      prescriptionInfo: undefined,
    };
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
      shoppingDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<ShoppingPickAPharmacyScreen />);

    const pickPharmacy = testRenderer.root.findByType(PickAPharmacy);

    expect(pickPharmacy.props.hasStickyView).toBe(false);
  });

  it('renders sticky view when prescripton info available', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pharmacy, ...prescriptionInfoMockWithoutPharmacy } =
      prescriptionInfoMock;
    const shoppingStateMock: Partial<IShoppingState> = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMockWithoutPharmacy,
    };
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
      shoppingDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<ShoppingPickAPharmacyScreen />);

    const pickPharmacy = testRenderer.root.findByType(PickAPharmacy);

    expect(pickPharmacy.props.hasStickyView).toBe(true);
  });

  it('renders prescribed Medication', () => {
    const { ...prescriptionInfoMockWithoutPharmacy } = prescriptionInfoMock;
    const shoppingStateMock: Partial<IShoppingState> = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMockWithoutPharmacy,
    };
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
      shoppingDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<ShoppingPickAPharmacyScreen />);

    const pickPharmacy = testRenderer.root.findByType(PickAPharmacy);
    const expectedDrugData: IPickAPharmacyPrescribedMedicationProps = {
      drugName: prescriptionInfoMock.drugName,
      drugDetails: {
        formCode: prescriptionInfoMock.form,
        unit: prescriptionInfoMock.unit,
        quantity: prescriptionInfoMock.quantity,
        refills: prescriptionInfoMock.refills,
        strength: prescriptionInfoMock.strength,
      },
    };

    expect(pickPharmacy.props.prescribedMedicationProps).toEqual(
      expectedDrugData
    );
  });

  it.each([
    [
      false,
      {
        smartPriceMemberPays: 23,
        pbmType: 'phx' as PbmType,
        pbmMemberPays: 25,
        pbmPlanPays: 25,
      },
    ],
    [
      false,
      {
        smartPriceMemberPays: 23,
        pbmType: 'none' as PbmType,
      },
    ],
    [false, undefined],
    [
      true,
      {
        smartPriceMemberPays: 23,
        pbmType: 'none' as PbmType,
      },
    ],
    [
      true,
      {
        smartPriceMemberPays: 23,
        pbmType: 'phx' as PbmType,
        pbmMemberPays: 25,
        pbmPlanPays: 25,
      },
    ],
    [true, undefined],
  ])(
    'navigates to expected screen when pharmacy card clicked when blockchain is %p and dualprice is %p',
    (blockchainMock: boolean, dualPrice?: IDualDrugPrice) => {
      resetState({});
      const prescriptionIdMock = 'prescription-id';
      const navigateToHomeMock = true;
      const pharmacyDrugPrice: IPharmacyDrugPrice = {
        ...pharmacyDrugPrice1Mock,
        dualPrice,
      };
      useRouteMock.mockReturnValue({
        params: {
          prescriptionId: prescriptionIdMock,
          navigateToHome: navigateToHomeMock,
          blockchain: blockchainMock,
        },
      });

      const pharmaciesMock: IPharmacyDrugPrice[] = [
        pharmacyDrugPrice1Mock,
        pharmacyDrugPrice2Mock,
      ];
      const shoppingStateMock: Partial<IShoppingState> = {
        ...defaultShoppingState,
        prescriptionInfo: { ...prescriptionInfoMock, pharmacy: undefined },
        prescriptionPharmacies: pharmaciesMock,
      };
      useShoppingContextMock.mockReturnValue({
        shoppingState: shoppingStateMock,
        shoppingDispatch: jest.fn(),
      });

      const testRenderer = renderer.create(<ShoppingPickAPharmacyScreen />);

      const pickPharmacy = testRenderer.root.findByType(PickAPharmacy);
      const pharmacyNcpdpMock = pharmacyDrugPrice1Mock.pharmacy.ncpdp;
      const pricingOptionMock: PricingOption = getPricingOptionType(
        pharmacyDrugPrice.dualPrice
      );

      pickPharmacy.props.onPharmacyPress({
        ncpdp: pharmacyNcpdpMock,
        isBestValue: false,
        isBestPrice: false,
        pharmacyDrugPrice,
      });

      expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
        CustomAppInsightEvents.PRESCRIPTION_USER_SELECTS_PHARMACY,
        {
          prescriptionId: 'prescription-id',
          ncpdp: pharmacyNcpdpMock,
          isBestValue: false,
        }
      );

      if (shouldNavigateToPricingOption(pharmacyDrugPrice.dualPrice)) {
        const expectedRouteProps: IPricingOptionsScreenRouteProps = {
          pharmacyNcpdp: pharmacyNcpdpMock,
        };
        expect(PricingOptionNavigateDispatchMock).toHaveBeenCalledWith(
          rootStackNavigationMock,
          expectedRouteProps
        );
      } else {
        const expectedRouteProps: IOrderPreviewScreenRouteProps = {
          pharmacyNcpdp: pharmacyNcpdpMock,
          isSieMemberPrescription: true,
          pricingOption: pricingOptionMock,
        };

        expect(orderPreviewNavigateDispatchMock).toHaveBeenCalledWith(
          rootStackNavigationMock,
          expectedRouteProps
        );
      }
    }
  );

  it.each([
    [undefined, undefined, undefined],
    ['Bellevue', undefined, 'Bellevue'],
    [undefined, 'WA', 'WA'],
    ['Bellevue', 'WA', 'Bellevue, WA'],
  ])(
    'Set Location Text set as City, State when patient city/state exist (city: %p, state: %p) ',
    (city?: string, state?: string, title?: string) => {
      const pharmaciesMock: IPharmacyDrugPrice[] = [
        pharmacyDrugPrice1Mock,
        pharmacyDrugPrice2Mock,
      ];
      const shoppingStateMock: Partial<IShoppingState> = {
        ...defaultShoppingState,
        prescriptionInfo: {
          ...prescriptionInfoMock,
          zipCode: '98005',
          pharmacy: undefined,
        },
        prescriptionPharmacies: pharmaciesMock,
      };
      useShoppingContextMock.mockReturnValue({
        shoppingState: shoppingStateMock,
        shoppingDispatch: jest.fn(),
      });
      const sortByMock = 'distance';
      const distanceMock = 25;

      const sessionStateMock: Partial<ISessionState> = {
        ...defaultSessionState,
        pharmacyFilterPreferences: {
          sortBy: sortByMock,
          distance: distanceMock,
        },
        userLocation: {
          city,
          state,
          zipCode: '98005',
        },
      };
      useSessionContextMock.mockReturnValue({
        sessionState: sessionStateMock,
        sessionContext: jest.fn(),
      });

      const testRenderer = renderer.create(<ShoppingPickAPharmacyScreen />);

      const pickPharmacy = testRenderer.root.findByType(PickAPharmacy);
      expect(pickPharmacy.props.pharmacyLocation).toEqual(title);
    }
  );

  it('navigates to home screen when back button is clicked', () => {
    const prescriptionIdMock = 'prescription-id';
    const navigateToHomeMock = true;

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
        navigateToHome: navigateToHomeMock,
      },
    });
    const pharmaciesMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ];
    const shoppingStateMock: Partial<IShoppingState> = {
      ...defaultShoppingState,
      prescriptionInfo: { ...prescriptionInfoMock, pharmacy: undefined },
      prescriptionPharmacies: pharmaciesMock,
      isGettingPharmacies: true,
    };
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
      shoppingDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<ShoppingPickAPharmacyScreen />);

    const pickPharmacy = testRenderer.root.findByType(PickAPharmacy);
    pickPharmacy.props.navigateBack();

    expect(navigateHomeScreenNoApiRefreshDispatchMock).toBeCalledWith(
      reduxGetStateMock,
      rootStackNavigationMock
    );
  });

  it('navigates to previous screen when back button is clicked', () => {
    const prescriptionIdMock = 'prescription-id';
    const navigateToHomeMock = undefined;

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
        navigateToHome: navigateToHomeMock,
      },
    });
    const pharmaciesMock: IPharmacyDrugPrice[] = [
      pharmacyDrugPrice1Mock,
      pharmacyDrugPrice2Mock,
    ];
    const shoppingStateMock: Partial<IShoppingState> = {
      ...defaultShoppingState,
      prescriptionInfo: { ...prescriptionInfoMock, pharmacy: undefined },
      prescriptionPharmacies: pharmaciesMock,
    };
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
      shoppingDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<ShoppingPickAPharmacyScreen />);

    const pickPharmacy = testRenderer.root.findByType(PickAPharmacy);
    pickPharmacy.props.navigateBack();

    expect(rootStackNavigationMock.goBack).toHaveBeenCalledTimes(1);
  });

  it('does not request prescription pharmacies if prescriptionInfo changes in other screen (navigation out of focus)', () => {
    const routeParamsMock: IShoppingPickAPharmacyScreenRouteProps = {
      prescriptionId: 'prescription-id',
    };
    useRouteMock.mockReturnValue({
      params: routeParamsMock,
    });

    rootStackNavigationMock.isFocused = jest.fn().mockReturnValueOnce(false);

    const orderDateMock = getNewDateMock();

    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: {
        ...prescriptionInfoMock,
        orderDate: orderDateMock,
      },
    };
    const shoppingDispatchMock = jest.fn();
    const shoppingContextMock: IShoppingContext = {
      shoppingState: shoppingStateMock,
      shoppingDispatch: shoppingDispatchMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);
    renderer.create(<ShoppingPickAPharmacyScreen />);

    expect(useEffectMock).toHaveBeenNthCalledWith(3, expect.any(Function), [
      { sortBy: 'distance', distance: 25 },
      undefined,
      { ...prescriptionInfoMock, orderDate: orderDateMock },
    ]);

    const effectHandler = useEffectMock.mock.calls[2][0];
    effectHandler();

    expect(setPrescriptionPharmaciesDispatchMock).not.toHaveBeenCalled();

    expect(getPrescriptionPharmaciesAsyncActionMock).not.toHaveBeenCalled();
  });

  it.each([[false], [true]])(
    'request prescription pharmacies (when navigation is focused) and blockchain route parameter is %p',
    (blockchainMock: boolean) => {
      const zipCodeMock = 'zip-code1';
      const locationMock: ILocationCoordinates = {
        latitude: 2,
        longitude: 2,
      };
      const prescriptionIdMock = 'prescription-id';
      const sortByMock = 'distance';
      const distanceMock = 25;

      resetState({ coordinates: locationMock });
      const routeParamsMock: IShoppingPickAPharmacyScreenRouteProps = {
        prescriptionId: 'prescription-id',
        blockchain: blockchainMock,
      };
      useRouteMock.mockReturnValue({
        params: routeParamsMock,
      });
      useReduxContextMock.mockReturnValue(reduxContextMock);

      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo: {
          ...prescriptionInfoMock,
          pharmacy: undefined,
          zipCode: zipCodeMock,
        },
      };
      const shoppingDispatchMock = jest.fn();
      const shoppingContextMock: IShoppingContext = {
        shoppingState: shoppingStateMock,
        shoppingDispatch: shoppingDispatchMock,
      };
      useShoppingContextMock.mockReturnValue(shoppingContextMock);

      rootStackNavigationMock.isFocused = jest.fn().mockReturnValueOnce(true);

      const sessionContextMock: ISessionContext = {
        sessionDispatch: sessionDispatchMock,
        sessionState: {
          ...defaultSessionState,
          userLocation: locationMock,
        },
      };
      useSessionContextMock.mockReturnValueOnce(sessionContextMock);

      renderer.create(<ShoppingPickAPharmacyScreen />);

      expect(useEffectMock).toHaveBeenNthCalledWith(3, expect.any(Function), [
        { sortBy: sortByMock, distance: distanceMock },
        locationMock,
        { ...prescriptionInfoMock, zipCode: 'zip-code1', pharmacy: undefined },
      ]);

      const effectHandler = useEffectMock.mock.calls[2][0];
      effectHandler();

      const expectedArgs: IGetPrescriptionPharmaciesAsyncActionArgs = {
        location: locationMock,
        prescriptionId: prescriptionIdMock,
        sortBy: sortByMock,
        distance: distanceMock,
        reduxDispatch: reduxDispatchMock,
        reduxGetState: reduxGetStateMock,
        shoppingDispatch: shoppingDispatchMock,
        navigation: rootStackNavigationMock,
        blockchain: blockchainMock,
      };
      expect(setPrescriptionPharmaciesDispatchMock).toHaveBeenCalledWith(
        shoppingDispatchMock,
        { pharmacyPrices: [] },
        'prescription-id'
      );
      expect(getPrescriptionPharmaciesAsyncActionMock).toHaveBeenCalledWith(
        expectedArgs
      );
    }
  );

  it.each([[false], [true]])(
    'onFilterApply fetches prescription pharmacies and dispatches session state change and blockchain route parameter is %p',
    (blockchainMock: boolean) => {
      const zipCodeMock = 'zip-code';
      const locationMock: ILocationCoordinates = { latitude: 2, longitude: 2 };
      resetState({ coordinates: locationMock });
      const prescriptionIdMock = 'prescription-id';
      const sortByMock = 'distance';
      const distanceMock = 25;

      const routeParamsMock: IShoppingPickAPharmacyScreenRouteProps = {
        prescriptionId: prescriptionIdMock,
        blockchain: blockchainMock,
      };
      useRouteMock.mockReturnValue({
        params: routeParamsMock,
      });

      useReduxContextMock.mockReturnValue(reduxContextMock);

      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo: {
          ...prescriptionInfoMock,
          zipCode: zipCodeMock,
          pharmacy: undefined,
        },
      };
      const shoppingDispatchMock = jest.fn();
      const shoppingContextMock: IShoppingContext = {
        shoppingState: shoppingStateMock,
        shoppingDispatch: shoppingDispatchMock,
      };
      const sessionStateMock: Partial<ISessionState> = {
        ...defaultSessionState,
        pharmacyFilterPreferences: {
          sortBy: sortByMock,
          distance: distanceMock,
        },
        userLocation: locationMock,
      };
      useSessionContextMock.mockReturnValue({
        sessionState: sessionStateMock,
        sessionContext: jest.fn(),
      });
      useShoppingContextMock.mockReturnValue(shoppingContextMock);

      renderer.create(<ShoppingPickAPharmacyScreen />);

      expect(useEffectMock).toHaveBeenNthCalledWith(3, expect.any(Function), [
        { sortBy: sortByMock, distance: distanceMock },
        locationMock,
        { ...prescriptionInfoMock, pharmacy: undefined },
      ]);

      const effectHandler = useEffectMock.mock.calls[2][0];
      effectHandler();

      const expectedArgs: IGetPrescriptionPharmaciesAsyncActionArgs = {
        location: locationMock,
        prescriptionId: prescriptionIdMock,
        sortBy: sortByMock,
        distance: distanceMock,
        reduxDispatch: reduxDispatchMock,
        reduxGetState: reduxGetStateMock,
        shoppingDispatch: shoppingDispatchMock,
        navigation: rootStackNavigationMock,
        blockchain: blockchainMock,
      };
      expect(setPrescriptionPharmaciesDispatchMock).toHaveBeenCalledWith(
        shoppingDispatchMock,
        { pharmacyPrices: [] },
        'prescription-id'
      );
      expect(getPrescriptionPharmaciesAsyncActionMock).toHaveBeenCalledWith(
        expectedArgs
      );
    }
  );

  it.each([
    [bestPricePharmacyMock2, prescriptionInfoMock2, alternativeDrugPriceMock2],
    [bestPricePharmacyMock2, undefined, undefined],
    [undefined, prescriptionInfoMock2, undefined],
  ])(
    'does not request alternative drug price if bestPricePharmacy || prescriptionInfo || !alternativeDrugPrice is undefined',
    (
      bestPricePharmacy: IPharmacyDrugPrice | undefined,
      prescriptionInfo: IPrescriptionInfo | undefined,
      alternativeDrugPrice: IAlternativeDrugPrice | undefined
    ) => {
      const routeParamsMock: IShoppingPickAPharmacyScreenRouteProps = {
        prescriptionId: 'prescription-id',
      };
      useRouteMock.mockReturnValue({
        params: routeParamsMock,
      });

      rootStackNavigationMock.isFocused = jest.fn().mockReturnValueOnce(false);

      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo,
        alternativeDrugPrice,
        bestPricePharmacy,
      };
      const shoppingDispatchMock = jest.fn();
      const shoppingContextMock: IShoppingContext = {
        shoppingState: shoppingStateMock,
        shoppingDispatch: shoppingDispatchMock,
      };
      useShoppingContextMock.mockReturnValue(shoppingContextMock);

      const isUnauthExperienceMock = false;

      useSessionContextMock.mockReset();
      const sessionStateMock: Partial<ISessionState> = {
        ...defaultSessionState,
        isUnauthExperience: isUnauthExperienceMock,
      };
      useSessionContextMock.mockReturnValue({
        sessionState: sessionStateMock,
        sessionContext: jest.fn(),
      });

      renderer.create(<ShoppingPickAPharmacyScreen />);

      expect(useEffectMock).toHaveBeenNthCalledWith(4, expect.any(Function), [
        bestPricePharmacy,
        prescriptionInfo,
      ]);

      const effectHandler = useEffectMock.mock.calls[3][0];

      effectHandler();

      expect(getAlternativeDrugPriceAsyncActionMock).not.toHaveBeenCalled();
    }
  );

  it('requests alternative drug price if bestPricePharmacy && prescriptionInfo && !alternativeDrugPrice', () => {
    const routeParamsMock: IShoppingPickAPharmacyScreenRouteProps = {
      prescriptionId: 'prescription-id',
    };
    useRouteMock.mockReturnValue({
      params: routeParamsMock,
    });

    rootStackNavigationMock.isFocused = jest.fn().mockReturnValueOnce(false);

    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock2,
      alternativeDrugPrice: undefined,
      bestPricePharmacy: bestPricePharmacyMock2,
    };
    const shoppingDispatchMock = jest.fn();
    const shoppingContextMock: IShoppingContext = {
      shoppingState: shoppingStateMock,
      shoppingDispatch: shoppingDispatchMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const isUnauthExperienceMock = false;

    useSessionContextMock.mockReset();
    const sessionStateMock: Partial<ISessionState> = {
      ...defaultSessionState,
      isUnauthExperience: isUnauthExperienceMock,
    };
    useSessionContextMock.mockReturnValue({
      sessionState: sessionStateMock,
      sessionContext: jest.fn(),
    });

    renderer.create(<ShoppingPickAPharmacyScreen />);

    expect(useEffectMock).toHaveBeenNthCalledWith(4, expect.any(Function), [
      bestPricePharmacyMock2,
      prescriptionInfoMock2,
    ]);

    const effectHandler = useEffectMock.mock.calls[3][0];

    effectHandler();

    const alternativeDrugPriceAsyncActionArgs: IGetAlternativeDrugPriceAsyncActionArgs =
      {
        ndc: prescriptionInfoMock2?.ndc,
        ncpdp: bestPricePharmacyMock2?.pharmacy.ncpdp,
        isUnauthExperience: isUnauthExperienceMock,
        navigation: rootStackNavigationMock,
        shoppingDispatch: shoppingDispatchMock,
        reduxDispatch: reduxDispatchMock,
        reduxGetState: reduxGetStateMock,
      };

    expect(getAlternativeDrugPriceAsyncActionMock).toHaveBeenCalledTimes(1);
    expect(getAlternativeDrugPriceAsyncActionMock).toHaveBeenNthCalledWith(
      1,
      alternativeDrugPriceAsyncActionArgs
    );
  });

  it('calls handleGetGeolocationData when !userLocation and prescriptionInfo contains zipCode', () => {
    const prescriptionIdMock = 'prescription-id-mock';
    const navigationToHomeMock = false;

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
        navigateToHome: navigationToHomeMock,
      },
    });

    const orderPharmacyMock: IPharmacy = {
      address: {} as IAddress,
      isMailOrderOnly: false,
      name: 'name-mock',
      ncpdp: 'ncpdp-mock',
      hours: [],
      twentyFourHours: true,
    };

    const zipCodeMock = '98052';

    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: {
        ...prescriptionInfoMock,
        pharmacy: orderPharmacyMock,
        zipCode: zipCodeMock,
      },
    };
    const shoppingDispatchMock = jest.fn();
    const shoppingContextMock: IShoppingContext = {
      shoppingState: shoppingStateMock,
      shoppingDispatch: shoppingDispatchMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const sessionDispatchMock = jest.fn();
    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        userLocation: {},
      },
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    renderer.create(<ShoppingPickAPharmacyScreen />);

    expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
      shoppingStateMock.prescriptionInfo,
    ]);

    const effectHandler = useEffectMock.mock.calls[1][0];
    effectHandler();

    const expectedGetUserLocationAsyncActionArgs: IGetUserLocationAsyncActionArgs =
      {
        location: { zipCode: zipCodeMock },
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

      const orderPharmacyMock: IPharmacy = {
        address: {} as IAddress,
        isMailOrderOnly: false,
        name: 'name-mock',
        ncpdp: 'ncpdp-mock',
        hours: [],
        twentyFourHours: true,
      };

      const shoppingStateMock: IShoppingState = {
        ...defaultShoppingState,
        prescriptionInfo: {
          ...prescriptionInfoMock,
          pharmacy: orderPharmacyMock,
          zipCode: '',
        },
      };
      const shoppingDispatchMock = jest.fn();
      const shoppingContextMock: IShoppingContext = {
        shoppingState: shoppingStateMock,
        shoppingDispatch: shoppingDispatchMock,
      };
      useShoppingContextMock.mockReturnValue(shoppingContextMock);

      const sessionDispatchMock = jest.fn();
      const sessionContextMock: ISessionContext = {
        sessionState: {
          ...defaultSessionState,
          userLocation: {},
        },
        sessionDispatch: sessionDispatchMock,
      };
      useSessionContextMock.mockReturnValue(sessionContextMock);

      renderer.create(<ShoppingPickAPharmacyScreen />);

      expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
        shoppingStateMock.prescriptionInfo,
      ]);

      const effectHandler = useEffectMock.mock.calls[1][0];

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
        shoppingDispatchMock,
        errorMessageMock
      );

      expect(translateCoordinateHelperMock).not.toHaveBeenCalled();
      expect(getUserLocationAsyncActionMock).not.toHaveBeenCalled();
      expect(guestExperienceCustomEventLogger).not.toHaveBeenCalled();
    }
  );

  it('calls fetchUserPosition when !userLocation and prescriptionInfo does not contain zipCode', async () => {
    const prescriptionIdMock = 'prescription-id-mock';
    const navigationToHomeMock = false;

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
        navigateToHome: navigationToHomeMock,
      },
    });

    const orderPharmacyMock: IPharmacy = {
      address: {} as IAddress,
      isMailOrderOnly: false,
      name: 'name-mock',
      ncpdp: 'ncpdp-mock',
      hours: [],
      twentyFourHours: true,
    };

    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: {
        ...prescriptionInfoMock,
        pharmacy: orderPharmacyMock,
        zipCode: '',
      },
    };
    const shoppingDispatchMock = jest.fn();
    const shoppingContextMock: IShoppingContext = {
      shoppingState: shoppingStateMock,
      shoppingDispatch: shoppingDispatchMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const sessionDispatchMock = jest.fn();
    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        userLocation: undefined,
      },
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    renderer.create(<ShoppingPickAPharmacyScreen />);

    expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
      shoppingStateMock.prescriptionInfo,
    ]);

    const effectHandler = useEffectMock.mock.calls[1][0];

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

    await handleUserPositionChange(userDeviceLocationMock, errorMessageMock);

    expect(setLocationDeniedErrorMessageDispatchMock).toHaveBeenCalledWith(
      shoppingDispatchMock,
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
  });

  it('handleGetGeolocationData handles geolocationDataError', async () => {
    const prescriptionIdMock = 'prescription-id-mock';
    const navigationToHomeMock = false;

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
        navigateToHome: navigationToHomeMock,
      },
    });

    const orderPharmacyMock: IPharmacy = {
      address: {} as IAddress,
      isMailOrderOnly: false,
      name: 'name-mock',
      ncpdp: 'ncpdp-mock',
      hours: [],
      twentyFourHours: true,
    };

    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: {
        ...prescriptionInfoMock,
        pharmacy: orderPharmacyMock,
        zipCode: '',
      },
    };
    const shoppingDispatchMock = jest.fn();
    const shoppingContextMock: IShoppingContext = {
      shoppingState: shoppingStateMock,
      shoppingDispatch: shoppingDispatchMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    const sessionDispatchMock = jest.fn();
    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        userLocation: undefined,
      },
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    renderer.create(<ShoppingPickAPharmacyScreen />);

    expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
      shoppingStateMock.prescriptionInfo,
    ]);

    const effectHandler = useEffectMock.mock.calls[1][0];

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
      shoppingDispatchMock,
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
      shoppingDispatchMock,
      geolocationDataErrorMock.message
    );
  });

  it('calls getDependentWithMemberId', () => {
    const prescriptionIdMock = 'prescription-id';
    const navigateToHomeMock = false;

    useRouteMock.mockReturnValue({
      params: {
        prescriptionId: prescriptionIdMock,
        navigateToHome: navigateToHomeMock,
      },
    });

    const shoppingStateMock: IShoppingState = {
      ...defaultShoppingState,
      prescriptionInfo: prescriptionInfoMock,
    };
    const shoppingDispatchMock = jest.fn();
    const shoppingContextMock: IShoppingContext = {
      shoppingState: shoppingStateMock,
      shoppingDispatch: shoppingDispatchMock,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    renderer.create(<ShoppingPickAPharmacyScreen />);

    expect(getDependentWithMemberIdMock).toHaveBeenCalledWith(
      undefined,
      prescriptionInfoMock.primaryMemberRxId
    );
  });
});
