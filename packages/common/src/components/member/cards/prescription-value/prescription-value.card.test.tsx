// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { prescriptionValueCardStyles } from './prescription-value.card.styles';
import { PrescriptionValueCard } from './prescription-value.card';
import { IAddress } from '../../../../models/address';
import { PrescriptionPriceSection } from '../../prescription-price/prescription-price.section';
import { couponDetailsMock1 } from '../../../../experiences/guest-experience/__mocks__/coupon-details.mock';
import { useMembershipContext } from '../../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { PharmacyTagList } from '../../../tags/pharmacy/pharmacy-tag-list';
import { getChildren } from '../../../../testing/test.helper';
import { Heading } from '../../heading/heading';
import { BaseText } from '../../../text/base-text/base-text';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { IDualDrugPrice } from '../../../../models/drug-price';
import { PbmPricingOptionInformativePanel } from '../../panels/pbm-pricing-option-informative/pbm-pricing-option-informative.panel';
import { SmartPricePricingOptionInformativePanel } from '../../panels/smart-pricing-option-informative/smart-price-pricing-option-informative.panel';
import { ThirdPartyPricingOptionInformativePanel } from '../../panels/third-party-pricing-option-informative/third-party-pricing-option-informative.panel';
import { NoPricePricingOptionInformativePanel } from '../../panels/no-price-pricing-option-informative/no-price-pricing-option-informative.panel';

jest.mock('../../../tags/pharmacy/pharmacy-tag-list', () => ({
  PharmacyTagList: () => <div />,
}));

jest.mock('../../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

jest.mock(
  '../../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook'
);
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

const ncpdpMock = 'ncpdp-mock';
const favoriteNcpdpMock = 'favoriteNcpdpMock';
const pbmDualPriceMock: IDualDrugPrice = {
  smartPriceMemberPays: 23,
  pbmType: 'phx',
  pbmMemberPays: 25,
  pbmPlanPays: 25,
};

const pbmDualPriceWithUndefinedPricesMock: IDualDrugPrice = {
  smartPriceMemberPays: undefined,
  pbmType: 'phx',
  pbmMemberPays: undefined,
  pbmPlanPays: undefined,
};

const pbmDualPriceWithZeroPricesMock: IDualDrugPrice = {
  smartPriceMemberPays: 0,
  pbmType: 'phx',
  pbmMemberPays: 0,
  pbmPlanPays: 0,
};

const thirdPartyDualPriceMock: IDualDrugPrice = {
  smartPriceMemberPays: 23,
  pbmType: 'thirdParty',
  pbmMemberPays: 25,
  pbmPlanPays: 25,
};

const thirdPartyDualPriceWithUndefinedPricesMock: IDualDrugPrice = {
  smartPriceMemberPays: undefined,
  pbmType: 'thirdParty',
  pbmMemberPays: undefined,
  pbmPlanPays: undefined,
};

const thirdPartyDualPriceWithZeroPricesMock: IDualDrugPrice = {
  smartPriceMemberPays: 0,
  pbmType: 'thirdParty',
  pbmMemberPays: 0,
  pbmPlanPays: 0,
};

const smartPriceDualPriceMock: IDualDrugPrice = {
  smartPriceMemberPays: 23,
  pbmType: 'none',
};

const smartPriceDualPriceWithUndefinedPricesMock: IDualDrugPrice = {
  smartPriceMemberPays: undefined,
  pbmType: 'none',
};

const smartPriceDualPriceWithZeroPricesMock: IDualDrugPrice = {
  smartPriceMemberPays: 0,
  pbmType: 'none',
};

describe('PrescriptionValueCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: { favoritedPharmacies: [favoriteNcpdpMock] },
      },
    });
    useFlagsMock.mockReturnValue({ useDualPrice: false });
  });
  it('renders touchable opacity', () => {
    const customViewStyle: ViewStyle = { width: 1 };
    const distance = 4.8;
    const address: IAddress = {
      city: 'Seattle',
      lineOne: '2607 Denny Way',
      zip: '1234',
      state: 'WA',
    };

    const mockOnPress = jest.fn();
    const testIDMock = 'testIDMock';
    const testRenderer = renderer.create(
      <PrescriptionValueCard
        userGroup='CASH'
        isBestValue={true}
        bestValueLabel='The best value'
        pharmacyName='pharmacyName'
        ncpdp={favoriteNcpdpMock}
        onPress={mockOnPress}
        viewStyle={customViewStyle}
        distance={distance}
        address={address}
        isMailOrderOnly={true}
        testID={testIDMock}
      />
    );

    const touchableOpacity = testRenderer.root.children[0] as ReactTestInstance;

    expect(touchableOpacity.type).toEqual(TouchableOpacity);
    expect(touchableOpacity.props.onPress).toEqual(mockOnPress);
    expect(touchableOpacity.props.style).toEqual([
      prescriptionValueCardStyles.cardViewStyle,
      customViewStyle,
    ]);
    expect(touchableOpacity.props.testID).toEqual(testIDMock);
    expect(touchableOpacity.props.children.length).toEqual(3);

    const pharmacyTagList = touchableOpacity.props.children[0];
    expect(pharmacyTagList.type).toEqual(PharmacyTagList);
    expect(pharmacyTagList.props.isFavoritedPharmacy).toEqual(true);
  });

  it('renders best value default label if no label is set', () => {
    const mockOnPress = jest.fn();
    const address: IAddress = {
      city: 'Seattle',
      lineOne: '2607 Denny Way',
      zip: '1234',
      state: 'WA',
    };
    const distance = 4.8;
    const testRenderer = renderer.create(
      <PrescriptionValueCard
        isBestValue={true}
        pharmacyName='pharmacyName'
        ncpdp={ncpdpMock}
        onPress={mockOnPress}
        userGroup='CASH'
        distance={distance}
        address={address}
      />
    );

    const bestValueBaseText = testRenderer.root.findByType(PharmacyTagList);
    expect(bestValueBaseText.props.isBestValue).toEqual(true);
  });

  it('renders mail delivery label if isMailOrderOnly is set true', () => {
    const mockOnPress = jest.fn();
    const address: IAddress = {
      city: 'Seattle',
      lineOne: '2607 Denny Way',
      zip: '1234',
      state: 'WA',
    };
    const distance = 4.8;
    const testRenderer = renderer.create(
      <PrescriptionValueCard
        isBestValue={true}
        pharmacyName='pharmacyName'
        ncpdp={ncpdpMock}
        onPress={mockOnPress}
        userGroup='CASH'
        distance={distance}
        address={address}
        isMailOrderOnly={true}
      />
    );

    const pharmacyTagList = testRenderer.root.findByType(PharmacyTagList);

    expect(pharmacyTagList.props.isHomeDelivery).toEqual(true);
  });

  it('renders touchable opacity with border style if not best value', () => {
    const mockOnPress = jest.fn();
    const address: IAddress = {
      city: 'Seattle',
      lineOne: '2607 Denny Way',
      zip: '1234',
      state: 'WA',
    };
    const distance = 4.8;
    const testRenderer = renderer.create(
      <PrescriptionValueCard
        pharmacyName='pharmacyName'
        ncpdp={ncpdpMock}
        onPress={mockOnPress}
        userGroup='CASH'
        distance={distance}
        address={address}
      />
    );

    const touchableOpacity = testRenderer.root.children[0] as ReactTestInstance;
    expect(touchableOpacity.props.style).toEqual([
      prescriptionValueCardStyles.cardViewStyle,
      undefined,
    ]);
  });

  it.each([[true], [false], [undefined]])(
    'renders priceContainerRender if useDualPrice flag %p',
    (useDualPrice: boolean | undefined) => {
      const priceYouPay = 1000;
      const priceEmployerPay = 10000;
      const insurancePayMock = 23.45;
      const address: IAddress = {
        city: 'Seattle',
        lineOne: '2607 Denny Way',
        zip: '1234',
        state: 'WA',
      };
      useFlagsMock.mockReturnValue({ useDualPrice });
      const testRenderer = renderer.create(
        <PrescriptionValueCard
          pharmacyName='mock name'
          ncpdp={ncpdpMock}
          priceYouPay={priceYouPay}
          pricePlanPays={priceEmployerPay}
          userGroup='CASH'
          address={address}
          insurancePrice={insurancePayMock}
          patientAssistance={true}
          dualPrice={pbmDualPriceMock}
        />
      );

      const container = testRenderer.root.findByType(TouchableOpacity);
      const priceContainerRender = container.props.children[2];
      if (useDualPrice) {
        const pbmInformative = getChildren(priceContainerRender)[2];
        expect(pbmInformative.type).toEqual(PbmPricingOptionInformativePanel);
        expect(pbmInformative.props.memberPays).toEqual(
          pbmDualPriceMock.pbmMemberPays
        );
        expect(pbmInformative.props.planPays).toEqual(
          pbmDualPriceMock.pbmPlanPays
        );
      } else {
        expect(priceContainerRender.type).toEqual(PrescriptionPriceSection);
        expect(priceContainerRender.props.hasAssistanceProgram).toEqual(true);
        expect(priceContainerRender.props.memberPays).toEqual(priceYouPay);
        expect(priceContainerRender.props.planPays).toEqual(undefined);
        expect(priceContainerRender.props.showPlanPays).toEqual(false);
        expect(priceContainerRender.props.insurancePrice).toEqual(
          insurancePayMock
        );
      }
    }
  );

  it.each([
    [smartPriceDualPriceMock],
    [smartPriceDualPriceWithUndefinedPricesMock],
    [smartPriceDualPriceWithZeroPricesMock],
  ])(
    'renders priceContainerRender for smartPrice with dualPrice %p',
    (dualPrice?: IDualDrugPrice) => {
      const priceYouPay = 1000;
      const priceEmployerPay = 10000;
      const insurancePayMock = 23.45;
      const address: IAddress = {
        city: 'Seattle',
        lineOne: '2607 Denny Way',
        zip: '1234',
        state: 'WA',
      };

      useFlagsMock.mockReturnValue({ useDualPrice: true });
      const testRenderer = renderer.create(
        <PrescriptionValueCard
          pharmacyName='mock name'
          ncpdp={ncpdpMock}
          priceYouPay={priceYouPay}
          pricePlanPays={priceEmployerPay}
          userGroup='CASH'
          address={address}
          insurancePrice={insurancePayMock}
          patientAssistance={true}
          dualPrice={dualPrice}
        />
      );

      const container = testRenderer.root.findByType(TouchableOpacity);
      const priceContainerRender = container.props.children[2];

      const smartPriceInformative = getChildren(priceContainerRender)[3];
      if (dualPrice?.smartPriceMemberPays !== undefined) {
        expect(smartPriceInformative.type).toEqual(
          SmartPricePricingOptionInformativePanel
        );
        expect(smartPriceInformative.props.memberPays).toEqual(
          dualPrice.smartPriceMemberPays
        );
      } else {
        expect(smartPriceInformative).toBeFalsy();
      }
    }
  );

  it.each([
    [pbmDualPriceMock],
    [pbmDualPriceWithUndefinedPricesMock],
    [pbmDualPriceWithZeroPricesMock],
  ])(
    'renders priceContainerRender for smartPrice and PBM price with dualPrice %p',
    (dualPriceMock?: IDualDrugPrice) => {
      const priceYouPay = 1000;
      const priceEmployerPay = 10000;
      const insurancePayMock = 23.45;
      const address: IAddress = {
        city: 'Seattle',
        lineOne: '2607 Denny Way',
        zip: '1234',
        state: 'WA',
      };
      useFlagsMock.mockReturnValue({ useDualPrice: true });
      const testRenderer = renderer.create(
        <PrescriptionValueCard
          pharmacyName='mock name'
          ncpdp={ncpdpMock}
          priceYouPay={priceYouPay}
          pricePlanPays={priceEmployerPay}
          userGroup='SIE'
          address={address}
          insurancePrice={insurancePayMock}
          patientAssistance={true}
          dualPrice={dualPriceMock}
        />
      );

      const container = testRenderer.root.findByType(TouchableOpacity);
      const priceContainerRender = container.props.children[2];

      const pbmInformative = getChildren(priceContainerRender)[2];
      const smartPriceInformative = getChildren(priceContainerRender)[3];
      if (
        dualPriceMock?.pbmType === 'phx' &&
        dualPriceMock.pbmMemberPays !== undefined &&
        dualPriceMock.pbmPlanPays !== undefined
      ) {
        expect(pbmInformative.type).toEqual(PbmPricingOptionInformativePanel);
        expect(pbmInformative.props.memberPays).toEqual(
          dualPriceMock.pbmMemberPays
        );
        expect(pbmInformative.props.planPays).toEqual(
          dualPriceMock.pbmPlanPays
        );
        expect(pbmInformative.props.viewStyle).toEqual(
          prescriptionValueCardStyles.pricingOptionInformativePanelViewStyle
        );
      } else {
        expect(pbmInformative).toBeFalsy();
      }
      if (dualPriceMock?.smartPriceMemberPays !== undefined) {
        expect(smartPriceInformative.type).toEqual(
          SmartPricePricingOptionInformativePanel
        );
        expect(smartPriceInformative.props.memberPays).toEqual(
          dualPriceMock.smartPriceMemberPays
        );
      } else {
        expect(smartPriceInformative).toBeFalsy();
      }
    }
  );

  it.each([
    [thirdPartyDualPriceMock],
    [thirdPartyDualPriceWithUndefinedPricesMock],
    [thirdPartyDualPriceWithZeroPricesMock],
  ])(
    'renders priceContainerRender for smartPrice and third-party price with dualPrice %p',
    (dualPriceMock?: IDualDrugPrice) => {
      const priceYouPay = 1000;
      const priceEmployerPay = 10000;
      const insurancePayMock = 23.45;
      const address: IAddress = {
        city: 'Seattle',
        lineOne: '2607 Denny Way',
        zip: '1234',
        state: 'WA',
      };
      useFlagsMock.mockReturnValue({ useDualPrice: true });
      const testRenderer = renderer.create(
        <PrescriptionValueCard
          pharmacyName='mock name'
          ncpdp={ncpdpMock}
          priceYouPay={priceYouPay}
          pricePlanPays={priceEmployerPay}
          userGroup='SIE'
          address={address}
          insurancePrice={insurancePayMock}
          patientAssistance={true}
          dualPrice={dualPriceMock}
        />
      );

      const container = testRenderer.root.findByType(TouchableOpacity);
      const priceContainerRender = container.props.children[2];

      const thirdPartyInformative = getChildren(priceContainerRender)[1];
      const smartPriceInformative = getChildren(priceContainerRender)[3];
      if (
        dualPriceMock?.pbmType === 'thirdParty' &&
        dualPriceMock.pbmMemberPays !== undefined
      ) {
        expect(thirdPartyInformative.type).toEqual(
          ThirdPartyPricingOptionInformativePanel
        );
        expect(thirdPartyInformative.props.memberPays).toEqual(
          dualPriceMock.pbmMemberPays
        );
        expect(thirdPartyInformative.props.viewStyle).toEqual(
          prescriptionValueCardStyles.pricingOptionInformativePanelViewStyle
        );
      } else {
        expect(thirdPartyInformative).toBeFalsy();
      }

      if (dualPriceMock?.smartPriceMemberPays !== undefined) {
        expect(smartPriceInformative.type).toEqual(
          SmartPricePricingOptionInformativePanel
        );
        expect(smartPriceInformative.props.memberPays).toEqual(
          dualPriceMock.smartPriceMemberPays
        );
      } else {
        expect(smartPriceInformative).toBeFalsy();
      }
    }
  );

  it('renders priceContainerRender for no dual price', () => {
    const priceYouPay = 1000;
    const priceEmployerPay = 10000;
    const insurancePayMock = 23.45;
    const address: IAddress = {
      city: 'Seattle',
      lineOne: '2607 Denny Way',
      zip: '1234',
      state: 'WA',
    };
    useFlagsMock.mockReturnValue({ useDualPrice: true });
    const testRenderer = renderer.create(
      <PrescriptionValueCard
        pharmacyName='mock name'
        ncpdp={ncpdpMock}
        priceYouPay={priceYouPay}
        pricePlanPays={priceEmployerPay}
        userGroup='SIE'
        address={address}
        insurancePrice={insurancePayMock}
        patientAssistance={true}
        dualPrice={undefined}
      />
    );

    const container = testRenderer.root.findByType(TouchableOpacity);
    const priceContainerRender = container.props.children[2];

    const noPriceInformative = getChildren(priceContainerRender)[0];

    expect(noPriceInformative.type).toEqual(
      NoPricePricingOptionInformativePanel
    );
  });

  it('renders priceContainerRender if cash user', () => {
    const priceYouPay = 1000;
    const priceEmployerPay = 10000;
    const insurancePayMock = 23.45;
    const address: IAddress = {
      city: 'Seattle',
      lineOne: '2607 Denny Way',
      zip: '1234',
      state: 'WA',
    };
    const testRenderer = renderer.create(
      <PrescriptionValueCard
        pharmacyName='mock name'
        ncpdp={ncpdpMock}
        priceYouPay={priceYouPay}
        pricePlanPays={priceEmployerPay}
        userGroup='CASH'
        address={address}
        insurancePrice={insurancePayMock}
        patientAssistance={true}
      />
    );

    const container = testRenderer.root.findByType(TouchableOpacity);
    const priceContainerRender = container.props.children[2];
    expect(priceContainerRender.type).toEqual(PrescriptionPriceSection);
    expect(priceContainerRender.props.hasAssistanceProgram).toEqual(true);
    expect(priceContainerRender.props.memberPays).toEqual(priceYouPay);
    expect(priceContainerRender.props.planPays).toEqual(undefined);
    expect(priceContainerRender.props.showPlanPays).toEqual(false);
    expect(priceContainerRender.props.insurancePrice).toEqual(insurancePayMock);
  });

  it('renders priceContainerRender if pbm user', () => {
    const priceYouPay = 1000;
    const priceEmployerPay = 10000;
    const address: IAddress = {
      city: 'Seattle',
      lineOne: '2607 Denny Way',
      zip: '1234',
      state: 'WA',
    };
    const testRenderer = renderer.create(
      <PrescriptionValueCard
        pharmacyName='mock name'
        ncpdp={ncpdpMock}
        priceYouPay={priceYouPay}
        pricePlanPays={priceEmployerPay}
        userGroup='SIE'
        address={address}
        patientAssistance={true}
        couponDetails={couponDetailsMock1}
      />
    );

    const container = testRenderer.root.findByType(TouchableOpacity);
    const priceContainerRender = container.props.children[2];
    expect(priceContainerRender.type).toEqual(PrescriptionPriceSection);
    expect(priceContainerRender.props.hasAssistanceProgram).toEqual(true);
    expect(priceContainerRender.props.memberPays).toEqual(priceYouPay);
    expect(priceContainerRender.props.planPays).toEqual(priceEmployerPay);
    expect(priceContainerRender.props.showPlanPays).toEqual(true);
    expect(priceContainerRender.props.couponDetails).toEqual(
      couponDetailsMock1
    );
  });

  it.each([[undefined], [true]])(
    'renders pharmacy service status, skeletons %p',
    (isSkeletonMock?: boolean) => {
      const customViewStyle: ViewStyle = { width: 1 };
      const distance = 4.8;
      const address: IAddress = {
        city: 'Seattle',
        lineOne: '2607 Denny Way',
        zip: '1234',
        state: 'WA',
      };

      const mockOnPress = jest.fn();
      const testIDMock = 'testIDMock';
      const pharmacyNameMock = 'pharmacyName';
      const serviceStatusMock = 'serviceStatus';
      const testRenderer = renderer.create(
        <PrescriptionValueCard
          userGroup='CASH'
          isBestValue={true}
          bestValueLabel='The best value'
          pharmacyName={pharmacyNameMock}
          ncpdp={favoriteNcpdpMock}
          onPress={mockOnPress}
          viewStyle={customViewStyle}
          distance={distance}
          address={address}
          isMailOrderOnly={true}
          testID={testIDMock}
          serviceStatus={serviceStatusMock}
          isServiceStatusLoading={isSkeletonMock}
        />
      );

      const touchableOpacity = testRenderer.root
        .children[0] as ReactTestInstance;

      const serviceStatusRowContainerView = touchableOpacity.props.children[1];
      expect(serviceStatusRowContainerView.type).toEqual(View);
      expect(serviceStatusRowContainerView.props.style).toEqual(
        prescriptionValueCardStyles.rowContainerViewStyle
      );

      const serviceStatusColumnContainerView = getChildren(
        serviceStatusRowContainerView
      )[0];
      expect(serviceStatusColumnContainerView.type).toEqual(View);
      expect(serviceStatusColumnContainerView.props.style).toEqual(
        prescriptionValueCardStyles.leftColumnViewStyle
      );

      const heading = getChildren(serviceStatusColumnContainerView)[0];
      expect(heading.type).toEqual(Heading);
      expect(heading.props.level).toEqual(3);
      expect(heading.props.textStyle).toEqual(
        prescriptionValueCardStyles.pharmacyNameTextStyle
      );
      expect(heading.props.translateContent).toEqual(false);
      expect(heading.props.children).toEqual(pharmacyNameMock);

      const locationOrMailOrderInfo = getChildren(
        serviceStatusColumnContainerView
      )[1];
      expect(locationOrMailOrderInfo).toEqual(false);

      const serviceStatus = getChildren(serviceStatusColumnContainerView)[2];
      expect(serviceStatus.type).toEqual(BaseText);
      expect(serviceStatus.props.isSkeleton).toEqual(isSkeletonMock);
      expect(serviceStatus.props.skeletonWidth).toEqual('medium');
      expect(serviceStatus.props.children).toEqual(serviceStatusMock);
    }
  );
});
