// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { NavigationLink } from '../../links/navigation/navigation.link';
import { List } from '../../primitives/list';
import { ListItem } from '../../primitives/list-item';
import { NavigationView } from '../../primitives/navigation-view';

export interface INavigationLink {
  label: string;
  key: string;
  isSkeleton?: boolean;
  onPress: () => void;
}

export interface INavigationLinkListProps {
  viewStyle?: StyleProp<ViewStyle>;
  links: INavigationLink[];
}

export const NavigationLinkList = ({
  viewStyle,
  links,
}: INavigationLinkListProps): ReactElement => {
  const testId = 'navigationLinkList';

  const listItems: ReactNode[] = links.map(
    ({ label, onPress, isSkeleton, key }) => {
      const linkTestId = `${testId}-${key}`;
      return (
        <ListItem key={key}>
          <NavigationLink
            label={label}
            testID={linkTestId}
            onPress={onPress}
            isSkeleton={isSkeleton}
          />
        </ListItem>
      );
    }
  );

  const linkList = links.length ? <List>{listItems}</List> : null;

  return (
    <NavigationView style={viewStyle} testID={testId}>
      {linkList}
    </NavigationView>
  );
};
