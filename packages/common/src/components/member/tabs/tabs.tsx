// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactNode, useState, useEffect, ReactElement } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { BaseButton } from '../../buttons/base/base.button';
import { BaseText } from '../../text/base-text/base-text';
import { tabsStyles } from './tabs.style';

export interface ITab {
  name: ReactNode;
  content: ReactNode;
  value?: string;
}

export interface ITabsProps {
  tabs: ITab[];
  selected?: number;
  viewStyle?: StyleProp<ViewStyle>;
  tabContainerViewStyle?: StyleProp<ViewStyle>;
  onTabPress?: (tabName: string) => void;
}

export const Tabs = ({
  tabs,
  viewStyle,
  tabContainerViewStyle,
  selected = 0,
  onTabPress,
}: ITabsProps): ReactElement => {
  const [currentTab, setCurrentTab] = useState<number>(selected);
  useEffect(() => {
    setCurrentTab(selected);
  }, [selected]);
  const renderTabsHeaders = tabs.map((t, i) => {
    const onPressHeader = () => {
      setCurrentTab(i);
      if (onTabPress) onTabPress(t.value ?? '');
    };
    const selectedLineStyle =
      i === currentTab
        ? tabsStyles.selectedLineViewStyle
        : tabsStyles.unSelectedLineViewStyle;

    const buttonHeaderStyle = {
      ...tabsStyles.headerButtonViewStyle,
      width: `${100 / tabs.length}%`,
    };

    const headerTextStyle =
      i === currentTab
        ? tabsStyles.headerSelectedTextStyle
        : tabsStyles.headerUnSelectedTextStyle;
    return (
      <BaseButton
        viewStyle={buttonHeaderStyle}
        textStyle={tabsStyles.headerButtonTextStyle}
        key={`tab${t.name}`}
        onPress={onPressHeader}
      >
        <View style={tabsStyles.headerViewStyle}>
          <BaseText style={headerTextStyle}>{t.name}</BaseText>
          <View style={selectedLineStyle} />
        </View>
      </BaseButton>
    );
  });

  return (
    <View style={viewStyle}>
      <View style={tabsStyles.headerContainerViewStyle}>
        {renderTabsHeaders}
      </View>
      <View style={tabsStyles.lineSeparatorViewStyle} />
      <View style={[tabsStyles.tabContainerViewStyle, tabContainerViewStyle]}>
        {tabs[currentTab]?.content}
      </View>
    </View>
  );
};
