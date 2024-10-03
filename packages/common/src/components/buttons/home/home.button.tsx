// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { BaseButton, IBaseButtonProps } from '../base/base.button';

export interface IHomeButtonProps extends Omit<IBaseButtonProps, 'children'> {
  onPress: () => void;
}

export const HomeButton = ({ ...props }: IHomeButtonProps): ReactElement => {
  const groupKey = CmsGroupKey.global;
  const { content, isContentLoading } = useContent<IGlobalContent>(groupKey, 2);

  return (
    <BaseButton {...props} isSkeleton={isContentLoading} skeletonWidth='medium'>
      {content.homeButton}
    </BaseButton>
  );
};
