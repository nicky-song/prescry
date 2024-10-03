// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent } from 'react';
import { View, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { formatPhoneNumber } from '../../../utils/formatters/phone-number.formatter';
import { MapUrlHelper } from '../../../utils/map-url.helper';
import { BaseText } from '../../text/base-text/base-text';
import { prescriptionPharmacyInfoStyles } from './prescription-pharmacy-info.styles';
import { formatZipCode } from '../../../utils/formatters/address.formatter';
import { IPharmacyWebsite } from '../pharmacy-information/pharmacy-information';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { callPhoneNumber, goToUrl } from '../../../utils/link.helper';
import { FavoriteIconButton } from '../../buttons/favorite-icon/favorite-icon.button';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { useReduxContext } from '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { favoritePharmacyAsyncAction } from '../../../experiences/guest-experience/store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action';
import { RootStackNavigationProp } from '../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation } from '@react-navigation/native';
import { IconSize } from '../../../theming/icons';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

export interface IPrescriptionPharmacyInfoProps {
  phoneNumber?: string;
  pharmacyAddress1?: string;
  pharmacyCity?: string;
  pharmacyZipCode?: string;
  pharmacyState?: string;
  title?: string;
  ncpdp?: string;
  pharmacyWebsite?: IPharmacyWebsite;
  openStatus?: string;
  hideLinkButtons?: boolean;
  isMailOrderOnly?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  isSkeleton?: boolean;
}

export const PrescriptionPharmacyInfo: FunctionComponent<IPrescriptionPharmacyInfoProps> =
  ({
    phoneNumber = '',
    pharmacyAddress1,
    pharmacyCity,
    pharmacyZipCode,
    pharmacyState,
    title,
    ncpdp,
    pharmacyWebsite,
    openStatus,
    hideLinkButtons,
    isMailOrderOnly,
    viewStyle,
    isSkeleton,
  }) => {
    const navigation = useNavigation<RootStackNavigationProp>();

    const { dispatch: reduxDispatch, getState: reduxGetState } =
      useReduxContext();

    const { membershipDispatch } = useMembershipContext();

    const onAddressPress = (): void => {
      if (
        pharmacyAddress1 &&
        pharmacyCity &&
        pharmacyState &&
        pharmacyZipCode
      ) {
        const url = MapUrlHelper.getUrl(
          pharmacyAddress1,
          pharmacyCity,
          pharmacyState,
          pharmacyZipCode
        );
        goToUrl(url);
      }
    };

    const onPhonePress = async () => {
      await callPhoneNumber(phoneNumber);
    };

    const onWebsitePress = async () => {
      if (!pharmacyWebsite?.url) {
        return;
      }

      await goToUrl(pharmacyWebsite.url);
    };

    const titleContent = title ? (
      <ProtectedBaseText
        weight='semiBold'
        style={prescriptionPharmacyInfoStyles.titleTextStyle}
        isSkeleton={isSkeleton}
        skeletonWidth='long'
      >
        {title}
      </ProtectedBaseText>
    ) : null;

    const onFavoriteIconButtonPress = async () => {
      if (ncpdp)
        await favoritePharmacyAsyncAction({
          ncpdp,
          navigation,
          reduxDispatch,
          reduxGetState,
          membershipDispatch,
        });
    };

    const titleContentWithFavorite = (
      <View
        style={prescriptionPharmacyInfoStyles.titleContentWithFavoriteViewStyle}
      >
        {titleContent}
        {ncpdp && (
          <FavoriteIconButton
            onPress={onFavoriteIconButtonPress}
            ncpdp={ncpdp}
            testID='favoriteIconButtonOnPrescriptionPharmacyInfo'
            viewStyle={
              prescriptionPharmacyInfoStyles.favoriteIconButtonViewStyle
            }
          />
        )}
      </View>
    );

    const currentTitleContent =
      title && ncpdp ? titleContentWithFavorite : titleContent;

    const openStatusContent = openStatus ? (
      <View style={prescriptionPharmacyInfoStyles.rowViewStyle}>
        <BaseText isSkeleton={isSkeleton} skeletonWidth='short'>
          {openStatus}
        </BaseText>
      </View>
    ) : null;

    const formattedPharmacyZipCode = formatZipCode(pharmacyZipCode ?? '');

    const address = `${pharmacyAddress1} ${pharmacyCity}, ${pharmacyState} ${formattedPharmacyZipCode}`;
    const addressContent =
      !isMailOrderOnly && pharmacyAddress1 ? (
        hideLinkButtons ? (
          <View style={prescriptionPharmacyInfoStyles.rowViewStyle}>
            <ProtectedBaseText
              isSkeleton={isSkeleton}
              skeletonWidth='medium'
              style={prescriptionPharmacyInfoStyles.commonTextStyle}
            >
              {address}
            </ProtectedBaseText>
          </View>
        ) : (
          <TouchableOpacity
            style={prescriptionPharmacyInfoStyles.rowViewStyle}
            onPress={onAddressPress}
            testID='prescriptionPharmacyInfoAddressTouchable'
          >
            <FontAwesomeIcon
              name='map-marker-alt'
              size={IconSize.regular}
              style={prescriptionPharmacyInfoStyles.iconTextStyle}
            />
            <ProtectedBaseText
              isSkeleton={isSkeleton}
              skeletonWidth='medium'
              style={prescriptionPharmacyInfoStyles.commonTextStyle}
            >
              {address}
            </ProtectedBaseText>
          </TouchableOpacity>
        )
      ) : null;

    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    const phoneNumberContent = phoneNumber ? (
      hideLinkButtons ? (
        <View style={prescriptionPharmacyInfoStyles.rowViewStyle}>
          <BaseText
            isSkeleton={isSkeleton}
            skeletonWidth='medium'
            style={prescriptionPharmacyInfoStyles.commonTextStyle}
          >
            {formattedPhoneNumber}
          </BaseText>
        </View>
      ) : (
        <TouchableOpacity
          style={prescriptionPharmacyInfoStyles.rowViewStyle}
          onPress={onPhonePress}
          testID='prescriptionPharmacyInfoPhoneNumberTouchable'
        >
          <FontAwesomeIcon
            name='phone-alt'
            size={IconSize.regular}
            style={prescriptionPharmacyInfoStyles.phoneIconTextStyle}
          />
          <BaseText
            isSkeleton={isSkeleton}
            skeletonWidth='medium'
            style={prescriptionPharmacyInfoStyles.commonTextStyle}
          >
            {formattedPhoneNumber}
          </BaseText>
        </TouchableOpacity>
      )
    ) : null;

    const websiteContent = pharmacyWebsite ? (
      hideLinkButtons ? (
        <View style={prescriptionPharmacyInfoStyles.rowViewStyle}>
          <ProtectedBaseText
            isSkeleton={isSkeleton}
            skeletonWidth='medium'
            style={prescriptionPharmacyInfoStyles.commonTextStyle}
          >
            {pharmacyWebsite.url}
          </ProtectedBaseText>
        </View>
      ) : (
        <TouchableOpacity
          style={prescriptionPharmacyInfoStyles.rowViewStyle}
          onPress={onWebsitePress}
          testID='prescriptionPharmacyInfoWebsiteTouchable'
        >
          <FontAwesomeIcon
            name='globe-americas'
            solid={true}
            style={prescriptionPharmacyInfoStyles.iconTextStyle}
          />
          <BaseText
            isSkeleton={isSkeleton}
            skeletonWidth='medium'
            style={prescriptionPharmacyInfoStyles.commonTextStyle}
          >
            {pharmacyWebsite.label}
          </BaseText>
        </TouchableOpacity>
      )
    ) : null;

    return (
      <View style={viewStyle}>
        {currentTitleContent}
        {addressContent}
        {phoneNumberContent}
        {websiteContent}
        {openStatusContent}
      </View>
    );
  };
