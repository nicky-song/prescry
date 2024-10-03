// Copyright 2021 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import type { ISignUpContent } from '../../../../../models/cms-content/sign-up.ui-content';

import { PbmMemberBenefitsList } from './pbm-member-benefits-list';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';

import type {
  PbmMemberBenefitsRouteProp,
  RootStackNavigationProp,
} from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import type { ICreateAccountScreenRouteProps } from '../../sign-in/create-account/create-account.screen';
import { pbmMemberBenefitsScreenStyles } from './pbm-member-benefits.screen.styles';

import { useFlags } from 'launchdarkly-react-client-sdk';

export interface IPbmMemberBenefitsScreenRouteProps {
  showBackButton?: boolean;
}

export const PbmMemberBenefitsScreen = (): ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { params } = useRoute<PbmMemberBenefitsRouteProp>();

  const { showBackButton } = params;
  const { uselangselector } = useFlags();

  const onContinuePress = () => {
    navigation.navigate('CreateAccount', {
      workflow: 'pbmActivate',
    } as ICreateAccountScreenRouteProps);
  };

  const groupKey = CmsGroupKey.signUp;
  const { content, isContentLoading } = useContent<ISignUpContent>(groupKey, 2);
  const showSkeleton = isContentLoading;

  const bottomContent = (
    <View style={pbmMemberBenefitsScreenStyles.bottomContentViewStyle}>
      <BaseButton
        onPress={onContinuePress}
        isSkeleton={showSkeleton}
        testID='pbmMemberBenefitsScreenContinueButton'
      >
        {content.continueButton}
      </BaseButton>
    </View>
  );

  const body = (
    <BodyContentContainer
      testID='pbmMemberBenefitsScreenBodyContentContainer'
      viewStyle={pbmMemberBenefitsScreenStyles.bodyContainerViewStyle}
    >
      <PbmMemberBenefitsList
        styles={pbmMemberBenefitsScreenStyles}
        content={content}
        showSkeleton={showSkeleton}
      />
      {bottomContent}
    </BodyContentContainer>
  );

  const onNavigateBack = showBackButton ? navigation.goBack : undefined;

  return (
    <BasicPageConnected
      body={body}
      bodyViewStyle={pbmMemberBenefitsScreenStyles.bodyContainerViewStyle}
      allowBodyGrow={true}
      navigateBack={onNavigateBack}
      showProfileAvatar={uselangselector}
      translateContent={true}
    />
  );
};
