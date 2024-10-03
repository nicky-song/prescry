// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IPrescriptionInfo } from '../../../models/prescription-info';
import { PrescriptionCard } from '../../member/cards/prescription/prescription.card';
import { IPrescriptionCardContent } from '../../member/cards/prescription/prescription.card.content';
import { Heading } from '../../member/heading/heading';
import { List } from '../../primitives/list';
import { prescriptionListStyles } from './prescription.list.styles';

export interface IPrescriptionListProps {
  viewStyle?: StyleProp<ViewStyle>;
  title?: string;
  headingLevel?: number;
  prescriptions: IPrescriptionInfo[];
  onPrescriptionSelect: (prescriptionId: string, blockchain?: boolean) => void;
  isSkeleton?: boolean;
  testID?: string;
}

export const PrescriptionList = ({
  viewStyle,
  title,
  headingLevel = 2,
  prescriptions,
  isSkeleton,
  onPrescriptionSelect,
  testID = 'prescriptionList',
}: IPrescriptionListProps): ReactElement => {
  const prescriptionCardGroupKey = CmsGroupKey.prescriptionCard;

  const {
    content: prescriptionCardContent,
    isContentLoading: prescriptionCardIsContentLoading,
  } = useContent<IPrescriptionCardContent>(prescriptionCardGroupKey, 2);

  const styles = prescriptionListStyles;

  const cardHeadingLevel = title ? headingLevel + 1 : headingLevel;

  const heading = title ? (
    <Heading
      level={headingLevel}
      isSkeleton={isSkeleton}
      textStyle={styles.titleTextStyle}
    >
      {title}
    </Heading>
  ) : null;

  const prescriptionCards: ReactNode[] = prescriptions.map(
    (prescription, index) => {
      const onActionPress = () =>
        onPrescriptionSelect(
          prescription.prescriptionId,
          prescription.blockchain
        );

      const viewStyle =
        index === 0
          ? styles.prescriptionCardFirstViewStyle
          : styles.prescriptionCardViewStyle;

      const isLastCard = index === prescriptions.length - 1;

      return (
        <PrescriptionCard
          key={prescription.prescriptionId}
          onActionPress={onActionPress}
          prescription={prescription}
          headingLevel={cardHeadingLevel}
          viewStyle={viewStyle}
          testID={`${testID}-${prescription.prescriptionId}`}
          hideLine={isLastCard}
          content={prescriptionCardContent}
          isContentLoading={prescriptionCardIsContentLoading}
        />
      );
    }
  );

  return (
    <View style={viewStyle} testID={testID}>
      {heading}
      <List>{prescriptionCards}</List>
    </View>
  );
};
