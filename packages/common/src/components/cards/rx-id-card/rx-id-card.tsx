// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import { useMediaQueryContext } from '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook';
import { useCobrandingContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-cobranding-content';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IPrimaryProfile } from '../../../models/member-profile/member-profile-info';
import { RxCardType } from '../../../models/rx-id-card';
import { SmartPriceConstants } from '../../../models/smartprice-constants';
import { MemberNameFormatter } from '../../../utils/formatters/member-name-formatter';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { ImageAsset } from '../../image-asset/image-asset';
import { RemoteImageAsset } from '../../remote-image-asset/remote-image-asset';
import { BaseText } from '../../text/base-text/base-text';
import { RxLabelWithValue } from '../../text/rx-label-with-value/rx-label-with-value';
import { IRxIdCardContent } from './rx-id-card.content';
import { rxIdCardStyles } from './rx-id-card.styles';

export interface IRxIdCardProps {
  profile?: IPrimaryProfile;
  rxCardType: RxCardType;
  viewStyle?: StyleProp<ViewStyle>;
}

export const RxIdCard = ({
  profile,
  rxCardType,
  viewStyle,
}: IRxIdCardProps): ReactElement => {
  const isPbm = rxCardType === 'pbm';
  const isSmartPrice = rxCardType === 'smartPrice';

  const groupKey = CmsGroupKey.rxIdCardContent;

  const {
    content: {
      rxBenefitsLabel,
      rxSavingsLabel,
      idLabel,
      groupLabel,
      binLabel,
      pcnLabel,
      unauthMessage,
      memberIdLabel,
    },
    isContentLoading,
  } = useContent<IRxIdCardContent>(groupKey, 2);

  const {
    brokerAssociation,
    firstName,
    lastName,
    primaryMemberFamilyId,
    primaryMemberRxId,
    rxGroup,
    rxBin,
    carrierPCN,
  } = profile ?? {
    rxGroup: SmartPriceConstants.group,
    rxBin: SmartPriceConstants.bin,
    carrierPCN: SmartPriceConstants.pcn,
  };

  const name = MemberNameFormatter.formatName(firstName, lastName);

  const memberId = primaryMemberFamilyId
    ? primaryMemberFamilyId
    : primaryMemberRxId;

  const { windowWidth } = useMediaQueryContext();

  const { idCardLogo } = useCobrandingContent(rxGroup, brokerAssociation);

  const styles = rxIdCardStyles(windowWidth);

  const renderHeaderAnnotationContent = (): ReactNode => {
    if (idCardLogo && !isSmartPrice) {
      return (
        <RemoteImageAsset uri={idCardLogo} style={styles.providerImageStyle} />
      );
    } else if (isSmartPrice) {
      return (
        <BaseText
          style={[styles.headerTextStyle, styles.headerSmartPriceTextStyle]}
          isSkeleton={isContentLoading}
          skeletonWidth='medium'
        >
          {rxSavingsLabel}
        </BaseText>
      );
    } else if (isPbm) {
      return (
        <BaseText
          style={[styles.headerTextStyle, styles.headerPbmTextStyle]}
          isSkeleton={isContentLoading}
          skeletonWidth='medium'
        >
          {rxBenefitsLabel}
        </BaseText>
      );
    }

    return null;
  };

  const cardHeader = (
    <View style={styles.headerViewStyle} testID='rxIdCardHeader'>
      <View style={styles.logoContainerViewStyle}>
        <ImageAsset
          name='prescryptiveBrandWhite'
          style={styles.logoImageStyle}
          resizeMethod='scale'
        />
      </View>
      <View style={styles.providerImageContainer}>
        {renderHeaderAnnotationContent()}
      </View>
    </View>
  );

  const labelWithCobranding = () => {
    if (idCardLogo && isPbm)
      return (
        <BaseText
          style={styles.cobrandingPbmTextStyle}
          isSkeleton={isContentLoading}
          skeletonWidth='medium'
        >
          {rxBenefitsLabel}
        </BaseText>
      );

    return <View style={styles.bottomSpacingViewStyle} />;
  };

  const headingTextStyle = isPbm
    ? styles.pbmNameTextStyle
    : styles.smartPriceNameTextStyle;

  const idLabelTextStyle = isPbm
    ? styles.pbmIdLabelTextStyle
    : styles.smartPriceIdLabelTextStyle;

  const idTextStyle = isPbm
    ? styles.pbmIdTextStyle
    : styles.smartPriceIdTextStyle;

  const bodyHeading =
    name && memberId ? (
      <BaseText style={headingTextStyle}>{name}</BaseText>
    ) : (
      <BaseText style={styles.memberIdTextStyle}>{memberIdLabel}</BaseText>
    );

  const bodyID =
    name && memberId ? (
      <View style={styles.idViewStyle}>
        <BaseText style={idLabelTextStyle} isSkeleton={isContentLoading}>
          {idLabel}
        </BaseText>
        <ProtectedView style={styles.idTextViewStyle}>
          <BaseText style={idTextStyle}>{memberId}</BaseText>
        </ProtectedView>
      </View>
    ) : (
      <BaseText style={styles.unauthMessageTextStyle}>{unauthMessage}</BaseText>
    );

  const cardBody = (
    <View style={styles.bodyContainerViewStyle} testID='rxIdCardBody'>
      {bodyHeading}
      {bodyID}
      <View style={[styles.rxViewStyle, styles.rxViewStyleWithLabel]}>
        {rxGroup && (
          <RxLabelWithValue
            label={groupLabel}
            value={rxGroup}
            isSkeleton={isContentLoading}
            rxType={rxCardType}
          />
        )}
        {rxBin && (
          <RxLabelWithValue
            label={binLabel}
            value={rxBin}
            isSkeleton={isContentLoading}
            rxType={rxCardType}
          />
        )}
        {carrierPCN && (
          <RxLabelWithValue
            label={pcnLabel}
            value={carrierPCN}
            isSkeleton={isContentLoading}
            rxType={rxCardType}
          />
        )}
      </View>
      {labelWithCobranding()}
    </View>
  );

  const backgroundImage =
    rxCardType === 'pbm' ? (
      <ImageAsset
        name='rxIdCardFlower'
        resizeMethod='scale'
        style={styles.pbmBackgroundImageStyle}
      />
    ) : (
      <ImageAsset
        name='rxIdSavingsCardPattern'
        resizeMethod='scale'
        style={styles.smartPriceBackgroundImageStyle}
      />
    );

  const cardColorStyle =
    rxCardType === 'pbm'
      ? styles.containerPbmViewStyle
      : styles.containerSmartPriceViewStyle;

  return (
    <View
      style={[styles.containerViewStyle, cardColorStyle, viewStyle]}
      testID='rxIdCard'
    >
      {backgroundImage}
      {cardHeader}
      {cardBody}
    </View>
  );
};
