// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, useState } from 'react';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { configureFiltersScreenStyles as styles } from './configure-filters.screen.styles';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { Heading } from '../../../../../components/member/heading/heading';
import {
  defaultDistanceSliderMaximumPosition,
  DistanceSlider,
} from '../../../../../components/sliders/distance/distance.slider';
import { RadioButtonToggle } from '../../../../../components/member/radio-button-toggle/radio-button-toggle';
import { LineSeparator } from '../../../../../components/member/line-separator/line-separator';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { configureFiltersScreenContent as content } from './configure-filters.screen.content';
import { distanceSliderContent } from '../../../../../components/sliders/distance/distance.slider.content';
import {
  ConfigureFiltersRouteProp,
  RootStackNavigationProp,
} from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation, useRoute } from '@react-navigation/native';
import { setFilterPreferencesDispatch } from '../../../state/session/dispatch/set-filter-preferences.dispatch';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';

export enum SortOptionValue {
  distance = 0,
  youpay = 1,
  planpays = 2,
}

export type SortByOption = 'distance' | 'youpay' | 'planpays';

export interface ISortOptions {
  label: string;
  value: SortOptionValue;
  sortBy: SortByOption;
}
export interface IConfigureFiltersScreenRouteProps {
  sortOptions: ISortOptions[];
  defaultSort: SortByOption;
  defaultDistanceSliderPosition: number;
  minimumDistanceSliderPosition?: number;
  maximumDistanceSliderPosition?: number;
  distanceUnit?: string;
}

export const ConfigureFiltersScreen = (): ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { params } = useRoute<ConfigureFiltersRouteProp>();
  const { sessionDispatch } = useSessionContext();
  const {
    sortOptions,
    defaultSort,
    defaultDistanceSliderPosition,
    minimumDistanceSliderPosition,
    maximumDistanceSliderPosition = defaultDistanceSliderMaximumPosition,
    distanceUnit = distanceSliderContent.defaultUnit,
  } = params;

  const [currentSort, setCurrentSort] = useState<SortByOption>(defaultSort);
  const [currentDistance, setCurrentDistance] = useState<number>(
    defaultDistanceSliderPosition
  );
  const defaultSelectedOptionValue =
    sortOptions.find((x) => x.sortBy === defaultSort)?.value ?? 0;
  const isApplyButtonDisabled =
    currentSort === defaultSort &&
    currentDistance === defaultDistanceSliderPosition;

  const selectSort = (selection: SortOptionValue) => {
    const selectedOption = sortOptions.find((x) => x.value === selection);
    if (selectedOption) {
      setCurrentSort(selectedOption.sortBy);
    }
  };

  const selectDistance = (selection: number) => {
    setCurrentDistance(selection);
  };

  const onApplyPress = () => {
    setFilterPreferencesDispatch(sessionDispatch, currentSort, currentDistance);
    navigation.goBack();
  };

  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);

  const onSliderChange = (status: 'started' | 'stopped' | 'sliding') => {
    if (status === 'started' || status === 'sliding') {
      setScrollEnabled(false);
    } else if (status === 'stopped') {
      setScrollEnabled(true);
    }
  };

  const body = (
    <BodyContentContainer viewStyle={styles.bodyContentContainerViewStyle}>
      <Heading textStyle={styles.headingTextStyle}>
        {content.filterByLabel}
      </Heading>
      <BaseText style={styles.labelTextStyle}>
        {content.distanceRange(maximumDistanceSliderPosition, distanceUnit)}
      </BaseText>
      <DistanceSlider
        defaultPosition={defaultDistanceSliderPosition}
        minimumPosition={minimumDistanceSliderPosition}
        maximumPosition={maximumDistanceSliderPosition}
        unit={distanceUnit}
        onSelectedValue={selectDistance}
        onSliderChange={onSliderChange}
      />
      <LineSeparator viewStyle={styles.lineSeparatorViewStyle} />
      <Heading textStyle={styles.headingTextStyle}>
        {content.sortByLabel}
      </Heading>
      {sortOptions.length ? (
        <RadioButtonToggle
          onOptionSelected={selectSort}
          options={sortOptions}
          defaultSelectedOption={defaultSelectedOptionValue}
          buttonViewStyle={styles.radioButtonViewStyle}
          viewStyle={styles.radioButtonToggleViewStyle}
          checkBoxContainerViewStyle={styles.checkBoxContainerViewStyle}
        />
      ) : null}
    </BodyContentContainer>
  );

  const footer = (
    <BaseButton disabled={isApplyButtonDisabled} onPress={onApplyPress}>
      {content.applyLabel}
    </BaseButton>
  );

  return (
    <BasicPageConnected
      navigateBack={navigation.goBack}
      body={body}
      footer={footer}
      scrollEnabled={scrollEnabled}
      translateContent={true}
    />
  );
};
