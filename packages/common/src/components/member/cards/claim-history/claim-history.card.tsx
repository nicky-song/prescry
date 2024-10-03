// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { IClaim } from '../../../../models/claim';
import dateFormatter from '../../../../utils/formatters/date.formatter';
import { MoneyFormatter } from '../../../../utils/formatters/money-formatter';
import { ExpandableCard } from '../../../cards/expandable/expandable.card';
import { PrescriptionPriceContainer } from '../../../containers/prescription-price/prescription-price.container';
import { ValueText } from '../../../text/value/value.text';
import { BaseText } from '../../../text/base-text/base-text';
import { ConfirmedAmountText } from '../../../text/confirmed-amount/confirmed-amount.text';
import { DrugDetailsText } from '../../../text/drug-details/drug-details.text';
import { claimHistoryCardStyles } from './claim-history.card.styles';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IClaimHistoryCardContent } from './claim-history.card.content';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { formatPhoneNumber } from '../../../../utils/formatters/phone-number.formatter';

export interface IClaimHistoryCardProps {
  viewStyle?: StyleProp<ViewStyle>;
  claim: IClaim;
  testID?: string;
  hideLine?: boolean;
}

export const ClaimHistoryCard = ({
  viewStyle,
  claim,
  testID = 'claimHistoryCard',
  hideLine,
}: IClaimHistoryCardProps): ReactElement => {
  const { content, isContentLoading } = useContent<IClaimHistoryCardContent>(
    CmsGroupKey.claimHistoryCard,
    2
  );

  const {
    drugName,
    strength,
    quantity,
    formCode,
    daysSupply,
    billing: { memberPays, deductibleApplied },
    filledOn,
    pharmacy: { name: pharmacyName, phoneNumber },
    orderNumber,
  } = claim;
  const styles = claimHistoryCardStyles;

  const formattedFilledOn = filledOn
    ? dateFormatter.formatToMMDDYYYY(filledOn)
    : '';

  const pharmacyPhoneNumberElement = phoneNumber ? (
    <ValueText>{formatPhoneNumber(phoneNumber)}</ValueText>
  ) : null;

  const formattedMemberPays = MoneyFormatter.format(memberPays);

  const collapsedContent = (
    <View testID={`${testID}CollapsedContent`}>
      <DrugDetailsText
        formCode={formCode}
        quantity={quantity}
        strength={strength}
        supply={daysSupply}
      />
      <View
        style={[
          styles.rowContainerViewStyle,
          styles.collapseFilledOnDateViewStyle,
        ]}
      >
        <BaseText isSkeleton={isContentLoading}>
          {content.dateFilledLabel}
        </BaseText>
        <ValueText>{formattedFilledOn}</ValueText>
      </View>
      <PrescriptionPriceContainer>
        <BaseText>{content.youPaidLabel}</BaseText>
        <ConfirmedAmountText>{formattedMemberPays}</ConfirmedAmountText>
      </PrescriptionPriceContainer>
    </View>
  );

  const formattedDeductibleApplied = MoneyFormatter.format(deductibleApplied);

  const orderNumberRow = orderNumber ? (
    <View style={styles.colContainerViewStyle}>
      <BaseText isSkeleton={isContentLoading}>{content.orderNumber}</BaseText>
      <ValueText>{orderNumber}</ValueText>
    </View>
  ) : null;

  const expandedContent = (
    <View testID={`${testID}ExpandedContent`}>
      <DrugDetailsText
        formCode={formCode}
        quantity={quantity}
        strength={strength}
        supply={daysSupply}
      />
      <View style={styles.rowContainerViewStyle}>
        <BaseText isSkeleton={isContentLoading}>
          {content.dateFilledLabel}
        </BaseText>
        <ValueText>{formattedFilledOn}</ValueText>
      </View>
      <View style={styles.colContainerViewStyle}>
        <BaseText isSkeleton={isContentLoading}>{content.pharmacy}</BaseText>
        <ValueText translateContent={false}>{pharmacyName}</ValueText>
        {pharmacyPhoneNumberElement}
      </View>
      {orderNumberRow}
      <View style={styles.colContainerViewStyle}>
        <BaseText isSkeleton={isContentLoading}>
          {content.deductibleApplied}
        </BaseText>
        <ValueText>{formattedDeductibleApplied}</ValueText>
      </View>
      <PrescriptionPriceContainer viewStyle={styles.expandedPriceViewStyle}>
        <BaseText>{content.youPaidLabel}</BaseText>
        <ConfirmedAmountText isSkeleton={isContentLoading}>
          {formattedMemberPays}
        </ConfirmedAmountText>
      </PrescriptionPriceContainer>
    </View>
  );

  return (
    <ExpandableCard
      viewStyle={viewStyle}
      collapsedTitle={drugName}
      collapsedContent={collapsedContent}
      expandedContent={expandedContent}
      testID={testID}
      hideLine={hideLine}
      translateTitleContent={false}
    />
  );
};
