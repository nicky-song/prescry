// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement, useState } from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { PinScreenContainer } from '../../../components/member/pin-screen-container/pin-screen-container';
import { PrimaryTextBox } from '../../../components/text/primary-text-box/primary-text-box';
import { InternalResponseCode } from '../../../errors/error-codes';
import { createPinScreenStyles as styles } from './create-pin-screen.style';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  CreatePinNavigationProp,
  CreatePinRouteProp,
  RootStackNavigationProp,
} from '../navigation/stack-navigators/root/root.stack-navigator';
import { IVerifyPinScreenRouteProps } from '../verify-pin-screen/verify-pin-screen';
import { Workflow } from '../../../models/workflow';
import { ISignUpContent } from '../../../models/cms-content/sign-up.ui-content';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';
import { PinScreenConstants } from '../../../theming/constants';

export interface ICreatePinScreenRouteProps {
  isUpdatePin?: boolean;
  currentPin?: string;
  workflow?: Workflow;
}

export interface ICreatePinScreenProps {
  errorCode?: number;
}

export interface ICreatePinScreenActionProps {
  setPinAction: (pin: string) => void;
  navigateToBack: (navigation: RootStackNavigationProp) => void;
}

export const CreatePinScreen = ({
  errorCode,
  setPinAction,
  navigateToBack,
}: ICreatePinScreenProps & ICreatePinScreenActionProps): ReactElement => {
  const navigation = useNavigation<CreatePinNavigationProp>();

  const { params } = useRoute<CreatePinRouteProp>();

  const { isUpdatePin, currentPin, workflow } = params;

  const [createdPin, setCreatedPin] = useState<string>('');

  const groupKey = CmsGroupKey.signUp;
  const { content, isContentLoading } = useContent<ISignUpContent>(groupKey, 2);

  const onNextClick = async () => {
    await setPinAction(createdPin);
    const verifyPinScreenParams: IVerifyPinScreenRouteProps = {
      isUpdatePin,
      currentPin,
      workflow,
    };
    navigation.navigate('VerifyPin', verifyPinScreenParams);
    setCreatedPin('');
  };

  const renderSubHeader = isUpdatePin ? null : (
    <PrimaryTextBox
      caption={content.createPinScreenInfo}
      textBoxStyle={styles.screenInfoHeadingText}
    />
  );

  const errorMessage =
    errorCode === InternalResponseCode.USE_ANOTHER_PIN
      ? content.updatePinErrorMessage
      : undefined;

  const headerText = isUpdatePin
    ? content.updatePinHeader
    : content.createPinHeader;

  const isPinValid =
    createdPin && createdPin.length === PinScreenConstants.pinLength;

  const disableButton = !isPinValid;

  const footer = (
    <BaseButton
      disabled={disableButton}
      onPress={onNextClick}
      viewStyle={styles.buttonViewStyle}
      isSkeleton={isContentLoading}
      testID='createPinNextButton'
    >
      {content.nextButtonLabel}
    </BaseButton>
  );

  const body = (
    <View style={styles.bodyViewStyle}>
      <PrimaryTextBox caption={headerText} textBoxStyle={styles.pinLabelText} />
      {renderSubHeader}
      <PinScreenContainer
        errorMessage={errorMessage}
        onPinChange={setCreatedPin}
        enteredPin={createdPin}
        testID='createPinScreenContainer'
      />
      {footer}
    </View>
  );

  const handleNavigateToBack = () => {
    navigateToBack(navigation);
    return;
  };

  const navigateBack = isUpdatePin ? handleNavigateToBack : undefined;

  return (
    <BasicPageConnected
      navigateBack={navigateBack}
      headerViewStyle={styles.headerView}
      bodyViewStyle={styles.bodyContainerViewStyle}
      body={body}
      translateContent={true}
    />
  );
};
