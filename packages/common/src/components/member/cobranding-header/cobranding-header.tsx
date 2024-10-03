// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { RemoteImageAsset } from '../../remote-image-asset/remote-image-asset';
import { BaseText } from '../../text/base-text/base-text';
import { cobrandingHeaderStyles } from './cobranding-header.styles';

export interface ICobrandingHeaderProps {
  logoUrl: string;
}

export const CobrandingHeader = (
  props: ICobrandingHeaderProps
): React.ReactElement => {
  const { logoUrl } = props;

  const groupKey = CmsGroupKey.global;

  const { content } = useContent<IGlobalContent>(groupKey, 2);

  return (
    <View
      style={cobrandingHeaderStyles.containerViewStyle}
      testID='cobrandingHeader'
    >
      <BaseText style={cobrandingHeaderStyles.titleTextStyle}>
        {content.providedBy}
      </BaseText>
      <RemoteImageAsset
        style={cobrandingHeaderStyles.logoStyle}
        uri={logoUrl}
      />
    </View>
  );
};
