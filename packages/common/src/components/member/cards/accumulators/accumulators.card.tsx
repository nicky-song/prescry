// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IAccumulatorValue } from '../../../../models/accumulators';
import { StrokeCard } from '../../../cards/stroke/stroke.card';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { AccumulatorProgressBar } from '../../../progress-bars/accumulator/accumulator.progress-bar';
import { BaseText } from '../../../text/base-text/base-text';
import { LineSeparator } from '../../line-separator/line-separator';
import { IAccumulatorsCardContent } from './accumulators.card.content';
import { accumulatorsCardStyles } from './accumulators.card.styles';

export type AccumulatorsCategory = 'individual' | 'family';

export interface IAccumulatorsCardProps {
  viewStyle?: StyleProp<ViewStyle>;
  category: AccumulatorsCategory;
  deductible: IAccumulatorValue;
  outOfPocket: IAccumulatorValue;
}

export const AccumulatorsCard = ({
  viewStyle,
  category,
  deductible,
  outOfPocket,
}: IAccumulatorsCardProps): ReactElement => {
  const styles = accumulatorsCardStyles;

  const { content, isContentLoading } = useContent<IAccumulatorsCardContent>(
    CmsGroupKey.accumulatorsCard,
    2
  );

  const categoryLabel =
    category === 'individual' ? content.individual : content.family;
  const iconName = category === 'individual' ? 'user' : 'users';

  const deductibleProgressBar = deductible.maximum ? (
    <AccumulatorProgressBar
      title={content.deductible}
      maxValue={deductible.maximum}
      value={deductible.used}
      viewStyle={styles.progressBarViewStyle}
      isSkeleton={isContentLoading}
    />
  ) : null;

  const outOfPocketProgressBar = (
    <AccumulatorProgressBar
      title={content.maxOutOfPocket}
      maxValue={outOfPocket.maximum}
      value={outOfPocket.used}
      viewStyle={styles.progressBarViewStyle}
      isSkeleton={isContentLoading}
    />
  );

  const testId = `accumulatorsCard-${category}`;

  return (
    <StrokeCard viewStyle={viewStyle} testID={testId}>
      <View style={styles.categoryContainerViewStyle}>
        <FontAwesomeIcon name={iconName} style={styles.categoryIconTextStyle} />
        <BaseText
          style={styles.categoryLabelTextStyle}
          isSkeleton={isContentLoading}
        >
          {categoryLabel}
        </BaseText>
      </View>
      <LineSeparator viewStyle={styles.separatorViewStyle} />
      {deductibleProgressBar}
      {outOfPocketProgressBar}
    </StrokeCard>
  );
};
