// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { formatAddressWithoutStateZip } from '../../../../utils/formatters/address.formatter';
import { pharmacySearchResultListItemStyle as styles } from '../pharmacy-search-result-item/pharmacy-search-result-item.style';
import { IProviderLocationDetails } from '../../../../models/api-response/provider-location-response';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { ProtectedView } from '../../../containers/protected-view/protected-view';
import { TranslatableBaseText } from '../../../text/translated-base-text/translatable-base-text';

export interface IPharmacyListItemProps {
  item: IProviderLocationDetails;
  navigateToPharmacyInformation: () => void;
  viewStyle?: StyleProp<ViewStyle>;
}

export const PharmacySearchResultItem = (props: IPharmacyListItemProps) => {
  const { item, navigateToPharmacyInformation, viewStyle } = props;

  const formattedAddress = formatAddressWithoutStateZip(item);
  const formattedPriceText =
    item.price && !isNaN(parseFloat(item.price)) ? (
      <TranslatableBaseText style={styles.priceTextStyle}>
        {`$${(parseFloat(item.price) / 100.0).toFixed(2)}`}
      </TranslatableBaseText>
    ) : null;

  return (
    <TouchableOpacity
      testID={`pharmacySearchResultItem-${item.id}`}
      key={item.id}
      style={[styles.containerViewStyle, viewStyle]}
      onPress={navigateToPharmacyInformation}
    >
      <ProtectedView style={styles.textContainerViewStyle}>
        <View style={styles.priceViewStyle}>
          <Text style={styles.headerTextStyle}>{item.providerName}</Text>
          {formattedPriceText}
        </View>
        <View style={styles.addressContainerViewStyle}>
          <Text style={styles.addressTextStyle}>{formattedAddress}</Text>
          <Text style={styles.phoneTextStyle}>{item.phoneNumber}</Text>
          <TranslatableBaseText
            style={styles.distanceTextStyle}
          >{`${item.distance} mi.`}</TranslatableBaseText>
        </View>
      </ProtectedView>
      <View style={styles.iconContainerViewStyle}>
        <View style={styles.iconViewStyle}>
          <FontAwesomeIcon name='chevron-right' style={styles.iconStyle} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
