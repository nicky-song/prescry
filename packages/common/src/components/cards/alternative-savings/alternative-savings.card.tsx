// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { NotificationColor } from '../../../theming/colors';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { ChevronCard } from '../chevron/chevron.card';
import { IAlternativeSavingsCardContent } from './alternative-savings.card.content';
import { alternativeSavingsCardStyles as styles } from './alternative-savings.card.styles';

export interface IAlternativeSavingsCardProps {
  onPress: () => void;
  savingsAmount: number;
  viewStyle?: StyleProp<ViewStyle>;
}

export const AlternativeSavingsCard = ({
  onPress,
  savingsAmount,
  viewStyle,
}: IAlternativeSavingsCardProps): ReactElement => {
  const { content } = useContent<IAlternativeSavingsCardContent>(
    CmsGroupKey.alternativeSavingsCard,
    2
  );

  const formattedSavingsAmount = MoneyFormatter.format(savingsAmount, true);

  const message = StringFormatter.format(
    content.message,
    new Map([['savingsAmount', formattedSavingsAmount]])
  );

  return (
    <ChevronCard onPress={onPress} viewStyle={[styles.viewStyle, viewStyle]}>
      <View style={styles.contentViewStyle}>
        <FontAwesomeIcon
          name='usd-circle'
          solid={true}
          size={17}
          color={NotificationColor.darkGreen}
        />
        <BaseText style={styles.messageTextStyle}>{message}</BaseText>
      </View>
    </ChevronCard>
  );
};
