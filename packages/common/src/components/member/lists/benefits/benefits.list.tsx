// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ISignUpContent } from '../../../../models/cms-content/sign-up.ui-content';
import { List } from '../../../primitives/list';
import { IllustratedListItem } from '../../list-items/illustrated/illustrated.list-item';
import { benefitsListStyles } from './benefits.list.styles';

export interface IBenefitsListProps {
  viewStyle?: StyleProp<ViewStyle>;
}

export const BenefitsList = ({
  viewStyle,
}: IBenefitsListProps): ReactElement => {
  const groupKey = CmsGroupKey.signUp;
  const { content, isContentLoading } = useContent<ISignUpContent>(groupKey, 2);
  return (
    <List style={viewStyle}>
      <IllustratedListItem
        description={content.pbmBenefit1}
        imageName='pillCartIcon'
        imageStyle={benefitsListStyles.itemImageStyle}
        isSkeleton={isContentLoading}
      />
      <IllustratedListItem
        description={content.pbmBenefit2}
        imageName='dollarMagnifier'
        imageStyle={benefitsListStyles.itemImageStyle}
        viewStyle={benefitsListStyles.middleItemViewStyle}
        isSkeleton={isContentLoading}
      />
      <IllustratedListItem
        description={content.pbmBenefit3}
        imageStyle={benefitsListStyles.itemImageStyle}
        imageName='pillHandIcon'
        isSkeleton={isContentLoading}
      />
    </List>
  );
};
