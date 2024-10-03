// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement, useState } from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { PinScreenContainer } from '../../../components/member/pin-screen-container/pin-screen-container';
import { PrimaryTextBox } from '../../../components/text/primary-text-box/primary-text-box';
import { InternalResponseCode } from '../../../errors/error-codes';
import { verifyPinScreenStyles as styles } from './verify-pin-screen.style';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { IAddUpdatePinAsyncActionArgs } from '../store/secure-pin/secure-pin-reducer.actions';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  VerifyPinNavigationProp,
  VerifyPinRouteProp,
} from '../navigation/stack-navigators/root/root.stack-navigator';
import { ICreatePinScreenRouteProps } from '../create-pin-screen/create-pin-screen';
import { ISignUpContent } from '../../../models/cms-content/sign-up.ui-content';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';
import { PinScreenConstants } from '../../../theming/constants';

export type IVerifyPinScreenRouteProps = ICreatePinScreenRouteProps;

export interface IVerifyPinScreenProps {
  hasErrorOccurred: boolean;
  errorCode?: number;
}

export interface IVerifyPinScreenActionProps {
  addUpdatePinAction: (args: IAddUpdatePinAsyncActionArgs) => void;
}

export const VerifyPinScreen = ({
  hasErrorOccurred,
  errorCode,
  addUpdatePinAction,
}: IVerifyPinScreenProps & IVerifyPinScreenActionProps): ReactElement => {
  const navigation = useNavigation<VerifyPinNavigationProp>();

  const { params } = useRoute<VerifyPinRouteProp>();

  const { workflow, currentPin, isUpdatePin }: IVerifyPinScreenRouteProps =
    params;

  const [verificationPin, setVerificationPin] = useState<string>('');

  const groupKey = CmsGroupKey.signUp;
  const { content, isContentLoading } = useContent<ISignUpContent>(groupKey, 2);

  const onPinChange = (updatedPin: string) => setVerificationPin(updatedPin);

  const onNextClick = () => {
    const createPinScreenParams: ICreatePinScreenRouteProps = {
      isUpdatePin,
      currentPin,
      workflow,
    };
    addUpdatePinAction({
      pin: verificationPin,
      pinScreenParams: createPinScreenParams,
      navigation,
    });
    if (hasErrorOccurred || errorCode) {
      setVerificationPin('');
    }
  };

  const renderErrorText = () => {
    if (hasErrorOccurred || errorCode) {
      return errorCode === InternalResponseCode.USE_ANOTHER_PIN
        ? content.updatePinErrorMessage
        : content.confirmPinErrorMessage;
    }
    return;
  };

  const renderSubHeader = () => {
    if (isUpdatePin) {
      return null;
    }

    return (
      <PrimaryTextBox
        caption={content.confirmPinScreenInfo}
        textBoxStyle={styles.screenInfoHeadingText}
      />
    );
  };

  const headerText = isUpdatePin
    ? content.confirmPinHeader
    : content.verifyPinLabel;

  const errorMessage = renderErrorText();

  const isPinValid = verificationPin?.length === PinScreenConstants.pinLength;

  const disableButton = isPinValid ? false : true;

  const footer = (
    <BaseButton
      disabled={disableButton}
      onPress={onNextClick}
      viewStyle={styles.buttonViewStyle}
      isSkeleton={isContentLoading}
      testID='verifyPinNextButton'
    >
      {content.nextButtonLabel}
    </BaseButton>
  );

  const body = (
    <View style={styles.bodyViewStyle} testID='updatePin'>
      <PrimaryTextBox caption={headerText} textBoxStyle={styles.pinLabelText} />
      {renderSubHeader()}
      <PinScreenContainer
        errorMessage={errorMessage}
        enteredPin={verificationPin}
        onPinChange={onPinChange}
        testID='verifyPinScreenContainer'
      />
      {footer}
    </View>
  );

  return (
    <BasicPageConnected
      headerViewStyle={styles.headerView}
      body={body}
      bodyViewStyle={styles.bodyContainerViewStyle}
      navigateBack={navigation.goBack}
      translateContent={true}
    />
  );
};
