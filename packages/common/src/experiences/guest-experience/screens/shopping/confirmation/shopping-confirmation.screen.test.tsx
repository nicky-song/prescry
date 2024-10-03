// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { IPharmacy } from '../../../../../models/pharmacy';
import { IShoppingContext } from '../../../context-providers/shopping/shopping.context';
import { useShoppingContext } from '../../../context-providers/shopping/use-shopping-context.hook';
import {
  defaultShoppingState,
  IShoppingState,
} from '../../../state/shopping/shopping.state';
import {
  pharmacyDrugPrice1Mock,
  pharmacyDrugPrice2Mock,
} from '../../../__mocks__/pharmacy-drug-price.mock';
import {
  prescriptionInfoMock,
  prescriptionInfoWithoutPharmacyMock,
} from '../../../__mocks__/prescription-info.mock';
import { OrderConfirmationScreen } from '../../order-confirmation-screen/order-confirmation.screen';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { profileListMock } from '../../../__mocks__/profile-list.mock';
import { ShoppingConfirmationScreen } from './shopping-confirmation.screen';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useNavigation, useRoute } from '@react-navigation/native';
import { findPharmacy } from '../../../../../utils/pharmacies/find-pharmacy.helper';
import { useFeaturesContext } from '../../../context-providers/features/use-features-context.hook';
import { IFeaturesState } from '../../../guest-experience-features';
import { IFeaturesContext } from '../../../context-providers/features/features.context';

jest.mock('../../../../../utils/pharmacies/find-pharmacy.helper');
const findPharmacyMock = findPharmacy as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../context-providers/shopping/use-shopping-context.hook');
const useShoppingContextMock = useShoppingContext as jest.Mock;

jest.mock('../../order-confirmation-screen/order-confirmation.screen', () => ({
  OrderConfirmationScreen: () => <div />,
}));

jest.mock('../../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../context-providers/features/use-features-context.hook');
const useFeaturesContextMock = useFeaturesContext as jest.Mock;

describe('ShoppingConfirmationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: defaultShoppingState,
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    useMembershipContextMock.mockReturnValueOnce({
      membershipState: { profileList: profileListMock },
    });
    useFeaturesContextMock.mockReturnValue({ featuresState: {} });

    useNavigationMock.mockReturnValueOnce(rootStackNavigationMock);

    useRouteMock.mockReset();

    findPharmacyMock.mockReturnValue(pharmacyDrugPrice2Mock);
  });

  it('renders Order Confirmation Screen component', () => {
    const shoppingStateMock: Partial<IShoppingState> = {
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
    };
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
    });

    const pharmacyNcpdpMock = pharmacyDrugPrice2Mock.pharmacy.ncpdp;
    const useDualPriceMock = true;

    useRouteMock.mockReturnValueOnce({
      params: {
        pharmacyNcpdp: pharmacyNcpdpMock,
        useDualPrice: useDualPriceMock,
      },
    });

    const testRenderer = renderer.create(<ShoppingConfirmationScreen />);

    const orderConfirmationScreen = testRenderer.root.findByType(
      OrderConfirmationScreen
    );
    expect(orderConfirmationScreen).toBeDefined();
  });

  it('renders OrderScreencomponent when pharmacy doesnt exist and pharmacyNcpdp is not passed to the component', () => {
    const shoppingStateMock: Partial<IShoppingState> = {
      prescriptionInfo: prescriptionInfoWithoutPharmacyMock,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
    };
    useShoppingContextMock.mockReturnValueOnce({
      shoppingState: shoppingStateMock,
    });

    useRouteMock.mockReturnValueOnce({
      params: { pharmacyNcpdp: undefined },
    });

    const expectedPharmacy: IPharmacy = {
      name: '',
      phoneNumber: undefined,
      hours: [],
      ncpdp: '',
      address: {
        city: '',
        lineOne: '',
        lineTwo: undefined,
        state: '',
        zip: '',
      },
      twentyFourHours: false,
      isMailOrderOnly: false,
    };

    const testRenderer = renderer.create(<ShoppingConfirmationScreen />);

    const orderConfirmationScreen = testRenderer.root.findByType(
      OrderConfirmationScreen
    );
    expect(orderConfirmationScreen.props.pharmacyDrugPrice.pharmacy).toEqual(
      expectedPharmacy
    );
    expect(orderConfirmationScreen.props.isNewOrder).toEqual(false);
    expect(orderConfirmationScreen.props.navigation).toEqual(
      rootStackNavigationMock
    );
    expect(orderConfirmationScreen);
    const orderSectionProp = orderConfirmationScreen.props.orderSectionProps;
    expect(orderSectionProp.drugName).toEqual(
      prescriptionInfoWithoutPharmacyMock.drugName
    );
    expect(orderSectionProp.drugDetails.strength).toEqual(
      prescriptionInfoWithoutPharmacyMock.strength
    );
    expect(orderSectionProp.planPays).toBeUndefined();
    expect(orderSectionProp.memberPays).toBeUndefined();
  });

  it('renders OrderScreencomponent when pharmacyNcpdp is not passed to the component', () => {
    const shoppingStateMock: Partial<IShoppingState> = {
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [pharmacyDrugPrice1Mock, pharmacyDrugPrice2Mock],
    };
    useShoppingContextMock.mockReturnValueOnce({
      shoppingState: shoppingStateMock,
    });

    useRouteMock.mockReturnValueOnce({
      params: { pharmacyNcpdp: undefined },
    });

    const testRenderer = renderer.create(<ShoppingConfirmationScreen />);

    const orderConfirmationScreen = testRenderer.root.findByType(
      OrderConfirmationScreen
    );
    expect(orderConfirmationScreen.props.pharmacyDrugPrice.pharmacy).toEqual(
      prescriptionInfoMock.pharmacy
    );
    expect(orderConfirmationScreen.props.isNewOrder).toEqual(false);
    const orderSectionProp = orderConfirmationScreen.props.orderSectionProps;
    expect(orderSectionProp.drugName).toEqual(prescriptionInfoMock.drugName);
    expect(orderSectionProp.planPays).toBeUndefined();
    expect(orderSectionProp.memberPays).toBeUndefined();
  });

  it('builds selectedPharmacy Prop and OrderSectionProps when pharmacy from ncpdp and bestpharmacyPrice exists', () => {
    const shoppingStateMock: Partial<IShoppingState> = {
      prescriptionInfo: prescriptionInfoMock,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      prescriptionPharmacies: [pharmacyDrugPrice2Mock],
      hasInsurance: false,
    };
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
    });

    const pharmacyNcpdpMock = pharmacyDrugPrice1Mock.pharmacy.ncpdp;

    useRouteMock.mockReturnValueOnce({
      params: { pharmacyNcpdp: pharmacyNcpdpMock },
    });

    findPharmacyMock.mockReturnValue(pharmacyDrugPrice1Mock);

    const testRenderer = renderer.create(<ShoppingConfirmationScreen />);

    expect(findPharmacyMock).toHaveBeenCalledTimes(1);
    expect(findPharmacyMock).toHaveBeenNthCalledWith(
      1,
      [
        ...(shoppingStateMock.prescriptionPharmacies ?? []),
        shoppingStateMock.bestPricePharmacy,
      ],
      pharmacyNcpdpMock
    );

    const orderConfirmationScreen = testRenderer.root.findByType(
      OrderConfirmationScreen
    );

    expect(orderConfirmationScreen.props.pharmacyDrugPrice.pharmacy).toEqual(
      pharmacyDrugPrice1Mock.pharmacy
    );
    expect(orderConfirmationScreen.props.isNewOrder).toEqual(true);

    const orderSectionProp = orderConfirmationScreen.props.orderSectionProps;
    expect(orderSectionProp.drugName).toEqual(prescriptionInfoMock.drugName);
    expect(orderSectionProp.planPays).toEqual(
      pharmacyDrugPrice1Mock.price?.planPays
    );
    expect(orderSectionProp.memberPays).toEqual(
      pharmacyDrugPrice1Mock.price?.memberPays
    );
    expect(orderSectionProp.hasInsurance).toEqual(false);
  });

  it('builds selectedPharmacy Prop and OrderSectionProps when pharmacy from other pharmacy ncpdp', () => {
    const shoppingStateMock: Partial<IShoppingState> = {
      prescriptionInfo: prescriptionInfoMock,
      bestPricePharmacy: pharmacyDrugPrice1Mock,
      prescriptionPharmacies: [pharmacyDrugPrice2Mock],
      hasInsurance: false,
    };
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
    });

    const otherPharmacy = (pharmacyDrugPrice1Mock.otherPharmacies ?? [])[0];

    const pharmacyNcpdpMock = otherPharmacy.pharmacy.ncpdp;

    useRouteMock.mockReturnValueOnce({
      params: { pharmacyNcpdp: pharmacyNcpdpMock },
    });

    findPharmacyMock.mockReturnValue(otherPharmacy);

    const testRenderer = renderer.create(<ShoppingConfirmationScreen />);

    expect(findPharmacyMock).toHaveBeenCalledTimes(1);
    expect(findPharmacyMock).toHaveBeenNthCalledWith(
      1,
      [
        ...(shoppingStateMock.prescriptionPharmacies ?? []),
        shoppingStateMock.bestPricePharmacy,
      ],
      pharmacyNcpdpMock
    );

    const orderConfirmationScreen = testRenderer.root.findByType(
      OrderConfirmationScreen
    );

    expect(orderConfirmationScreen.props.pharmacyDrugPrice.pharmacy).toEqual(
      otherPharmacy.pharmacy
    );
    expect(orderConfirmationScreen.props.isNewOrder).toEqual(true);

    const orderSectionProp = orderConfirmationScreen.props.orderSectionProps;
    expect(orderSectionProp.drugName).toEqual(prescriptionInfoMock.drugName);
    expect(orderSectionProp.planPays).toEqual(otherPharmacy.price?.planPays);
    expect(orderSectionProp.memberPays).toEqual(
      otherPharmacy.price?.memberPays
    );
    expect(orderSectionProp.hasInsurance).toEqual(false);
  });

  it('builds "summarySectionProps" for order confirmation component', () => {
    const shoppingStateMock: Partial<IShoppingState> = {
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [],
    };
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
    });
    useRouteMock.mockReturnValueOnce({
      params: { pharmacyNcpdp: undefined },
    });

    const testRenderer = renderer.create(<ShoppingConfirmationScreen />);

    const orderConfirmationScreen = testRenderer.root.findByType(
      OrderConfirmationScreen
    );

    expect(orderConfirmationScreen.props.summarySectionProps.orderDate).toEqual(
      prescriptionInfoMock.orderDate
    );
    expect(
      orderConfirmationScreen.props.summarySectionProps.orderNumber
    ).toEqual(prescriptionInfoMock.orderNumber);
  });

  it.each([
    ['CA7F7K01', false, false, false],
    ['CA7F7K01', true, false, false],
    ['CA7F7K01', false, true, true],
    ['SIECA7F7K05', false, false, true],
    ['SIECA7F7K05', true, false, false],
    ['SIECA7F7K05', false, true, true],
  ])(
    'renders Order Confirmation Screen component with correct props based on member profile and feature flags (prescriptionMemberId %p, cash %p, sie %p, showPlanPays: %p)',
    (
      prescriptionMemberId: string,
      cashFeatureFlag: boolean,
      sieFeatureFlag: boolean,
      showPlanPays: boolean
    ) => {
      const featuresStateMock: IFeaturesState = {
        usegrouptypesie: sieFeatureFlag,
        usegrouptypecash: cashFeatureFlag,
      } as IFeaturesState;
      const featuresContextMock: IFeaturesContext = {
        featuresState: featuresStateMock,
      };
      useFeaturesContextMock.mockReturnValue(featuresContextMock);

      const prescriptionMockWithMemberId = {
        ...prescriptionInfoMock,
        primaryMemberRxId: prescriptionMemberId,
      };
      const shoppingStateMock: Partial<IShoppingState> = {
        prescriptionInfo: prescriptionMockWithMemberId,
        bestPricePharmacy: pharmacyDrugPrice1Mock,
        prescriptionPharmacies: [pharmacyDrugPrice2Mock],
      };
      useShoppingContextMock.mockReturnValue({
        shoppingState: shoppingStateMock,
      });

      const pharmacyNcpdpMock = pharmacyDrugPrice1Mock.pharmacy.ncpdp;

      useRouteMock.mockReturnValueOnce({
        params: { pharmacyNcpdp: pharmacyNcpdpMock },
      });

      findPharmacyMock.mockReturnValue(pharmacyDrugPrice1Mock);

      const testRenderer = renderer.create(<ShoppingConfirmationScreen />);

      expect(findPharmacyMock).toHaveBeenCalledTimes(1);
      expect(findPharmacyMock).toHaveBeenNthCalledWith(
        1,
        [
          ...(shoppingStateMock.prescriptionPharmacies ?? []),
          shoppingStateMock.bestPricePharmacy,
        ],
        pharmacyNcpdpMock
      );

      const orderConfirmationScreen = testRenderer.root.findByType(
        OrderConfirmationScreen
      );

      expect(orderConfirmationScreen.props.pharmacyDrugPrice.pharmacy).toEqual(
        pharmacyDrugPrice1Mock.pharmacy
      );
      expect(orderConfirmationScreen.props.isNewOrder).toEqual(true);

      expect(orderConfirmationScreen.props.pharmacyDrugPrice).toEqual(
        pharmacyDrugPrice1Mock
      );

      const orderSectionProp = orderConfirmationScreen.props.orderSectionProps;
      expect(orderSectionProp.drugName).toEqual(prescriptionInfoMock.drugName);
      expect(orderSectionProp.planPays).toEqual(
        pharmacyDrugPrice1Mock.price?.planPays
      );
      expect(orderSectionProp.showPlanPays).toEqual(showPlanPays);
      expect(orderSectionProp.memberPays).toEqual(
        pharmacyDrugPrice1Mock.price?.memberPays
      );
    }
  );

  it('builds "prescriberSectionProps" for order confirmation component', () => {
    const shoppingStateMock: Partial<IShoppingState> = {
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [],
    };
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
    });
    useRouteMock.mockReturnValueOnce({
      params: { pharmacyNcpdp: undefined },
    });

    const testRenderer = renderer.create(<ShoppingConfirmationScreen />);

    const orderConfirmationScreen = testRenderer.root.findByType(
      OrderConfirmationScreen
    );

    expect(
      orderConfirmationScreen.props.prescriberSectionContent.doctorName
    ).toEqual(prescriptionInfoMock.practitioner?.name);

    expect(
      orderConfirmationScreen.props.prescriberSectionContent.doctorContactNumber
    ).toEqual(prescriptionInfoMock.practitioner?.phoneNumber);
  });

  it('builds "pharmacyDrugPrice" props and prescriptionInfoMock\'s coupon object is the source of data for pharmacyDrugPrice\'s coupon object', () => {
    const shoppingStateMock: Partial<IShoppingState> = {
      prescriptionInfo: prescriptionInfoMock,
      prescriptionPharmacies: [],
    };
    useShoppingContextMock.mockReturnValue({
      shoppingState: shoppingStateMock,
    });
    useRouteMock.mockReturnValueOnce({
      params: { pharmacyNcpdp: undefined },
    });

    const testRenderer = renderer.create(<ShoppingConfirmationScreen />);

    const orderConfirmationScreen = testRenderer.root.findByType(
      OrderConfirmationScreen
    );

    expect(orderConfirmationScreen.props.pharmacyDrugPrice.coupon).toEqual(
      prescriptionInfoMock.coupon
    );
  });
});
