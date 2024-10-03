// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { List } from '../../primitives/list';
import { BaseTag, IBaseTagProps } from '../../tags/base/base.tag';
import { tagListStyles } from './tag.list.styles';

export interface ITagListProps {
  viewStyle?: StyleProp<ViewStyle>;
  tags: IBaseTagProps[];
}

export const TagList = ({
  viewStyle,
  tags: tagPropsList,
}: ITagListProps): ReactElement => {
  const tags: ReactNode[] = tagPropsList.map((tagProps) => {
    return <BaseTag key={tagProps.label} {...tagProps} />;
  });

  return (
    <List style={[tagListStyles.viewStyle, viewStyle]} testID='tagList'>
      {tags}
    </List>
  );
};
