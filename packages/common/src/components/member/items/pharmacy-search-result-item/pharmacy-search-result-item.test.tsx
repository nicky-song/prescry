// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { TouchableOpacity, View, Text, ViewStyle } from 'react-native';
import { PharmacySearchResultItem } from '../pharmacy-search-result-item/pharmacy-search-result-item';
import { pharmacySearchResultListItemStyle as styles } from '../pharmacy-search-result-item/pharmacy-search-result-item.style';
import renderer from 'react-test-renderer';
import { IProviderLocationDetails } from '../../../../models/api-response/provider-location-response';
import { formatAddressWithoutStateZip } from '../../../../utils/formatters/address.formatter';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { useReduxContext } from '../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../../../../experiences/guest-experience/context-providers/redux/redux.context';
import { ProtectedView } from '../../../containers/protected-view/protected-view';
import { TranslatableBaseText } from '../../../text/translated-base-text/translatable-base-text';

jest.mock(
  '../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);

const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../utils/formatters/address.formatter');
const formatAddressWithoutStateZipMock =
  formatAddressWithoutStateZip as jest.Mock;
jest.mock('../../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));
const mockItem: IProviderLocationDetails = {
  id: '1',
  providerName: 'Bartell Drugs',
  locationName: 'Bartell Drugs',
  address1: '7370 170th Ave NE',
  city: 'Redmond',
  state: 'WA',
  zip: '98052',
  distance: 0.32,
  phoneNumber: '(425) 977-5489',
  price: '1000',
};
const navigationFunctionMock = jest.fn();

describe('PharmacySearchResultListItem', () => {
  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn();
  const reduxContextMock: IReduxContext = {
    dispatch: reduxDispatchMock,
    getState: reduxGetStateMock,
  };
  beforeEach(() => {
    jest.clearAllMocks();
    formatAddressWithoutStateZipMock.mockReturnValue(
      '7370 170th Ave NE Redmond'
    );
    useReduxContextMock.mockReturnValue(reduxContextMock);
  });
  it('renders search result container component with expected properties', () => {
    const mockViewStyle: ViewStyle = { width: 350 };
    const testRenderer = renderer.create(
      <PharmacySearchResultItem
        item={mockItem}
        navigateToPharmacyInformation={navigationFunctionMock}
        viewStyle={mockViewStyle}
      />
    );

    const touchableOpacityComponent =
      testRenderer.root.findByType(TouchableOpacity);

    expect(touchableOpacityComponent.props.style).toEqual([
      styles.containerViewStyle,
      mockViewStyle,
    ]);
    expect(touchableOpacityComponent.props.onPress).toBeDefined();
    expect(touchableOpacityComponent.props.testID).toEqual(
      `pharmacySearchResultItem-${mockItem.id}`
    );
  });

  it('calls asnyc action when pharmacy is pressed', () => {
    const mockViewStyle: ViewStyle = { width: 350 };
    const testRenderer = renderer.create(
      <PharmacySearchResultItem
        item={mockItem}
        navigateToPharmacyInformation={navigationFunctionMock}
        viewStyle={mockViewStyle}
      />
    );

    const touchableOpacityComponent =
      testRenderer.root.findByType(TouchableOpacity);

    expect(touchableOpacityComponent.props.style).toEqual([
      styles.containerViewStyle,
      mockViewStyle,
    ]);
    touchableOpacityComponent.props.onPress();
    expect(navigationFunctionMock).toHaveBeenCalledTimes(1);
  });

  it('renders search result texts container with expected properties', () => {
    const testRenderer = renderer.create(
      <PharmacySearchResultItem
        item={mockItem}
        navigateToPharmacyInformation={navigationFunctionMock}
      />
    );

    const touchableOpacityComponent =
      testRenderer.root.findByType(TouchableOpacity);

    const textsContainer = touchableOpacityComponent.props.children[0];
    expect(textsContainer.type).toEqual(ProtectedView);
    expect(textsContainer.props.style).toEqual(styles.textContainerViewStyle);

    const priceView = textsContainer.props.children[0];
    expect(priceView.type).toEqual(View);
    expect(priceView.props.style).toEqual(styles.priceViewStyle);

    const header = priceView.props.children[0];
    expect(header.type).toEqual(Text);
    expect(header.props.style).toEqual(styles.headerTextStyle);
    expect(header.props.children).toEqual(mockItem.providerName);
    const price = priceView.props.children[1];
    expect(price.type).toEqual(TranslatableBaseText);
    expect(price.props.style).toEqual(styles.priceTextStyle);
    expect(price.props.children).toEqual('$10.00');

    const address = textsContainer.props.children[1];
    expect(address.type).toEqual(View);
    expect(address.props.style).toEqual(styles.addressContainerViewStyle);
    const addressText = address.props.children[0];
    expect(addressText.type).toEqual(Text);
    expect(addressText.props.style).toEqual(styles.addressTextStyle);
    expect(addressText.props.children).toEqual(
      formatAddressWithoutStateZipMock(mockItem)
    );
    const phone = address.props.children[1];
    expect(phone.type).toEqual(Text);
    expect(phone.props.style).toEqual(styles.phoneTextStyle);
    expect(phone.props.children).toEqual(mockItem.phoneNumber);
    const distance = address.props.children[2];
    expect(distance.type).toEqual(TranslatableBaseText);
    expect(distance.props.style).toEqual(styles.distanceTextStyle);
    expect(distance.props.children).toEqual(`${mockItem.distance} mi.`);
  });

  it('renders search result texts container with expected properties when price is undefined', () => {
    const testRenderer = renderer.create(
      <PharmacySearchResultItem
        item={{ ...mockItem, price: undefined }}
        navigateToPharmacyInformation={navigationFunctionMock}
      />
    );

    const touchableOpacityComponent =
      testRenderer.root.findByType(TouchableOpacity);

    const textsContainer = touchableOpacityComponent.props.children[0];
    expect(textsContainer.type).toEqual(ProtectedView);
    expect(textsContainer.props.style).toEqual(styles.textContainerViewStyle);

    const priceView = textsContainer.props.children[0];
    expect(priceView.type).toEqual(View);
    expect(priceView.props.style).toEqual(styles.priceViewStyle);

    const header = priceView.props.children[0];
    expect(header.type).toEqual(Text);
    expect(header.props.style).toEqual(styles.headerTextStyle);
    expect(header.props.children).toEqual(mockItem.providerName);
    const price = priceView.props.children[1];
    expect(price).toEqual(null);
  });

  it('renders arrow button icon with expected properties', () => {
    const testRenderer = renderer.create(
      <PharmacySearchResultItem
        item={mockItem}
        navigateToPharmacyInformation={navigationFunctionMock}
      />
    );

    const touchableOpacityComponent =
      testRenderer.root.findByType(TouchableOpacity);

    const arrowIconContainer = touchableOpacityComponent.props.children[1];
    expect(arrowIconContainer.props.style).toEqual(
      styles.iconContainerViewStyle
    );

    const arrowIconView = arrowIconContainer.props.children;
    expect(arrowIconView.type).toEqual(View);
    expect(arrowIconView.props.style).toEqual(styles.iconViewStyle);
    const arrowIcon = arrowIconView.props.children;
    expect(arrowIcon.type).toEqual(FontAwesomeIcon);
    expect(arrowIcon.props.name).toEqual('chevron-right');
    expect(arrowIcon.props.style).toEqual(styles.iconStyle);
  });
});
