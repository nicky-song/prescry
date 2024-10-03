// Copyright 2018 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { Heading } from '../../../../components/member/heading/heading';
import { TermsConditionsAndPrivacyLinks } from '../../../../components/member/links/terms-conditions-and-privacy/terms-conditions-and-privacy.links';
import { PinFeatureWelcomeScreenContainer } from '../../../../components/member/pin-feature-welcome-screen-container/pin-feature-welcome-screen-container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { ISignInContent } from '../../../../models/cms-content/sign-in.ui-content';
import { Workflow } from '../../../../models/workflow';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { ICreatePinScreenRouteProps } from '../../create-pin-screen/create-pin-screen';
import {
  PinFeatureWelcomeNavigationProp,
  PinFeatureWelcomeRouteProp,
} from '../../navigation/stack-navigators/root/root.stack-navigator';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { accountTokenClearDispatch } from '../../store/settings/dispatch/account-token-clear.dispatch';
import { pinFeatureWelcomeScreenStyles } from './pin-feature-welcome.screen.styles';

export interface IPinFeatureWelcomeScreenRouteProps {
  workflow?: Workflow;
}

export const PinFeatureWelcomeScreen = (): ReactElement => {
  const { dispatch: reduxDispatch } = useReduxContext();
  const navigation = useNavigation<PinFeatureWelcomeNavigationProp>();

  const { params } = useRoute<PinFeatureWelcomeRouteProp>();

  const { workflow } = params;

  const groupKey = CmsGroupKey.signIn;
  const { content, isContentLoading } = useContent<ISignInContent>(groupKey, 2);

  const title = (
    <Heading
      textStyle={pinFeatureWelcomeScreenStyles.titleTextStyle}
      isSkeleton={isContentLoading}
    >
      {content.welcomeText}
    </Heading>
  );

  const body = <PinFeatureWelcomeScreenContainer />;

  const onButtonPress = () => {
    accountTokenClearDispatch(reduxDispatch);
    const createPinParams: ICreatePinScreenRouteProps = { workflow };
    navigation.navigate('CreatePin', createPinParams);
  };
  const footer = (
    <>
      <TermsConditionsAndPrivacyLinks
        viewStyle={pinFeatureWelcomeScreenStyles.linksViewStyle}
      />
      <BaseButton onPress={onButtonPress} isSkeleton={isContentLoading}>
        {content.continueButtonCaption}
      </BaseButton>
    </>
  );

  return (
    <BasicPageConnected
      header={title}
      headerViewStyle={pinFeatureWelcomeScreenStyles.headerViewStyle}
      body={body}
      footer={footer}
      translateContent={true}
    />
  );
};
