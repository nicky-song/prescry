// Copyright 2023 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { IShoppingContext } from '../../../context-providers/shopping/shopping.context';
import { useShoppingContext } from '../../../context-providers/shopping/use-shopping-context.hook';
import { defaultShoppingState } from '../../../state/shopping/shopping.state';
import { pharmacyDrugPrice2Mock } from '../../../__mocks__/pharmacy-drug-price.mock';
import { prescriptionInfoMock } from '../../../__mocks__/prescription-info.mock';
import { useRoute, useNavigation } from '@react-navigation/native';
import { shoppingStackNavigationMock } from '../../../navigation/stack-navigators/shopping/__mocks__/shopping.stack-navigation.mock';
import { findPharmacy } from '../../../../../utils/pharmacies/find-pharmacy.helper';
import { ErrorConstants } from '../../../../../theming/constants';
import {
  IPricingOptionsScreenRouteProps,
  PricingOptionsScreen,
} from './pricing-options.screen';
import { pricingOptionsScreenStyles } from './pricing-options.screen.styles';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { getChildren } from '../../../../../testing/test.helper';
import { PricingOptionContextContainer } from '../../../../../components/containers/pricing-option-context/pricing-option-context.container';
import { LineSeparator } from '../../../../../components/member/line-separator/line-separator';
import { IDrugDetailsTextProps } from '../../../../../components/text/drug-details/drug-details.text';
import { IPharmacy } from '../../../../../models/pharmacy';
import { IPricingOptionContent } from '../../../../../models/cms-content/pricing-options.content';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { orderPreviewNavigateDispatch } from '../../../store/navigation/dispatch/shopping/order-preview-navigate.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IOrderPreviewScreenRouteProps } from '../order-preview/order-preview.screen';

import { IDualDrugPrice } from '@phx/common/src/models/drug-price';
import { StringFormatter } from '../../../../../utils/formatters/string.formatter';
import {
  getOptions,
  lowestPriceOption,
} from '../../../../../utils/pricing-option.helper';
import { View } from 'react-native';
import { Heading } from '../../../../../components/member/heading/heading';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import {
  IPricingOptionSelectorOption,
  PricingOptionGroup,
} from '../../../../../components/buttons/pricing-option-group/pricing-option-group';
import { PricingOption } from '../../../../../models/pricing-option';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../../../../utils/pharmacies/find-pharmacy.helper');
const findPharmacyMock = findPharmacy as jest.Mock;

jest.mock('../../../context-providers/shopping/use-shopping-context.hook');
const useShoppingContextMock = useShoppingContext as jest.Mock;

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../../../components/containers/body-content/body-content.container',
  () => ({
    BodyContentContainer: () => <div />,
  })
);
jest.mock(
  '../../../../../components/buttons/pricing-option-group/pricing-option-group',
  () => ({
    PricingOptionGroup: () => <div />,
  })
);

jest.mock(
  '../../../store/navigation/dispatch/shopping/order-preview-navigate.dispatch'
);
const orderPreviewNavigateDispatchMock =
  orderPreviewNavigateDispatch as jest.Mock;

jest.mock('../../../../../utils/formatters/string.formatter');
const formatMock = StringFormatter.format as jest.Mock;

type drugDetailsType = Pick<
  IDrugDetailsTextProps,
  'strength' | 'unit' | 'formCode' | 'quantity' | 'refills' | 'supply'
>;
type pharmacyInfoType = Pick<IPharmacy, 'name' | 'address'>;

const setSelectedOptionMock = jest.fn();

describe('PricingOptionsScreen', () => {
  const isContentLoadingMock = false;

  const pricingOptionsContentMock: Partial<IPricingOptionContent> = {
    pricingOptionsTitle: 'Select your pricing option',
    pricingOptionsDescription:
      'Choose the pricing option that aligns with your budget and needs.',
    pricingOptionsFooterLabel: 'Preview order',
  };

  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn().mockReturnValue({ features: {} });
  const reduxContextMock: IReduxContext = {
    dispatch: reduxDispatchMock,
    getState: reduxGetStateMock,
  };

  const pharmacyMock = {
    ...pharmacyDrugPrice2Mock,
    dualPrice: {
      smartPriceMemberPays: 23,
      pbmType: 'phx',
      pbmMemberPays: 25,
      pbmPlanPays: 15,
    } as IDualDrugPrice,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useReduxContextMock.mockReturnValue(reduxContextMock);

    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: {
        ...defaultShoppingState,
        prescriptionInfo: prescriptionInfoMock,
      },
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);
    useNavigationMock.mockReturnValueOnce(rootStackNavigationMock);

    const paramsMock: IPricingOptionsScreenRouteProps = {
      pharmacyNcpdp: pharmacyMock.pharmacy.ncpdp,
    };
    useRouteMock.mockReturnValueOnce({
      params: paramsMock,
    });

    findPharmacyMock.mockReturnValue(pharmacyMock);

    useContentMock.mockReturnValue({
      content: pricingOptionsContentMock,
      isContentLoading: isContentLoadingMock,
    });

    const pricingOptionData = getOptions(pharmacyMock.dualPrice);
    const lowestPrice = lowestPriceOption(pricingOptionData);
    useStateMock.mockReturnValueOnce([lowestPrice, setSelectedOptionMock]);
    formatMock.mockReturnValue(
      pricingOptionsContentMock.pricingOptionsFooterLabel
    );
  });

  it('throws exception if no prescription in context', () => {
    const shoppingContextMock: IShoppingContext = {
      shoppingDispatch: jest.fn(),
      shoppingState: {
        ...defaultShoppingState,
        prescriptionInfo: undefined,
      },
    };
    useShoppingContextMock.mockReturnValue(shoppingContextMock);

    try {
      renderer.create(<PricingOptionsScreen />);
      expect.assertions(1);
    } catch (ex) {
      expect(ex).toEqual(
        new Error(ErrorConstants.errorForGettingPrescriptionInfo)
      );
    }
  });

  it('renders PricingOptionsScreen page', () => {
    const testRenderer = renderer.create(<PricingOptionsScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.showProfileAvatar).toEqual(true);
    expect(basicPage.props.navigateBack).toEqual(
      shoppingStackNavigationMock.goBack
    );
  });

  it('renders the body container', () => {
    const testRenderer = renderer.create(<PricingOptionsScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);

    expect(bodyContainer.props.testID).toEqual('pricingOptionScreen');
    expect(bodyContainer.props.children.length).toEqual(5);
    expect(bodyContainer.type).toEqual(BodyContentContainer);
  });

  it('renders the footer container', () => {
    const testRenderer = renderer.create(<PricingOptionsScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footerRenderer = renderer.create(basicPage.props.footer);
    const footerContainer = footerRenderer.root.findByType(BaseButton);

    expect(useEffectMock).toHaveBeenCalledTimes(1);
    expect(findPharmacyMock).toHaveBeenCalledTimes(1);

    expect(footerContainer.type).toEqual(BaseButton);
    expect(footerContainer.props.testID).toEqual(
      'pricingOptionsScreenFooterButton'
    );
    expect(footerContainer.props.children).toEqual(
      pricingOptionsContentMock?.pricingOptionsFooterLabel
    );
  });

  it('navigates to the order preview screen when the footer button is pressed', () => {
    const testRenderer = renderer.create(<PricingOptionsScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footerRenderer = renderer.create(basicPage.props.footer);
    const expectedOptions = getOptions(pharmacyMock.dualPrice);
    const expectedSelectedOption = lowestPriceOption(expectedOptions);

    const pharmacyNcpdpMock = pharmacyDrugPrice2Mock.pharmacy.ncpdp;
    const expectedRouteProps: IOrderPreviewScreenRouteProps = {
      pharmacyNcpdp: pharmacyNcpdpMock,
      isSieMemberPrescription: false,
      pricingOption: expectedSelectedOption.pricingOption,
    };

    const footerContainer = footerRenderer.root.findByType(BaseButton);
    footerContainer.props.onPress();

    expect(orderPreviewNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      expectedRouteProps
    );
  });

  it('renders Pricing options context container', () => {
    const drugNameMock = 'drug-name';
    const drugDetailsMock: drugDetailsType = {
      strength: '2',
      unit: 'unit',
      formCode: 'form',
      quantity: 3,
      supply: 1,
    };
    const pharmacyInfoMock: pharmacyInfoType = {
      name: 'name-2',
      address: {
        city: 'city-2',
        lineOne: 'address-line-1-2',
        zip: 'zip-2',
        state: 'state-2',
      },
    };
    const testRenderer = renderer.create(<PricingOptionsScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const pricingOptionContextContainer = getChildren(bodyContainer)[0];

    expect(pricingOptionContextContainer.type).toEqual(
      PricingOptionContextContainer
    );
    expect(pricingOptionContextContainer.props.drugName).toEqual(drugNameMock);
    expect(pricingOptionContextContainer.props.drugDetails).toEqual(
      drugDetailsMock
    );
    expect(pricingOptionContextContainer.props.pharmacyInfo).toEqual(
      pharmacyInfoMock
    );
  });

  it('renders the line separator', () => {
    const testRenderer = renderer.create(<PricingOptionsScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const lineSeparator = getChildren(bodyContainer)[1];

    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      pricingOptionsScreenStyles.separatorViewStyle
    );
  });

  it('renders the view heading section', () => {
    const testRenderer = renderer.create(<PricingOptionsScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const viewHeadingSection = getChildren(bodyContainer)[2];

    expect(viewHeadingSection.type).toEqual(View);
    expect(viewHeadingSection.props.style).toEqual(
      pricingOptionsScreenStyles.selectYourPricingOptionViewStyle
    );
  });

  it('renders the view heading section header', () => {
    const testRenderer = renderer.create(<PricingOptionsScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const viewHeadingSection = getChildren(bodyContainer)[2];
    const viewHeadingSectionHeader = getChildren(viewHeadingSection)[0];

    expect(viewHeadingSectionHeader.type).toEqual(Heading);
    expect(viewHeadingSectionHeader.props.level).toEqual(2);
    expect(viewHeadingSectionHeader.props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(viewHeadingSectionHeader.props.skeletonWidth).toEqual('long');
    expect(viewHeadingSectionHeader.props.children).toEqual(
      pricingOptionsContentMock.pricingOptionsTitle
    );
  });

  it('renders the baseText description', () => {
    const testRenderer = renderer.create(<PricingOptionsScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const baseText = getChildren(bodyContainer)[3];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(baseText.props.skeletonWidth).toEqual('medium');
    expect(baseText.props.children).toEqual(
      pricingOptionsContentMock.pricingOptionsDescription
    );
  });

  it('renders the pricing options section', () => {
    const testRenderer = renderer.create(<PricingOptionsScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const pricingOptionsSection = getChildren(bodyContainer)[4];
    const expectedOptions = getOptions(pharmacyMock.dualPrice);
    const expectedSelectedOption = lowestPriceOption(
      pricingOptionsSection.props.options
    );

    expect(pricingOptionsSection.type).toEqual(PricingOptionGroup);
    expect(pricingOptionsSection.props.options).toEqual(expectedOptions);
    expect(pricingOptionsSection.props.selected).toEqual(
      expectedSelectedOption.pricingOption
    );
    expect(pricingOptionsSection.props.viewStyle).toEqual(
      pricingOptionsScreenStyles.pricingOptionGroupViewStyle
    );
  });

  it.each([
    [
      'pbm' as PricingOption,
      {
        memberPays: 25,
        planPays: 15,
        pricingOption: 'pbm',
      } as IPricingOptionSelectorOption,
    ],
    [
      'smartPrice' as PricingOption,
      {
        memberPays: 23,
        pricingOption: 'smartPrice',
      } as IPricingOptionSelectorOption,
    ],
  ])(
    'returns selected option on pricing option select (selected: %p)',
    (
      selectedOption: PricingOption,
      expectedOptions: IPricingOptionSelectorOption
    ) => {
      const testRenderer = renderer.create(<PricingOptionsScreen />);
      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(basicPage.props.body);
      const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
      const pricingOptionsSection = getChildren(bodyContainer)[4];
      pricingOptionsSection.props.onSelect(selectedOption);

      useStateMock.mockReturnValueOnce([selectedOption, setSelectedOptionMock]);
      expect(setSelectedOptionMock).toHaveBeenCalledWith(expectedOptions);
    }
  );
});
