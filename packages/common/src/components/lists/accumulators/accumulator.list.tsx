// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IAccumulators } from '../../../models/accumulators';
import { AccumulatorsCard } from '../../member/cards/accumulators/accumulators.card';
import { List } from '../../primitives/list';
import { accumulatorListStyles } from './accumulator.list.styles';

export interface IAccumulatorListProps {
  viewStyle?: StyleProp<ViewStyle>;
  accumulators: IAccumulators;
  testID?: string;
}

export const AccumulatorList = ({
  viewStyle,
  accumulators,
  testID = 'accumulatorList',
}: IAccumulatorListProps): ReactElement => {
  const styles = accumulatorListStyles;

  const familyCardViewStyle = styles.accumulatorCardViewStyle;

  const individualAccumulatorCards = (
    <AccumulatorsCard
      key='individual'
      category='individual'
      deductible={accumulators.individualDeductible}
      outOfPocket={accumulators.individualOutOfPocket}
    />
  );

  const familyAccumulatorCards = (
    <AccumulatorsCard
      key='family'
      category='family'
      deductible={accumulators.familyDeductible}
      outOfPocket={accumulators.familyOutOfPocket}
      viewStyle={familyCardViewStyle}
    />
  );

  return (
    <List style={viewStyle} testID={testID}>
      {individualAccumulatorCards}
      {familyAccumulatorCards}
    </List>
  );
};
