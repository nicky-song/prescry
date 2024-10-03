// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IPrescriptionInfo } from '../../../../models/prescription-info';
import {
  ActionRank,
  CallToActionCard,
} from '../../../cards/call-to-action/call-to-action.card';
import { IBaseTagProps } from '../../../tags/base/base.tag';
import { DrugDetailsText } from '../../../text/drug-details/drug-details.text';
import { IPrescriptionCardContent } from './prescription.card.content';

export interface IPrescriptionCardProps {
  viewStyle?: StyleProp<ViewStyle>;
  onActionPress: () => void;
  prescription: IPrescriptionInfo;
  content: IPrescriptionCardContent;
  isContentLoading?: boolean;
  headingLevel?: number;
  testID?: string;
  hideLine?: boolean;
}

export const PrescriptionCard = ({
  viewStyle,
  onActionPress,
  prescription,
  content,
  isContentLoading,
  headingLevel = 3,
  testID = 'prescriptionCard',
  hideLine,
}: IPrescriptionCardProps): ReactElement => {
  const {
    strength,
    unit,
    quantity,
    form,
    refills,
    authoredOn,
    organizationId: pharmacyId,
  } = prescription;

  const isSent = !!pharmacyId;

  const statusTag: IBaseTagProps = {
    label: isSent ? content.statusTagSent : content.statusTagNotSent,
    isSkeleton: isContentLoading,
  };

  const actionLabel = isSent
    ? content.actionLabelSent
    : content.actionLabelNotSent;
  const actionRank: ActionRank = isSent ? 'secondary' : 'primary';

  return (
    <CallToActionCard
      title={prescription.drugName}
      tags={[statusTag]}
      onActionPress={onActionPress}
      actionLabel={actionLabel}
      actionRank={actionRank}
      viewStyle={viewStyle}
      testID={testID}
      isSkeleton={isContentLoading}
      headingLevel={headingLevel}
      hideLine={hideLine}
      translateTitle={false}
    >
      <DrugDetailsText
        strength={strength}
        unit={unit}
        quantity={quantity}
        formCode={form}
        refills={refills}
        authoredOn={authoredOn}
      />
    </CallToActionCard>
  );
};
