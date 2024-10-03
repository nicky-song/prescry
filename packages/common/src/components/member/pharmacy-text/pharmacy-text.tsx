// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ITransferFlowContent } from '../../../experiences/guest-experience/screens/shopping/order-preview/transfer-flow.ui-content.model';
import { BaseText } from '../../text/base-text/base-text';
import { Heading } from '../heading/heading';
import { pharmacyTextStyles as styles } from './pharmacy-text.style';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { FavoriteIconButton } from '../../buttons/favorite-icon/favorite-icon.button';

export interface IPharmacyTextProps {
  pharmacy: string;
  ncpdp?: string;
  onFavoriteIconButtonPress?: () => Promise<void>;
  alternative?: ReactNode;
  headingLevel?: number;
  hasCoupon?: boolean;
}

export const PharmacyText = (props: IPharmacyTextProps) => {
  const {
    membershipState: {
      account: { favoritedPharmacies },
    },
  } = useMembershipContext();

  const favoriteIconButton = props.ncpdp && props.onFavoriteIconButtonPress && (
    <FavoriteIconButton
      key={`${favoritedPharmacies}${props.ncpdp}`}
      onPress={props.onFavoriteIconButtonPress}
      ncpdp={props.ncpdp}
      testID='favoriteIconButtonOnPharmacyText'
      viewStyle={styles.favoriteIconButtonViewStyle}
    />
  );

  const title = props.pharmacy.toUpperCase();

  const groupKey = CmsGroupKey.transferFlow;

  const { content, isContentLoading } = useContent<ITransferFlowContent>(
    groupKey,
    2
  );

  const defaultContent = props.hasCoupon
    ? content.couponDeliveryInfoDescription
    : content.deliveryInfoDescription;

  const description = props.alternative || defaultContent;

  const headingLevel =
    props.headingLevel === undefined ? 1 : props.headingLevel;

  return (
    <View style={styles.parentViewStyle} testID={'pharmacyTextParentView'}>
      <View style={styles.headingViewStyle}>
        <Heading
          level={headingLevel}
          isSkeleton={isContentLoading}
          skeletonWidth='long'
          translateContent={false}
        >
          {title}
        </Heading>
        {favoriteIconButton}
      </View>
      <BaseText
        style={styles.descriptionTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {description}
      </BaseText>
    </View>
  );
};
