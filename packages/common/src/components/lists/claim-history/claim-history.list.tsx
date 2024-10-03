// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IClaim } from '../../../models/claim';
import { ClaimHistoryCard } from '../../member/cards/claim-history/claim-history.card';
import { List } from '../../primitives/list';
import { claimHistoryListStyles } from './claim-history.list.styles';

export interface IClaimHistoryListProps {
  viewStyle?: StyleProp<ViewStyle>;
  claims: IClaim[];
  testID?: string;
}

export const ClaimHistoryList = ({
  viewStyle,
  claims,
  testID = 'claimHistoryList',
}: IClaimHistoryListProps): ReactElement => {
  const styles = claimHistoryListStyles;

  const claimHistoryCards: ReactNode[] = claims.map((claim, index) => {
    const viewStyle =
      index === 0 ? styles.firstCardViewStyle : styles.cardViewStyle;

    const isLastCard = index === claims.length - 1;

    return (
      <ClaimHistoryCard
        key={claim.prescriptionId}
        claim={claim}
        viewStyle={viewStyle}
        testID={`${testID}-${claim.prescriptionId}`}
        hideLine={isLastCard}
      />
    );
  });
  return (
    <List style={viewStyle} testID={testID}>
      {claimHistoryCards}
    </List>
  );
};
