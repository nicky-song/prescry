// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import { ReactElement } from 'react';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IRxIdCardSectionContent } from '../../../models/cms-content/rx-id-card-section';
import { IPrimaryProfile } from '../../../models/member-profile/member-profile-info';
import { RxIdCardSection } from '../rx-id-card/rx-id-card.section';
export interface IPbmRxIdCardSectionProps extends Omit<ViewProps, 'style'> {
  profile: IPrimaryProfile;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PbmRxIdCardSection = ({
  profile,
  viewStyle,
  testID = 'pbmRxIdCardSection',
}: IPbmRxIdCardSectionProps): ReactElement => {
  const { content, isContentLoading } = useContent<IRxIdCardSectionContent>(
    CmsGroupKey.rxIdCardSection,
    2
  );
  return (
    <RxIdCardSection
      profile={profile}
      cardType='pbm'
      description={content.pbmDescription}
      title={content.pbmTitle}
      isSkeleton={isContentLoading}
      testID={testID}
      viewStyle={viewStyle}
    />
  );
};
