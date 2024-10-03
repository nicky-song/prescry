// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { isDesktopDevice } from '../../../utils/responsive-screen.helper';
import { SearchButton } from '../../buttons/search/search.button';
import { BaseText } from '../../text/base-text/base-text';
import { getDrugSearchCardStyles } from './drug-search-card.style';

export interface IDrugSearchCardProps {
  buttonLabel: string;
  title?: string;
  subtitle?: string;
  onSearchPress: () => void;
  viewStyle?: StyleProp<ViewStyle>;
}

export const DrugSearchCard = ({
  title,
  subtitle,
  buttonLabel,
  onSearchPress,
  viewStyle,
}: IDrugSearchCardProps): ReactElement => {
  const isDesktop = isDesktopDevice();
  const styles = getDrugSearchCardStyles(isDesktop);
  return (
    <View style={[styles.cardContainerViewStyle, viewStyle]}>
      <BaseText style={styles.titleTextStyle}>{title}</BaseText>
      <BaseText style={styles.subtitleTextStyle}>{subtitle}</BaseText>
      <View style={styles.searchButtonContainerViewStyle}>
        <SearchButton
          onPress={onSearchPress}
          label={buttonLabel}
          testID='drugSearchCardSearchButton'
        />
      </View>
    </View>
  );
};
