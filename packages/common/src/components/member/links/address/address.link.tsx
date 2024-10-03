// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { goToUrl } from '../../../../utils/link.helper';
import { MapUrlHelper } from '../../../../utils/map-url.helper';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';
import { InlineLink } from '../inline/inline.link';

export interface IAddressLinkProps {
  formattedAddress: string;
  viewStyle?: StyleProp<ViewStyle>;
}

export const AddressLink = ({
  formattedAddress,
  viewStyle,
}: IAddressLinkProps) => {
  const onAddressPress = async () => {
    const formattedURL = MapUrlHelper.getUrl(formattedAddress).replace(
      ' ',
      '+'
    );

    await goToUrl(formattedURL);
  };

  return (
    // Note: This BaseText is ugly but important.  Without it, if the AddressLink parent
    // is a flex container, the link gets treated as a block element instead of inline
    // and, with wrapping, we end up with one underline for the whole block instead of the
    // underline wrapping with the text.
    <ProtectedBaseText>
      <InlineLink onPress={onAddressPress} textStyle={viewStyle}>
        {formattedAddress}
      </InlineLink>
    </ProtectedBaseText>
  );
};
