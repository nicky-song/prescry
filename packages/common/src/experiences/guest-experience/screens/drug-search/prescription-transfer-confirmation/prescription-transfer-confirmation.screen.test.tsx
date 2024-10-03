// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { IDrugDetails } from '../../../../../utils/formatters/drug.formatter';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import { OrderConfirmationScreen } from '../../order-confirmation-screen/order-confirmation.screen';
import { IOrderSectionProps } from '../../order-confirmation-screen/sections/order/order.section';
import {
  defaultDrugSearchState,
  IDrugSearchState,
} from '../../../state/drug-search/drug-search.state';

import { selectedDrugMock } from '../../../__mocks__/drug-search-state.mock';
import { PrescriptionTransferConfirmationScreen } from './prescription-transfer-confirmation.screen';
import { IDrugConfiguration } from '../../../../../models/drug-configuration';
import { pharmacyDrugPrice2Mock } from '../../../__mocks__/pharmacy-drug-price.mock';
import { IDrugSearchContext } from '../../../context-providers/drug-search/drug-search.context';
import { prescriptionTransferConfirmationScreenContent } from './prescription-transfer-confirmation.screen.content';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { profileListMock } from '../../../__mocks__/profile-list.mock';
import { IProfile } from '../../../../../models/member-profile/member-profile-info';
import {
  ICouponDetails,
  ICouponDetailsLogo,
} from '../../../../../models/coupon-details/coupon-details';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { assertIsDefined } from '../../../../../assertions/assert-is-defined';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import { PricingOption } from '../../../../../models/pricing-option';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock(
  '../../../context-providers/drug-search/use-drug-search-context.hook'
);
const useDrugSearchContextMock = useDrugSearchContext as jest.Mock;

jest.mock('../../order-confirmation-screen/order-confirmation.screen', () => ({
  OrderConfirmationScreen: () => <div />,
}));

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../../../assertions/assert-is-defined');
const assertIsDefinedMock = assertIsDefined as jest.Mock;

describe('PrescriptionTransferConfirmationScreen', () => {
  const selectedConfigurationMock: IDrugConfiguration = {
    ndc: selectedDrugMock.drugVariants[0].ndc,
    quantity: 1,
    supply: 30,
  };
  const drugSearchStateMock: IDrugSearchState = {
    ...defaultDrugSearchState,
    selectedPharmacy: pharmacyDrugPrice2Mock,
    selectedDrug: selectedDrugMock,
    selectedConfiguration: selectedConfigurationMock,
  };
  const drugSearchContextMock: IDrugSearchContext = {
    drugSearchState: drugSearchStateMock,
    drugSearchDispatch: jest.fn(),
  };

  const cashUserProfile = profileListMock[0];
  const sieUserProfile = profileListMock[1];

  const couponDetailsMock: ICouponDetails = {
    productManufacturerName: pharmacyDrugPrice2Mock.coupon
      ?.productManufacturerName as string,
    price: pharmacyDrugPrice2Mock.coupon?.price as number,
    ageLimit: pharmacyDrugPrice2Mock.coupon?.ageLimit as number,
    introductionDialog: pharmacyDrugPrice2Mock.coupon
      ?.introductionDialog as string,
    eligibilityURL: pharmacyDrugPrice2Mock.coupon?.eligibilityURL as string,
    copayText: pharmacyDrugPrice2Mock.coupon?.copayText as string,
    copayAmount: pharmacyDrugPrice2Mock.coupon?.copayAmount as number,
    groupNumber: pharmacyDrugPrice2Mock.coupon?.groupNumber as string,
    pcn: pharmacyDrugPrice2Mock.coupon?.pcn as string,
    memberId: pharmacyDrugPrice2Mock.coupon?.memberId as string,
    bin: pharmacyDrugPrice2Mock.coupon?.bin as string,
    featuredPharmacy: pharmacyDrugPrice2Mock.coupon?.featuredPharmacy as string,
    logo: pharmacyDrugPrice2Mock.coupon?.logo as ICouponDetailsLogo,
  };

  const pricingOptionMock = 'smartPrice' as PricingOption;

  beforeEach(() => {
    jest.clearAllMocks();
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({
      params: { pricingOption: pricingOptionMock },
    });
  });

  it('has expected number of assertions', () => {
    useMembershipContextMock.mockReturnValueOnce({
      membershipState: { profileList: [] },
    });

    const reduxGetStateMockWithFeatureFlag = jest.fn().mockReturnValue({
      features: {},
    });
    const reduxContextMockWithFeatureFlag: IReduxContext = {
      dispatch: jest.fn(),
      getState: reduxGetStateMockWithFeatureFlag,
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMockWithFeatureFlag);

    renderer.create(<PrescriptionTransferConfirmationScreen />);

    expect(assertIsDefinedMock).toHaveBeenCalledTimes(3);
  });

  it('asserts configuration selected', () => {
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedPharmacy: pharmacyDrugPrice2Mock,
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    useMembershipContextMock.mockReturnValueOnce({
      membershipState: { profileList: [] },
    });

    const reduxGetStateMockWithFeatureFlag = jest.fn().mockReturnValue({
      features: {},
    });
    const reduxContextMockWithFeatureFlag: IReduxContext = {
      dispatch: jest.fn(),
      getState: reduxGetStateMockWithFeatureFlag,
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMockWithFeatureFlag);

    renderer.create(<PrescriptionTransferConfirmationScreen />);

    expect(assertIsDefinedMock).toHaveBeenNthCalledWith(
      1,
      selectedConfigurationMock
    );
  });

  it('asserts drug selected', () => {
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedPharmacy: pharmacyDrugPrice2Mock,
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    useMembershipContextMock.mockReturnValueOnce({
      membershipState: { profileList: [] },
    });

    const reduxGetStateMockWithFeatureFlag = jest.fn().mockReturnValue({
      features: {},
    });
    const reduxContextMockWithFeatureFlag: IReduxContext = {
      dispatch: jest.fn(),
      getState: reduxGetStateMockWithFeatureFlag,
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMockWithFeatureFlag);

    renderer.create(<PrescriptionTransferConfirmationScreen />);

    expect(assertIsDefinedMock).toHaveBeenNthCalledWith(2, selectedDrugMock);
  });

  it('asserts drug variant found', () => {
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedPharmacy: pharmacyDrugPrice2Mock,
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: drugSearchStateMock,
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    useMembershipContextMock.mockReturnValueOnce({
      membershipState: { profileList: [] },
    });

    const reduxGetStateMockWithFeatureFlag = jest.fn().mockReturnValue({
      features: {},
    });
    const reduxContextMockWithFeatureFlag: IReduxContext = {
      dispatch: jest.fn(),
      getState: reduxGetStateMockWithFeatureFlag,
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMockWithFeatureFlag);

    renderer.create(<PrescriptionTransferConfirmationScreen />);

    const expectedVariant = drugSearchResultHelper.getVariantByNdc(
      selectedConfigurationMock.ndc,
      selectedDrugMock
    );
    expect(assertIsDefinedMock).toHaveBeenNthCalledWith(3, expectedVariant);
  });

  it.each([
    [[cashUserProfile], false, false, false],
    [[cashUserProfile], true, false, false],
    [[cashUserProfile], false, true, true],
    [[sieUserProfile], false, false, true],
    [[sieUserProfile], true, false, false],
    [[sieUserProfile], false, true, true],
    [[sieUserProfile, cashUserProfile], false, false, true],
    [[sieUserProfile, cashUserProfile], true, false, false],
    [[sieUserProfile, cashUserProfile], false, true, true],
  ])(
    'renders Order Confirmation Screen component with correct props based on member profile and feature flags (profiles: %p; cash %p, sie %p, showPlanPays: %p, planPrice: %p)',
    (
      memberProfiles: IProfile[],
      cashFeatureFlag: boolean,
      sieFeatureFlag: boolean,
      showPlanPays: boolean
    ) => {
      useMembershipContextMock.mockReturnValueOnce({
        membershipState: { profileList: memberProfiles },
      });

      const reduxGetStateMockWithFeatureFlag = jest.fn().mockReturnValue({
        features: {
          usegrouptypecash: cashFeatureFlag,
          usegrouptypesie: sieFeatureFlag,
        },
      });
      const reduxContextMockWithFeatureFlag: IReduxContext = {
        dispatch: jest.fn(),
        getState: reduxGetStateMockWithFeatureFlag,
      };
      useReduxContextMock.mockReturnValueOnce(reduxContextMockWithFeatureFlag);

      const testRenderer = renderer.create(
        <PrescriptionTransferConfirmationScreen />
      );

      const orderConfirmationScreen = testRenderer.root.findByType(
        OrderConfirmationScreen
      );
      expect(orderConfirmationScreen).toBeDefined();
      expect(orderConfirmationScreen.props.pharmacyDrugPrice.pharmacy).toEqual(
        drugSearchStateMock.selectedPharmacy?.pharmacy
      );
      expect(orderConfirmationScreen.props.pharmacyDrugPrice).toEqual(
        drugSearchStateMock.selectedPharmacy
      );
      expect(orderConfirmationScreen.props.whatIsNextSectionContent).toEqual(
        prescriptionTransferConfirmationScreenContent.confirmationText
      );
      expect(orderConfirmationScreen.props.navigation).toEqual(
        rootStackNavigationMock
      );
      const expectedVariant = selectedDrugMock.drugVariants[0];
      const expectedDrugDetails: IDrugDetails = {
        formCode: expectedVariant.formCode,
        strength: expectedVariant.strength,
        unit: expectedVariant.strengthUnit,
        quantity: selectedConfigurationMock.quantity,
        supply: selectedConfigurationMock.supply,
      };
      const expectedOrderSectionProps: IOrderSectionProps = {
        drugDetails: expectedDrugDetails,
        drugName: selectedDrugMock.name,
        showPlanPays,
        memberPays: pharmacyDrugPrice2Mock.price?.memberPays,
        planPays: pharmacyDrugPrice2Mock.price?.planPays,
        couponDetails: couponDetailsMock,
        hasAssistanceProgram: false,
        pricingOption: pricingOptionMock,
      };

      expect(orderConfirmationScreen.props.orderSectionProps).toEqual(
        expectedOrderSectionProps
      );
      expect(orderConfirmationScreen.props.isNewOrder).toEqual(true);
    }
  );

  it('useNavigation and useRoute have been called only once', () => {
    useMembershipContextMock.mockReturnValueOnce({
      membershipState: { profileList: [] },
    });

    const reduxGetStateMockWithFeatureFlag = jest.fn().mockReturnValue({
      features: {},
    });
    const reduxContextMockWithFeatureFlag: IReduxContext = {
      dispatch: jest.fn(),
      getState: reduxGetStateMockWithFeatureFlag,
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMockWithFeatureFlag);

    renderer.create(<PrescriptionTransferConfirmationScreen />);
  });
});
