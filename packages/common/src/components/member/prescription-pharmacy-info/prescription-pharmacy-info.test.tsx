// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { TouchableOpacity, View } from 'react-native';
import { PrescriptionPharmacyInfo } from './prescription-pharmacy-info';
import {
  prescriptionPharmacyInfoStyles,
  prescriptionPharmacyInfoStyles as styles,
} from './prescription-pharmacy-info.styles';
import { formatPhoneNumber } from '../../../utils/formatters/phone-number.formatter';
import { MapUrlHelper } from '../../../utils/map-url.helper';
import { BaseText } from '../../text/base-text/base-text';
import { formatZipCode } from '../../../utils/formatters/address.formatter';
import { IPharmacyWebsite } from '../pharmacy-information/pharmacy-information';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { callPhoneNumber, goToUrl } from '../../../utils/link.helper';
import { FavoriteIconButton } from '../../buttons/favorite-icon/favorite-icon.button';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { useReduxContext } from '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { favoritePharmacyAsyncAction } from '../../../experiences/guest-experience/store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action';
import { getChildren } from '../../../testing/test.helper';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IconSize } from '../../../theming/icons';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../buttons/favorite-icon/favorite-icon.button', () => ({
  ...jest.requireActual('../../buttons/favorite-icon/favorite-icon.button'),
  FavoriteIconButton: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook'
);
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action'
);
const favoritePharmacyAsyncActionMock =
  favoritePharmacyAsyncAction as jest.Mock;

jest.mock('../../../utils/link.helper');
const callPhoneNumberMock = callPhoneNumber as jest.Mock;
const goToUrlMock = goToUrl as jest.Mock;

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

const membershipDispatchMock = jest.fn();

describe('PrescriptionPharmacyInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: { favoritedPharmacies: ['ncpdp-mock-1', 'ncpdp-mock-2'] },
        favoritingStatus: 'none',
      },
      membershipDispatch: membershipDispatchMock,
    });

    useReduxContextMock.mockReturnValue({
      dispatch: jest.fn(),
      getState: jest.fn(),
    });

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
  });

  it('renders container view', () => {
    const testRenderer = renderer.create(
      <PrescriptionPharmacyInfo
        pharmacyAddress1='address-1'
        pharmacyCity='city'
        pharmacyState='state'
        pharmacyZipCode='zip-code'
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.children.length).toEqual(5);
  });

  it.each([[undefined], ['title']])(
    'renders title %p',
    (titleMock: string | undefined) => {
      const testRenderer = renderer.create(
        <PrescriptionPharmacyInfo
          title={titleMock}
          pharmacyAddress1='address-1'
          pharmacyCity='city'
          pharmacyState='state'
          pharmacyZipCode='zip-code'
        />
      );
      const container = testRenderer.root.findByType(View);

      const titleContentContainer = container.props.children[0];

      if (!titleMock) {
        expect(titleContentContainer).toBeNull();
      } else {
        expect(titleContentContainer.type).toEqual(ProtectedBaseText);
        expect(titleContentContainer.props.weight).toEqual('semiBold');
        expect(titleContentContainer.props.style).toEqual(
          styles.titleTextStyle
        );
        expect(titleContentContainer.props.children).toEqual(titleMock);
      }
    }
  );

  it('renders title with FavoritePharmacyIcon when title and ncpdp exist', () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    useReduxContextMock.mockReturnValue({
      dispatch: dispatchMock,
      getState: getStateMock,
    });

    const titleMock = 'title-mock';
    const ncpdpMock = 'ncpdp-mock';

    const testRenderer = renderer.create(
      <PrescriptionPharmacyInfo
        title={titleMock}
        ncpdp={ncpdpMock}
        pharmacyAddress1='address-1'
        pharmacyCity='city'
        pharmacyState='state'
        pharmacyZipCode='zip-code'
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    const titleContentWithFavorite = getChildren(container)[0];

    expect(titleContentWithFavorite.type).toEqual(View);
    expect(titleContentWithFavorite.props.style).toEqual(
      prescriptionPharmacyInfoStyles.titleContentWithFavoriteViewStyle
    );

    const titleContent = getChildren(titleContentWithFavorite)[0];
    const favoriteIconButton = getChildren(titleContentWithFavorite)[1];

    expect(titleContent.type).toEqual(ProtectedBaseText);
    expect(titleContent.props.weight).toEqual('semiBold');
    expect(titleContent.props.style).toEqual(styles.titleTextStyle);
    expect(titleContent.props.children).toEqual(titleMock);

    expect(favoriteIconButton.type).toEqual(FavoriteIconButton);
    expect(favoriteIconButton.props.onPress).toEqual(expect.any(Function));
    expect(favoriteIconButton.props.testID).toEqual(
      'favoriteIconButtonOnPrescriptionPharmacyInfo'
    );

    favoriteIconButton.props.onPress();

    expect(favoritePharmacyAsyncActionMock).toHaveBeenCalledWith({
      ncpdp: ncpdpMock,
      navigation: rootStackNavigationMock,
      reduxDispatch: dispatchMock,
      reduxGetState: getStateMock,
      membershipDispatch: membershipDispatchMock,
    });
  });

  it.each([[undefined], ['open-status']])(
    'renders open status %p',
    (openStatusMock: string | undefined) => {
      const testRenderer = renderer.create(
        <PrescriptionPharmacyInfo
          openStatus={openStatusMock}
          pharmacyAddress1='address-1'
          pharmacyCity='city'
          pharmacyState='state'
          pharmacyZipCode='zip-code'
        />
      );
      const container = testRenderer.root.findByType(View);

      const openStatusContainer = container.props.children[4];

      if (!openStatusMock) {
        expect(openStatusContainer).toBeNull();
      } else {
        expect(openStatusContainer.type).toEqual(View);
        expect(openStatusContainer.props.style).toEqual(
          prescriptionPharmacyInfoStyles.rowViewStyle
        );

        const openStatusContent = openStatusContainer.props.children;
        expect(openStatusContent.type).toEqual(BaseText);
        expect(openStatusContent.props.children).toEqual(openStatusMock);
      }
    }
  );

  it('renders address with link button', () => {
    const address1Mock = 'address-1';
    const cityMock = 'city';
    const stateMock = 'state';
    const zipCodeMock = 'zip-code';

    const testRenderer = renderer.create(
      <PrescriptionPharmacyInfo
        pharmacyAddress1={address1Mock}
        pharmacyCity={cityMock}
        pharmacyState={stateMock}
        pharmacyZipCode={zipCodeMock}
      />
    );
    const container = testRenderer.root.findByType(View);

    const addressButton = container.props.children[1];
    expect(addressButton.type).toEqual(TouchableOpacity);

    const onPress = addressButton.props.onPress;
    onPress();

    const expectedUrl = MapUrlHelper.getUrl(
      address1Mock,
      cityMock,
      stateMock,
      zipCodeMock
    );
    expect(goToUrlMock).toHaveBeenCalledWith(expectedUrl);

    expect(addressButton.props.style).toEqual(styles.rowViewStyle);
    expect(addressButton.props.testID).toBe(
      'prescriptionPharmacyInfoAddressTouchable'
    );

    const buttonContent = addressButton.props.children;
    expect(buttonContent.length).toEqual(2);

    const imageAsset = buttonContent[0];
    expect(imageAsset.type).toEqual(FontAwesomeIcon);
    expect(imageAsset.props.name).toEqual('map-marker-alt');
    expect(imageAsset.props.size).toEqual(IconSize.regular);
    expect(imageAsset.props.style).toEqual(styles.iconTextStyle);

    const text = buttonContent[1];
    expect(text.type).toEqual(ProtectedBaseText);
    expect(text.props.style).toEqual(
      prescriptionPharmacyInfoStyles.commonTextStyle
    );

    const formattedPharmacyZipCodeMock = formatZipCode(zipCodeMock ?? '');

    const expectedAddress = `${address1Mock} ${cityMock}, ${stateMock} ${formattedPharmacyZipCodeMock}`;
    expect(text.props.children).toEqual(expectedAddress);
  });

  it('renders address without link button', () => {
    const address1Mock = 'address-1';
    const cityMock = 'city';
    const stateMock = 'state';
    const zipCodeMock = 'zip-code';

    const testRenderer = renderer.create(
      <PrescriptionPharmacyInfo
        pharmacyAddress1={address1Mock}
        pharmacyCity={cityMock}
        pharmacyState={stateMock}
        pharmacyZipCode={zipCodeMock}
        hideLinkButtons={true}
      />
    );
    const container = testRenderer.root.findByType(View);

    const addressContainer = container.props.children[1];
    expect(addressContainer.type).toEqual(View);
    expect(addressContainer.props.style).toEqual(
      prescriptionPharmacyInfoStyles.rowViewStyle
    );

    const addressContent = addressContainer.props.children;
    expect(addressContent.type).toEqual(ProtectedBaseText);

    expect(addressContent.props.style).toEqual(
      prescriptionPharmacyInfoStyles.commonTextStyle
    );

    const formattedPharmacyZipCodeMock = formatZipCode(zipCodeMock ?? '');

    const expectedAddress = `${address1Mock} ${cityMock}, ${stateMock} ${formattedPharmacyZipCodeMock}`;
    expect(addressContent.props.children).toEqual(expectedAddress);
  });

  it('does not render address without it', () => {
    const address1Mock = '';
    const cityMock = '';
    const stateMock = '';
    const zipCodeMock = '';

    const testRenderer = renderer.create(
      <PrescriptionPharmacyInfo
        pharmacyAddress1={address1Mock}
        pharmacyCity={cityMock}
        pharmacyState={stateMock}
        pharmacyZipCode={zipCodeMock}
      />
    );
    const container = testRenderer.root.findByType(View);

    const addressButton = container.props.children[1];
    expect(addressButton).toEqual(null);
  });

  it.each([[undefined], ['4258815894']])(
    'renders phone number %p with link button',
    (phoneNumberMock: string | undefined) => {
      const testRenderer = renderer.create(
        <PrescriptionPharmacyInfo
          phoneNumber={phoneNumberMock}
          pharmacyAddress1='address-1'
          pharmacyCity='city'
          pharmacyState='state'
          pharmacyZipCode='zip-code'
        />
      );
      const container = testRenderer.root.findByType(View);

      const phoneNumberContent = container.props.children[2];

      if (!phoneNumberMock) {
        expect(phoneNumberContent).toBeNull();
      } else {
        expect(phoneNumberContent.type).toEqual(TouchableOpacity);
        expect(phoneNumberContent.props.style).toEqual(styles.rowViewStyle);
        expect(phoneNumberContent.props.testID).toBe(
          'prescriptionPharmacyInfoPhoneNumberTouchable'
        );

        const onPress = phoneNumberContent.props.onPress;
        onPress();

        expect(callPhoneNumberMock).toHaveBeenCalledWith(phoneNumberMock);

        const buttonContent = phoneNumberContent.props.children;
        expect(buttonContent.length).toEqual(2);

        const imageAsset = buttonContent[0];
        expect(imageAsset.type).toEqual(FontAwesomeIcon);
        expect(imageAsset.props.name).toEqual('phone-alt');
        expect(imageAsset.props.size).toEqual(IconSize.regular);
        expect(imageAsset.props.style).toEqual(styles.phoneIconTextStyle);

        const text = buttonContent[1];
        expect(text.type).toEqual(BaseText);
        expect(text.props.children).toEqual(formatPhoneNumber(phoneNumberMock));
        expect(text.props.style).toEqual(
          prescriptionPharmacyInfoStyles.commonTextStyle
        );
      }
    }
  );

  it.each([[undefined], ['4258815894']])(
    'renders phone number %p without link button',
    (phoneNumberMock: string | undefined) => {
      const testRenderer = renderer.create(
        <PrescriptionPharmacyInfo
          phoneNumber={phoneNumberMock}
          pharmacyAddress1='address-1'
          pharmacyCity='city'
          pharmacyState='state'
          pharmacyZipCode='zip-code'
          hideLinkButtons={true}
        />
      );
      const container = testRenderer.root.findByType(View);

      const phoneNumberContainer = container.props.children[2];

      if (!phoneNumberMock) {
        expect(phoneNumberContainer).toBeNull();
      } else {
        expect(phoneNumberContainer.type).toEqual(View);
        expect(phoneNumberContainer.props.style).toEqual(styles.rowViewStyle);

        const phoneNumberContent = phoneNumberContainer.props.children;
        expect(phoneNumberContent.type).toEqual(BaseText);
        expect(phoneNumberContent.props.children).toEqual(
          formatPhoneNumber(phoneNumberMock)
        );
        expect(phoneNumberContent.props.style).toEqual(
          prescriptionPharmacyInfoStyles.commonTextStyle
        );
      }
    }
  );

  it.each([
    [undefined],
    [{ label: 'label', url: 'url' }],
    [{ label: 'label', url: '' }],
  ])(
    'renders web site %p with link button',
    (webSiteMock: IPharmacyWebsite | undefined) => {
      const testRenderer = renderer.create(
        <PrescriptionPharmacyInfo
          pharmacyAddress1='address-1'
          pharmacyCity='city'
          pharmacyState='state'
          pharmacyZipCode='zip-code'
          pharmacyWebsite={webSiteMock}
        />
      );
      const container = testRenderer.root.findByType(View);

      const webSiteContent = container.props.children[3];

      if (!webSiteMock) {
        expect(webSiteContent).toBeNull();
      } else {
        expect(webSiteContent.type).toEqual(TouchableOpacity);
        expect(webSiteContent.props.style).toEqual(styles.rowViewStyle);
        expect(webSiteContent.props.testID).toBe(
          'prescriptionPharmacyInfoWebsiteTouchable'
        );

        const onPress = webSiteContent.props.onPress;
        onPress();

        if (webSiteMock.url) {
          expect(goToUrlMock).toHaveBeenCalledWith(webSiteMock.url);
        } else {
          expect(goToUrlMock).not.toHaveBeenCalled();
        }

        const buttonContent = webSiteContent.props.children;
        expect(buttonContent.length).toEqual(2);

        const imageAsset = buttonContent[0];
        expect(imageAsset.type).toEqual(FontAwesomeIcon);
        expect(imageAsset.props.name).toEqual('globe-americas');
        expect(imageAsset.props.solid).toEqual(true);
        expect(imageAsset.props.style).toEqual(styles.iconTextStyle);

        const text = buttonContent[1];
        expect(text.type).toEqual(BaseText);
        expect(text.props.children).toEqual(webSiteMock.label);
        expect(text.props.style).toEqual(
          prescriptionPharmacyInfoStyles.commonTextStyle
        );
      }
    }
  );

  it.each([
    [undefined],
    [{ label: 'label', url: 'url' }],
    [{ label: 'label', url: '' }],
  ])(
    'renders web site %p without link button',
    (webSiteMock: IPharmacyWebsite | undefined) => {
      const testRenderer = renderer.create(
        <PrescriptionPharmacyInfo
          pharmacyAddress1='address-1'
          pharmacyCity='city'
          pharmacyState='state'
          pharmacyZipCode='zip-code'
          pharmacyWebsite={webSiteMock}
          hideLinkButtons={true}
        />
      );
      const container = testRenderer.root.findByType(View);

      const webSiteContainer = container.props.children[3];

      if (!webSiteMock) {
        expect(webSiteContainer).toBeNull();
      } else {
        expect(webSiteContainer.type).toEqual(View);
        expect(webSiteContainer.props.style).toEqual(styles.rowViewStyle);

        const webSiteContent = webSiteContainer.props.children;
        expect(webSiteContent.type).toEqual(ProtectedBaseText);
        expect(webSiteContent.props.children).toEqual(webSiteMock.url);
        expect(webSiteContent.props.style).toEqual(
          prescriptionPharmacyInfoStyles.commonTextStyle
        );
      }
    }
  );

  it('renders skeletons when isSkeleton is true', () => {
    const address1Mock = 'address-1';
    const cityMock = 'city';
    const stateMock = 'state';
    const zipCodeMock = 'zip-code';

    const testRenderer = renderer.create(
      <PrescriptionPharmacyInfo
        title={'title'}
        phoneNumber={'4258815894'}
        pharmacyAddress1={address1Mock}
        pharmacyCity={cityMock}
        pharmacyState={stateMock}
        pharmacyZipCode={zipCodeMock}
        isSkeleton={true}
        pharmacyWebsite={{ label: 'label', url: 'url' }}
        openStatus={'open-status'}
      />
    );
    const container = testRenderer.root.findByType(View);

    const titleContent = container.props.children[0];

    expect(titleContent.type).toEqual(ProtectedBaseText);
    expect(titleContent.props.isSkeleton).toEqual(true);
    expect(titleContent.props.skeletonWidth).toEqual('long');

    const addressButton = container.props.children[1];
    const addressButtonContent = addressButton.props.children;

    const text = addressButtonContent[1];
    expect(text.type).toEqual(ProtectedBaseText);
    expect(text.props.isSkeleton).toEqual(true);
    expect(text.props.skeletonWidth).toEqual('medium');
    expect(text.props.style).toEqual(
      prescriptionPharmacyInfoStyles.commonTextStyle
    );

    const phoneNumberContent = container.props.children[2];

    const phoneNumberButtonContent = phoneNumberContent.props.children;

    const textPhoneNumber = phoneNumberButtonContent[1];
    expect(textPhoneNumber.type).toEqual(BaseText);
    expect(textPhoneNumber.props.isSkeleton).toEqual(true);
    expect(textPhoneNumber.props.skeletonWidth).toEqual('medium');
    expect(textPhoneNumber.props.style).toEqual(
      prescriptionPharmacyInfoStyles.commonTextStyle
    );

    const webSiteContent = container.props.children[3];

    const webSiteButtonContent = webSiteContent.props.children;

    const webSiteText = webSiteButtonContent[1];
    expect(webSiteText.type).toEqual(BaseText);
    expect(webSiteText.props.isSkeleton).toEqual(true);
    expect(webSiteText.props.skeletonWidth).toEqual('medium');
    expect(webSiteText.props.style).toEqual(
      prescriptionPharmacyInfoStyles.commonTextStyle
    );

    const openStatusContainer = container.props.children[4];

    const openStatusContent = openStatusContainer.props.children;
    expect(openStatusContent.type).toEqual(BaseText);
    expect(openStatusContent.props.isSkeleton).toEqual(true);
    expect(openStatusContent.props.skeletonWidth).toEqual('short');
  });
});
